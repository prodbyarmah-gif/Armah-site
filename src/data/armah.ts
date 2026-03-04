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
    videoUrl: "https://pub-17d9dfc949e942378e7463ab8ecb35d3.r2.dev/live01_web.mp4",
    thumbnail: "/assets/amahh.png",
  },
  {
    id: "02",
    title: "Live Clip 02",
    videoUrl: "https://pub-17d9dfc949e942378e7463ab8ecb35d3.r2.dev/live02_web.mp4",
    thumbnail: "/assets/roots.png",
  },
  {
    id: "03",
    title: "Live Clip 03",
    videoUrl: "https://pub-17d9dfc949e942378e7463ab8ecb35d3.r2.dev/live03_signature_smaller.mp4",
    thumbnail: "/assets/we outside.png",
  },
  {
    id: "04",
    title: "Live Clip 04",
    videoUrl: "https://pub-17d9dfc949e942378e7463ab8ecb35d3.r2.dev/live04_web.mp4",
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

// Selected shows list with Instagram links
export const selectedShows = [
  { label: "We Outside", url: "https://www.instagram.com/p/DMNCUSps_HX/?igsh=MmZvM3JwYjJ2Y2Zi" },
  { label: "Golden Cut", url: "https://www.instagram.com/p/DLVG2yqN0M_/?img_index=1&igsh=MTU2Z2kwazJ0OGdtaQ==" },
  { label: "Enchanted", url: "https://www.instagram.com/reel/DKG7FHmCg-9/?igsh=MTVyM2pjY29lYnl5Zg==" },
  { label: "Afro Slot", url: "https://www.instagram.com/reel/DI1dj7YsIKO/?igsh=MWVhY2poazZoN2Vrdg==" },
  { label: "YOTO", url: "https://www.instagram.com/reel/DPQoM9ijZEV/?igsh=dm90MmVoYXNzOG9i" },
  { label: "BRICKS Berlin", url: "https://www.instagram.com/reel/DJr3PfwsX8f/?igsh=MWkwMzR5YjMydXA1NA==" },
  { label: "L'Atelier Studios", url: "https://www.instagram.com/reel/DMqgXDdMFe3/?igsh=MW9qbTA0M3A1czVucQ==" },
  { label: "Queens & Clouds", url: "https://www.instagram.com/p/DPG1ox_CHj7/?igsh=eDBkcnJudWpqOWRh" },
  { label: "Foot Locker", url: "https://www.instagram.com/p/DQHgyKVCkab/?img_index=2&igsh=dmNveWZ1c3Z4NGZl" },
  { label: "Monteezy's World", url: "https://www.instagram.com/reel/DOWbwTkjPzo/?igsh=MXVydGVpaHF2ZjNtdQ==" },
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
