import { useI18n } from "../i18n";
import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, ExternalLink, Music } from 'lucide-react';
import ResponsiveImage from './ResponsiveImage';
import { photographyPreview } from '../data/photographyPreview';
import { producerReleases } from '../data/releases';

import type WaveSurfer from 'wavesurfer.js';

type WaveInstance = ReturnType<typeof WaveSurfer.create>;




export type BeatMood = 'Afro' | 'Drill' | 'Trap';

export type Beat = {
  id: string;
  title: string;
  bpm: number;
  mood: BeatMood;
  tags: string[];
  credits: string[];
  previewUrl: string;
};

export const beatCatalog: Beat[] = [
  // AFRO
  {
    id: 'B001',
    title: '23',
    bpm: 89,
    mood: 'Afro',
    tags: ['Afro', 'Afrobeats'],
    credits: [],
    previewUrl: 'https://pub-17d9dfc949e942378e7463ab8ecb35d3.r2.dev/mp3/23%20-%2089BPM%20%40Armah.mp3',
  },
  {
    id: 'B003',
    title: 'Forever',
    bpm: 105,
    mood: 'Afro',
    tags: ['Afro', 'Dancehall', 'Afrobeats'],
    credits: [],
    previewUrl: 'https://pub-17d9dfc949e942378e7463ab8ecb35d3.r2.dev/mp3/Forever%20-%20105BPM%20%40Armah.mp3',
  },
  {
    id: 'B004',
    title: 'Kokonsa',
    bpm: 100,
    mood: 'Afro',
    tags: ['Afro', 'Afrobeats'],
    credits: [],
    previewUrl: 'https://pub-17d9dfc949e942378e7463ab8ecb35d3.r2.dev/mp3/Kokonsa%20-%20100BPM%20%40Armah.mp3',
  },
  {
    id: 'B007',
    title: 'Waiting Game',
    bpm: 104,
    mood: 'Afro',
    tags: ['Afro', 'Afrobeats', 'Afro Swing'],
    credits: [],
    previewUrl: 'https://pub-17d9dfc949e942378e7463ab8ecb35d3.r2.dev/mp3/Waiting%20Game%20-%20104%20BPM%20%40Armah.mp3',
  },
  {
    id: 'B008',
    title: 'Walking in Tokyo',
    bpm: 113,
    mood: 'Afro',
    tags: ['Afro', 'Afro Jazz'],
    credits: [],
    previewUrl: 'https://pub-17d9dfc949e942378e7463ab8ecb35d3.r2.dev/mp3/Walking%20in%20Tokyo%20-%20113BPM%20%40Armah.mp3',
  },
  {
    id: 'B009',
    title: 'Wstrn',
    bpm: 118,
    mood: 'Afro',
    tags: ['Afro', 'Afrofusion'],
    credits: [],
    previewUrl: 'https://pub-17d9dfc949e942378e7463ab8ecb35d3.r2.dev/mp3/Wstrn%20-%20118BPM%20%40Armah.mp3',
  },

  // DRILL
  {
    id: 'B002',
    title: 'Curious',
    bpm: 150,
    mood: 'Drill',
    tags: ['Drill', 'Sexy Drill'],
    credits: [],
    previewUrl: 'https://pub-17d9dfc949e942378e7463ab8ecb35d3.r2.dev/mp3/Curious%20-%20150BPM%20%40Armah.mp3',
  },
  {
    id: 'B005',
    title: 'Siren',
    bpm: 140,
    mood: 'Drill',
    tags: ['Drill', 'UK Drill (Soft)'],
    credits: [],
    previewUrl: 'https://pub-17d9dfc949e942378e7463ab8ecb35d3.r2.dev/mp3/Siren%20-%20140BPM%20%40Armah.mp3',
  },

  // TRAP
  {
    id: 'B006',
    title: 'Timba',
    bpm: 114,
    mood: 'Trap',
    tags: ['Trap'],
    credits: [],
    previewUrl: 'https://pub-17d9dfc949e942378e7463ab8ecb35d3.r2.dev/mp3/Timba%20-%20114BPM%20%40Armah.mp3',
  },
];

/** One source of truth for the existing catalog's intentional mood groupings. */
export const beatCatalogByMood: Record<BeatMood, readonly Beat[]> = {
  Afro: beatCatalog.filter((beat) => beat.mood === 'Afro'),
  Drill: beatCatalog.filter((beat) => beat.mood === 'Drill'),
  Trap: beatCatalog.filter((beat) => beat.mood === 'Trap'),
};

