// @ts-nocheck
import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = (supabaseUrl && supabaseServiceKey) 
  ? createClient(supabaseUrl, supabaseServiceKey) 
  : null;

// Allowlist for Origins
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
  return new Set(defaults);
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

export default async function handler(req: any, res: any) {
  // CORS
  const origin = req.headers.origin;
  const allowedOrigins = getAllowedOrigins();
  
  if (origin && allowedOrigins.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Fallback
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, clubName, phone, email, city, country, products, message } = req.body;

    // Validate required fields
    if (!name || !clubName || !phone || !email || !city || !country || !products) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Format products list
    const productListText = Object.entries(products)
      .filter(([_, qty]) => (qty as number) > 0)
      .map(([name, qty]) => `${name}: ${qty}`)
      .join('\n');

    const productListHtml = Object.entries(products)
      .filter(([_, qty]) => (qty as number) > 0)
      .map(([name, qty]) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${qty}</td>
        </tr>
      `)
      .join('');

    // --- Google Sheets Integration ---
    const emailEnv = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const pkRaw = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const sheetName = 'Estimates'; // Use a specific sheet for estimates

    if (emailEnv && pkRaw && spreadsheetId) {
      try {
        const privateKey = normalizePrivateKey(pkRaw);
        const auth = new google.auth.JWT({
          email: emailEnv,
          key: privateKey,
          scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });

        const sheets = google.sheets({ version: 'v4', auth });
        const submittedAt = formatTimestamp(new Date());
        // Generate a unique ID for the estimate to allow syncing
        const estimateId = crypto.randomUUID();

        // --- Supabase Integration ---
        // We only write to Supabase now. The Webhook will sync to Google Sheets.
        if (supabase) {
          try {
            const { error } = await supabase.from('estimates').insert({
              id: estimateId,
              name: name,
              club_name: clubName,
              email: email,
              phone: phone,
              city: city,
              country: country,
              products: productListText,
              message: message,
              timestamp: submittedAt,
              status: 'New'
            });
            
            if (error) {
              console.error('[estimate] Supabase insert error:', error);
            } else {
              console.log('[estimate] Supabase insert done');
            }
          } catch (sbError) {
            console.error('[estimate] Supabase exception:', sbError);
          }
        } else {
          console.warn('[estimate] Supabase credentials missing, skipping DB insert');
        }
        // ----------------------------

      } catch (sheetError) {
        console.error('[estimate] Failed to append to sheets', sheetError);
        // Don't fail the request if sheets fails, still send email
      }
    } else {
      console.warn('[estimate] Google Sheets credentials missing, skipping sheet append');
    }
    // ---------------------------------

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: (process.env.SMTP_PORT || '465') === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"GameCam Estimate Form" <${process.env.SMTP_USER}>`,
      replyTo: email,
      to: 'magnus@gamecam.se,sales@gamecam.se,emrik@gamecam.se',
      subject: `New Estimate Request from ${clubName}`,
      text: `
New Estimate Request

Products:
${productListText || 'No products selected'}

Customer Details:
Name: ${name}
Club/Company: ${clubName}
Email: ${email}
Phone: ${phone}
Location: ${city}, ${country}

Message:
${message || '-'}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #0070f3; padding: 20px; text-align: center;">
            <h2 style="color: #fff; margin: 0;">New Estimate Request</h2>
          </div>
          
          <div style="padding: 20px;">
            <h3 style="color: #0070f3; border-bottom: 2px solid #0070f3; padding-bottom: 5px;">Products Requested</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <thead>
                <tr style="background-color: #f9f9f9; text-align: left;">
                  <th style="padding: 8px; border-bottom: 1px solid #ddd;">Product</th>
                  <th style="padding: 8px; border-bottom: 1px solid #ddd;">Quantity</th>
                </tr>
              </thead>
              <tbody>
                ${productListHtml || '<tr><td colspan="2" style="padding: 8px;">No products selected</td></tr>'}
              </tbody>
            </table>
            
            <h3 style="color: #0070f3; border-bottom: 2px solid #0070f3; padding-bottom: 5px;">Customer Details</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Club/Company:</strong> ${clubName}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #0070f3;">${email}</a></p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Location:</strong> ${city}, ${country}</p>
            
            <h3 style="color: #0070f3; border-bottom: 2px solid #0070f3; padding-bottom: 5px;">Message</h3>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px;">
              <p style="margin: 0; white-space: pre-wrap;">${message || 'No additional message provided.'}</p>
            </div>
          </div>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            <p>This email was sent from the GameCam Estimate Form.<br>Reply to this email to contact the customer.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Error sending estimate email:', error);
    return res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
}
