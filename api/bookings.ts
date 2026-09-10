import type { VercelRequest, VercelResponse } from '@vercel/node';

// Minimal CORS helper (local dev + prod). Only the two canonical origins are
// ever echoed; same-origin form posts do not depend on CORS at all.
const ALLOWED_ORIGINS = new Set(['https://prodbyarmah.com', 'https://www.prodbyarmah.com']);
function setCors(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers?.origin;
  res.setHeader('Access-Control-Allow-Origin', typeof origin === 'string' && ALLOWED_ORIGINS.has(origin) ? origin : 'https://prodbyarmah.com');
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');
}

// Best-effort per-IP rate limiting for the public booking endpoint. NOTE:
// serverless instances do not share this memory, so this only raises the bar
// per instance — Vercel-level firewall/rate limiting remains the recommended
// defense in depth (see deployment report).
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_REQUESTS = 5;
const rateBuckets = new Map<string, { start: number; count: number }>();

function clientIp(req: VercelRequest): string {
  const forwarded = req.headers?.['x-forwarded-for'];
  const first = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(',')[0]?.trim();
  const socketIp = (req.socket as { remoteAddress?: string } | undefined)?.remoteAddress;
  return first || socketIp || 'unknown';
}

function checkRateLimit(ip: string): { limited: boolean; retryAfterSec: number } {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);
  if (!bucket || now - bucket.start >= RATE_WINDOW_MS) {
    rateBuckets.set(ip, { start: now, count: 1 });
    return { limited: false, retryAfterSec: 0 };
  }
  bucket.count += 1;
  if (bucket.count > RATE_MAX_REQUESTS) {
    return { limited: true, retryAfterSec: Math.max(1, Math.ceil((RATE_WINDOW_MS - (now - bucket.start)) / 1000)) };
  }
  return { limited: false, retryAfterSec: 0 };
}

/** Test-only reset for the in-memory booking rate limiter. */
export function __resetBookingRateLimit(): void {
  rateBuckets.clear();
}

// Absolute ceiling for the raw request body. Per-field caps below keep
// legitimate inquiries far under this; anything larger is abuse/probing.
const MAX_BODY_BYTES = 32 * 1024;

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
  eventDate?: string;
  company?: string;
  language?: string;
};

type Lang = 'de' | 'en' | 'fr' | 'pt' | 'es';
const LANGS: readonly Lang[] = ['de', 'en', 'fr', 'pt', 'es'];

function normalizeLanguage(v: unknown): Lang {
  if (typeof v === 'string' && (LANGS as readonly string[]).includes(v)) {
    return v as Lang;
  }
  return 'en';
}

type EmailCopy = {
  subject: string;
  greeting: string;
  intro: string;
  body: string;
  summaryTitle: string;
  messageLabel: string;
  fields: {
    name: string;
    email: string;
    inquiryType: string;
    eventType: string;
    location: string;
    budget: string;
    eventDate: string;
    beatId: string;
    beatTitle: string;
  };
  inquiryTypeLabels: {
    dj: string;
    producer: string;
  };
};

