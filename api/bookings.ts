import type { VercelRequest, VercelResponse } from '@vercel/node';

// Minimal CORS helper (local dev + prod)
function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', 'https://prodbyarmah.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

type BookingPayload = {
  name?: string;
  email?: string;
  inquiryType?: string;
  eventType?: string;
  location?: string;
  message?: string;
  beatId?: string;
  beatTitle?: string;
  budget?: string;
  company?: string;
};

function isEmail(v: unknown): v is string {
  return typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function clean(v: unknown, max = 2000): string {
  if (typeof v !== 'string') return '';
  const s = v.trim();
  return s.length > max ? s.slice(0, max) : s;
}

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char] as string));
}

function formatAddress(email: string, name?: string): string {
  const displayName = (name || '').trim();
  if (!displayName) return `<${email}>`;
  return `"${displayName.replace(/"/g, '')}" <${email}>`;
}

function buildRawMessage(params: {
  fromEmail: string;
  fromName: string;
  to: string[];
  replyTo?: { email: string; name?: string };
  subject: string;
  html: string;
}): string {
  const lines = [
    `From: ${formatAddress(params.fromEmail, params.fromName)}`,
    `To: ${params.to.join(', ')}`,
    params.replyTo ? `Reply-To: ${formatAddress(params.replyTo.email, params.replyTo.name)}` : undefined,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: 7bit',
    `Subject: ${params.subject}`,
    '',
    params.html,
  ].filter((value): value is string => Boolean(value));

  return Buffer.from(lines.join('\r\n')).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

async function getGmailAccessToken(): Promise<string> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Email service is not configured');
  }

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  const data = await res.json().catch(() => ({} as { access_token?: string }));
  if (!res.ok || !data.access_token) {
    throw new Error('Unable to initialize email delivery');
  }

  return data.access_token;
}

async function sendGmailEmail(params: {
  fromEmail: string;
  fromName: string;
  to: string[];
  replyTo?: { email: string; name?: string };
  subject: string;
  html: string;
}): Promise<void> {
  const accessToken = await getGmailAccessToken();
  const raw = buildRawMessage(params);

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw }),
  });

  const text = await res.text().catch(() => '');
  if (!res.ok) {
    throw new Error(`Gmail API error ${res.status}: ${text || res.statusText}`);
  }
}

function buildEmailHtml(details: {
  name: string;
  email: string;
  inquiryType: string;
  eventType: string;
  location: string;
  message: string;
  budget?: string;
  beatId?: string;
  beatTitle?: string;
}): string {
  const rows = [
    ['Name', details.name],
    ['Email', details.email],
    ['Inquiry type', details.inquiryType],
    ['Event type', details.eventType],
    ['Location', details.location],
  ];

  if (details.budget) {
    rows.push(['Budget', details.budget]);
  }

  if (details.beatId) {
    rows.push(['Beat ID', details.beatId]);
  }

  if (details.beatTitle) {
    rows.push(['Beat title', details.beatTitle]);
  }

  const tableRows = rows.map(([label, value]) => `<tr><td style="padding:6px 0; color:#666; width:140px;">${escapeHtml(label)}</td><td style="padding:6px 0;">${escapeHtml(value)}</td></tr>`).join('');

  return `
  <div style="font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; line-height:1.4;">
    <h2 style="margin:0 0 12px;">New Booking Inquiry</h2>
    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse; width:100%; max-width:640px;">
      ${tableRows}
    </table>
    <div style="margin-top:14px; padding:12px; background:#111; color:#fff; border-radius:8px;">
      <div style="color:#aaa; font-size:12px; margin-bottom:8px;">Message</div>
      <div style="white-space:pre-wrap;">${escapeHtml(details.message)}</div>
    </div>
  </div>`;
}

function buildAutoReplyHtml(name: string, message: string, senderName: string): string {
  const safeName = escapeHtml(name);
  const safeMessage = escapeHtml(message);
  const safeSender = escapeHtml(senderName);

  return `
    <div style="font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; line-height:1.5;">
      <p style="margin:0 0 10px;">Hey ${safeName},</p>
      <p style="margin:0 0 10px;">Thanks for reaching out — I received your booking inquiry.</p>
      <p style="margin:0 0 10px;">My name is <strong>Armah</strong>, and my manager is already informed. We’ll get back to you as soon as possible.</p>
      <p style="margin:0 0 14px; color:#666; font-size:13px;">(This is an automatic confirmation.)</p>
      <hr style="border:none;border-top:1px solid #e5e5e5;margin:14px 0;" />
      <p style="margin:0 0 6px; color:#666; font-size:13px;">Your message:</p>
      <div style="white-space:pre-wrap; background:#111; color:#fff; padding:10px 12px; border-radius:8px;">${safeMessage}</div>
      <p style="margin:14px 0 0;">— ${safeSender}</p>
    </div>
  `;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    setCors(res);

    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ ok: false, error: 'Method not allowed' });
    }

    const bookingTo = requireEnv('BOOKING_TO');
    const fromEmail = requireEnv('GOOGLE_FROM_EMAIL');
    const fromName = process.env.GOOGLE_FROM_NAME || 'ARMAH Website';
    const managerEmail = process.env.MANAGER_EMAIL || '';
    const managerRecipients = isEmail(managerEmail) ? [managerEmail] : [];

    const body: unknown = req.body;
    let payload: BookingPayload = {};

    if (typeof body === 'string') {
      try {
        payload = JSON.parse(body) as BookingPayload;
      } catch {
        payload = {};
      }
    } else {
      payload = body as BookingPayload;
    }

    const name = clean(payload?.name, 120);
    const email = clean(payload?.email, 200);
    const inquiryType = clean(payload?.inquiryType, 40);
    const eventType = clean(payload?.eventType, 120);
    const location = clean(payload?.location, 200);
    const message = clean(payload?.message, 4000);
    const budget = clean(payload?.budget, 200);
    const beatId = clean(payload?.beatId, 200);
    const beatTitle = clean(payload?.beatTitle, 200);
    const company = clean(payload?.company, 200);

    if (company) {
      return res.status(400).json({ ok: false, error: 'Spam detected' });
    }

    if (!name || !email || !eventType || !location || !message) {
      return res.status(400).json({
        ok: false,
        error: 'Missing required fields',
        required: ['name', 'email', 'eventType', 'location', 'message'],
      });
    }

    if (!isEmail(email)) {
      return res.status(400).json({ ok: false, error: 'Invalid email' });
    }

    const recipients = [bookingTo, ...managerRecipients].filter(Boolean);
    if (!recipients.length) {
      return res.status(500).json({ ok: false, error: 'Missing booking recipient' });
    }

    const html = buildEmailHtml({
      name,
      email,
      inquiryType: inquiryType || 'dj',
      eventType,
      location,
      message,
      budget: inquiryType === 'dj' ? budget : undefined,
      beatId: inquiryType === 'producer' ? beatId : undefined,
      beatTitle: inquiryType === 'producer' ? beatTitle : undefined,
    });

    await sendGmailEmail({
      fromEmail,
      fromName,
      to: recipients,
      replyTo: { email, name },
      subject: `ARMAH Booking Inquiry — ${eventType} (${location})`,
      html,
    });

    try {
      const autoHtml = buildAutoReplyHtml(name, message, fromName);
      await sendGmailEmail({
        fromEmail,
        fromName,
        to: [email],
        replyTo: { email: bookingTo, name: fromName },
        subject: 'Booking inquiry received ✅',
        html: autoHtml,
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Gmail auto-reply failed:', e);
    }

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ ok: false, error: 'Unable to send booking email right now.' });
  }
}