export type BeatOption = {
  id: Beat['id'];
  title: Beat['title'];
  bpm: Beat['bpm'];
  mood: Beat['mood'];
};

export const beatOptions: BeatOption[] = beatCatalog.map((b: Beat) => ({
  id: b.id,
  title: b.title,
  bpm: b.bpm,
  mood: b.mood,
}));

export const beatOptionsById: Record<string, BeatOption> = Object.fromEntries(
  beatOptions.map((b) => [b.id, b])
);

// Global registry to enforce single-preview playback
const waveRegistry = new Map<string, WaveInstance>();
let currentlyPlayingId: string | null = null;

function WaveformPreview({
  id,
  url,
  accentClass,
  i18n,
}: {
  id: string;
  url: string;
  accentClass?: string;
  i18n: {
    play: string;
    pause: string;
    previewUnavailable: string;
    previewSeekHint: string;
    loading: string;
  };
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const waveRef = useRef<WaveInstance | null>(null);
  const readyRef = useRef(false);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [activation, setActivation] = useState(0);
  const pendingPlayRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current || activation === 0) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;
    async function initialize() {
      const { default: WaveSurfer } = await import('wavesurfer.js');
      if (disposed || !containerRef.current) return;
    // Build a few URL variants (handles en-dash/em-dash vs hyphen, and already-encoded paths)
    const encodeAssetPath = (raw: string) => {
      // If it is already a full URL, don't rewrite it (it may already be encoded).
      if (/^https?:\/\//i.test(raw)) return raw;

      const [pathOnly] = raw.split(/(?=[?#])/);

      let decodedPath = pathOnly;
      try {
        decodedPath = decodeURIComponent(pathOnly);
      } catch {
        // ignore
      }

      if (!decodedPath.startsWith('/')) decodedPath = `/${decodedPath}`;

      const parts = decodedPath.split('/').map((seg, idx) => {
        if (idx === 0) return seg;
        if (!seg) return seg;
        return encodeURIComponent(seg);
      });

      return parts.join('/');
    };

    const makeUrlVariants = (raw: string) => {
      if (/^https?:\/\//i.test(raw)) return [raw];
      // Work on decoded text so we can normalize typography reliably
      let decoded = raw;
      try {
        decoded = decodeURIComponent(raw);
      } catch {
        // ignore
      }

      // Normalize common dash variants and odd spaces
      const normalizeDashes = (s: string) =>
        s
          .replace(/[–—]/g, '-')
          .replace(/\s+-\s+/g, ' - ')
          .replace(/\s{2,}/g, ' ');

      const v1 = decoded;
      const v2 = normalizeDashes(decoded);

      // De-duplicate while preserving order
      const uniq: string[] = [];
      for (const v of [v1, v2]) {
        const encoded = encodeAssetPath(v);
        if (!uniq.includes(encoded)) uniq.push(encoded);
      }
      return uniq;
    };

    const urlCandidates = makeUrlVariants(url);

    // Use MediaElement for maximum MP3 stability in browsers (WebAudio decoding can fail silently)
    const audioEl = document.createElement('audio');
    audioEl.preload = 'none';
    audioEl.crossOrigin = 'anonymous';
    // Never show native audio UI (the white control bar)
    audioEl.controls = false;
    audioEl.style.display = 'none';

    const wave = WaveSurfer.create({
      container: containerRef.current,
      media: audioEl,
      mediaControls: false,
      height: 26,
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      normalize: true,
      cursorWidth: 2,
      interact: true,
      dragToSeek: true,
      waveColor: 'rgba(255,255,255,0.40)',
      progressColor: 'rgba(255,255,255,0.98)',
      cursorColor: 'rgba(255,255,255,1)',
    });

    waveRef.current = wave;
    readyRef.current = false;
    setIsReady(false);
    setIsPlaying(false);
    setHasError(false);

    // register instance for single-play behavior
    waveRegistry.set(id, wave);

    let loadTimeout: number | null = null;
    let cancelled = false;

    wave.on('ready', () => {
      readyRef.current = true;
      setIsReady(true);
      if (pendingPlayRef.current) { pendingPlayRef.current = false; void wave.play().catch(() => setIsPlaying(false)); }
      setHasError(false);
      // clear watchdog if running
      if (loadTimeout) window.clearTimeout(loadTimeout);
    });

    wave.on('play', () => {
      // stop any other preview
      waveRegistry.forEach((ws, otherId) => {
        if (otherId !== id) {
          try {
            if (ws.isPlaying()) ws.pause();
          } catch {
            // ignore
          }
        }
      });

      currentlyPlayingId = id;
      setIsPlaying(true);
    });

    wave.on('pause', () => {
      if (currentlyPlayingId === id) currentlyPlayingId = null;
      setIsPlaying(false);
    });

    wave.on('finish', () => {
      if (currentlyPlayingId === id) currentlyPlayingId = null;
      setIsPlaying(false);
    });

    wave.on('error', (e) => {
      // mark failure so UI can show fallback text
      // also log for debugging (most common: wrong path -> server returns HTML)
      // eslint-disable-next-line no-console
      console.error('[WaveSurfer] preview load error', { id, url: urlCandidates[0], error: e });
      readyRef.current = false;
      if (loadTimeout) window.clearTimeout(loadTimeout);
      setHasError(true);
      if (currentlyPlayingId === id) currentlyPlayingId = null;
      setIsPlaying(false);
    });


    // WaveSurfer fetches audio to build the waveform. Only load after explicit activation.
    const candidate = urlCandidates[0];
    if (candidate && !cancelled) {
      try {
        void wave.load(candidate).catch(() => { if (!cancelled) setHasError(true); });
      } catch {
        setHasError(true);
      }
    }

    // Watchdog: if it never becomes ready, surface an error instead of spinning forever.
    loadTimeout = window.setTimeout(() => {
      if (!cancelled && !readyRef.current) {
        setHasError(true);
      }
    }, 20000);

    return () => {
      cancelled = true;
      readyRef.current = false;
      if (loadTimeout) window.clearTimeout(loadTimeout);
      waveRegistry.delete(id);
      if (currentlyPlayingId === id) currentlyPlayingId = null;

      try {
        wave.destroy();
      } catch {
        // ignore
      }
      waveRef.current = null;
    };
    }
    void initialize().then(dispose => {
      if (disposed) dispose?.(); else cleanup = dispose;
    }).catch(() => { if (!disposed) setHasError(true); });
    return () => { disposed = true; cleanup?.(); };
  }, [id, url, activation]);

  const toggle = () => {
    if (activation === 0 || hasError) {
      pendingPlayRef.current = true;
      setHasError(false);
      setActivation(value => value + 1);
      return;
    }
    const w = waveRef.current;
    if (!w) return;
    void w.playPause().catch(() => setIsPlaying(false));
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={toggle}
        disabled={activation > 0 && !isReady && !hasError}
        className={`inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-white/80 transition hover:border-white/25 hover:bg-white/[0.06] disabled:opacity-40 ${accentClass ?? ''}`}
        aria-label={isPlaying ? i18n.pause : i18n.play}
        title={isPlaying ? i18n.pause : i18n.play}
      >
        <span className="text-sm font-semibold">{isPlaying ? 'II' : '▶'}</span>
      </button>

      <div className="flex-1">
        <div ref={containerRef} className="w-full overflow-hidden" />
        <div className="mt-0.5 text-[10px] text-white/65">
          {hasError
            ? i18n.previewUnavailable
            : isReady
            ? i18n.previewSeekHint
            : activation === 0 ? i18n.play : i18n.loading}
        </div>
      </div>
    </div>
  );
}

export default function Producer() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const GENRE_ORDER = ['Afro', 'Drill', 'Trap'] as const;
  type Genre = (typeof GENRE_ORDER)[number];
  const [activeGenre, setActiveGenre] = useState<Genre>('Afro');

  // grouped beats for compact catalog
  const afro = beatCatalogByMood.Afro;
  const drill = beatCatalogByMood.Drill;
  const trap = beatCatalogByMood.Trap;
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="producer" ref={sectionRef} className="relative w-full bg-black py-24 md:py-32 overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0">
        <ResponsiveImage image={photographyPreview.ph06} sizes="100vw" alt="" loading="lazy" className="h-full w-full object-cover object-[50%_38%] opacity-[0.82]" />
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(0,0,0,0.58),rgba(0,0,0,0.18)_48%,rgba(0,0,0,0.52))]" />
      </div>
      {/* Purple Bloom Effect */}
      <div className="purple-bloom opacity-70" />

      <div className="relative z-10 w-full px-6 lg:px-12 xl:px-24">
        {/* Section Title */}
        <div
          className={`text-center mb-6 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="font-head text-4xl md:text-5xl lg:text-6xl text-white tracking-tight uppercase">{t('producer.title')}</h2>
          <div className="w-20 h-0.5 bg-armah-purple mt-6 mx-auto" />
        </div>

        {/* Subline */}
        <div
          className={`text-center mb-16 transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-white/60 text-lg md:text-xl tracking-wide">
            {t('producer.currentCollabLabel')}: <span className="text-white font-medium">Stephen Jounior</span>
          </p>
        </div>

        <section className={`mx-auto w-full max-w-6xl transition-all duration-700 delay-150 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} aria-labelledby="producer-releases">
          <div className="mb-7 flex items-center justify-between gap-4 border-b border-white/15 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1DB954]">{t('producer.spotifyLabel')}</p>
              <h3 id="producer-releases" className="mt-2 font-head text-3xl uppercase tracking-tight text-white md:text-4xl">{t('producer.releases')}</h3>
            </div>
            <Music className="h-6 w-6 shrink-0 text-[#1DB954]" aria-hidden="true" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
            {producerReleases.map((release) => (
              <article key={release.id} className="overflow-hidden rounded-lg border border-white/10 bg-black/45 shadow-[0_18px_40px_rgba(0,0,0,0.24)] transition-colors hover:border-white/25">
                <a href={release.platformUrl} target="_blank" rel="noreferrer" className="group grid grid-cols-1 gap-6 p-6 sm:grid-cols-[minmax(190px,0.85fr)_minmax(0,1fr)] sm:gap-8 sm:p-8">
                  <img src={release.artwork} alt={`${release.title} cover art`} width={600} height={600} loading="lazy" decoding="async" className="aspect-[16/10] w-full rounded-md object-cover transition-transform duration-500 group-hover:scale-[1.025] sm:aspect-square sm:h-full" />
                  <div className="flex min-w-0 flex-col justify-between sm:py-2">
                    <div>
                      <p className="font-head text-[1.65rem] uppercase leading-[1.05] text-white sm:text-4xl">{release.title}</p>
                      <p className="mt-3 text-sm leading-6 text-white/65">{release.artists}</p>
                      <div className="mt-6 border-l-2 border-[#1DB954]/70 pl-4">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#1DB954]">{t('producer.portfolioCredit')}</p>
                        <p className="mt-2 text-[13px] font-medium leading-6 text-white/90">ARMAH — {release.portfolioRoles.join(' · ')}</p>
                        <p className="mt-3 text-[10px] uppercase leading-5 tracking-[0.14em] text-white/48">{t('producer.platformRoleLabels')}: {release.spotifyRoleLabels.join(' · ')}</p>
                      </div>
                    </div>
                    <span className="mt-8 inline-flex min-h-11 items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/70 transition-colors group-hover:text-white"><span className="h-1.5 w-1.5 rounded-full bg-[#1DB954]" />Spotify · {t('producer.listen')} <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /></span>
                  </div>
                </a>
              </article>
            ))}
          </div>
        </section>

        {/* Beat Catalog */}
        <div
          id="beats"
          className={`w-full max-w-6xl mx-auto mt-20 transition-all duration-700 delay-250 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-10">
            <h3 className="font-head text-3xl md:text-4xl text-white uppercase tracking-tight">{t('beatCatalog.title')}</h3>
            <div className="w-20 h-0.5 bg-armah-purple mt-6 mx-auto" />
            <p className="text-white/60 mt-4 max-w-2xl mx-auto">{t('beatCatalog.subtitle')}</p>
            <div className="mt-6 mx-auto max-w-3xl rounded-xl border border-armah-red/65 bg-gradient-to-r from-armah-red/20 via-white/[0.055] to-armah-purple/15 px-4 py-4 text-left shadow-[0_0_34px_rgba(251,54,64,0.16)] ring-1 ring-white/10 md:px-5">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-armah-red text-white shadow-[0_0_20px_rgba(251,54,64,0.35)]">
                  <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-armah-red">{t('beatCatalog.demoLabel')}</p>
                  <p className="mt-1 text-sm leading-6 text-white md:text-base">{t('beatCatalog.demoDisclaimer')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Genre Carousel */}
          <div className="mb-6 overflow-x-auto no-scrollbar">
            <div className="flex gap-2 min-w-max justify-center">
              {GENRE_ORDER.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setActiveGenre(g)}
                  className={`px-4 py-2 rounded-full border text-sm font-semibold tracking-wide transition
                    ${activeGenre === g
                      ? 'border-white/30 bg-white/[0.08] text-white'
                      : 'border-white/10 bg-white/[0.02] text-white/70 hover:border-white/20 hover:bg-white/[0.04]'
                    }`}
                >
                  {t(`beatCatalog.genres.${g.toLowerCase()}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {/* Afro Group */}
            {activeGenre === 'Afro' && afro.length ? (
              <div>
                <div className="mt-8 first:mt-0 flex items-baseline justify-between">
                  <h4 className="text-white font-semibold tracking-wide">{t('beatCatalog.genres.afro').toUpperCase()}</h4>
                  <span className="text-white/60 text-[11px]">({afro.length})</span>
                </div>
                <div className="mt-3 h-px w-full bg-white/10" />

                <div className="mt-3 flex flex-col gap-2">
                  {afro.map((b) => (
                    <div
                      key={b.id}
                      className="w-full rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition-colors px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-white text-sm font-semibold leading-tight">{b.title}</p>
                          <p className="text-white/60 text-[11px] mt-0.5">
                            {b.mood}
                            {b.credits?.length ? ` • ${t('beatCatalog.with')} ${b.credits.join(' · ')}` : ''}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-white/80 text-[11px]">{b.bpm} {t('beatCatalog.bpm')}</p>
                        </div>
                      </div>

                      {b.tags?.length ? (
                        <div className="mt-2 overflow-x-auto no-scrollbar">
                          <div className="flex gap-2 min-w-max pr-1">
                            {b.tags.slice(0, 3).map((t) => (
                              <span
                                key={t}
                                className="shrink-0 text-[10px] text-white/70 border border-white/10 rounded-full px-2 py-0.5"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      <div className="mt-2">
                        <WaveformPreview
                          id={b.id}
                          url={b.previewUrl}
                          accentClass=""
                          i18n={{
                            play: t('beatCatalog.previewPlay'),
                            pause: t('beatCatalog.previewPause'),
                            previewUnavailable: t('common.previewUnavailable'),
                            previewSeekHint: t('beatCatalog.previewSeekHint'),
                            loading: t('common.loading'),
                          }}
                        />
                      </div>

                      <div className="mt-3">
                        <button
                          type="button"
                          onClick={() => {
                            window.location.hash = `#booking?beatId=${encodeURIComponent(b.id)}`;

                            requestAnimationFrame(() => {
                              const bookingEl = document.getElementById('booking');
                              if (bookingEl) bookingEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            });
                          }}
                          className="inline-flex items-center justify-center w-full rounded-lg bg-armah-purple text-white font-semibold py-2 hover:opacity-90 transition"
                        >
                          {t('beatCatalog.licenseInquiry')}
                        </button>
                      </div>

                      <p className="text-white/65 text-xs mt-2">{t('beatCatalog.idLabel')}: {b.id} • {t('beatCatalog.termsLine')}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Drill Group */}
            {activeGenre === 'Drill' && drill.length ? (
              <div>
                <div className="mt-8 first:mt-0 flex items-baseline justify-between">
                  <h4 className="text-white font-semibold tracking-wide">{t('beatCatalog.genres.drill').toUpperCase()}</h4>
                  <span className="text-white/60 text-[11px]">({drill.length})</span>
                </div>
                <div className="mt-3 h-px w-full bg-white/10" />

                <div className="mt-3 flex flex-col gap-2">
                  {drill.map((b) => (
                    <div
                      key={b.id}
                      className="w-full rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition-colors px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-white text-sm font-semibold leading-tight">{b.title}</p>
                          <p className="text-white/60 text-[11px] mt-0.5">
                            {b.mood}
                            {b.credits?.length ? ` • ${t('beatCatalog.with')} ${b.credits.join(' · ')}` : ''}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-white/80 text-[11px]">{b.bpm} {t('beatCatalog.bpm')}</p>
                        </div>
                      </div>

                      {b.tags?.length ? (
                        <div className="mt-2 overflow-x-auto no-scrollbar">
                          <div className="flex gap-2 min-w-max pr-1">
                            {b.tags.slice(0, 3).map((t) => (
                              <span
                                key={t}
                                className="shrink-0 text-[10px] text-white/70 border border-white/10 rounded-full px-2 py-0.5"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      <div className="mt-2">
                        <WaveformPreview
                          id={b.id}
                          url={b.previewUrl}
                          accentClass=""
                          i18n={{
                            play: t('beatCatalog.previewPlay'),
                            pause: t('beatCatalog.previewPause'),
                            previewUnavailable: t('common.previewUnavailable'),
                            previewSeekHint: t('beatCatalog.previewSeekHint'),
                            loading: t('common.loading'),
                          }}
                        />
                      </div>

                      <div className="mt-3">
                        <button
                          type="button"
                          onClick={() => {
                            window.location.hash = `#booking?beatId=${encodeURIComponent(b.id)}`;

                            requestAnimationFrame(() => {
                              const bookingEl = document.getElementById('booking');
                              if (bookingEl) bookingEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            });
                          }}
                          className="inline-flex items-center justify-center w-full rounded-lg bg-armah-purple text-white font-semibold py-2 hover:opacity-90 transition"
                        >
                          {t('beatCatalog.licenseInquiry')}
                        </button>
                      </div>

                      <p className="text-white/65 text-xs mt-2">{t('beatCatalog.idLabel')}: {b.id} • {t('beatCatalog.termsLine')}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Trap Group */}
            {activeGenre === 'Trap' && trap.length ? (
              <div>
                <div className="mt-8 first:mt-0 flex items-baseline justify-between">
                  <h4 className="text-white font-semibold tracking-wide">{t('beatCatalog.genres.trap').toUpperCase()}</h4>
                  <span className="text-white/60 text-[11px]">({trap.length})</span>
                </div>
                <div className="mt-3 h-px w-full bg-white/10" />

                <div className="mt-3 flex flex-col gap-2">
                  {trap.map((b) => (
                    <div
                      key={b.id}
                      className="w-full rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition-colors px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-white text-sm font-semibold leading-tight">{b.title}</p>
                          <p className="text-white/60 text-[11px] mt-0.5">
                            {b.mood}
                            {b.credits?.length ? ` • ${t('beatCatalog.with')} ${b.credits.join(' · ')}` : ''}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-white/80 text-[11px]">{b.bpm} {t('beatCatalog.bpm')}</p>
                        </div>
                      </div>

                      {b.tags?.length ? (
                        <div className="mt-2 overflow-x-auto no-scrollbar">
                          <div className="flex gap-2 min-w-max pr-1">
                            {b.tags.slice(0, 3).map((t) => (
                              <span
                                key={t}
                                className="shrink-0 text-[10px] text-white/70 border border-white/10 rounded-full px-2 py-0.5"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      <div className="mt-2">
                        <WaveformPreview
                          id={b.id}
                          url={b.previewUrl}
                          accentClass=""
                          i18n={{
                            play: t('beatCatalog.previewPlay'),
                            pause: t('beatCatalog.previewPause'),
                            previewUnavailable: t('common.previewUnavailable'),
                            previewSeekHint: t('beatCatalog.previewSeekHint'),
                            loading: t('common.loading'),
                          }}
                        />
                      </div>

                      <div className="mt-3">
                        <button
                          type="button"
                          onClick={() => {
                            window.location.hash = `#booking?beatId=${encodeURIComponent(b.id)}`;

                            requestAnimationFrame(() => {
                              const bookingEl = document.getElementById('booking');
                              if (bookingEl) bookingEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            });
                          }}
                          className="inline-flex items-center justify-center w-full rounded-lg bg-armah-purple text-white font-semibold py-2 hover:opacity-90 transition"
                        >
                          {t('beatCatalog.licenseInquiry')}
                        </button>
                      </div>

                      <p className="text-white/65 text-xs mt-2">{t('beatCatalog.idLabel')}: {b.id} • {t('beatCatalog.termsLine')}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="mt-10 text-center text-white/60 text-sm">
            <span className="text-white/80 font-semibold">{t('beatCatalog.licensingLabel')}:</span> {t('beatCatalog.licensingText')}
          </div>
        </div>

      </div>

      {/* Decorative Line */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-armah-purple/30 to-transparent" />
    </section>
  );
}
