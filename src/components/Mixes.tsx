import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useI18n } from '../i18n';
import { featuredMix, additionalMixes, watchUrl } from '../data/mixes';
import YouTubePreview from './YouTubePreview';

export default function Mixes() {
  const { t } = useI18n();
  const [activeId, setActiveId] = useState<string | null>(null);
  return (
    <section id="mixes" aria-labelledby="featured-live-set" className="bg-[#090909] px-6 py-16 md:py-24 lg:px-12">
      <span id="youtube" className="block" aria-hidden="true" />
      <div className="mx-auto max-w-[1120px]">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-armah-red">{t('mixes.featured')}</p>
        <h2 id="featured-live-set" className="font-head text-4xl uppercase leading-tight text-white md:text-6xl">ARMAH @ WE OUTSIDE HAMBURG</h2>
        <p className="mb-8 mt-3 text-base text-white/75 md:text-xl">Amapiano x Afrobeats Live DJ Set</p>
        <div className="overflow-hidden rounded-sm border border-white/15 bg-black">
          <YouTubePreview mix={featuredMix} featuredSurface showPlatformLink={false} active={activeId === featuredMix.id} onActivate={() => setActiveId(featuredMix.id)} />
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-8">
          <p className="max-w-xl text-xs leading-5 text-white/65">{t('mixes.connection')}</p>
          <a href="#booking" className="inline-flex min-h-11 items-center gap-2 text-sm text-white hover:text-armah-red">{t('mixes.booking')}<ArrowUpRight aria-hidden="true" className="h-4 w-4" /></a>
        </div>
        <h3 className="mb-6 mt-10 font-head text-2xl uppercase text-white">{t('mixes.more')}</h3>
        <div className="grid gap-4 md:grid-cols-3 md:gap-5">
          {additionalMixes.map(mix => (
            <article key={mix.id} className={`grid items-start gap-4 rounded-sm border border-white/10 bg-white/[0.025] p-3 transition-colors hover:border-white/25 md:block ${activeId === mix.id ? 'grid-cols-1' : 'grid-cols-[112px_minmax(0,1fr)]'}`}>
              <YouTubePreview compact mix={mix} active={activeId === mix.id} onActivate={() => setActiveId(mix.id)} />
              <div><h4 className="text-sm font-medium leading-6 text-white/90 md:mt-4 md:text-base">{mix.title}</h4><a href={watchUrl(mix)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-xs text-white/70 hover:text-white">{t('mixes.watch')} ↗<span className="sr-only">: {mix.title}</span></a></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
