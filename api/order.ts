/*
  Serverless function: Receives order form submissions and appends a row to Google Sheets via the Google Sheets API.

  Required Vercel environment variables:
  - GOOGLE_SERVICE_ACCOUNT_EMAIL
  - GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY (escape newlines as \n)
  - GOOGLE_SHEETS_SPREADSHEET_ID
  - GOOGLE_SHEETS_SHEET_NAME (optional, defaults to 'Sheet1')
*/

// @ts-nocheck
import { google } from 'googleapis';

// Simple allowlist for Origins that are allowed to post orders
const ALLOWED_ORIGINS = new Set([
  'https://gamecam.se',
  'https://www.gamecam.se',
  'https://gamecam.io',
  'https://www.gamecam.io',
  'http://localhost:5173',
  'http://localhost:3000'
]);

// Sanitize user-provided strings before writing to Google Sheets to avoid formula/CSV injection
function sanitizeCell(input: unknown, maxLen = 2000): string {
  if (input == null) return '';
  let s = String(input);
  // Trim and cap length
  if (s.length > maxLen) s = s.slice(0, maxLen);
  // Remove control characters except tab/newline
  s = s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  // If value starts with characters that Google Sheets may interpret as formulas, prefix with an apostrophe
  if (/^[=+\-@].*/.test(s)) s = `'${s}`;
  return s;
}

function toInt(n: any, fallback = 0): number {
  const v = Number(n);
  if (!Number.isFinite(v)) return fallback;
  return Math.trunc(v);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  // Basic origin protection: only accept same-site or allowlisted origins
  try {
    const origin = req.headers.origin as string | undefined;
    const referer = req.headers.referer as string | undefined;
    const host = req.headers.host as string | undefined;
    const isLocal = host?.startsWith('localhost:');

    const originOk = !origin || ALLOWED_ORIGINS.has(origin) || isLocal;
    const refererOk = !referer || Array.from(ALLOWED_ORIGINS).some((o) => referer.startsWith(o)) || isLocal;
    if (!originOk || !refererOk) {
      res.status(403).json({ ok: false, error: 'Forbidden origin' });
      return;
    }
  } catch {}

  // Legacy mode: If GSHEET_WEBAPP_URL is set, forward payload to Apps Script instead of using Sheets API
  const legacyEndpoint = process.env.GSHEET_WEBAPP_URL;

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const pkRaw = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME || 'Sheet1';

  // If legacy endpoint is configured, we don't require Google credentials
  if (!legacyEndpoint) {
    if (!email || !pkRaw || !spreadsheetId) {
      res.status(500).json({
        ok: false,
        error: 'Missing Google Sheets credentials. Please set GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY, GOOGLE_SHEETS_SPREADSHEET_ID. Or set GSHEET_WEBAPP_URL to use Apps Script forwarding.'
      });
      return;
    }
  }

  // Convert escaped newlines in private key (only when present)
  const privateKey = pkRaw ? pkRaw.replace(/\\n/g, '\n') : undefined;

  try {
    // Ensure JSON body
    const payload = (req.body && typeof req.body === 'object') ? req.body : {};

    // Basic size guard: reject obviously huge payloads
    if (JSON.stringify(payload).length > 20_000) {
      res.status(413).json({ ok: false, error: 'Payload too large' });
      return;
    }

    // Validate required fields
    if (!payload || !payload.product || !payload.name || !payload.email) {
      res.status(400).json({ ok: false, error: 'Missing required fields' });
      return;
    }

    if (legacyEndpoint) {
      console.log('[order] Using Apps Script legacy endpoint');
      // Forward to Apps Script Web App (JSON). Treat any 2xx as success.
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10_000);
      const fRes = await fetch(legacyEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      }).finally(() => clearTimeout(timeout));
      if (!fRes.ok) {
        const text = await fRes.text().catch(() => '');
        console.error('[order] Apps Script upstream error', fRes.status, text);
        res.status(502).json({ ok: false, error: 'Upstream (Apps Script) error', status: fRes.status, body: text });
        return;
      }
    } else {
      console.log('[order] Using Google Sheets API');
      if (!privateKey || !email || !spreadsheetId) {
        res.status(500).json({ ok: false, error: 'Google Sheets credentials not configured' });
        return;
      }
      const auth = new google.auth.JWT({
        email,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
      });

      const sheets = google.sheets({ version: 'v4', auth });

      // Prepare row values in a fixed order to match your sheet's headers
      const values = [[
        new Date().toISOString(),
        sanitizeCell(payload.product, 200),
        sanitizeCell(payload.name, 200),
        payload.isCompany ? 'Company' : 'Private',
        sanitizeCell(payload.companyName, 200),
        sanitizeCell(payload.taxNumber, 200),
        sanitizeCell(payload.deliveryAddress, 500),
        sanitizeCell(payload.phone, 100),
        sanitizeCell(payload.email, 200),
        String(toInt(payload.quantity, 0)),
        sanitizeCell(payload.message, 2000),
        String(toInt(payload.unitPrice, 0)),
        String(toInt(payload.subtotal, 0)),
        String(toInt((payload.total ?? payload.subtotal), 0)),
        sanitizeCell(payload.currency || 'EUR', 12),
        sanitizeCell(payload.userAgent, 400)
      ]];

      const appendRes = await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${sheetName}!A1`,
        // Use RAW to prevent formula execution in Sheets
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: { values }
      });
      console.log('[order] Sheets append done', appendRes.status);
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[order] Handler error', err);
    res.status(500).json({ ok: false, error: (err && err.message) || 'Unknown error' });
  }
}
