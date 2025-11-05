/*
  Serverless test endpoint: appends a simple test row to Google Sheets to verify credentials and sharing.

  SECURITY: Requires ORDER_TEST_TOKEN to be set in env and provided via query (?token=...) or header (x-order-test-token).
*/

// @ts-nocheck
import { google } from 'googleapis';

export default async function handler(req, res) {
  try {
    const tokenEnv = (process.env.ORDER_TEST_TOKEN || '').trim();
    const token = (req.query?.token || req.headers['x-order-test-token'] || '').toString().trim();

    if (!tokenEnv) {
      res.status(500).json({ ok: false, error: 'ORDER_TEST_TOKEN not configured on server' });
      return;
    }
    if (!token || token !== tokenEnv) {
      res.status(401).json({ ok: false, error: 'Unauthorized: invalid token' });
      return;
    }

    if (req.method !== 'GET' && req.method !== 'POST') {
      res.status(405).json({ ok: false, error: 'Method not allowed' });
      return;
    }

    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const pkRaw = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME || 'Sheet1';

    if (!email || !pkRaw || !spreadsheetId) {
      res.status(500).json({ ok: false, error: 'Missing Google Sheets credentials (email/private key/spreadsheet id)' });
      return;
    }
    const privateKey = pkRaw.replace(/\\n/g, '\n');

    const auth = new google.auth.JWT({
      email,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const now = new Date().toISOString();
    const values = [[
      now,
      'TEST_PRODUCT',
      'Order Test',
      'Private',
      '', '', 'N/A', 'N/A', 'orders-test@gamecam.se', '1',
      'This is a test row from /api/order-test', '0', '0', '0', 'EUR', 'server-test'
    ]];

    const appendRes = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values }
    });

    res.status(200).json({ ok: true, status: appendRes.status, appendedAt: now });
  } catch (err) {
    const message = (err && (err.message || err.toString())) || 'Unknown error';
    console.error('[order-test] error', message, err?.response?.data || err);
    res.status(500).json({ ok: false, error: message, details: err?.response?.data });
  }
}
