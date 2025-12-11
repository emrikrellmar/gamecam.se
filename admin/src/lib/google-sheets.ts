import { google } from 'googleapis';

export type Order = {
  customerName: string;
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
      range: 'Orders!A2:L', 
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return [];
    }

    // Based on observation, there is a hidden/extra column at index 0 (Customer Name)
    // 0: Customer Name
    // 1: Product (A)
    // 2: Quantity (B)
    // 3: Company (C)
    // 4: Company Name (D)
    // 5: Tax/VAT (E)
    // 6: Address (F)
    // 7: Phone (G)
    // 8: Email (H)
    // 9: Message (I)
    // 10: Timestamp (J)
    // 11: Order Id (K)
    
    return rows
      .filter(row => row[1] && row[10]) // Filter out empty rows (must have Product and Timestamp)
      .map((row) => ({
        customerName: row[0] || '',
        product: row[1] || '',
        quantity: row[2] || '',
        company: row[3] || '',
        companyName: row[4] || '',
        taxVatNumber: row[5] || '',
        deliveryAddress: row[6] || '',
        phoneNumber: row[7] || '',
        email: row[8] || '',
        message: row[9] || '',
        timestamp: row[10] || '',
        orderId: row[11] || '',
      }));
  } catch (error) {
    console.error('Error fetching orders from Google Sheets:', error);
    return [];
  }
}
