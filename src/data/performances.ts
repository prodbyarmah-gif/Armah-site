// Original owner-confirmed venue history retained; dated history is additive.
//
// Normalized model (approved reconciliation):
// - VENUE (physical location) is distinct from EVENT BRAND (booking relationship).
// - EVENT DAY groups one or more PERFORMANCE STOPS (KDK Berlin Day = 1 day, 2 stops).
// - `count` on a venue = owner-confirmed lifetime total; `history` = individually
//   known occurrences/periods. A venue may therefore report verified_count=N with
//   known_dated<M without inventing dates (Golden Cut x3, Foot Locker x4).
// - Internal precision fields (datePrecision/weekday/year) must NEVER be rendered
//   verbatim in public UI; Trusted.tsx maps them to public-facing date lines.
export type PerformanceHistory = {
  id: string;
  event: string;
  /** Shared across stops of one event-day (e.g. KDK Berlin Day). */
  eventDayId?: string;
  /** Public-facing stop descriptor, e.g. 'Daytime set' / 'Evening closing set'. */
  stopLabel?: string;
  date?: string;
  startMonth?: string;
  endMonth?: string;
  /** Known year without exact date (e.g. KDK Berlin Day 2025). */
  year?: string;
  /** Owner-confirmed weekday without exact date (e.g. 'Saturday'). */
  weekday?: string;
  /** Internal precision marker — never render verbatim in public UI. */
  datePrecision?: 'DAY' | 'PERIOD' | 'YEAR_WEEKDAY' | 'WEEKDAY_ONLY' | 'UNRESOLVED';
  city: 'Hamburg' | 'Berlin';
  country: 'Germany';
  performanceRole: 'DJ';
  projectRole?: 'CO_FOUNDER / OWN_EVENT';
  relationshipType: 'OWN_EVENT' | 'EVENT_PERFORMANCE' | 'RECURRING_DJ_ENGAGEMENT';
  ownerVerified: true;
  publicVerification?: string;
  venueDetail?: string;
};
export type Venue = {
  subtitle?: string;
  history?: PerformanceHistory[]; // occurrences/periods at this venue; not a lifetime total
  name: string; // the real location / club
  coords?: [number, number];
  address?: string;
  own?: boolean; // your own event happened here
  events?: string[]; // which event(s)/brand(s) ran here
  count?: number; // times played here
  approx?: boolean; // coordinates still approximate (need exact address)
};
export type Stop = { city: string; coords: [number, number]; zoom: number; venues: Venue[] };

