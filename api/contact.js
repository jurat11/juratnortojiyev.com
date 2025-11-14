// Vercel Serverless Function: Contact Form Email Sender
// Uses nodemailer and local email-config.js (app password)

export default async function handler(req, res) {
  // Handle CORS preflight for local/dev tools
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { fullName, email, phone, message } = req.body || {};
    if (!fullName || !email || !phone || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const nodemailer = (await import('nodemailer')).default;
    const { emailConfig } = await import('../email-config.js');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailConfig.user,
        pass: emailConfig.pass,
      },
    });

    const mailOptions = {
      from: `Portfolio Contact <${emailConfig.user}>`,
      to: emailConfig.user,
      replyTo: email,
      subject: `New message from ${fullName}`,
      text: `Name: ${fullName}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br/>')}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}











