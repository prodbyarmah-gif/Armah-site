import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).end();
    return;
  }

  const providedKey = typeof req.query?.key === 'string' ? req.query.key : '';
  const expectedKey = process.env.GOOGLE_OAUTH_ADMIN_KEY || '';

  if (!expectedKey || providedKey !== expectedKey) {
    res.status(404).end();
    return;
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    res.status(500).json({ ok: false, error: 'Google OAuth is not configured.' });
    return;
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: 'https://prodbyarmah.com/api/google-callback',
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
    scope: 'https://www.googleapis.com/auth/gmail.send',
  });

  res.setHeader('Location', `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
  res.status(302).end();
}
