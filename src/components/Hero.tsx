import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useI18n } from "../i18n";
import { siteConfig } from '../data/armah';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax: background drifts slower than the page, content lifts + fades as you scroll past.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
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
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image (parallax) */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
        style={{
          backgroundImage: 'url(/assets/hero-bg.jpg)',
          scale: reduce ? 1 : 1.3,
          y: reduce ? 0 : bgY,
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Red Bloom Effect */}
      <div className="red-bloom opacity-50" />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-6"
        style={{ y: reduce ? 0 : contentY, opacity: reduce ? 1 : contentOpacity }}
      >
        <motion.div variants={container} initial="hidden" animate="show">
          {/* Main Headline */}
          <motion.h1
            variants={item}
            className="font-head text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white tracking-tight mb-6"
          >
            {siteConfig.artistName}
          </motion.h1>

          {/* Subline */}
          <motion.p
            variants={item}
            className="text-white/80 text-lg sm:text-xl md:text-2xl tracking-wide max-w-2xl mx-auto mb-12"
          >
            {t("hero.tagline")}
          </motion.p>

          {/* CTA Button */}
          <motion.button
            variants={item}
            onClick={scrollToBooking}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-[#B91C1C] px-10 py-4 font-head text-sm uppercase tracking-[0.2em] text-white shadow-[0_18px_45px_rgba(185,28,28,0.18)] transition-all duration-300 hover:bg-[#D72632] hover:shadow-[0_0_28px_rgba(185,28,28,0.45)]"
          >
            {t("hero.cta")}
          </motion.button>
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