const TRANSLATIONS: Record<Lang, EmailCopy> = {
  de: {
    subject: 'Deine Booking-Anfrage ist eingegangen — ARMAH',
    greeting: 'Hallo {name},',
    intro: 'vielen Dank für deine Anfrage. Wir haben sie erhalten und prüfen jetzt die Details.',
    body: 'Wir melden uns so schnell wie möglich bei dir zurück.',
    summaryTitle: 'Deine Anfrage',
    messageLabel: 'Deine Nachricht',
    fields: {
      name: 'Name',
      email: 'E-Mail',
      inquiryType: 'Anfrage-Typ',
      eventType: 'Event-Typ',
      location: 'Ort',
      budget: 'Budget',
      eventDate: 'Event-Datum',
      beatId: 'Beat-ID',
      beatTitle: 'Beat-Titel',
    },
    inquiryTypeLabels: { dj: 'DJ-Booking', producer: 'Producer / Beat-Lizenz' },
  },
  en: {
    subject: 'Your booking inquiry has been received — ARMAH',
    greeting: 'Hi {name},',
    intro: 'Thank you for your inquiry. We have received it and are now reviewing the details.',
    body: 'We will get back to you as soon as possible.',
    summaryTitle: 'Your inquiry',
    messageLabel: 'Your message',
    fields: {
      name: 'Name',
      email: 'Email',
      inquiryType: 'Inquiry type',
      eventType: 'Event type',
      location: 'Location',
      budget: 'Budget',
      eventDate: 'Event date',
      beatId: 'Beat ID',
      beatTitle: 'Beat title',
    },
    inquiryTypeLabels: { dj: 'DJ Booking', producer: 'Producer / Beat Licensing' },
  },
  fr: {
    subject: 'Votre demande de booking a bien été reçue — ARMAH',
    greeting: 'Bonjour {name},',
    intro: 'Merci pour votre demande. Nous l’avons bien reçue et examinons maintenant les détails.',
    body: 'Nous vous répondrons dès que possible.',
    summaryTitle: 'Votre demande',
    messageLabel: 'Votre message',
    fields: {
      name: 'Nom',
      email: 'E-mail',
      inquiryType: 'Type de demande',
      eventType: "Type d'événement",
      location: 'Lieu',
      budget: 'Budget',
      eventDate: "Date de l'événement",
      beatId: 'ID du beat',
      beatTitle: 'Titre du beat',
    },
    inquiryTypeLabels: { dj: 'Booking DJ', producer: 'Producer / Licence de beat' },
  },
  pt: {
    subject: 'O seu pedido de booking foi recebido — ARMAH',
    greeting: 'Olá {name},',
    intro: 'Obrigado pelo seu pedido. Recebemo-lo e estamos agora a analisar os detalhes.',
    body: 'Entraremos em contacto consigo o mais breve possível.',
    summaryTitle: 'O seu pedido',
    messageLabel: 'A sua mensagem',
    fields: {
      name: 'Nome',
      email: 'E-mail',
      inquiryType: 'Tipo de pedido',
      eventType: 'Tipo de evento',
      location: 'Localização',
      budget: 'Orçamento',
      eventDate: 'Data do evento',
      beatId: 'ID do beat',
      beatTitle: 'Título do beat',
    },
    inquiryTypeLabels: { dj: 'Booking de DJ', producer: 'Producer / Licenciamento de beat' },
  },
  es: {
    subject: 'Hemos recibido tu solicitud de booking — ARMAH',
    greeting: 'Hola {name},',
    intro: 'Gracias por tu solicitud. La hemos recibido y estamos revisando los detalles.',
    body: 'Nos pondremos en contacto contigo lo antes posible.',
    summaryTitle: 'Tu solicitud',
    messageLabel: 'Tu mensaje',
    fields: {
      name: 'Nombre',
      email: 'Correo electrónico',
      inquiryType: 'Tipo de solicitud',
      eventType: 'Tipo de evento',
      location: 'Ubicación',
      budget: 'Presupuesto',
      eventDate: 'Fecha del evento',
      beatId: 'ID del beat',
      beatTitle: 'Título del beat',
    },
    inquiryTypeLabels: { dj: 'Booking de DJ', producer: 'Producer / Licencia de beat' },
  },
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
  const displayName = (name || '').replace(/[\x00-\x1F\x7F]/g, '').trim();
  if (!displayName) return `<${email}>`;
  return `"${displayName.replace(/"/g, '')}" <${email}>`;
}

function encodeMimeSubject(subject: string): string {
  subject = subject.replace(/[\x00-\x1F\x7F]/g, ' ');
  // eslint-disable-next-line no-control-regex
  if (/^[\x00-\x7F]*$/.test(subject)) return subject;
  return `=?UTF-8?B?${Buffer.from(subject, 'utf8').toString('base64')}?=`;
}

