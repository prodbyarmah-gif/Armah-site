import { useEffect, useRef, useState } from 'react';
import { Youtube, ExternalLink } from 'lucide-react';

export default function Instagram() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Provided YouTube video
  const youtubeUrl = 'https://youtu.be/b02dn3XbjHs?si=aGXVz33VqLa6C1ev';
  const youtubeEmbedUrl = 'https://www.youtube-nocookie.com/embed/b02dn3XbjHs?rel=0&modestbranding=1';

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

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="youtube" ref={sectionRef} className="relative w-full bg-black py-24 md:py-32">
      <div className="w-full px-6 lg:px-12 xl:px-24">
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="font-head text-4xl md:text-5xl lg:text-6xl text-white tracking-tight uppercase">
            YouTube
          </h2>
          <div className="w-20 h-0.5 bg-armah-red mt-6 mx-auto" />
        </div>

        <div
          className={`transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex justify-center">
            <div className="w-full max-w-4xl mx-auto">
              <div
                className="relative w-full overflow-hidden rounded-lg border border-white/10 bg-black"
                style={{ paddingTop: '56.25%' }}
              >
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={youtubeEmbedUrl}
                  title="ARMAH - YouTube"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className={`text-center mt-10 transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 text-white/70 hover:text-armah-red transition-colors duration-200 group"
            title="Open on YouTube"
          >
            <Youtube className="w-5 h-5" />
            <span className="text-sm tracking-wide">Watch on YouTube</span>
            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </a>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-armah-red/30 to-transparent" />
    </section>
  );
}
