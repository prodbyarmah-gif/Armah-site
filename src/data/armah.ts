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

