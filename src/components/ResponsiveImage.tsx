import type { ImgHTMLAttributes } from 'react';
import type { ImageAsset } from '../data/media';
type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'width' | 'height'> & { image: ImageAsset; alt: string; sizes: string };
export default function ResponsiveImage({ image, alt, sizes, loading = 'lazy', fetchPriority, ...props }: Props) {
  // React 18 does not recognize the camelCase fetchPriority DOM prop (console
  // warning). Forward it as lowercase `fetchpriority`, which React passes
  // through to the <img> untouched — loading-priority behavior is preserved.
  return <img {...props} {...(fetchPriority ? { fetchpriority: fetchPriority } : {})} src={image.src} srcSet={image.variants.map(v => `${v.src} ${v.width}w`).join(', ')}
    width={image.width} height={image.height} alt={alt} sizes={sizes} loading={loading} decoding="async" />;
}
