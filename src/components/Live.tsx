import { useI18n } from "../i18n";
import { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Play } from 'lucide-react';
import { liveClips } from '../data/media';
import ResponsiveImage from './ResponsiveImage';

const CARD_EASE = [0.22, 1, 0.36, 1] as const;


export default function Live() {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedClipId, setSelectedClipId] = useState<string>('01');
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const [videoError, setVideoError] = useState(false);
  const clips = liveClips.map(clip => ({ ...clip, title: `${t('live.clipLabel')} ${clip.id}` }));
  const selectedClip = clips.find(clip => clip.id === selectedClipId) || clips[0];
  // live02 is the strongest crowd/performance image in the existing live candidate pool.
  // Its PH-04/PH-05 role remains intentionally unresolved in the photography manifest.
  const backgroundClip = liveClips[1];

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

  useEffect(() => {
    const handleVisibility = () => {
      const v = videoRef.current;
      if (!v) return;

      // When the tab/page is hidden (sleep, lock screen, tab switch), pause so it won't resume unexpectedly.
      if (document.hidden) {
        try {
          v.pause();
        } catch {
          // ignore
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('pagehide', handleVisibility);
    window.addEventListener('blur', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('pagehide', handleVisibility);
      window.removeEventListener('blur', handleVisibility);
    };
  }, []);

  const handlePreviewClick = (clipId: string) => {
    videoRef.current?.pause();
    setHasUserInteracted(false);
    setVideoError(false);
    setSelectedClipId(clipId);
  };

  return (
    <section id="live" ref={sectionRef} className="relative w-full overflow-hidden bg-black py-16 md:py-32">
      <div aria-hidden="true" className="absolute inset-0">
        <ResponsiveImage image={backgroundClip.poster} sizes="100vw" alt="" loading="lazy" className="h-full w-full object-cover object-[62%_48%] opacity-[0.68]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.76)_0%,rgba(0,0,0,0.2)_38%,rgba(0,0,0,0.28)_70%,rgba(0,0,0,0.78)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.62)_0%,rgba(0,0,0,0.06)_38%,rgba(0,0,0,0.84)_100%)]" />
      </div>
      <div className="relative z-10 w-full px-6 lg:px-12 xl:px-24">
        {/* Section Title */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="font-head text-4xl md:text-5xl lg:text-6xl text-white tracking-tight uppercase">
            {t("live.title")}
          </h2>
          <div className="w-20 h-0.5 bg-armah-red mt-6 mx-auto" />
        </div>

        {/* Player + Playlist Layout */}
        {/*
            Layout:
            - Player on top, all previews below as a 4-column tap-to-select grid
              (small thumbnails on mobile, large cards on lg+).
          */}
        <div className="flex flex-col items-center gap-6">
          {/* Main Player */}
          <div className="w-full">
            <div className="relative w-full max-w-[420px] mx-auto">
              <div className="relative aspect-[9/16] bg-black overflow-hidden rounded-lg">
                {hasUserInteracted ? (
                  <video key={selectedClipId} ref={videoRef} controls playsInline autoPlay preload="none"
                    poster={selectedClip.poster.src} src={selectedClip.videoUrl}
                    aria-label={selectedClip.title} className="h-full w-full object-contain"
                    onError={() => setVideoError(true)} />
                ) : (
                  <button type="button" onClick={() => setHasUserInteracted(true)}
                    aria-label={`${t('live.play')}: ${selectedClip.title}`} className="relative h-full w-full">
                    <ResponsiveImage image={selectedClip.poster} sizes="420px" alt="" className="h-full w-full object-cover" />
                    <span className="absolute inset-0 grid place-items-center bg-black/20">
                      <span className="grid h-16 w-16 place-items-center rounded-full border border-white/60 bg-black/65"><Play className="ml-1 h-6 w-6" fill="white" aria-hidden="true" /></span>
                    </span>
                  </button>
                )}

              </div>
              <p className="text-white/80 text-sm font-medium tracking-wide mt-4">{selectedClip.title}</p>
              {videoError && <p role="alert" className="mt-3 text-sm text-white/80">{t('common.previewUnavailable')} <button type="button" className="underline" onClick={() => { setVideoError(false); setHasUserInteracted(false); }}>{t('common.retry')}</button> · <a href="#featured-live-set" className="underline">{t('mixes.featured')}</a></p>}
            </div>
          </div>

          {/* Preview Cards — all clips visible as tappable thumbnails (no swiping needed) */}
          <div className="relative w-full">
            <p className="mb-3 text-center text-xs tracking-wide text-white/65 lg:hidden">
              {t('live.tapHint')}
            </p>

            <motion.div
              className="mx-auto grid w-full max-w-xl grid-cols-4 gap-2 sm:gap-3 lg:max-w-6xl lg:gap-4"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
            >
              {clips.map((clip) => {
                const isSelected = clip.id === selectedClipId;
                return (
                  <motion.button
                    type="button" aria-pressed={isSelected} aria-label={clip.title}
                    key={clip.id}
                    variants={
                      reduce
                        ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.5 } } }
                        : {
                            hidden: { opacity: 0, y: 20 },
                            show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: CARD_EASE } },
                          }
                    }
                    whileHover={reduce ? undefined : { y: -4 }}
                    className={`relative aspect-[9/16] overflow-hidden bg-black cursor-pointer group rounded-lg transition-all duration-200 ${
                      isSelected ? 'ring-2 ring-armah-red' : 'hover:ring-1 hover:ring-armah-red/50'
                    }`}
                    onClick={() => handlePreviewClick(clip.id)}
                  >
                    {/* Preview Thumbnail */}
                    <ResponsiveImage
                      image={clip.poster} sizes="(min-width: 1024px) 240px, 25vw"
                      alt=""
                      loading="lazy"
                      className="w-full h-full object-cover object-top pointer-events-none select-none"
                      draggable={false}
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300 z-10 pointer-events-none" />

                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                      <div className="w-8 h-8 lg:w-12 lg:h-12 rounded-full bg-armah-red/90 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-armah-red">
                        <Play className="w-3.5 h-3.5 lg:w-5 lg:h-5 text-white ml-0.5" fill="white" />
                      </div>
                    </div>

                    {/* Title */}
                    <div className="absolute bottom-2 left-2 right-2 lg:bottom-3 lg:left-3 lg:right-3 z-30 pointer-events-none">
                      <p className="text-white/80 text-[10px] lg:text-xs font-medium tracking-wide truncate">{clip.title}</p>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Decorative Line */}
      <div className="absolute bottom-0 left-0 z-10 h-px w-full bg-gradient-to-r from-transparent via-armah-red/30 to-transparent" />
    </section>
  );
}