function buildRawMessage(params: {
  fromEmail: string;
  fromName: string;
  to: string[];
  replyTo?: { email: string; name?: string };
  subject: string;
  html: string;
}): string {
  const headers = [
    `From: ${formatAddress(params.fromEmail, params.fromName)}`,
    `To: ${params.to.join(', ')}`,
    params.replyTo ? `Reply-To: ${formatAddress(params.replyTo.email, params.replyTo.name)}` : undefined,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    `Subject: ${encodeMimeSubject(params.subject)}`,
  ].filter((value): value is string => Boolean(value));

  const message = `${headers.join('\r\n')}\r\n\r\n${params.html}`;

  return Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
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

const EMAIL_LOGO_URL = 'https://prodbyarmah.com/branding/armah-email-logo.jpg';
const EMAIL_FONT = 'Arial, Helvetica, sans-serif';

// Dark-mode lock: mail apps (esp. Gmail iOS/Android) force-invert colors in dark mode.
// "background-image: linear-gradient(x,x)" keeps backgrounds from being inverted and
// "-webkit-text-fill-color" keeps text colors stable; the meta tags cover Apple Mail.
function lockBg(hex: string): string {
  return `background:${hex}; background-image:linear-gradient(${hex},${hex});`;
}

function lockText(hex: string): string {
  return `color:${hex}; -webkit-text-fill-color:${hex};`;
}

function buildEmailShell(bodyHtml: string): string {
  return `
  <!DOCTYPE html>
  <html lang="en" style="color-scheme: light only; supported-color-schemes: light only;">
  <head>
    <meta charset="utf-8" />
    <meta name="color-scheme" content="light only" />
    <meta name="supported-color-schemes" content="light only" />
  </head>
  <body style="margin:0; padding:0; ${lockBg('#f4f4f2')}">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="${lockBg('#f4f4f2')} padding:32px 16px; font-family:${EMAIL_FONT};">
    <tr>
      <td align="center">
        <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px; width:100%; ${lockBg('#ffffff')}">
          <tr>
            <td align="center" style="${lockBg('#080808')} padding:32px 24px;">
              <img src="${EMAIL_LOGO_URL}" width="210" alt="ARMAH" style="display:block; width:210px; max-width:210px; height:auto; border:0;" />
            </td>
          </tr>
          <tr>
            <td style="${lockBg('#C7352C')} height:3px; line-height:3px; font-size:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:40px 40px 24px;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px 32px; border-top:1px solid #eeeeee;">
              <p style="margin:0; font-family:${EMAIL_FONT}; font-size:12px; ${lockText('#999999')} text-align:center;">
                booking@prodbyarmah.com &middot; prodbyarmah.com
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  </body>
  </html>`;
}

function buildSummaryTable(rows: Array<[string, string]>): string {
  const tableRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px; ${lockText('#888888')} font-size:13px; width:140px; vertical-align:top;">${escapeHtml(label)}</td><td style="padding:8px 12px; ${lockText('#111111')} font-size:13px;">${escapeHtml(value)}</td></tr>`
    )
    .join('');

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="${lockBg('#f7f7f6')} border-radius:8px; font-family:${EMAIL_FONT};">${tableRows}</table>`;
}

function buildEmailHtml(details: {
  name: string;
  email: string;
  inquiryType: string;
  eventType: string;
  location: string;
  message: string;
  budget?: string;
  eventDate?: string;
  beatId?: string;
  beatTitle?: string;
  language: Lang;
}): string {
  const copy = TRANSLATIONS[details.language];
  const inquiryTypeLabel = copy.inquiryTypeLabels[details.inquiryType === 'producer' ? 'producer' : 'dj'];

  const rows: Array<[string, string]> = [
    [copy.fields.name, details.name],
    [copy.fields.email, details.email],
    [copy.fields.inquiryType, inquiryTypeLabel],
    [copy.fields.eventType, details.eventType],
    [copy.fields.location, details.location],
  ];

  if (details.eventDate) rows.push([copy.fields.eventDate, details.eventDate]);
  if (details.budget) rows.push([copy.fields.budget, details.budget]);
  if (details.beatId) rows.push([copy.fields.beatId, details.beatId]);
  if (details.beatTitle) rows.push([copy.fields.beatTitle, details.beatTitle]);

  const body = `
    <p style="margin:0 0 20px; font-family:${EMAIL_FONT}; font-size:15px; ${lockText('#111111')}">New booking inquiry via prodbyarmah.com</p>
    ${buildSummaryTable(rows)}
    <div style="margin-top:24px;">
      <div style="font-family:${EMAIL_FONT}; font-size:11px; text-transform:uppercase; letter-spacing:0.08em; ${lockText('#999999')} margin-bottom:8px;">${escapeHtml(copy.messageLabel)}</div>
      <div style="font-family:${EMAIL_FONT}; font-size:14px; ${lockText('#333333')} ${lockBg('#f7f7f6')} padding:16px; border-radius:8px; white-space:pre-wrap;">${escapeHtml(details.message)}</div>
    </div>
  `;

  return buildEmailShell(body);
}

function buildAutoReplyHtml(details: {
  name: string;
  message: string;
  inquiryType: string;
  eventType: string;
  location: string;
  budget?: string;
  eventDate?: string;
  beatId?: string;
  beatTitle?: string;
  language: Lang;
}): string {
  const copy = TRANSLATIONS[details.language];
  const inquiryTypeLabel = copy.inquiryTypeLabels[details.inquiryType === 'producer' ? 'producer' : 'dj'];

  const rows: Array<[string, string]> = [
    [copy.fields.inquiryType, inquiryTypeLabel],
    [copy.fields.eventType, details.eventType],
    [copy.fields.location, details.location],
  ];

  if (details.eventDate) rows.push([copy.fields.eventDate, details.eventDate]);
  if (details.budget) rows.push([copy.fields.budget, details.budget]);
  if (details.beatId) rows.push([copy.fields.beatId, details.beatId]);
  if (details.beatTitle) rows.push([copy.fields.beatTitle, details.beatTitle]);

  const greeting = copy.greeting.replace('{name}', escapeHtml(details.name));

  const body = `
    <p style="margin:0 0 16px; font-family:${EMAIL_FONT}; font-size:16px; ${lockText('#111111')}">${greeting}</p>
    <p style="margin:0 0 12px; font-family:${EMAIL_FONT}; font-size:14px; ${lockText('#333333')} line-height:1.6;">${escapeHtml(copy.intro)}</p>
    <p style="margin:0 0 28px; font-family:${EMAIL_FONT}; font-size:14px; ${lockText('#333333')} line-height:1.6;">${escapeHtml(copy.body)}</p>

    <div style="font-family:${EMAIL_FONT}; font-size:11px; text-transform:uppercase; letter-spacing:0.08em; ${lockText('#999999')} margin-bottom:8px;">${escapeHtml(copy.summaryTitle)}</div>
    ${buildSummaryTable(rows)}

    <div style="margin-top:24px;">
      <div style="font-family:${EMAIL_FONT}; font-size:11px; text-transform:uppercase; letter-spacing:0.08em; ${lockText('#999999')} margin-bottom:8px;">${escapeHtml(copy.messageLabel)}</div>
      <div style="font-family:${EMAIL_FONT}; font-size:14px; ${lockText('#333333')} ${lockBg('#f7f7f6')} padding:16px; border-radius:8px; white-space:pre-wrap;">${escapeHtml(details.message)}</div>
    </div>

    <p style="margin:32px 0 0; font-family:${EMAIL_FONT}; font-size:14px; ${lockText('#111111')}">— ARMAH</p>
  `;

  return buildEmailShell(body);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    setCors(req, res);

    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ ok: false, error: 'Method not allowed' });
    }

    const { limited, retryAfterSec } = checkRateLimit(clientIp(req));
    if (limited) {
      res.setHeader('Retry-After', String(retryAfterSec));
      return res.status(429).json({ ok: false, error: 'Too many requests' });
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

    const rawSize = Buffer.byteLength(typeof body === 'string' ? body : JSON.stringify(body ?? {}), 'utf8');
    if (rawSize > MAX_BODY_BYTES) {
      return res.status(413).json({ ok: false, error: 'Payload too large' });
    }

    // These fields enter MIME headers; reject controls before normalization/trimming.
    if ([payload?.name, payload?.email, payload?.eventType, payload?.location].some(
      value => typeof value === 'string' && /[\x00-\x1F\x7F]/.test(value)
    )) return res.status(400).json({ ok: false, error: 'Invalid field characters' });

    const name = clean(payload?.name, 120);
    const email = clean(payload?.email, 200);
    const inquiryType = clean(payload?.inquiryType, 40) || 'dj';
    const eventType = clean(payload?.eventType, 120);
    const location = clean(payload?.location, 200);
    const message = clean(payload?.message, 4000);
    const budget = clean(payload?.budget, 200);
    const eventDate = clean(payload?.eventDate, 40);
    const beatId = clean(payload?.beatId, 200);
    const beatTitle = clean(payload?.beatTitle, 200);
    const company = clean(payload?.company, 200);
    const language = normalizeLanguage(payload?.language);

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

    const eventTypes = inquiryType === 'dj'
      ? ['club', 'festival', 'private', 'corporate', 'other']
      : ['beat_license', 'custom_beat', 'production', 'mix_master', 'collab', 'other'];
    if (!['dj', 'producer'].includes(inquiryType) || !eventTypes.includes(eventType)) {
      return res.status(400).json({ ok: false, error: 'Invalid inquiry type' });
    }
    if (inquiryType === 'dj' && (!/^\d{4}-\d{2}-\d{2}$/.test(eventDate) ||
      !Number.isFinite(Date.parse(eventDate)) || new Date(eventDate).toISOString().slice(0, 10) !== eventDate)) {
      return res.status(400).json({ ok: false, error: 'Valid event date required' });
    }
    if (inquiryType === 'producer' && eventType === 'beat_license' && !beatId) {
      return res.status(400).json({ ok: false, error: 'Beat selection required' });
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
      eventDate: inquiryType === 'dj' ? eventDate : undefined,
      beatId: inquiryType === 'producer' ? beatId : undefined,
      beatTitle: inquiryType === 'producer' ? beatTitle : undefined,
      language,
    });

    await sendGmailEmail({
      fromEmail,
      fromName,
      to: recipients,
      replyTo: { email, name },
      subject: `ARMAH Booking — ${eventType} (${location})`,
      html,
    });

    try {
      const autoHtml = buildAutoReplyHtml({
        name,
        message,
        inquiryType: inquiryType || 'dj',
        eventType,
        location,
        budget: inquiryType === 'dj' ? budget : undefined,
        eventDate: inquiryType === 'dj' ? eventDate : undefined,
        beatId: inquiryType === 'producer' ? beatId : undefined,
        beatTitle: inquiryType === 'producer' ? beatTitle : undefined,
        language,
      });
      await sendGmailEmail({
        fromEmail,
        fromName,
        to: [email],
        replyTo: { email: bookingTo, name: fromName },
        subject: TRANSLATIONS[language].subject,
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
