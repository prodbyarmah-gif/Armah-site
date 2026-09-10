import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, writeFileSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const assets = [
  ['hero', 'public/assets/hero-bg.jpg', 'press', [640, 1280]],
  ['portrait', 'public/assets/bio-main.jpg', 'press', [600, 1200]],
  ...['01', '02', '03', '04'].map(id => [`live${id}`, `public/assets/live${id}.jpg`, 'live', [240, 840]]),
  ...readdirSync(resolve(root, 'public/assets/logos')).filter(name => name.endsWith('.png')).map(name => [
    `venue-${name.slice(0, -4).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, `public/assets/logos/${name}`, 'venues', [440, 660]],
  ),
];
const manifest = {};
for (const [id, original, category, widths] of assets) {
  const variants = [];
  for (const width of widths) {
    const relative = `public/assets/media/${category}/${id}-${width}.webp`;
    const target = resolve(root, relative);
    mkdirSync(dirname(target), { recursive: true });
    const bound = category === 'venues' ? `${width}x${Math.round(width * 80 / 220)}>` : `${width}x>`;
    execFileSync('magick', [resolve(root, original), '-auto-orient', '-resize', bound, '-strip', '-quality', category === 'venues' ? '92' : '85', target]);
    const [w, h] = execFileSync('magick', ['identify', '-format', '%w %h', target], { encoding: 'utf8' }).split(' ').map(Number);
    variants.push({ src: relative.replace(/^public/, ''), width: w, height: h, bytes: statSync(target).size });
  }
  manifest[id] = { ...variants[variants.length - 1], original, originalBytes: statSync(resolve(root, original)).size, variants };
}
writeFileSync(resolve(root, 'src/data/imageVariants.json'), JSON.stringify(manifest, null, 2) + '\n');
const before = Object.values(manifest).reduce((sum, asset) => sum + asset.originalBytes, 0);
const after = Object.values(manifest).reduce((sum, asset) => sum + asset.bytes, 0);
console.log(JSON.stringify({ originalBytes: before, largestDerivativeBytes: after, assets: Object.keys(manifest).length }));
