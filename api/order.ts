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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
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

  // Convert escaped newlines in private key
  const privateKey = pkRaw.replace(/\\n/g, '\n');

  try {
    const payload = req.body || {};
    if (!payload || !payload.product || !payload.name || !payload.email) {
      res.status(400).json({ ok: false, error: 'Missing required fields' });
      return;
    }

    if (legacyEndpoint) {
      // Forward to Apps Script Web App (JSON). Treat any 2xx as success.
      const fRes = await fetch(legacyEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!fRes.ok) {
        const text = await fRes.text().catch(() => '');
        res.status(502).json({ ok: false, error: 'Upstream (Apps Script) error', status: fRes.status, body: text });
        return;
      }
    } else {
      const auth = new google.auth.JWT({
        email,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
      });

      const sheets = google.sheets({ version: 'v4', auth });

      // Prepare row values in a fixed order to match your sheet's headers
      const values = [[
        new Date().toISOString(),
        payload.product,
        payload.name,
        payload.isCompany ? 'Company' : 'Private',
        payload.companyName || '',
        payload.taxNumber || '',
        payload.deliveryAddress || '',
        payload.phone || '',
        payload.email || '',
        String(payload.quantity ?? ''),
        payload.message || '',
        String(payload.unitPrice ?? ''),
        String(payload.subtotal ?? ''),
        String((payload.total ?? payload.subtotal) ?? ''),
        payload.currency || 'EUR',
        payload.userAgent || ''
      ]];

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${sheetName}!A1`,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: { values }
      });
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: (err && err.message) || 'Unknown error' });
  }
}
