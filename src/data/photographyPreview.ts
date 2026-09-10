import type { ImageAsset } from './media';

type PreviewPhoto = ImageAsset & {
  id: 'PH-01' | 'PH-03' | 'PH-05' | 'PH-06' | 'PH-07' | 'PH-08' | 'PH-09' | 'PH-10';
  sourceFile: string;
};

const portrait = (
  id: PreviewPhoto['id'],
  sourceFile: string,
  small: { src: string; width: number; height: number },
  large: { src: string; width: number; height: number },
): PreviewPhoto => ({ id, sourceFile, src: large.src, width: large.width, height: large.height, variants: [small, large] });

/**
 * Local review placements for owner-supplied photography.
 * Deliberately separate from production imageAssets so the preview can be
 * adjusted or removed without changing the established production system.
 */
export const photographyPreview = {
  ph01: portrait('PH-01', 'assets/source/official/PH-01-press-primary.jpg',
    { src: '/assets/media/official/ph-01-720.webp', width: 720, height: 960 },
    { src: '/assets/media/official/ph-01-1440.webp', width: 1440, height: 1920 }),
  ph03: portrait('PH-03', 'assets/source/official/PH-03-press-secondary-sunglasses.jpg',
    { src: '/assets/media/official/ph-03-600.webp', width: 600, height: 800 },
    { src: '/assets/media/official/ph-03-1200.webp', width: 1200, height: 1600 }),
  ph05: portrait('PH-05', 'assets/source/official/PH-05-dj-bts.heic',
    { src: '/assets/media/official/ph-05-480.webp', width: 480, height: 640 },
    { src: '/assets/media/official/ph-05-960.webp', width: 960, height: 1280 }),
  ph06: portrait('PH-06', 'assets/source/official/PH-06-producer-primary.jpg',
    { src: '/assets/media/official/ph-06-720.webp', width: 720, height: 1086 },
    { src: '/assets/media/official/ph-06-1440.webp', width: 1440, height: 2172 }),
  ph07: portrait('PH-07', 'assets/source/official/PH-07-producer-secondary.jpg',
    { src: '/assets/media/official/ph-07-720.webp', width: 720, height: 1086 },
    { src: '/assets/media/official/ph-07-1440.webp', width: 1440, height: 2172 }),
  ph08: portrait('PH-08', 'assets/source/official/PH-08-editorial-window.jpg',
    { src: '/assets/media/official/ph-08-720.webp', width: 720, height: 1086 },
    { src: '/assets/media/official/ph-08-1440.webp', width: 1440, height: 2172 }),
  ph09: portrait('PH-09', 'assets/source/official/PH-09-editorial-sunlight.jpg',
    { src: '/assets/media/official/ph-09-720.webp', width: 720, height: 1086 },
    { src: '/assets/media/official/ph-09-1440.webp', width: 1440, height: 2172 }),
  ph10: portrait('PH-10', 'assets/source/official/PH-10-social-elevator.jpg',
    { src: '/assets/media/official/ph-10-480.webp', width: 480, height: 853 },
    { src: '/assets/media/official/ph-10-960.webp', width: 960, height: 1707 }),
} as const;
