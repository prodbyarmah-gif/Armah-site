export const riderResources = {
  technical: '/assets/TECHNICAL%20RIDER%20.pdf',
  hospitality: '/assets/HOSPITALITY%20RIDER.pdf',
} as const;
export const bookingResources: readonly { id: string; labelKey: string; href: string }[] = [
  { id: 'liveSet', labelKey: 'mixes.featured', href: '#featured-live-set' },
  { id: 'mixes', labelKey: 'mixes.more', href: '#mixes' },
  { id: 'technicalRider', labelKey: 'booking.technicalRider', href: riderResources.technical },
  { id: 'hospitalityRider', labelKey: 'booking.hospitalityRider', href: riderResources.hospitality },
  { id: 'booking', labelKey: 'nav.booking', href: '#booking' },
];
// Add EPK/pressPhotos records here only when real, approved files are supplied.
