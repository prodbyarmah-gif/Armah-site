import type { VercelRequest, VercelResponse } from '@vercel/node';

// --- Config (set these in Vercel Environment Variables) ---
// BREVO_API_KEY      = your Brevo API v3 key
// BREVO_LIST_ID      = e.g. "3"
// BREVO_FROM_EMAIL   = a VERIFIED sender email in Brevo (critical)
// BREVO_FROM_NAME    = optional, e.g. "ARMAH Website"
// BOOKING_TO         = where you want inquiries delivered (your Gmail)

// Minimal CORS helper (local dev + prod)
function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

type BookingPayload = {
  name?: string;
  email?: string;
  eventType?: string;
  location?: string;
  message?: string;
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

async function brevoRequest<T>(path: string, apiKey: string, init?: RequestInit): Promise<T> {
  const url = `https://api.brevo.com/v3${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
      ...(init?.headers ?? {}),
    },
  });

  const text = await res.text().catch(() => '');
  if (!res.ok) {
    // Never leak apiKey, but do return useful error detail
    throw new Error(`Brevo API error ${res.status}: ${text || res.statusText}`);
  }

  return (text ? (JSON.parse(text) as T) : ({} as T));
}

function buildEmailHtml(p: Required<Pick<BookingPayload, 'name' | 'email' | 'eventType' | 'location' | 'message'>>): string {
  const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[c] as string));

  return `
  <div style="font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; line-height:1.4;">
    <h2 style="margin:0 0 12px;">New Booking Inquiry</h2>
    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse; width:100%; max-width:640px;">
      <tr><td style="padding:6px 0; color:#666; width:140px;">Name</td><td style="padding:6px 0;">${esc(p.name)}</td></tr>
      <tr><td style="padding:6px 0; color:#666;">Email</td><td style="padding:6px 0;">${esc(p.email)}</td></tr>
      <tr><td style="padding:6px 0; color:#666;">Event type</td><td style="padding:6px 0;">${esc(p.eventType)}</td></tr>
      <tr><td style="padding:6px 0; color:#666;">Location</td><td style="padding:6px 0;">${esc(p.location)}</td></tr>
    </table>
    <div style="margin-top:14px; padding:12px; background:#111; color:#fff; border-radius:8px;">
      <div style="color:#aaa; font-size:12px; margin-bottom:8px;">Message</div>
      <div style="white-space:pre-wrap;">${esc(p.message)}</div>
    </div>
  </div>`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    setCors(res);

    if (req.method === 'OPTIONS') {
      // CORS preflight
      return res.status(204).end();
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ ok: false, error: 'Method not allowed' });
    }

    const apiKey = requireEnv('BREVO_API_KEY');
    const listIdRaw = requireEnv('BREVO_LIST_ID');
    const fromEmail = requireEnv('BREVO_FROM_EMAIL');
    const fromName = process.env.BREVO_FROM_NAME || 'ARMAH Website';
    const bookingTo = requireEnv('BOOKING_TO');

    const listId = Number(listIdRaw);
    if (!Number.isFinite(listId) || listId <= 0) {
      return res.status(500).json({ ok: false, error: 'BREVO_LIST_ID must be a positive number' });
    }

    // Body parsing (Vercel usually gives object; but be defensive)
    const body: unknown = req.body;
    const payload: BookingPayload =
      typeof body === 'string' ? (JSON.parse(body) as BookingPayload) : (body as BookingPayload);

    const name = clean(payload?.name, 120);
    const email = clean(payload?.email, 200);
    const eventType = clean(payload?.eventType, 120);
    const location = clean(payload?.location, 200);
    const message = clean(payload?.message, 4000);

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

    // 1) Upsert contact into Brevo list (best-effort)
    try {
      await brevoRequest('/contacts', apiKey, {
        method: 'POST',
        body: JSON.stringify({
          email,
          attributes: {
            FIRSTNAME: name,
            EVENT_TYPE: eventType,
            LOCATION: location,
          },
          listIds: [listId],
          updateEnabled: true,
        }),
      });
    } catch (e) {
      // Don't fail the whole request if contact add fails.
      // We still want the email to go out.
      // eslint-disable-next-line no-console
      console.warn('Brevo contact upsert failed:', e);
    }

    // 2) Send transactional email to you
    const html = buildEmailHtml({ name, email, eventType, location, message });

    await brevoRequest('/smtp/email', apiKey, {
      method: 'POST',
      body: JSON.stringify({
        sender: { email: fromEmail, name: fromName },
        to: [{ email: bookingTo }],

        // ✅ Reply-To makes Gmail "Reply" go to the customer automatically
        replyTo: { email, name: name || 'Booking Inquiry' },

        subject: `ARMAH Booking Inquiry — ${eventType} (${location})`,
        htmlContent: html,
      }),
    });

    // 3) Auto-reply to the customer (short confirmation)
    try {
      const autoSubject = 'Booking inquiry received ✅';
      const autoHtml = `
        <div style="font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; line-height:1.5;">
          <p style="margin:0 0 10px;">Hey ${name},</p>
          <p style="margin:0 0 10px;">Thanks for reaching out — I received your booking inquiry and will get back to you as soon as possible.</p>
          <p style="margin:0 0 14px; color:#666; font-size:13px;">(This is an automatic confirmation.)</p>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin:14px 0;" />
          <p style="margin:0 0 6px; color:#666; font-size:13px;">Your message:</p>
          <div style="white-space:pre-wrap; background:#111; color:#fff; padding:10px 12px; border-radius:8px;">${message.replace(/[&<>"']/g, (c) => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
          }[c] as string))}</div>
          <p style="margin:14px 0 0;">— ${fromName}</p>
        </div>
      `;

      await brevoRequest('/smtp/email', apiKey, {
        method: 'POST',
        body: JSON.stringify({
          sender: { email: fromEmail, name: fromName },
          to: [{ email }],
          // Reply-to should go to your booking inbox (so customers don't reply to no-reply by accident)
          replyTo: { email: bookingTo, name: fromName },
          subject: autoSubject,
          htmlContent: autoHtml,
        }),
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Brevo auto-reply failed:', e);
    }

    return res.status(200).json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return res.status(500).json({ ok: false, error: msg });
  }
}