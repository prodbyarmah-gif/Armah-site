// ARMAH Website Data Configuration
// This file must contain ONLY data/config helpers (no React components).

export const siteConfig = {
  email: 'prodbyarmah@gmail.com',
  instagram: 'https://www.instagram.com/prodbyarmah/',
  artistName: 'ARMAH',
  tagline: 'Afro & Amapiano driven DJ — Hamburg based, expanding internationally.',
  impressum: {
    name: 'Thierry Armah Thompson',
    brand: 'ARMAH',
    address: 'Schmachthäger Straße 51',
    city: '22309 Hamburg',
    country: 'Deutschland',
    email: 'prodbyarmah@gmail.com',
    vatId: 'DE455968381',
  },
};

// Trusted venues/events (logos are served from /public/assets/logos)
export const trustedEvents = [
  {
    name: 'Amapiano Hamburg',
    logo: '/assets/logos/Amahh.png',
    url: 'https://www.instagram.com/amapianohamburg/',
  },
  {
    name: 'Roots Entertainment',
    logo: '/assets/logos/roots.png',
    url: 'https://www.instagram.com/roots.entertainment/',
  },
  {
    name: 'We Outside',
    logo: '/assets/logos/we outside.png',
    url: 'https://www.instagram.com/p/DMNCUSps_HX/',
  },
  {
    name: 'Golden Cut',
    logo: '/assets/logos/golden cut.png',
    url: 'https://www.instagram.com/p/DLVG2yqN0M_/',
  },
  {
    name: 'Enchanted',
    logo: '/assets/logos/enchanted.png',
    url: 'https://www.instagram.com/reel/DKG7FHmCg-9/',
  },
  {
    name: 'Afro Slot',
    logo: '/assets/logos/Afroslot.png',
    url: 'https://www.instagram.com/reel/DI1dj7YsIKO/',
  },
  {
    name: 'YOTO',
    logo: '/assets/logos/yoto.png',
    url: 'https://www.instagram.com/reel/DPQoM9ijZEV/',
  },
  {
    name: "L'Atelier Studios",
    logo: "/assets/logos/L'atilier.png",
    url: 'https://www.instagram.com/reel/DMqgXDdMFe3/',
  },
  {
    name: 'Queens & Clouds',
    logo: '/assets/logos/queens and clouds.png',
    url: 'https://www.instagram.com/p/DPG1ox_CHj7/',
  },
  {
    name: 'BRICKS Berlin',
    logo: '/assets/logos/Bricks.png',
    url: 'https://www.instagram.com/reel/DJr3PfwsX8f/',
  },
  {
    name: 'Foot Locker',
    logo: '/assets/logos/footlocker.png',
    url: 'https://www.instagram.com/p/DQHgyKVCkab/',
  },
  {
    name: "Monteezy's World",
    logo: '/assets/logos/p montana.png',
    url: 'https://www.instagram.com/reel/DOWbwTkjPzo/',
  },
];

// Highlights carousel (single source of truth for carousel logos)
export const highlights = trustedEvents;

// Selected shows list (buttons/links)
export const selectedShows = [
  { label: 'We Outside', url: 'https://www.instagram.com/p/DMNCUSps_HX/?igsh=MmZvM3JwYjJ2Y2Zi' },
  { label: 'Golden Cut', url: 'https://www.instagram.com/p/DLVG2yqN0M_/?img_index=1&igsh=MTU2Z2kwazJ0OGdtaQ==' },
  { label: 'Enchanted', url: 'https://www.instagram.com/reel/DKG7FHmCg-9/?igsh=MTVyM2pjY29lYnl5Zg==' },
  { label: 'Afro Slot', url: 'https://www.instagram.com/reel/DI1dj7YsIKO/?igsh=MWVhY2poazZoN2Vrdg==' },
  { label: 'YOTO', url: 'https://www.instagram.com/reel/DPQoM9ijZEV/?igsh=dm90MmVoYXNzOG9i' },
  { label: 'KDK / BRICKS', url: 'https://www.instagram.com/reel/DJr3PfwsX8f/?igsh=MWkwMzR5YjMydXA1NA==' },
  { label: "L'Atelier Studios", url: 'https://www.instagram.com/reel/DMqgXDdMFe3/?igsh=MW9qbTA0M3A1czVucQ==' },
  { label: 'Queens & Clouds', url: 'https://www.instagram.com/p/DPG1ox_CHj7/?igsh=eDBkcnJudWpqOWRh' },
  { label: 'Foot Locker', url: 'https://www.instagram.com/p/DQHgyKVCkab/?img_index=2&igsh=dmNveWZ1c3Z4NGZl' },
  { label: "Monteezy's World", url: 'https://www.instagram.com/reel/DOWbwTkjPzo/?igsh=MXVydGVpaHF2ZjNtdQ==' },
];

// Spotify tracks for Producer section
export const producerTracks = [
  {
    id: '1',
    title: 'Track 01',
    url: 'https://open.spotify.com/intl-de/track/4OHgaDZPsAemSCikAgFKqr?si=ed4505e96e144fae',
  },
  {
    id: '2',
    title: 'Track 02',
    url: 'https://open.spotify.com/intl-de/track/38ZFS6DGwTP6BL0mEVUEdI?si=88feede361974aee',
  },
  {
    id: '3',
    title: 'Track 03',
    url: 'https://open.spotify.com/intl-de/track/3Mf5jsUc30w9PAfrM5LWvK?si=c5b2f6818b364c7d',
  },
];

// Instagram posts (simple links / embeds)
export const instagramPosts = [
  'https://www.instagram.com/p/DMqgXDdMFe3/',
  'https://www.instagram.com/p/DOfyZhCASvI/',
  'https://www.instagram.com/prodbyarmah/p/DCKe4ZxOPdw/',
  'https://www.instagram.com/p/C_thLUhO9qK/?img_index=1',
];

// Helper function to convert Spotify URL to embed URL
export function toSpotifyEmbed(url: string): string {
  const match = url.match(/track\/(\w+)/);
  if (match) return `https://open.spotify.com/embed/track/${match[1]}`;
  return url;
}
