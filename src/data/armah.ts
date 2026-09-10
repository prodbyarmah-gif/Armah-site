import { imageAssets } from './media';
// ARMAH Website Data Configuration
// This file must contain ONLY data/config helpers (no React components).

export const siteConfig = {
  email: 'prodbyarmah@gmail.com',
  instagram: 'https://www.instagram.com/prodbyarmah/',
  artistName: 'ARMAH',
  tagline: 'Afrobeats & Amapiano DJ & Producer. Hamburg-based.',
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
    logo: imageAssets["venue-amahh"],
    url: 'https://www.instagram.com/amapianohamburg/',
  },
  {
    name: 'Roots Entertainment',
    logo: imageAssets["venue-roots"],
    url: 'https://www.instagram.com/roots.entertainment/',
  },
  {
    name: 'We Outside',
    logo: imageAssets["venue-we-outside"],
    url: 'https://www.instagram.com/p/DMNCUSps_HX/',
  },
  {
    name: 'Golden Cut',
    logo: imageAssets["venue-golden-cut"],
    url: 'https://www.instagram.com/p/DLVG2yqN0M_/',
  },
  {
    name: 'Enchanted',
    logo: imageAssets["venue-enchanted"],
    url: 'https://www.instagram.com/reel/DKG7FHmCg-9/',
  },
  {
    name: 'Afro Slot',
    logo: imageAssets["venue-afroslot"],
    url: 'https://www.instagram.com/reel/DI1dj7YsIKO/',
  },
  {
    name: 'YOTO',
    logo: imageAssets["venue-yoto"],
    url: 'https://www.instagram.com/reel/DPQoM9ijZEV/',
  },
  {
    name: "L'Atelier Studios",
    logo: imageAssets["venue-l-atilier"],
    url: 'https://www.instagram.com/reel/DMqgXDdMFe3/',
  },
  {
    name: 'Queens & Clouds',
    logo: imageAssets["venue-queens-and-clouds"],
    url: 'https://www.instagram.com/p/DPG1ox_CHj7/',
  },
  {
    name: 'BRICKS Berlin',
    logo: imageAssets["venue-bricks"],
    url: 'https://www.instagram.com/reel/DJr3PfwsX8f/',
  },
  {
    name: 'Foot Locker',
    logo: imageAssets["venue-footlocker"],
    url: 'https://www.instagram.com/p/DQHgyKVCkab/',
  },
  {
    name: "Monteezy's World",
    logo: imageAssets["venue-p-montana"],
    url: 'https://www.instagram.com/reel/DOWbwTkjPzo/',
  },
];

// Highlights carousel (single source of truth for carousel logos)
export const highlights = trustedEvents;

