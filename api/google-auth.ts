import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHash, timingSafeEqual } from 'node:crypto';

function keyMatches(provided: string, expected: string): boolean {
  if (!expected || !provided) return false;
  const a = new TextEncoder().encode(provided);
  const b = new TextEncoder().encode(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Deterministic, non-secret OAuth state binding (sha-256 of the admin key). */
export function oauthStateForAdminKey(adminKey: string): string {
  return createHash('sha256').update(adminKey).digest('hex');
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).end();
    return;
  }
  res.setHeader('Cache-Control', 'no-store');

  const providedKey = typeof req.query?.key === 'string' ? req.query.key : '';
  const expectedKey = process.env.GOOGLE_OAUTH_ADMIN_KEY || '';

  if (!keyMatches(providedKey, expectedKey)) {
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
    // Binds the callback to a flow initiated with the admin key (CSRF
    // hardening); verified in google-callback before any token exchange.
    state: oauthStateForAdminKey(expectedKey),
  });

  res.setHeader('Location', `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
  res.status(302).end();
}
