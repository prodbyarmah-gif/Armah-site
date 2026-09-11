// Single source of truth for the approved site navigation order, mirroring
// the actual homepage flow: LIVE → MIXES → SHOWS → PRODUCER → BIO → BOOKING
// (Hero → Live → Mixes → Repeat/Career Map → Producer → Bio → Booking).
// Desktop header, mobile menu, and footer all derive from this definition
// so the order cannot silently drift again. Section hrefs are stable and
// must not be changed without updating the corresponding section ids.

export type NavLinkKey = 'live' | 'mixes' | 'shows' | 'producer' | 'about' | 'booking';

export type NavLink = { key: NavLinkKey; href: string };

export const NAV_LINKS: readonly NavLink[] = [
  { key: 'live', href: '#live' },
  { key: 'mixes', href: '#mixes' },
  { key: 'shows', href: '#shows' },
  { key: 'producer', href: '#producer' },
  { key: 'about', href: '#about' },
  { key: 'booking', href: '#booking' },
] as const;

type Queryable = Pick<Element, 'querySelector'>;

// Returns the first navigation link inside a menu container. Used to place
// initial focus when the mobile menu opens. This MUST target a link —
// focusing the language <select> instead opens the native language picker
// on mobile browsers, blocking access to the navigation.
export function firstNavLinkIn(menu: Queryable | null | undefined): Element | null {
  if (!menu) return null;
  return menu.querySelector('a[href^="#"]');
}
