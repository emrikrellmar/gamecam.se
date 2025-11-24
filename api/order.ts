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
import nodemailer from 'nodemailer';

// Allowlist for Origins that can post orders. Configurable via env `ALLOWED_ORIGINS` (comma-separated).
function getAllowedOrigins(): Set<string> {
  const defaults = [
    'https://gamecam.se',
    'https://www.gamecam.se',
    'https://gamecam.io',
    'https://www.gamecam.io',
    'http://localhost:5173',
    'http://localhost:3000'
  ];
  // Add current deployment URL automatically (useful for Vercel preview)
  const vercelUrl = (process.env.VERCEL_URL || '').trim();
  if (vercelUrl) {
    const origin = vercelUrl.startsWith('http') ? vercelUrl : `https://${vercelUrl}`;
    defaults.push(origin);
  }

  const raw = (process.env.ALLOWED_ORIGINS || '').trim();
  if (!raw) return new Set(defaults);
  const parts = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return new Set(parts.length ? parts : defaults);
}

function getAllowedOriginSuffixes(): string[] {
  const defaults = ['.vercel.app', '.vercel.dev'];
  const raw = (process.env.ALLOWED_ORIGIN_SUFFIXES || '').trim();
  if (!raw) return defaults;
  const parts = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length ? parts : defaults;
}

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

// Normalize service account private key from env (handles real newlines, \n, \r\n, and accidental quotes)
function normalizePrivateKey(pkRaw?: string) {
  if (!pkRaw) return undefined;
  let s = pkRaw.trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1);
  }
  // Replace escaped sequences first
  s = s.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n');
  // Normalize CRLF/CR to LF
  s = s.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  return s;
}

// Format timestamp like MM/DD/YYYY HH:mm (24h), defaulting to Europe/Stockholm timezone
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
  const mm = get('month');
  const dd = get('day');
  const yyyy = get('year');
  const hh = get('hour');
  const min = get('minute');
  return `${mm}/${dd}/${yyyy} ${hh}:${min}`;
}

