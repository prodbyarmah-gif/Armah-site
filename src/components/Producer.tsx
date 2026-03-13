import { useEffect, useRef, useState } from 'react';
import { Music } from 'lucide-react';

import WaveSurfer from 'wavesurfer.js';

type WaveInstance = ReturnType<typeof WaveSurfer.create>;




// Self-contained Spotify embeds (no dependency on ../data/armah)
type ProducerTrack = { id: string; title: string; url: string };

const producerTracks: ProducerTrack[] = [
  {
    id: 'T001',
    title: 'Track 01',
    url: 'https://open.spotify.com/intl-de/track/4OHgaDZPsAemSCikAgFKqr?si=ed4505e96e144fae',
  },
  {
    id: 'T002',
    title: 'Track 02',
    url: 'https://open.spotify.com/intl-de/track/38ZFS6DGwTP6BL0mEVUEdI?si=88feede361974aee',
  },
  {
    id: 'T003',
    title: 'Track 03',
    url: 'https://open.spotify.com/intl-de/track/3Mf5jsUc30w9PAfrM5LWvK?si=c5b2f6818b364c7d',
  },
  {
    id: 'T004',
    title: 'Track 04',
    url: 'https://open.spotify.com/intl-de/track/4SrqKPTiHd2BQXntPMiz5a?si=3acd362682874731',
  },
];

function toSpotifyEmbed(url: string): string {
  // Accept track URLs with query params and convert to embed
  // Example: https://open.spotify.com/track/<id> -> https://open.spotify.com/embed/track/<id>
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter(Boolean);
    // expected: ['intl-de','track','<id>'] OR ['track','<id>']
    const trackIdx = parts.indexOf('track');
    const id = trackIdx >= 0 ? parts[trackIdx + 1] : parts[parts.length - 1];
    return `https://open.spotify.com/embed/track/${id}`;
  } catch {
    return url;
  }
}

type BeatMood = 'Afro' | 'Drill' | 'Trap';

type Beat = {
  id: string;
  title: string;
  bpm: number;
  mood: BeatMood;
  tags: string[];
  credits: string[];
  previewUrl: string;
};

