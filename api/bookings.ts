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
  const displayName = (name || '').trim();
  if (!displayName) return `<${email}>`;
  return `"${displayName.replace(/"/g, '')}" <${email}>`;
}

function encodeMimeSubject(subject: string): string {
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
  const lines = [
    `From: ${formatAddress(params.fromEmail, params.fromName)}`,
    `To: ${params.to.join(', ')}`,
    params.replyTo ? `Reply-To: ${formatAddress(params.replyTo.email, params.replyTo.name)}` : undefined,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    `Subject: ${encodeMimeSubject(params.subject)}`,
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

const EMAIL_LOGO_URL = 'https://prodbyarmah.com/branding/armah-email-logo.jpg';
const EMAIL_FONT = 'Arial, Helvetica, sans-serif';

function buildEmailShell(bodyHtml: string): string {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f2; padding:32px 16px; font-family:${EMAIL_FONT};">
    <tr>
      <td align="center">
        <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px; width:100%; background:#ffffff;">
          <tr>
            <td align="center" style="background:#080808; padding:32px 24px;">
              <img src="${EMAIL_LOGO_URL}" width="210" alt="ARMAH" style="display:block; width:210px; max-width:210px; height:auto; border:0;" />
            </td>
          </tr>
          <tr>
            <td style="background:#C7352C; height:3px; line-height:3px; font-size:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:40px 40px 24px;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px 32px; border-top:1px solid #eeeeee;">
              <p style="margin:0; font-family:${EMAIL_FONT}; font-size:12px; color:#999999; text-align:center;">
                booking@prodbyarmah.com &middot; prodbyarmah.com
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
}

function buildSummaryTable(rows: Array<[string, string]>): string {
  const tableRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px; color:#888888; font-size:13px; width:140px; vertical-align:top;">${escapeHtml(label)}</td><td style="padding:8px 12px; color:#111111; font-size:13px;">${escapeHtml(value)}</td></tr>`
    )
    .join('');

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f7f6; border-radius:8px; font-family:${EMAIL_FONT};">${tableRows}</table>`;
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

  if (details.budget) rows.push([copy.fields.budget, details.budget]);
  if (details.beatId) rows.push([copy.fields.beatId, details.beatId]);
  if (details.beatTitle) rows.push([copy.fields.beatTitle, details.beatTitle]);

  const body = `
    <p style="margin:0 0 20px; font-family:${EMAIL_FONT}; font-size:15px; color:#111111;">New booking inquiry via prodbyarmah.com</p>
    ${buildSummaryTable(rows)}
    <div style="margin-top:24px;">
      <div style="font-family:${EMAIL_FONT}; font-size:11px; text-transform:uppercase; letter-spacing:0.08em; color:#999999; margin-bottom:8px;">${escapeHtml(copy.messageLabel)}</div>
      <div style="font-family:${EMAIL_FONT}; font-size:14px; color:#333333; background:#f7f7f6; padding:16px; border-radius:8px; white-space:pre-wrap;">${escapeHtml(details.message)}</div>
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

  if (details.budget) rows.push([copy.fields.budget, details.budget]);
  if (details.beatId) rows.push([copy.fields.beatId, details.beatId]);
  if (details.beatTitle) rows.push([copy.fields.beatTitle, details.beatTitle]);

  const greeting = copy.greeting.replace('{name}', escapeHtml(details.name));

  const body = `
    <p style="margin:0 0 16px; font-family:${EMAIL_FONT}; font-size:16px; color:#111111;">${greeting}</p>
    <p style="margin:0 0 12px; font-family:${EMAIL_FONT}; font-size:14px; color:#333333; line-height:1.6;">${escapeHtml(copy.intro)}</p>
    <p style="margin:0 0 28px; font-family:${EMAIL_FONT}; font-size:14px; color:#333333; line-height:1.6;">${escapeHtml(copy.body)}</p>

    <div style="font-family:${EMAIL_FONT}; font-size:11px; text-transform:uppercase; letter-spacing:0.08em; color:#999999; margin-bottom:8px;">${escapeHtml(copy.summaryTitle)}</div>
    ${buildSummaryTable(rows)}

    <div style="margin-top:24px;">
      <div style="font-family:${EMAIL_FONT}; font-size:11px; text-transform:uppercase; letter-spacing:0.08em; color:#999999; margin-bottom:8px;">${escapeHtml(copy.messageLabel)}</div>
      <div style="font-family:${EMAIL_FONT}; font-size:14px; color:#333333; background:#f7f7f6; padding:16px; border-radius:8px; white-space:pre-wrap;">${escapeHtml(details.message)}</div>
    </div>

    <p style="margin:32px 0 0; font-family:${EMAIL_FONT}; font-size:14px; color:#111111;">— ARMAH</p>
  `;

  return buildEmailShell(body);
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
