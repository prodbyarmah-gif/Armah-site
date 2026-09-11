import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useI18n } from "../i18n";
import { siteConfig } from '../data/armah';
import { imageAssets } from '../data/media';
import ResponsiveImage from './ResponsiveImage';
import HeroLogo3D from './HeroLogo3D';
import { isSceneVisuallySafe, markSceneReady, shouldResumePlayback } from '../lib/heroVideo';

const EASE = [0.22, 1, 0.36, 1] as const;
const CROSSFADE_MS = 1200;
type HeroVideoId = 'kwamzy' | 'dali';

const HERO_VIDEOS: readonly { id: HeroVideoId; src: string }[] = [
  { id: 'kwamzy', src: '/assets/media/hero/armah-red-club-hero.mp4' },
  { id: 'dali', src: '/assets/media/hero/armah-dali-club-hero.mp4' },
];

export default function Hero() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<Record<HeroVideoId, HTMLVideoElement | null>>({ kwamzy: null, dali: null });
  const activeSceneRef = useRef<HeroVideoId>('kwamzy');
  const isTransitioningRef = useRef(false);
  const transitionTimeoutRef = useRef<number | null>(null);
  const [activeVideo, setActiveVideo] = useState<HeroVideoId>('kwamzy');
  // Independent VIDEO readiness (see lib/heroVideo): each scene becomes
  // visible only after its own canplay/playing signal. The approved poster
  // stays beneath, so boot/reload never shows black or empty video.
  // 3D readiness is owned separately by HeroLogo3D — neither blocks the other.
  const [readyScenes, setReadyScenes] = useState<Record<HeroVideoId, boolean>>({ kwamzy: false, dali: false });

  const ensureActivePlayback = (id: HeroVideoId) => {
    if (reduce || activeSceneRef.current !== id) return;
    const video = videoRefs.current[id];
    if (video && shouldResumePlayback(video)) {
      void video.play().catch(() => {
        // Poster remains visible underneath; the next media event retries.
      });
    }
  };

  useEffect(() => {
    if (reduce) return;
    // Reload/hidden-tab recovery: when the page becomes visible again (or is
    // restored from bfcache), resume the active scene if it stalled. Purely
    // event-driven — no timers, no retry loops.
    const onVisible = () => {
      if (document.visibilityState === 'visible') ensureActivePlayback(activeSceneRef.current);
    };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('pageshow', onVisible);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('pageshow', onVisible);
    };
  }, [reduce]);

  // Parallax: background drifts slower than the page, content lifts + fades as you scroll past.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.72, 1], [1, 0.62, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.72, 1], [0.18, 0.48, 1]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };

  useEffect(() => () => {
    if (transitionTimeoutRef.current !== null) window.clearTimeout(transitionTimeoutRef.current);
  }, []);

  const crossfadeToNextScene = (outgoingId: HeroVideoId) => {
    if (reduce || isTransitioningRef.current || activeSceneRef.current !== outgoingId) return;
    const incomingId: HeroVideoId = outgoingId === 'kwamzy' ? 'dali' : 'kwamzy';
    const outgoing = videoRefs.current[outgoingId];
    const incoming = videoRefs.current[incomingId];
    if (!outgoing || !incoming) return;

    isTransitioningRef.current = true;
    const beginCrossfade = () => {
      if (!isTransitioningRef.current) return;
      incoming.currentTime = 0;
      activeSceneRef.current = incomingId;
      setActiveVideo(incomingId);
      void incoming.play().catch(() => {
        // PH-02 remains visible underneath if autoplay is unexpectedly blocked.
      });
      transitionTimeoutRef.current = window.setTimeout(() => {
        outgoing.pause();
        outgoing.currentTime = 0;
        isTransitioningRef.current = false;
      }, CROSSFADE_MS + 80);
    };

    // The next muted scene is normally ready via preload="auto". If not, hold
    // the final outgoing frame rather than cutting to black. The error arm
    // guarantees the transition flag can never stick if the incoming scene
    // fails — future crossfades stay possible.
    if (incoming.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) beginCrossfade();
    else {
      const onCanPlay = () => {
        incoming.removeEventListener('error', onError);
        beginCrossfade();
      };
      const onError = () => {
        incoming.removeEventListener('canplay', onCanPlay);
        isTransitioningRef.current = false;
      };
      incoming.addEventListener('canplay', onCanPlay, { once: true });
      incoming.addEventListener('error', onError, { once: true });
    }
  };

  const handleSceneReady = (id: HeroVideoId) => {
    setReadyScenes((prev) => markSceneReady(prev, id));
    // Covers deferred mobile autoplay after reload: the moment the active
    // scene can play, make sure it actually does.
    ensureActivePlayback(id);
  };

  const handleSceneProgress = (id: HeroVideoId, video: HTMLVideoElement) => {
    if (id !== activeSceneRef.current || !Number.isFinite(video.duration)) return;
    if (video.duration - video.currentTime <= CROSSFADE_MS / 1000) crossfadeToNextScene(id);
  };

  // Staggered entrance for headline / subline / CTA
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15, delayChildren: 0.15 } },
  };
  const item = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.6 } } }
    : {
        hidden: { opacity: 0, y: 28 },
        show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
      };

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden"
    >
      {/* PH-02 remains the poster/fallback beneath the local web-video derivative. */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
        style={{
          scale: reduce ? 1 : 1.3,
          y: reduce ? 0 : bgY,
          opacity: reduce ? 1 : backgroundOpacity,
        }}
      >
        <ResponsiveImage image={imageAssets.hero} alt="" sizes="100vw" loading="eager" fetchPriority="high" className="h-full w-full object-cover object-[40%_center] sm:object-center" />
        {!reduce && HERO_VIDEOS.map((video) => (
          <video
            key={video.id}
            ref={(element) => { videoRefs.current[video.id] = element; }}
            autoPlay={video.id === 'kwamzy'}
            muted
            playsInline
            preload="auto"
            poster={imageAssets.hero.src}
            aria-hidden="true"
            onTimeUpdate={(event) => handleSceneProgress(video.id, event.currentTarget)}
            onEnded={() => crossfadeToNextScene(video.id)}
            onCanPlay={() => handleSceneReady(video.id)}
            onPlaying={() => handleSceneReady(video.id)}
            // DALI-only mobile framing: the owner performs left-of-center
            // (~1/3 of the 16:9 frame), so a centered portrait crop loses him.
            // Kwamzy and desktop DALI framing are intentionally untouched.
            // Visibility additionally requires the scene's own readiness so
            // boot/reload shows the poster — never a black or empty surface.
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] ease-in-out ${video.id === 'dali' ? 'object-[32%_center] sm:object-center' : 'object-center'} ${isSceneVisuallySafe(activeVideo, video.id, readyScenes) ? 'opacity-100' : 'opacity-0'}`}
          >
            <source src={video.src} type="video/mp4" />
          </video>
        ))}
      </motion.div>

      {/* The video and foreground resolve to black as Live Moments enters. */}
      <motion.div className="absolute inset-0 bg-black" style={{ opacity: reduce ? 0.6 : overlayOpacity }} />

      {/* Red Bloom Effect */}
      <div className="red-bloom opacity-50" />

      <HeroLogo3D reducedMotion={reduce} />

      {/* Content */}
      <motion.div
        className="relative z-20 w-full px-6 pt-[clamp(8rem,26vh,17.5rem)] text-center"
        style={{ y: reduce ? 0 : contentY, opacity: reduce ? 1 : contentOpacity }}
      >
        <motion.div variants={container} initial="hidden" animate="show">
          {/* Main Headline */}
          <motion.h1
            variants={item}
            className="sr-only"
          >
            {siteConfig.artistName}
          </motion.h1>

          {/* Subline */}
          <motion.p
            variants={item}
            className="mx-auto mb-10 max-w-2xl text-lg tracking-wide text-white/85 sm:text-xl md:text-2xl"
          >
            {t("hero.tagline")}
          </motion.p>

          <p className="mx-auto -mt-7 mb-8 max-w-xl text-sm leading-6 text-white/80">{t('hero.availability')}</p>
          {/* CTA Button */}
          <motion.button
            variants={item}
            onClick={scrollToBooking}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className="mx-auto inline-flex items-center justify-center rounded-full border border-white/10 bg-[#B91C1C] px-10 py-4 font-head text-sm uppercase tracking-[0.2em] text-white shadow-[0_18px_45px_rgba(185,28,28,0.18)] transition-all duration-300 hover:bg-[#D72632] hover:shadow-[0_0_28px_rgba(185,28,28,0.45)]"
          >
            {t("hero.cta")}
          </motion.button>
          <a href="#featured-live-set" className="mx-auto mt-5 flex min-h-11 w-fit items-center border-b border-white/50 text-sm text-white/85 hover:text-white">{t('mixes.featured')} ↗</a>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      {!reduce && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          aria-hidden="true"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-1.5">
            <motion.div
              className="w-1 h-1.5 rounded-full bg-armah-red"
              animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}

    </section>
  );
}