const beatCatalog: Beat[] = [
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

// Global registry to enforce single-preview playback
const waveRegistry = new Map<string, WaveInstance>();
let currentlyPlayingId: string | null = null;

function WaveformPreview({ id, url, accentClass }: { id: string; url: string; accentClass?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const waveRef = useRef<WaveInstance | null>(null);
  const readyRef = useRef(false);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

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
    audioEl.preload = 'metadata';
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


    // Load directly (MediaElement). Avoid prefetching the entire MP3 via fetch.
    const candidate = urlCandidates[0];
    if (candidate && !cancelled) {
      try {
        wave.load(candidate);
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
  }, [id, url]);

  const toggle = () => {
    if (hasError) return;
    const w = waveRef.current;
    if (!w) return;
    w.playPause();
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={toggle}
        disabled={!isReady}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-white/80 transition hover:border-white/25 hover:bg-white/[0.06] disabled:opacity-40 ${accentClass ?? ''}`}
        aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
        title={isPlaying ? 'Pause' : 'Play'}
      >
        <span className="text-sm font-semibold">{isPlaying ? 'II' : '▶'}</span>
      </button>

      <div className="flex-1">
        <div ref={containerRef} className="w-full overflow-hidden" />
        <div className="mt-0.5 text-[10px] text-white/40">
          {hasError
            ? 'Preview unavailable'
            : isReady
            ? 'Preview (click waveform to seek)'
            : 'Loading preview…'}
        </div>
      </div>
    </div>
  );
}

export default function Producer() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const GENRE_ORDER = ['Afro', 'Drill', 'Trap'] as const;
  type Genre = (typeof GENRE_ORDER)[number];
  const [activeGenre, setActiveGenre] = useState<Genre>('Afro');

  // grouped beats for compact catalog
  const afro = beatCatalog.filter((b) => b.mood === 'Afro');
  const drill = beatCatalog.filter((b) => b.mood === 'Drill');
  const trap = beatCatalog.filter((b) => b.mood === 'Trap');
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
      {/* Purple Bloom Effect */}
      <div className="purple-bloom opacity-70" />

      <div className="relative z-10 w-full px-6 lg:px-12 xl:px-24">
        {/* Section Title */}
        <div
          className={`text-center mb-6 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="font-head text-4xl md:text-5xl lg:text-6xl text-white tracking-tight uppercase">Producer</h2>
          <div className="w-20 h-0.5 bg-armah-purple mt-6 mx-auto" />
        </div>

        {/* Subline */}
        <div
          className={`text-center mb-16 transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-white/60 text-lg md:text-xl tracking-wide">
            Current collaboration: <span className="text-white font-medium">Stephen Jounior</span>
          </p>
        </div>

        {/* Spotify Embeds */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {producerTracks.map((track) => (
            <div key={track.id} className="relative">
              <div className="flex items-center gap-3 mb-4">
                <Music className="w-5 h-5 text-[#1DB954]" />
                <span className="text-white/80 text-sm font-medium tracking-wide">Spotify</span>
              </div>
              <div className="relative rounded-lg overflow-hidden bg-white/5">
                <iframe
                  style={{ borderRadius: '12px' }}
                  src={toSpotifyEmbed(track.url)}
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title={`ARMAH ${track.title}`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Beat Catalog */}
        <div
          className={`w-full max-w-6xl mx-auto mt-16 transition-all duration-700 delay-250 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-10">
            <h3 className="font-head text-3xl md:text-4xl text-white uppercase tracking-tight">Beat Catalog</h3>
            <div className="w-20 h-0.5 bg-armah-purple mt-6 mx-auto" />
            <p className="text-white/60 mt-4 max-w-2xl mx-auto">Browse a few drafts & collaborations.</p>
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
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {/* Afro Group */}
            {activeGenre === 'Afro' && afro.length ? (
              <div>
                <div className="mt-8 first:mt-0 flex items-baseline justify-between">
                  <h4 className="text-white font-semibold tracking-wide">AFRO</h4>
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
                          <p className="text-white/60 text-[11px] mt-0.5">{b.mood}{b.credits?.length ? ` • with ${b.credits.join(' · ')}` : ''}</p>
                        </div>

                        <div className="text-right">
                          <p className="text-white/80 text-[11px]">{b.bpm} BPM</p>
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
                        <WaveformPreview id={b.id} url={b.previewUrl} accentClass="" />
                      </div>

                      <div className="mt-3">
                        <a
                          href={`#booking?beat=${encodeURIComponent(b.title)}&id=${encodeURIComponent(b.id)}`}
                          className="inline-flex items-center justify-center w-full rounded-lg bg-armah-purple text-white font-semibold py-2 hover:opacity-90 transition"
                        >
                          License inquiry
                        </a>
                      </div>

                      <p className="text-white/30 text-xs mt-2">ID: {b.id} • Non-exclusive / exclusive available</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Drill Group */}
            {activeGenre === 'Drill' && drill.length ? (
              <div>
                <div className="mt-8 first:mt-0 flex items-baseline justify-between">
                  <h4 className="text-white font-semibold tracking-wide">DRILL</h4>
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
                          <p className="text-white/60 text-[11px] mt-0.5">{b.mood}{b.credits?.length ? ` • with ${b.credits.join(' · ')}` : ''}</p>
                        </div>

                        <div className="text-right">
                          <p className="text-white/80 text-[11px]">{b.bpm} BPM</p>
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
                        <WaveformPreview id={b.id} url={b.previewUrl} accentClass="" />
                      </div>

                      <div className="mt-3">
                        <a
                          href={`#booking?beat=${encodeURIComponent(b.title)}&id=${encodeURIComponent(b.id)}`}
                          className="inline-flex items-center justify-center w-full rounded-lg bg-armah-purple text-white font-semibold py-2 hover:opacity-90 transition"
                        >
                          License inquiry
                        </a>
                      </div>

                      <p className="text-white/30 text-xs mt-2">ID: {b.id} • Non-exclusive / exclusive available</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Trap Group */}
            {activeGenre === 'Trap' && trap.length ? (
              <div>
                <div className="mt-8 first:mt-0 flex items-baseline justify-between">
                  <h4 className="text-white font-semibold tracking-wide">TRAP</h4>
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
                          <p className="text-white/60 text-[11px] mt-0.5">{b.mood}{b.credits?.length ? ` • with ${b.credits.join(' · ')}` : ''}</p>
                        </div>

                        <div className="text-right">
                          <p className="text-white/80 text-[11px]">{b.bpm} BPM</p>
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
                        <WaveformPreview id={b.id} url={b.previewUrl} accentClass="" />
                      </div>

                      <div className="mt-3">
                        <a
                          href={`#booking?beat=${encodeURIComponent(b.title)}&id=${encodeURIComponent(b.id)}`}
                          className="inline-flex items-center justify-center w-full rounded-lg bg-armah-purple text-white font-semibold py-2 hover:opacity-90 transition"
                        >
                          License inquiry
                        </a>
                      </div>

                      <p className="text-white/30 text-xs mt-2">ID: {b.id} • Non-exclusive / exclusive available</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="mt-10 text-center text-white/60 text-sm">
            <span className="text-white/80 font-semibold">Licensing:</span> Non-exclusive • Exclusive • Custom / Sync (ask)
          </div>
        </div>

      </div>

      {/* Decorative Line */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-armah-purple/30 to-transparent" />
    </section>
  );
}
