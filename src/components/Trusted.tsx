import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { trustedEvents } from '../data/armah';

export default function Trusted() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="relative w-full bg-black py-20 md:py-28"
    >
      <div className="w-full">
        {/* Section Title */}
        <div className={`text-center mb-12 px-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="font-head text-3xl md:text-4xl lg:text-5xl text-white tracking-tight uppercase">
            Trusted Venues
          </h2>
          <div className="w-20 h-0.5 bg-armah-red mt-6 mx-auto" />
        </div>

        {/* Carousel */}
        <div className={`relative transition-all duration-700 delay-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

          {/* Navigation Arrows */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 hover:bg-armah-red/20 border border-white/10 hover:border-armah-red/50 flex items-center justify-center text-white/60 hover:text-white transition-all duration-200"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <button
            onClick={() => scroll('right')}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 hover:bg-armah-red/20 border border-white/10 hover:border-armah-red/50 flex items-center justify-center text-white/60 hover:text-white transition-all duration-200"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Scrolling Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-8 md:gap-12 overflow-x-auto scrollbar-hide px-20 md:px-32 py-8"
          >
            {trustedEvents.map((event) => (
              <a
                key={event.name}
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 flex flex-col items-center gap-4 group"
              >
                <div className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
                  <img
                    src={event.logo}
                    alt={event.name}
                    loading="lazy"
                    className="trusted-logo max-w-full max-h-full object-contain opacity-80 group-hover:opacity-100"
                    style={{ filter: 'grayscale(100%) brightness(2)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.filter = 'grayscale(0%) brightness(1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.filter = 'grayscale(100%) brightness(2)';
                    }}
                  />
                </div>
                <span className="text-white/50 text-xs md:text-sm tracking-wide text-center group-hover:text-white/80 transition-colors">
                  {event.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Line */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-armah-red/30 to-transparent" />
    </section>
  );
}
