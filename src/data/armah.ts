// ARMAH Website Data Configuration
// Update these values to customize the website

export const siteConfig = {
  email: "prodbyarmah@gmail.com",
  instagram: "https://www.instagram.com/prodbyarmah/",
  artistName: "ARMAH",
  tagline: "Afro & Amapiano driven DJ — Hamburg based, expanding internationally.",
  impressum: {
    name: "Thierry Armah Thompson",
    brand: "ARMAH",
    address: "Schmachthäger Straße 51",
    city: "22309 Hamburg",
    country: "Deutschland",
    email: "prodbyarmah@gmail.com",
    vatId: "DE455968381",
  },
};

// Live clips data - Update video URLs when available
export const liveClips = [
  {
    id: "01",
    title: "Live Clip 01",
    videoUrl: "", // Add Cloudflare URL here
    thumbnail: "/assets/amahh.png",
  },
  {
    id: "02",
    title: "Live Clip 02",
    videoUrl: "", // Add Cloudflare URL here
    thumbnail: "/assets/roots.png",
  },
  {
    id: "03",
    title: "Live Clip 03",
    videoUrl: "", // Add Cloudflare URL here
    thumbnail: "/assets/we outside.png",
  },
  {
    id: "04",
    title: "Live Clip 04",
    videoUrl: "", // Add Cloudflare URL here
    thumbnail: "/assets/golden cut.png",
  },
];

// Trusted venues/events with Instagram links
export const trustedEvents = [
  { name: "Amapiano Hamburg", logo: "/assets/amahh.png", url: "https://www.instagram.com/amapianohamburg/" },
  { name: "Roots Entertainment", logo: "/assets/roots.png", url: "https://www.instagram.com/roots.entertainment/" },
  { name: "We Outside", logo: "/assets/we outside.png", url: "https://www.instagram.com/weoutside/" },
  { name: "Golden Cut", logo: "/assets/golden cut.png", url: "https://www.instagram.com/goldencut/" },
  { name: "YOTO", logo: "/assets/yoto 2.png", url: "https://www.instagram.com/yoto/" },
  { name: "Queens & Clouds", logo: "/assets/queens and clouds.png", url: "https://www.instagram.com/queensandclouds/" },
  { name: "BRICKS Berlin", logo: "/assets/Bricks.png", url: "https://www.instagram.com/bricks.berlin/" },
  { name: "Foot Locker", logo: "/assets/footlocker.png", url: "https://www.instagram.com/footlocker/" },
];

// Selected shows list
export const selectedShows = [
  "We Outside",
  "Golden Cut",
  "YOTO",
  "L'Atelier Studios",
  "Queens & Clouds",
  "BRICKS Berlin",
  "Afro Slot",
  "Foot Locker",
  "Enchanted",
  "Monteezy's World",
];

// Spotify tracks for Producer section
export const producerTracks = [
  {
    id: "1",
    title: "Track 01",
    url: "https://open.spotify.com/intl-de/track/4OHgaDZPsAemSCikAgFKqr",
  },
  {
    id: "2",
    title: "Track 02",
    url: "https://open.spotify.com/intl-de/track/38ZFS6DGwTP6BL0mEVUEdI",
  },
  {
    id: "3",
    title: "Track 03",
    url: "https://open.spotify.com/intl-de/track/3Mf5jsUc30w9PAfrM5LWvK",
  },
];

// Instagram posts to embed
export const instagramPosts = [
  "https://www.instagram.com/p/POST_ID_1/",
  "https://www.instagram.com/p/POST_ID_2/",
  "https://www.instagram.com/p/POST_ID_3/",
  "https://www.instagram.com/p/POST_ID_4/",
  "https://www.instagram.com/p/POST_ID_5/",
  "https://www.instagram.com/p/POST_ID_6/",
];

// Helper function to convert Spotify URL to embed URL
export function toSpotifyEmbed(url: string): string {
  const match = url.match(/track\/(\w+)/);
  if (match) {
    return `https://open.spotify.com/embed/track/${match[1]}`;
  }
  return url;
}
