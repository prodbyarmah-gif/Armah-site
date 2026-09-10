import { STOPS, type Venue } from '../data/performances';

export type HomepageRelationship = {
  id: 'golden-cut' | 'foot-locker' | 'we-outside' | 'yoto';
  name: string;
  relationship: 'venue' | 'brand';
  count: number;
};

const venues = STOPS.flatMap((stop) => stop.venues);

function venueForEvent(event: string): Venue | undefined {
  return venues.find((venue) => venue.events?.length === 1 && venue.events[0] === event);
}

function hasDirectRelationship(venue: Venue, event: string): boolean {
  return Boolean(venue.history?.some((record) => record.event === event));
}

function occurrenceCount(records: readonly { id: string; eventDayId?: string }[]): number {
  return new Set(records.map((record) => record.eventDayId ?? record.id)).size;
}

function historiesForEvent(event: string) {
  return venues.flatMap((venue) => venue.history?.filter((record) => record.event === event) ?? []);
}

/**
 * Homepage-only presentation, derived from the locked Career Map history.
 * No records, coordinates, or owner-confirmed counts are duplicated here.
 */
const relationshipCandidates: Array<HomepageRelationship | null> = [
  (() => {
    const venue = venueForEvent('Golden Cut');
    if (!venue || typeof venue.count !== 'number') return null;
    return { id: 'golden-cut', name: 'Golden Cut', relationship: 'venue', count: venue.count } as const;
  })(),
  (() => {
    const venue = venueForEvent('Foot Locker');
    if (!venue || typeof venue.count !== 'number') return null;
    return { id: 'foot-locker', name: 'Foot Locker', relationship: 'brand', count: venue.count } as const;
  })(),
  venues.some((venue) => hasDirectRelationship(venue, 'We Outside'))
    ? { id: 'we-outside', name: 'WE OUTSIDE', relationship: 'brand', count: occurrenceCount(historiesForEvent('We Outside')) } as const
    : null,
  (() => {
    const venue = venues.find((candidate) => candidate.name === 'YOTO');
    if (!venue || !hasDirectRelationship(venue, 'YOTO')) return null;
    // This counts bookings at the YOTO venue, not only the separate YOTO-named event.
    return { id: 'yoto', name: 'YOTO', relationship: 'venue', count: occurrenceCount(venue.history ?? []) } as const;
  })(),
];

export const homepageRelationships: readonly HomepageRelationship[] = relationshipCandidates.filter(
  (relationship): relationship is HomepageRelationship => relationship !== null,
);
