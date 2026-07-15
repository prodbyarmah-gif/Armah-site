# ARMAH — Website

Website für ARMAH, DJ & Producer aus Hamburg (Afrobeats, Amapiano, Afro-House, UK, Hip-Hop, RnB, Dancehall). Live unter [prodbyarmah.com](https://prodbyarmah.com).

Die Seite stellt Bio, Live-Auftritte, gebuchte Locations, den Beat-Katalog zur Lizenzierung sowie ein zweisprachiges Booking-Formular (DJ-Anfragen / Producer-Anfragen) bereit. Anfragen werden per Gmail-API versendet — an ARMAH selbst und als Bestätigung an die anfragende Person, jeweils in der Sprache, in der das Formular ausgefüllt wurde.

## Tech Stack

- **React 18 + TypeScript + Vite**
- **Tailwind CSS** für Styling, **Framer Motion** für Animationen
- **Vercel** für Hosting und Serverless Functions (`/api`)
- Eigenes, handgebautes i18n-System (`src/i18n/`) — 5 Sprachen: Deutsch, Englisch, Französisch, Portugiesisch, Spanisch
- `react-simple-maps` für die interaktive Tour-Karte, `wavesurfer.js` für die Beat-Previews

## Struktur

```
src/components/   Seiten-Sektionen (Hero, About, Live, Trusted, Producer, Booking, Footer, …)
src/i18n/         Übersetzungen pro Sprache + zentrale useI18n()-Logik
src/data/         Statische Inhalte (Events, Venues, Kontaktdaten)
api/               Vercel Serverless Functions (Booking-Mailversand, Gmail-OAuth)
public/assets/     Bilder, PDFs (Rider), Kartendaten
public/branding/   Gebrandete Assets für den E-Mail-Versand
```

## Entwicklung

```bash
npm install
npm run dev       # lokaler Dev-Server
npm run build     # Typecheck + Production-Build
npm run preview   # Production-Build lokal ansehen
```

## Booking-E-Mail-Versand (Gmail OAuth)

Der Mailversand läuft über die Gmail API mit einem OAuth-Refresh-Token, nicht über SMTP oder einen Drittanbieter.

### Vercel Environment Variables

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`
- `GOOGLE_OAUTH_ADMIN_KEY`
- `GOOGLE_FROM_EMAIL`
- `GOOGLE_FROM_NAME` (optional)
- `BOOKING_TO` — Empfänger der internen Booking-Mail. **Wichtig:** direkt auf `prodbyarmah@gmail.com` setzen, nicht auf den `booking@prodbyarmah.com`-Alias — sonst dedupliziert Gmail die Mail weg, weil sie vom selben Konto kommt, das sie auch empfängt.

Google Cloud Redirect URI:
- `https://prodbyarmah.com/api/google-callback`

One-time private OAuth-Link (nur nötig, falls der Refresh-Token neu ausgestellt werden muss):
- `https://prodbyarmah.com/api/google-auth?key=DEIN_GOOGLE_OAUTH_ADMIN_KEY`

### Sicherheitshinweise

- Secrets nie hardcoden.
- Keine lokalen `.env`-Dateien für diesen Flow anlegen oder committen.
