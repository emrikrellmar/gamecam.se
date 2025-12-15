import { google } from 'googleapis';
import crypto from 'crypto';

// Helper to normalize private key
function normalizePrivateKey(pkRaw?: string) {
  if (!pkRaw) return undefined;
  let s = pkRaw.trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1);
  }
  s = s.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n');
  s = s.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  return s;
}

// Helper to sanitize cell data
function sanitizeCell(input: unknown, maxLen = 2000): string {
  if (input == null) return '';
  let s = String(input);
  if (s.length > maxLen) s = s.slice(0, maxLen);
  s = s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  if (/^[=+\-@].*/.test(s)) s = `'${s}`;
  return s;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify secret
  const secret = process.env.SUPABASE_WEBHOOK_SECRET;
  if (!secret || req.headers['x-webhook-secret'] !== secret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { type, table, record } = req.body;
  console.log(`[sync-sheets] Received ${type} for ${table}`);

  if (!record) {
    return res.status(400).json({ error: 'No record provided' });
  }

  // Setup Google Sheets Auth
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const pkRaw = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

  if (!email || !pkRaw || !spreadsheetId) {
    console.error('[sync-sheets] Missing Google Sheets credentials');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const privateKey = normalizePrivateKey(pkRaw);
    const auth = new google.auth.JWT({
      email,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    const sheets = google.sheets({ version: 'v4', auth });

    if (table === 'orders') {
      await syncOrder(sheets, spreadsheetId, record, type);
    } else if (table === 'estimates') {
      await syncEstimate(sheets, spreadsheetId, record, type);
    } else {
      console.log(`[sync-sheets] Ignoring table ${table}`);
    }

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('[sync-sheets] Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function syncOrder(sheets: any, spreadsheetId: string, record: any, type: string) {
  const sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME || 'Sheet1'; // Default for Orders
  
  // 1. Fetch all Order IDs (Column L, Index 11)
  // We fetch A:L to get the data range
  const range = `${sheetName}!A:L`;
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const rows = response.data.values || [];
  const headerRow = rows[0]; // Assuming row 1 is header
  
  // Find the row index by Order ID
  // Order ID is in the last column (L), index 11
  const orderIdIndex = 11; 
  
  let rowIndex = -1;
  // Start from row 1 (index 1) to skip header
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][orderIdIndex] === record.order_id) {
      rowIndex = i;
      break;
    }
  }

  // Prepare row values
  const isCompany = record.company === 'Yes' || record.company === true; // Handle boolean or text
  const values = [
    sanitizeCell(record.customer_name, 200),
    sanitizeCell(record.product, 200),
    String(record.quantity || '0'),
    record.company || 'No',
    sanitizeCell(record.company_name || 'Private person', 200),
    sanitizeCell(record.tax_vat_number || 'Private person', 200),
    sanitizeCell(record.delivery_address, 500),
    sanitizeCell(record.phone_number, 100),
    sanitizeCell(record.email, 200),
    sanitizeCell(record.message, 2000),
    record.timestamp || new Date().toISOString(),
    record.order_id
  ];

  if (rowIndex !== -1) {
    // Update existing row
    // Row number is rowIndex + 1
    const updateRange = `${sheetName}!A${rowIndex + 1}:L${rowIndex + 1}`;
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: updateRange,
      valueInputOption: 'RAW',
      requestBody: { values: [values] }
    });
    console.log(`[sync-sheets] Updated Order ${record.order_id} at row ${rowIndex + 1}`);
  } else {
    // Insert new row
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [values] }
    });
    console.log(`[sync-sheets] Appended new Order ${record.order_id}`);
  }
}

async function syncEstimate(sheets: any, spreadsheetId: string, record: any, type: string) {
  const sheetName = 'Estimates';
  
  // 1. Fetch all Estimate IDs (Column I, Index 8)
  const range = `${sheetName}!A:I`;
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const rows = response.data.values || [];
  
  // Find the row index by ID
  const idIndex = 8; 
  
  let rowIndex = -1;
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][idIndex] === record.id) {
      rowIndex = i;
      break;
    }
  }

  // Prepare row values
  const combinedName = record.club_name 
    ? `${record.name} (${record.club_name})` 
    : record.name;

  const values = [
    record.timestamp || new Date().toISOString(),
    sanitizeCell(combinedName, 200),
    sanitizeCell(record.email, 200),
    sanitizeCell(record.phone, 100),
    sanitizeCell(record.city, 200),
    sanitizeCell(record.country, 200),
    sanitizeCell(record.products, 2000),
    sanitizeCell(record.message, 2000),
    record.id
  ];

  if (rowIndex !== -1) {
    // Update existing row
    const updateRange = `${sheetName}!A${rowIndex + 1}:I${rowIndex + 1}`;
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: updateRange,
      valueInputOption: 'RAW',
      requestBody: { values: [values] }
    });
    console.log(`[sync-sheets] Updated Estimate ${record.id} at row ${rowIndex + 1}`);
  } else {
    // Insert new row
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [values] }
    });
    console.log(`[sync-sheets] Appended new Estimate ${record.id}`);
  }
}
