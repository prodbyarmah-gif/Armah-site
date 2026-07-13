# Armah-site

## Vercel Environment Variables

Set these in Vercel before enabling the Gmail flow:

- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- GOOGLE_REFRESH_TOKEN
- GOOGLE_OAUTH_ADMIN_KEY
- GOOGLE_FROM_EMAIL
- GOOGLE_FROM_NAME (optional)
- BOOKING_TO

Example values:
- GOOGLE_FROM_EMAIL=booking@prodbyarmah.com
- BOOKING_TO=booking@prodbyarmah.com

Google Cloud redirect URI:
- https://prodbyarmah.com/api/google-callback

One-time private OAuth link:
- https://prodbyarmah.com/api/google-auth?key=DEIN_GOOGLE_OAUTH_ADMIN_KEY

Security notes:
- Never hardcode secrets.
- Do not create or edit local .env files for this flow.
- Keep Brevo variables in Vercel for now until the Gmail setup is verified live.
