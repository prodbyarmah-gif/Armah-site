import { useEffect, useRef } from 'react';
import { Play, ExternalLink } from 'lucide-react';
import { useI18n } from '../i18n';
import { embedUrl, watchUrl, type Mix } from '../data/mixes';

export default function YouTubePreview({ mix, active, onActivate, compact = false, featuredSurface = false, showPlatformLink = true }: {
  mix: Mix; compact?: boolean; featuredSurface?: boolean; showPlatformLink?: boolean; active: boolean; onActivate: () => void;
}) {
  const { t } = useI18n();
  const playerRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => { if (active) playerRef.current?.focus(); }, [active]);
  return (
    <div>
      <div className="relative aspect-video overflow-hidden bg-[#111]">
        {active ? (
          <iframe ref={playerRef} src={embedUrl(mix)} title={mix.title}
            className="absolute inset-0 h-full w-full" allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
        ) : (
          <button type="button" onClick={onActivate} aria-label={`${t('mixes.play')}: ${mix.title}`}
            className="group relative block h-full w-full text-white">
            <img src={mix.thumbnail} srcSet={`${mix.thumbnailSmall} 640w, ${mix.thumbnail} 1280w`}
              sizes={mix.featured ? '(min-width: 1280px) 1120px, 100vw' : '(min-width: 768px) 33vw, 112px'}
              width={1280} height={720} alt="" loading="lazy" decoding="async"
              className={`h-full w-full object-cover transition duration-500 group-hover:scale-[1.015] ${featuredSurface ? 'group-hover:brightness-75' : 'group-hover:opacity-75'}`} />
            {featuredSurface ? (
              <>
                <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04)_24%,rgba(0,0,0,0.18)_46%,rgba(0,0,0,0.88)_100%)]" />
                <span className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-5 md:p-7">
                  <span className="text-left text-[11px] font-semibold uppercase tracking-[0.24em] text-white/75">{t('mixes.featured')}</span>
                  <span className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-sm border border-white/50 bg-black/65 px-4 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors group-hover:border-white group-hover:bg-black/80">
                    <Play aria-hidden="true" className="h-3.5 w-3.5" fill="currentColor" /> {t('mixes.play')}
                  </span>
                </span>
              </>
            ) : (
              <span className="absolute inset-0 flex items-center justify-center bg-black/10">
                <span className={`grid place-items-center rounded-full border border-white/60 bg-black/65 shadow-lg ${compact ? 'h-10 w-10 md:h-14 md:w-14' : 'h-14 w-14 md:h-16 md:w-16'}`}>
                  <Play aria-hidden="true" className="ml-1 h-6 w-6" fill="currentColor" />
                </span>
              </span>
            )}
          </button>
        )}
      </div>
      {!compact && showPlatformLink && <a href={watchUrl(mix)} target="_blank" rel="noopener noreferrer"
        className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm text-white/70 hover:text-white">
        {t('mixes.watch')}<ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
        <span className="sr-only">: {mix.title}</span>
      </a>}
    </div>
  );
}
