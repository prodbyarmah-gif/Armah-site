import { useI18n } from "../i18n";
import { useEffect, useRef, useState } from 'react'
import { highlights, selectedShows } from '../data/armah'

export default function Trusted(): JSX.Element {
  const { t } = useI18n();
  const [index, setIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  useEffect(() => {
    // clamp index
    if (index < 0) setIndex(highlights.length - 1)
    if (index >= highlights.length) setIndex(0)
  }, [index])

  function prev() {
    setIndex((i) => (i - 1 + highlights.length) % highlights.length)
  }
  function next() {
    setIndex((i) => (i + 1) % highlights.length)
  }

  // Swipe handlers
  function onTouchStart(e: TouchEvent | React.TouchEvent) {
    touchStartX.current = (e as React.TouchEvent).touches[0].clientX
  }
  function onTouchMove(e: TouchEvent | React.TouchEvent) {
    touchEndX.current = (e as React.TouchEvent).touches[0].clientX
  }
  function onTouchEnd() {
    if (touchStartX.current == null || touchEndX.current == null) return
    const dx = touchStartX.current - touchEndX.current
    const threshold = 40
    if (dx > threshold) next()
    else if (dx < -threshold) prev()
    touchStartX.current = null
    touchEndX.current = null
  }

  return (
    <section id="shows" className="relative w-full bg-black py-24 md:py-32">
      <div className="w-full px-6 lg:px-12 xl:px-24">
        <div className="text-center mb-8">
          <h2 className="font-head text-4xl md:text-5xl lg:text-6xl text-white tracking-tight uppercase">{t("trusted.title")}</h2>
          <div className="w-20 h-0.5 bg-armah-red mt-6 mx-auto" />
        </div>

        {/* Carousel */}
        <div className="max-w-4xl mx-auto mb-8 relative">
          <div
            ref={containerRef}
            className="w-full h-28 flex items-center justify-center overflow-hidden relative"
            onTouchStart={onTouchStart as any}
            onTouchMove={onTouchMove as any}
            onTouchEnd={onTouchEnd as any}
          >
            {highlights.map((h, i) => {
              const active = i === index
              return (
                <div
                  key={h.name + i}
                  className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${
                    active ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                  style={{ width: '220px', height: '80px' }}
                >
                  <img src={h.logo} alt={h.name} className="h-full w-auto mx-auto object-contain" draggable={false} />
                </div>
              )
            })}

            {/* Arrows */}
            <button
              aria-label={t("trusted.prev")}
              onClick={prev}
              className="absolute top-1/2 -translate-y-1/2 left-10 md:left-14 pointer-events-auto z-50 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full cursor-pointer select-none touch-manipulation text-white bg-black/40 hover:bg-black/60 focus:outline-none"
            >
              ‹
            </button>
            <button
              aria-label={t("trusted.next")}
              onClick={next}
              className="absolute top-1/2 -translate-y-1/2 right-10 md:right-14 pointer-events-auto z-50 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full cursor-pointer select-none touch-manipulation text-white bg-black/40 hover:bg-black/60 focus:outline-none"
            >
              ›
            </button>
          </div>
        </div>

        {/* Buttons grid */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {selectedShows.map((s) => (
              <button
                key={s.label}
                onClick={() => window.open(s.url, '_blank', 'noopener')}
                className="px-4 py-3 border border-white/10 bg-white/[0.02] hover:border-armah-red/50 hover:bg-armah-red/5 transition-all duration-300 cursor-pointer pointer-events-auto relative z-10"
              >
                <p className="text-white/80 text-sm font-medium tracking-wide text-center hover:text-white transition-colors">
                  {s.label}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-armah-red/30 to-transparent" />
    </section>
  )
}