// 👉 Real locations per city. coords from OpenStreetMap; `approx:true` = still estimated.
export const STOPS: Stop[] = [
  {
    city: 'Hamburg',
    coords: [9.962, 53.56],
    zoom: 48,
    venues: [
      {
        name: 'ROOTS Club Hamburg',
        subtitle: 'formerly at Cave Club',
        address: 'Reeperbahn 48, 20359 Hamburg',
        // Approximate address position; no separate Cave Club pin.
        coords: [9.963, 53.550],
        approx: true,
        events: ['ROOTS Hamburg'],
        history: [{ id: 'roots-2024-12-2025-03', event: 'ROOTS Hamburg', startMonth: '2024-12', endMonth: '2025-03', datePrecision: 'PERIOD', city: 'Hamburg', country: 'Germany', performanceRole: 'DJ', relationshipType: 'RECURRING_DJ_ENGAGEMENT', ownerVerified: true }],
      },
      { history: [{ id: '2026-01-24-halo', date: '2026-01-24', datePrecision: 'DAY', event: 'Zaya Dreams', city: 'Hamburg', country: 'Germany', performanceRole: 'DJ', relationshipType: 'OWN_EVENT', ownerVerified: true, projectRole: 'CO_FOUNDER / OWN_EVENT', venueDetail: 'HALO Upper Club' }], name: 'Halo', coords: [9.9580213, 53.5502314], own: true, events: ['Zaya Dreams'] },
      { history: [{ id: '2026-06-05-uwe', date: '2026-06-05', datePrecision: 'DAY', event: 'Zaya Dreams', city: 'Hamburg', country: 'Germany', performanceRole: 'DJ', relationshipType: 'OWN_EVENT', ownerVerified: true, projectRole: 'CO_FOUNDER / OWN_EVENT' }], name: 'Uwe', coords: [9.9704241, 53.5565464], own: true, events: ['Zaya Dreams'] },
      {
        name: 'Club 25',
        coords: [9.9660033, 53.550125],
        events: ['Amapiano Hamburg'],
        history: [{ id: 'amapiano-hamburg-club-25', event: 'Amapiano Hamburg', datePrecision: 'UNRESOLVED', city: 'Hamburg', country: 'Germany', performanceRole: 'DJ', relationshipType: 'EVENT_PERFORMANCE', ownerVerified: true }],
      },
      {
        name: 'Golden Cut',
        coords: [10.0064963, 53.5550554],
        events: ['Golden Cut'],
        count: 3,
        // Owner-confirmed total x3; individual dates unresolved — never invented.
        history: [{ id: 'golden-cut-relationship', event: 'Golden Cut', datePrecision: 'UNRESOLVED', city: 'Hamburg', country: 'Germany', performanceRole: 'DJ', relationshipType: 'EVENT_PERFORMANCE', ownerVerified: true }],
      },
      {
        name: 'YOTO',
        coords: [9.9610207, 53.5623242],
        events: ['We Outside', 'YOTO', 'Enchanted', 'Queens & Clouds', 'PRAIZ / ARMAH / NORII', 'DARI HATI', "Monteezy's World"],
        history: [
          { id: 'yoto-own-event', event: 'YOTO', datePrecision: 'UNRESOLVED', city: 'Hamburg', country: 'Germany', performanceRole: 'DJ', relationshipType: 'EVENT_PERFORMANCE', ownerVerified: true },
          { id: '2025-05-31-yoto-enchanted', date: '2025-05-31', datePrecision: 'DAY', event: 'Enchanted', city: 'Hamburg', country: 'Germany', performanceRole: 'DJ', relationshipType: 'EVENT_PERFORMANCE', ownerVerified: true },
          { id: '2025-09-27-yoto-queens-clouds', date: '2025-09-27', datePrecision: 'DAY', event: 'Queens & Clouds', city: 'Hamburg', country: 'Germany', performanceRole: 'DJ', relationshipType: 'EVENT_PERFORMANCE', ownerVerified: true },
          { id: '2025-10-04-yoto-praiz-armah-norii', date: '2025-10-04', datePrecision: 'DAY', event: 'PRAIZ / ARMAH / NORII', city: 'Hamburg', country: 'Germany', performanceRole: 'DJ', relationshipType: 'EVENT_PERFORMANCE', ownerVerified: true },
          { id: '2026-04-18-yoto-dari-hati', date: '2026-04-18', datePrecision: 'DAY', event: 'DARI HATI', city: 'Hamburg', country: 'Germany', performanceRole: 'DJ', relationshipType: 'EVENT_PERFORMANCE', ownerVerified: true },
          { id: 'monteezy-world-at-yoto', event: "Monteezy's World", datePrecision: 'UNRESOLVED', city: 'Hamburg', country: 'Germany', performanceRole: 'DJ', relationshipType: 'EVENT_PERFORMANCE', ownerVerified: true },
          { id: 'we-outside-at-yoto', event: 'We Outside', datePrecision: 'UNRESOLVED', city: 'Hamburg', country: 'Germany', performanceRole: 'DJ', relationshipType: 'EVENT_PERFORMANCE', ownerVerified: true },
        ],
      },
      { history: [{ id: '2026-08-07-edelfettwerk', date: '2026-08-07', datePrecision: 'DAY', event: 'We Outside', city: 'Hamburg', country: 'Germany', performanceRole: 'DJ', relationshipType: 'EVENT_PERFORMANCE', ownerVerified: true }], name: 'Edelfettwerk', coords: [9.9056241, 53.5955002], events: ['We Outside'] },
      {
        name: 'Thomas Read',
        coords: [9.9566397, 53.5500714],
        events: ['We Outside'],
        history: [{ id: 'we-outside-thomas-read', event: 'We Outside', datePrecision: 'UNRESOLVED', city: 'Hamburg', country: 'Germany', performanceRole: 'DJ', relationshipType: 'EVENT_PERFORMANCE', ownerVerified: true }],
      },
      {
        name: 'Berliner Bahnhof',
        coords: [10.0063896, 53.5471794],
        events: ['We Outside'],
        history: [{ id: 'we-outside-berliner-bahnhof', event: 'We Outside', datePrecision: 'UNRESOLVED', city: 'Hamburg', country: 'Germany', performanceRole: 'DJ', relationshipType: 'EVENT_PERFORMANCE', ownerVerified: true }],
      },
      { history: [{ id: '2026-03-27-café-schöne-aussichten', date: '2026-03-27', datePrecision: 'DAY', event: 'We Outside', city: 'Hamburg', country: 'Germany', performanceRole: 'DJ', relationshipType: 'EVENT_PERFORMANCE', ownerVerified: true }], name: 'Café Schöne Aussichten', coords: [9.9857544, 53.558469], events: ['We Outside'] },
      {
        name: '45 Herz Gelände',
        coords: [9.9710102, 53.5634063],
        events: ['We Outside'],
        history: [{ id: 'we-outside-45-herz', event: 'We Outside', datePrecision: 'UNRESOLVED', city: 'Hamburg', country: 'Germany', performanceRole: 'DJ', relationshipType: 'EVENT_PERFORMANCE', ownerVerified: true }],
      },
      {
        name: 'Kairo Beach',
        coords: [9.938, 53.546],
        approx: true,
        events: ["L'Atelier Studios"],
        history: [{ id: 'latelier-studios-kairo-beach', event: "L'Atelier Studios", datePrecision: 'UNRESOLVED', city: 'Hamburg', country: 'Germany', performanceRole: 'DJ', relationshipType: 'EVENT_PERFORMANCE', ownerVerified: true }],
      },
      {
        name: 'Golden Pudel',
        coords: [9.9577662, 53.5461935],
        events: ['Afro Slot'],
        history: [{ id: 'afro-slot-golden-pudel', event: 'Afro Slot', datePrecision: 'UNRESOLVED', city: 'Hamburg', country: 'Germany', performanceRole: 'DJ', relationshipType: 'EVENT_PERFORMANCE', ownerVerified: true }],
      },
      {
        name: 'Westfield Hamburg',
        coords: [9.9991553, 53.5397349],
        events: ['Foot Locker'],
        count: 4,
        // Owner-confirmed total x4; individual dates unresolved — never invented.
        history: [{ id: 'foot-locker-westfield-relationship', event: 'Foot Locker', datePrecision: 'UNRESOLVED', city: 'Hamburg', country: 'Germany', performanceRole: 'DJ', relationshipType: 'EVENT_PERFORMANCE', ownerVerified: true }],
      },
    ],
  },
  {
    city: 'Berlin',
    coords: [13.414, 52.507],
    zoom: 42,
    venues: [
      {
        name: 'BRICKS Berlin',
        coords: [13.3883, 52.5122],
        events: ['KDK'],
        // Stop 2 of 2 of one KDK Berlin event-day (evening close). Shares
        // eventDayId with the Skate Yard daytime stop: 1 day, 2 appearances.
        history: [{ id: 'kdk-berlin-day-bricks-evening', event: 'KDK', eventDayId: 'kdk-berlin-day-2025', stopLabel: 'Evening closing set', year: '2025', weekday: 'Saturday', datePrecision: 'YEAR_WEEKDAY', city: 'Berlin', country: 'Germany', performanceRole: 'DJ', relationshipType: 'EVENT_PERFORMANCE', ownerVerified: true }],
      },
      {
        name: 'Skate Yard',
        coords: [13.453496, 52.507928],
        address: 'Revaler Str. 99, 10245 Berlin',
        events: ['KDK'],
        // Stop 1 of 2 of one KDK Berlin event-day (daytime). See above.
        history: [{ id: 'kdk-berlin-day-skate-yard-daytime', event: 'KDK', eventDayId: 'kdk-berlin-day-2025', stopLabel: 'Daytime set', year: '2025', weekday: 'Saturday', datePrecision: 'YEAR_WEEKDAY', city: 'Berlin', country: 'Germany', performanceRole: 'DJ', relationshipType: 'EVENT_PERFORMANCE', ownerVerified: true }],
      },
      {
        name: 'Corner TT - Blücherstraße',
        coords: [13.392376, 52.496517],
        address: 'Blücherstraße / Blücherplatz, 10961 Berlin',
        events: ['KDK – On My Mind Street Fest'],
        // Separate KDK-associated event-day; NOT merged into the Berlin Day above.
        history: [{ id: 'kdk-on-my-mind-street-fest-corner-tt', event: 'KDK – On My Mind Street Fest', weekday: 'Saturday', datePrecision: 'WEEKDAY_ONLY', city: 'Berlin', country: 'Germany', performanceRole: 'DJ', relationshipType: 'EVENT_PERFORMANCE', ownerVerified: true }],
      },
    ],
  },
];


// Present the recorded count under its event/brand name where unambiguous.
// Do not add venue-qualified booking claims or reinterpret counts as return visits.
export const repeatBookings = STOPS.flatMap(stop => stop.venues)
  .filter(venue => !venue.own && typeof venue.count === 'number' && venue.count > 1)
  .map(venue => ({
    name: venue.events?.length === 1 ? venue.events[0] : venue.name,
    count: venue.count!,
  }));
