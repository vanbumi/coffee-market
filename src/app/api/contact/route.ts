import { NextRequest, NextResponse } from 'next/server';

interface ContactBody {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactBody = await request.json();
    const { name, email, phone, subject, message } = body;

    // ── Validation ─────────────────────────────────
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Nama harus diisi' }, { status: 400 });
    }
    if (!email || !email.trim()) {
      return NextResponse.json({ error: 'Email harus diisi' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Format email tidak valid' }, { status: 400 });
    }
    if (!subject || !subject.trim()) {
      return NextResponse.json({ error: 'Subjek harus diisi' }, { status: 400 });
    }
    if (!message || !message.trim() || message.trim().length < 10) {
      return NextResponse.json({ error: 'Pesan minimal 10 karakter' }, { status: 400 });
    }

    // ── Send Email via Nodemailer ──────────────────
    const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
    const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
    const SMTP_USER = process.env.SMTP_USER;
    const SMTP_PASS = process.env.SMTP_PASS;
    const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || SMTP_USER;

    if (!SMTP_USER || !SMTP_PASS) {
      console.error('SMTP credentials not configured');
      return NextResponse.json(
        { error: 'Konfigurasi email belum tersedia. Silakan hubungi admin.' },
        { status: 500 }
      );
    }

    const nodemailer = await import('nodemailer');

    const transporter = nodemailer.default.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const phoneInfo = phone ? `\nNo. WhatsApp: ${phone}` : '';

    const emailContent = `
========================================
  PESAN BARU DARI FORM KONTAK
  Sundara Coffee - Premium Roastery
========================================

Nama         : ${name}
Email        : ${email}${phoneInfo}
Subjek       : ${subject}
Waktu        : ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}

---------- PESAN ----------

${message}

========================================
  Email ini dikirim otomatis dari
  halaman Kontak - sundaracoffee.com
========================================
    `;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f5f0e0; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .header { background: #C4A35A; padding: 24px; text-align: center; }
    .header h1 { color: #1a1a1a; margin: 0; font-size: 22px; font-weight: 700; }
    .header p { color: #1a1a1a; margin: 4px 0 0; font-size: 13px; opacity: 0.8; }
    .body { padding: 24px; }
    .field { margin-bottom: 16px; }
    .field-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #888; margin-bottom: 4px; }
    .field-value { font-size: 14px; color: #333; font-weight: 500; }
    .message-box { background: #f9f9f9; border-left: 3px solid #C4A35A; padding: 16px; border-radius: 8px; margin-top: 8px; }
    .message-box p { margin: 0; font-size: 14px; line-height: 1.7; color: #444; white-space: pre-wrap; }
    .footer { background: #f5f0e0; padding: 16px 24px; text-align: center; font-size: 11px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>☕ Pesan Baru dari Form Kontak</h1>
      <p>Sundara Coffee - Premium Roastery</p>
    </div>
    <div class="body">
      <div class="field">
        <div class="field-label">Nama</div>
        <div class="field-value">${escapeHtml(name)}</div>
      </div>
      <div class="field">
        <div class="field-label">Email</div>
        <div class="field-value">${escapeHtml(email)}</div>
      </div>
      ${phone ? `<div class="field"><div class="field-label">No. WhatsApp</div><div class="field-value">${escapeHtml(phone)}</div></div>` : ''}
      <div class="field">
        <div class="field-label">Subjek</div>
        <div class="field-value">${escapeHtml(subject)}</div>
      </div>
      <div class="field">
        <div class="field-label">Waktu</div>
        <div class="field-value">${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'full', timeStyle: 'short' })}</div>
      </div>
      <div class="field">
        <div class="field-label">Pesan</div>
        <div class="message-box">
          <p>${escapeHtml(message)}</p>
        </div>
      </div>
    </div>
    <div class="footer">
      Email ini dikirim otomatis dari halaman Kontak — sundaracoffee.com
    </div>
  </div>
</body>
</html>
    `;

    await transporter.sendMail({
      from: `"Sundara Coffee Contact" <${SMTP_USER}>`,
      to: NOTIFICATION_EMAIL,
      replyTo: email,
      subject: `[Kontak] ${subject} — dari ${name}`,
      text: emailContent,
      html: htmlContent,
    });

    return NextResponse.json({
      success: true,
      message: 'Pesan berhasil dikirim. Kami akan menghubungi Anda segera!',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Gagal mengirim pesan. Silakan coba lagi atau hubungi via WhatsApp.' },
      { status: 500 }
    );
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&#039;');
}
