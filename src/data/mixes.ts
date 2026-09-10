// Exact public titles verified through YouTube oEmbed on 2026-09-08.
// Featured priority is editorial, independent of metrics. Do not add unverified metadata.
export interface Mix {
  id: string;
  videoId: string;
  title: string;
  platform: 'YouTube';
  featured: boolean;
  type: 'live-set' | 'mix';
  thumbnail: string;
  thumbnailSmall: string;
}
export const mixes: readonly Mix[] = [
  {
    "id": "ukQDVRV-4Rs",
    "videoId": "ukQDVRV-4Rs",
    "title": "ARMAH @ WE OUTSIDE HAMBURG | Amapiano x Afrobeats Live DJ Set",
    "platform": "YouTube",
    "featured": true,
    "type": "live-set",
    "thumbnail": "/assets/media/mixes/ukQDVRV-4Rs-1280.webp",
    "thumbnailSmall": "/assets/media/mixes/ukQDVRV-4Rs-640.webp"
  },
  {
    "id": "tJgmfQGqq-4",
    "videoId": "tJgmfQGqq-4",
    "title": "ARMAH MIX SERIES VOL. 02 – THE SUMMER JOURNEY",
    "platform": "YouTube",
    "featured": false,
    "type": "mix",
    "thumbnail": "/assets/media/mixes/tJgmfQGqq-4-1280.webp",
    "thumbnailSmall": "/assets/media/mixes/tJgmfQGqq-4-640.webp"
  },
  {
    "id": "Edy-hiLpmz4",
    "videoId": "Edy-hiLpmz4",
    "title": "Afronation Prep mix  | Beat of Amapiano",
    "platform": "YouTube",
    "featured": false,
    "type": "mix",
    "thumbnail": "/assets/media/mixes/Edy-hiLpmz4-1280.webp",
    "thumbnailSmall": "/assets/media/mixes/Edy-hiLpmz4-640.webp"
  },
  {
    "id": "Wa7tW_tpVr8",
    "videoId": "Wa7tW_tpVr8",
    "title": "Armahs Opener Mix  | Best Afrobeats, Amapiano, Dancehall, Francophono Mix",
    "platform": "YouTube",
    "featured": false,
    "type": "mix",
    "thumbnail": "/assets/media/mixes/Wa7tW_tpVr8-1280.webp",
    "thumbnailSmall": "/assets/media/mixes/Wa7tW_tpVr8-640.webp"
  }
];
export const featuredMix = mixes.find(mix => mix.featured)!;
export const additionalMixes = mixes.filter(mix => !mix.featured);
export const watchUrl = (mix: Mix) => `https://www.youtube.com/watch?v=${mix.videoId}`;
export const embedUrl = (mix: Mix) => `https://www.youtube-nocookie.com/embed/${mix.videoId}?autoplay=1&rel=0`;
