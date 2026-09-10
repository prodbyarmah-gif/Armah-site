import variants from './imageVariants.json';
export interface ImageAsset {
  src: string; width: number; height: number;
  variants: readonly { src: string; width: number; height: number }[];
}
export const imageAssets: Record<string, ImageAsset> = variants;
export const liveClips = [
  { id: '01', videoUrl: 'https://pub-17d9dfc949e942378e7463ab8ecb35d3.r2.dev/live01_web.mp4', poster: imageAssets.live01 },
  { id: '02', videoUrl: 'https://pub-17d9dfc949e942378e7463ab8ecb35d3.r2.dev/live02_web.mp4', poster: imageAssets.live02 },
  { id: '03', videoUrl: 'https://pub-17d9dfc949e942378e7463ab8ecb35d3.r2.dev/live03_signature_smaller.mp4', poster: imageAssets.live03 },
  { id: '04', videoUrl: 'https://pub-17d9dfc949e942378e7463ab8ecb35d3.r2.dev/live04_web.mp4', poster: imageAssets.live04 },
] as const;