async function sendOrderEmail(payload: any) {
  // Configure transporter using environment variables
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: (process.env.SMTP_PORT || '465') === '465', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const isCompany = !!payload.isCompany;
  
  // Plain text version (fallback)
  const text = `
New Order Received!

Product: ${payload.product}
Quantity: ${payload.quantity}

Customer Details:
Name: ${payload.name}
Email: ${payload.email}
Phone: ${payload.phone}
Address: ${payload.deliveryAddress}

Company Details:
Is Company: ${isCompany ? 'Yes' : 'No'}
Company Name: ${isCompany ? payload.companyName : '-'}
Tax/VAT: ${isCompany ? payload.taxNumber : '-'}

Message:
${payload.message || '-'}
  `;

  // HTML version
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #0056b3; border-bottom: 2px solid #0056b3; padding-bottom: 10px;">New Order Received!</h2>
      
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="margin-top: 0; color: #0056b3; font-size: 18px;">Product Details</h3>
        <p style="margin: 5px 0;"><strong>Product:</strong> ${payload.product}</p>
        <p style="margin: 5px 0;"><strong>Quantity:</strong> ${payload.quantity}</p>
      </div>

      <div style="margin-bottom: 20px;">
        <h3 style="color: #0056b3; font-size: 18px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Customer Details</h3>
        <p style="margin: 5px 0;"><strong>Name:</strong> ${payload.name}</p>
        <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${payload.email}" style="color: #0056b3;">${payload.email}</a></p>
        <p style="margin: 5px 0;"><strong>Phone:</strong> ${payload.phone}</p>
        <p style="margin: 5px 0;"><strong>Address:</strong> ${payload.deliveryAddress}</p>
      </div>

      <div style="margin-bottom: 20px;">
        <h3 style="color: #0056b3; font-size: 18px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Company Details</h3>
        <p style="margin: 5px 0;"><strong>Is Company:</strong> ${isCompany ? 'Yes' : 'No'}</p>
        ${isCompany ? `<p style="margin: 5px 0;"><strong>Company Name:</strong> ${payload.companyName}</p>` : ''}
        ${isCompany ? `<p style="margin: 5px 0;"><strong>Tax/VAT:</strong> ${payload.taxNumber}</p>` : ''}
      </div>

      ${payload.message ? `
      <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; border: 1px solid #ffeeba; margin-top: 20px;">
        <h3 style="margin-top: 0; color: #856404; font-size: 16px;">Message</h3>
        <p style="margin: 0; white-space: pre-wrap;">${payload.message}</p>
      </div>
      ` : ''}
      
      <p style="font-size: 12px; color: #999; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px; text-align: center;">
        Sent from GameCam.io Order Form
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: '"GameCam Order" <no-reply@gamecam.se>',
      to: 'emrik@gamecam.se',
      subject: `New Order: ${payload.product} - ${payload.name}`,
      text: text,
      html: html,
    });
    console.log('[order] Admin email sent successfully');

    // Customer confirmation email
    const customerText = `Hi ${payload.name},\n\nThank you for your order request for ${payload.product}.\nWe have received your details and will get back to you shortly with delivery details.\n\nOrder Summary:\nProduct: ${payload.product}\nQuantity: ${payload.quantity}\n\nBest regards,\nThe GameCam Team`;

    const customerHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #0056b3;">Thank you for your order!</h2>
      <p>Hi ${payload.name},</p>
      <p>We have received your order request for <strong>${payload.product}</strong>.</p>
      <p>Our team will review your order and get back to you shortly with delivery details and payment information.</p>
      
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #0056b3; font-size: 16px;">Order Summary</h3>
        <p style="margin: 5px 0;"><strong>Product:</strong> ${payload.product}</p>
        <p style="margin: 5px 0;"><strong>Quantity:</strong> ${payload.quantity}</p>
      </div>

      <p>If you have any questions in the meantime, feel free to reply to this email.</p>
      
      <p style="margin-top: 30px;">Best regards,<br>The GameCam Team</p>
    </div>
    `;

    await transporter.sendMail({
      from: '"GameCam" <emrik@gamecam.se>',
      replyTo: 'sales@gamecam.se',
      to: payload.email,
      subject: `Order Confirmation: ${payload.product}`,
      text: customerText,
      html: customerHtml,
    });
    console.log('[order] Customer confirmation email sent');
  } catch (error) {
    console.error('[order] Failed to send email', error);
    // We don't throw here to avoid failing the request if the sheet update was successful
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  // Basic origin protection: only accept same-site or allowlisted origins
  try {
    const ALLOWED_ORIGINS = getAllowedOrigins();
    const ALLOWED_SUFFIXES = getAllowedOriginSuffixes();
    const origin = req.headers.origin as string | undefined;
    const referer = req.headers.referer as string | undefined;
    const host = req.headers.host as string | undefined;
    const xVercelUrl = (req.headers['x-vercel-deployment-url'] as string | undefined)?.trim();
    const xForwardedHost = (req.headers['x-forwarded-host'] as string | undefined)?.trim();
    const isLocal = host?.startsWith('localhost:');

    const safeUrl = (u?: string) => {
      try { return u ? new URL(u) : undefined; } catch { return undefined; }
    };
    const originUrl = safeUrl(origin);
    const refererUrl = safeUrl(referer);
    const vercelUrl = safeUrl(xVercelUrl && (xVercelUrl.startsWith('http') ? xVercelUrl : `https://${xVercelUrl}`));

    const isAllowedExact = (u?: URL) => !!u && ALLOWED_ORIGINS.has(u.origin);
    const isAllowedBySuffix = (u?: URL) => !!u && ALLOWED_SUFFIXES.some((s) => u.hostname.endsWith(s));
    const allowedHostBySuffix = (h?: string) => !!h && ALLOWED_SUFFIXES.some((s) => h.toLowerCase().endsWith(s));
    const allowedHostExact = (h?: string) => {
      if (!h) return false;
      try {
        // Compare against the host of every allowed origin
        for (const o of ALLOWED_ORIGINS) {
          const u = new URL(o);
          if (u.host.toLowerCase() === h.toLowerCase()) return true;
        }
      } catch {}
      return false;
    };

    // Allow if any of the following is true:
    // - local dev
    // - origin is absent (some agents) and referer is allowed
    // - origin or referer matches exact allowlist
    // - origin or referer host ends with an allowed suffix (e.g., *.vercel.app)
    // - host header matches allowed hosts (exact or suffix)
    // - x-vercel-deployment-url indicates an allowed preview
    const allowed =
      !!isLocal ||
      (!origin && !referer) ||
      isAllowedExact(originUrl) ||
      isAllowedExact(refererUrl) ||
      isAllowedBySuffix(originUrl) ||
      isAllowedBySuffix(refererUrl) ||
      allowedHostExact(host) ||
      allowedHostBySuffix(host) ||
      allowedHostExact(xForwardedHost) ||
      allowedHostBySuffix(xForwardedHost) ||
      isAllowedExact(vercelUrl) ||
      isAllowedBySuffix(vercelUrl);

    if (!allowed) {
      console.warn('[order] Blocked by origin check', { origin, referer, host, xVercelUrl, xForwardedHost, ALLOWED_ORIGINS: Array.from(ALLOWED_ORIGINS), ALLOWED_SUFFIXES });
      res.status(403).json({ ok: false, error: 'Forbidden origin' });
      return;
    }
  } catch (e) {
    console.warn('[order] Origin check failed', e);
    res.status(403).json({ ok: false, error: 'Forbidden origin' });
    return;
  }

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
  const privateKey = normalizePrivateKey(pkRaw);

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

      // Prepare row values to match desired sheet order:
      // Full name, Product, Plan, Quantity, Ordering as a company (Yes/No), Company name (or "Private person"),
      // Tax/VAT number (or "Private person"), Delivery address, Phone number, Email address, Extra message
      const isCompany = !!payload.isCompany;
      const submittedAt = formatTimestamp(new Date());
      const values = [[
        sanitizeCell(payload.name, 200),
        sanitizeCell(payload.product, 200),
        String(toInt(payload.quantity, 0)),
        isCompany ? 'Yes' : 'No',
        isCompany ? sanitizeCell(payload.companyName, 200) : 'Private person',
        isCompany ? sanitizeCell(payload.taxNumber, 200) : 'Private person',
        sanitizeCell(payload.deliveryAddress, 500),
        sanitizeCell(payload.phone, 100),
        sanitizeCell(payload.email, 200),
        sanitizeCell(payload.message, 2000),
        submittedAt
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

    await sendOrderEmail(payload);

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[order] Handler error', err);
    res.status(500).json({ ok: false, error: (err && err.message) || 'Unknown error' });
  }
}
