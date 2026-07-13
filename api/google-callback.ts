import type { VercelRequest, VercelResponse } from '@vercel/node';

function renderPage(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 2rem; line-height: 1.6; color: #111; }
      textarea { width: 100%; min-height: 120px; margin-top: 0.75rem; padding: 0.75rem; border: 1px solid #ddd; border-radius: 8px; }
      .card { max-width: 720px; margin: 0 auto; padding: 1.5rem; border: 1px solid #eee; border-radius: 12px; }
      .muted { color: #666; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>${title}</h1>
      <p>${body}</p>
    </div>
  </body>
</html>`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).end();
    return;
  }

  const code = typeof req.query?.code === 'string' ? req.query.code : '';
  if (!code) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(400).send(renderPage('OAuth callback error', 'No authorization code was provided.'));
    return;
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = 'https://prodbyarmah.com/api/google-callback';

  if (!clientId || !clientSecret) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(500).send(renderPage('OAuth callback error', 'Google OAuth is not configured correctly.'));
    return;
  }

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const data = await tokenResponse.json().catch(() => ({} as { refresh_token?: string; error_description?: string }));

    if (!tokenResponse.ok || !data.refresh_token) {
      const message = data.error_description || 'Google did not return a refresh token.';
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.status(400).send(renderPage('OAuth callback error', `${message} If you previously granted access, revoke the app in Google Account > Security > Third-party access and run the authorization flow again.`));
      return;
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(renderPage(
      'Google OAuth complete',
      'Copy this once to Vercel as GOOGLE_REFRESH_TOKEN. Treat it like a password. Do not share it.'
    ) + `\n<textarea readonly>${data.refresh_token}</textarea>`);
  } catch {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(500).send(renderPage('OAuth callback error', 'The OAuth exchange failed. No secrets were exposed.'));
  }
}
