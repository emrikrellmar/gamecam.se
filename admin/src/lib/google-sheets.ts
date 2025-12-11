import { google } from 'googleapis';

export type Order = {
  product: string;
  quantity: string;
  company: string;
  companyName: string;
  taxVatNumber: string;
  deliveryAddress: string;
  phoneNumber: string;
  email: string;
  message: string;
  timestamp: string;
  orderId: string;
};

export async function getOrders(): Promise<Order[]> {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
      range: 'Orders!A2:L', // Assuming headers are in row 1 and data starts from A2 to L
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return [];
    }

    // Map rows to Order objects based on the spreadsheet columns
    // A: Product, B: Quantity, C: Company, D: Company name, E: Tax/VAT, F: Address, G: Phone, H: Email, I: Message, J: Timestamp, K: Order Id
    // Note: The screenshot shows columns A-L. 
    // A: Product
    // B: Quantity
    // C: Company (Yes/No)
    // D: Company name
    // E: Tax/VAT number
    // F: Delivery address
    // G: Phone number
    // H: Email
    // I: Message
    // J: Time stamp
    // K: Order Id
    
    return rows.map((row) => ({
      product: row[0] || '',
      quantity: row[1] || '',
      company: row[2] || '',
      companyName: row[3] || '',
      taxVatNumber: row[4] || '',
      deliveryAddress: row[5] || '',
      phoneNumber: row[6] || '',
      email: row[7] || '',
      message: row[8] || '',
      timestamp: row[9] || '',
      orderId: row[10] || '',
    }));
  } catch (error) {
    console.error('Error fetching orders from Google Sheets:', error);
    return [];
  }
}
