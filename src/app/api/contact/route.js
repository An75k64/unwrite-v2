import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'messages.json');

function ensureFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]');
}

function saveMessage(name, email, userType, message) {
  ensureFile();
  const existing = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  const maxId = existing.length > 0 ? Math.max(...existing.map(m => m.id)) : 0;
  existing.unshift({
    id: maxId + 1,
    name,
    email,
    userType,
    message,
    date: new Date().toISOString(),
    read: false,
  });
  fs.writeFileSync(DATA_FILE, JSON.stringify(existing, null, 2));
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { userType, name, email, message } = body;

    if (!userType || !name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // ── Step 1: Always save message to file first ──────────────────────────
    try {
      saveMessage(name, email, userType, message);
    } catch (saveErr) {
      console.error('Failed to save message:', saveErr.message);
    }

    // ── Step 2: Try sending email (non-blocking — won't fail the request) ──
    try {
      const nodemailer = (await import('nodemailer')).default;

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'unwritestudios@gmail.com',
          pass: 'lqry tccm hoza jkeo',
        },
      });

      await transporter.sendMail({
        from: 'unwritestudios@gmail.com',
        to: 'unwritestudios@gmail.com',
        subject: `New Contact: ${name}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;padding:30px;border-radius:12px;">
            <h2 style="color:#333;border-bottom:2px solid #667eea;padding-bottom:10px;">New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Type:</strong> ${userType}</p>
            <p><strong>Message:</strong></p>
            <div style="background:#f8f9fa;padding:15px;border-radius:8px;border-left:4px solid #667eea;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
        `,
      });

      // Auto-reply
      await transporter.sendMail({
        from: 'unwritestudios@gmail.com',
        to: email,
        subject: 'Thank you for contacting Unwrite Studios',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;padding:40px;border-radius:12px;">
            <h1 style="color:#333;">Thank You, ${name}!</h1>
            <p style="color:#666;">We've received your message and will get back to you within <strong>24–48 hours</strong>.</p>
            <p style="color:#666;">For urgent queries, reach us at <a href="mailto:hr.unwrite@gmail.com" style="color:#667eea;">hr.unwrite@gmail.com</a></p>
          </div>
        `,
      });
    } catch (emailErr) {
      // Email failed but message is already saved — that's OK
      console.warn('Email sending failed (message still saved):', emailErr.message);
    }

    // Always return success since message was saved
    return NextResponse.json({ success: true, message: 'Message received!' }, { status: 200 });

  } catch (error) {
    console.error('Contact route error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
