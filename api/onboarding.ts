/*
  Serverless function: Receives onboarding form submissions and appends a row to Google Sheets via the Google Sheets API.

  Required/optional Vercel environment variables:
  - GOOGLE_SERVICE_ACCOUNT_EMAIL
  - GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY (escape newlines as \n)
  - GOOGLE_SHEETS_SPREADSHEET_ID (fallback if dedicated onboarding ID not set)
  - GOOGLE_SHEETS_ONBOARDING_SPREADSHEET_ID (optional, overrides spreadsheet id)
  - GOOGLE_SHEETS_ONBOARDING_SHEET_NAME (optional, defaults to 'Onboarding')
  - ALLOWED_ORIGINS (optional allowlist, comma-separated)
  - ALLOWED_ORIGIN_SUFFIXES (optional, e.g. .vercel.app,.vercel.dev)
*/

// @ts-nocheck
import { google } from 'googleapis';

function getAllowedOrigins(): Set<string> {
  const defaults = [
    'https://gamecam.se',
    'https://www.gamecam.se',
    'https://gamecam.io',
    'https://www.gamecam.io',
    'http://localhost:5173',
    'http://localhost:3000'
  ];
  const vercelUrl = (process.env.VERCEL_URL || '').trim();
  if (vercelUrl) {
    const origin = vercelUrl.startsWith('http') ? vercelUrl : `https://${vercelUrl}`;
    defaults.push(origin);
  }
  const raw = (process.env.ALLOWED_ORIGINS || '').trim();
  if (!raw) return new Set(defaults);
  const parts = raw.split(',').map(s => s.trim()).filter(Boolean);
  return new Set(parts.length ? parts : defaults);
}

function getAllowedOriginSuffixes(): string[] {
  const defaults = ['.vercel.app', '.vercel.dev'];
  const raw = (process.env.ALLOWED_ORIGIN_SUFFIXES || '').trim();
  if (!raw) return defaults;
  const parts = raw.split(',').map(s => s.trim()).filter(Boolean);
  return parts.length ? parts : defaults;
}

function sanitizeCell(input: unknown, maxLen = 2000): string {
  if (input == null) return '';
  let s = String(input);
  if (s.length > maxLen) s = s.slice(0, maxLen);
  s = s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  if (/^[=+\-@].*/.test(s)) s = `'${s}`;
  return s;
}

function normalizePrivateKey(pkRaw?: string) {
  if (!pkRaw) return undefined;
  let s = pkRaw.trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith('\'') && s.endsWith('\''))) {
    s = s.slice(1, -1);
  }
  s = s.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n');
  s = s.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  return s;
}

function formatTimestamp(d: Date, timeZone = 'Europe/Stockholm') {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).formatToParts(d);
  const get = (t: string) => parts.find(p => p.type === t)?.value || '';
  return `${get('month')}/${get('day')}/${get('year')} ${get('hour')}:${get('minute')}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  try {
    const ALLOWED_ORIGINS = getAllowedOrigins();
    const ALLOWED_SUFFIXES = getAllowedOriginSuffixes();
    const origin = req.headers.origin as string | undefined;
    const referer = req.headers.referer as string | undefined;
    const host = req.headers.host as string | undefined;
    const xVercelUrl = (req.headers['x-vercel-deployment-url'] as string | undefined)?.trim();
    const xForwardedHost = (req.headers['x-forwarded-host'] as string | undefined)?.trim();
    const isLocal = host?.startsWith('localhost:');

    const safeUrl = (u?: string) => { try { return u ? new URL(u) : undefined; } catch { return undefined; } };
    const originUrl = safeUrl(origin);
    const refererUrl = safeUrl(referer);
    const vercelUrl = safeUrl(xVercelUrl && (xVercelUrl.startsWith('http') ? xVercelUrl : `https://${xVercelUrl}`));

    const isAllowedExact = (u?: URL) => !!u && ALLOWED_ORIGINS.has(u.origin);
    const isAllowedBySuffix = (u?: URL) => !!u && ALLOWED_SUFFIXES.some(s => u.hostname.endsWith(s));
    const allowedHostBySuffix = (h?: string) => !!h && ALLOWED_SUFFIXES.some(s => h.toLowerCase().endsWith(s));
    const allowedHostExact = (h?: string) => {
      if (!h) return false;
      try {
        for (const o of ALLOWED_ORIGINS) {
          const u = new URL(o);
          if (u.host.toLowerCase() === h.toLowerCase()) return true;
        }
      } catch {}
      return false;
    };

    const allowed = !!isLocal || (!origin && !referer) || isAllowedExact(originUrl) || isAllowedExact(refererUrl) ||
      isAllowedBySuffix(originUrl) || isAllowedBySuffix(refererUrl) || allowedHostExact(host) || allowedHostBySuffix(host) ||
      allowedHostExact(xForwardedHost) || allowedHostBySuffix(xForwardedHost) || isAllowedExact(vercelUrl) || isAllowedBySuffix(vercelUrl);

    if (!allowed) {
      res.status(403).json({ ok: false, error: 'Forbidden origin' });
      return;
    }
  } catch (e) {
    res.status(403).json({ ok: false, error: 'Forbidden origin' });
    return;
  }

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const pkRaw = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  const spreadsheetId = process.env.GOOGLE_SHEETS_ONBOARDING_SPREADSHEET_ID || process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const sheetName = process.env.GOOGLE_SHEETS_ONBOARDING_SHEET_NAME || 'Onboarding';

  if (!email || !pkRaw || !spreadsheetId) {
    // Graceful noop: accept in dev without Sheets to unblock UI
    res.status(200).json({ ok: true, note: 'Sheets credentials missing; accepted in dev mode.' });
    return;
  }

  const privateKey = normalizePrivateKey(pkRaw);

  try {
    const payload = (req.body && typeof req.body === 'object') ? req.body : {};

    if (!payload || !payload.contactPerson || !payload.clubName || !payload.email) {
      res.status(400).json({ ok: false, error: 'Missing required fields' });
      return;
    }

    const auth = new google.auth.JWT({
      email,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const submittedAt = formatTimestamp(new Date());
    const values = [[
      sanitizeCell(payload.contactPerson, 200),
      sanitizeCell(payload.clubName, 200),
      sanitizeCell(payload.email, 200),
      sanitizeCell(payload.phone, 100),
      sanitizeCell(payload.cameraId, 100),
      sanitizeCell(payload.preferredTime, 200),
      sanitizeCell(payload.source || 'install-wizard', 100),
      submittedAt
    ]];

    const appendRes = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values }
    });

    if (appendRes.status < 200 || appendRes.status >= 300) {
      throw new Error(`Sheets append failed (${appendRes.status})`);
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[onboarding] error', err);
    res.status(500).json({ ok: false, error: (err && err.message) || 'Unknown error' });
  }
}
