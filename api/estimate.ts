import nodemailer from 'nodemailer';

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
      from: `"GameCam Estimate" <${process.env.SMTP_USER}>`,
      replyTo: email,
      to: 'emrik@gamecam.se',
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
            <p>This email was sent from the GameCam Estimate Form.</p>
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
