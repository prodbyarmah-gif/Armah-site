import { useState, useEffect, useRef } from 'react';
import { Instagram as InstagramIcon, ExternalLink } from 'lucide-react';
import { siteConfig, instagramPosts } from '../data/armah';

export default function Instagram() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [embedsLoaded, setEmbedsLoaded] = useState(false);

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

  // Load Instagram embed script
  useEffect(() => {
    if (!isVisible) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.instagram.com/embed.js';
    script.onload = () => {
      setEmbedsLoaded(true);
      if ((window as any).instgrm?.Embeds?.process) {
        (window as any).instgrm.Embeds.process();
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [isVisible]);

  // Process embeds when loaded
  useEffect(() => {
    if (embedsLoaded && (window as any).instgrm?.Embeds?.process) {
      (window as any).instgrm.Embeds.process();
    }
  }, [embedsLoaded]);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full bg-black py-24 md:py-32"
    >
      <div className="w-full px-6 lg:px-12 xl:px-24">
        {/* Section Header */}
        <div className={`flex flex-col md:flex-row md:items-center md:justify-between mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div>
            <h2 className="font-head text-4xl md:text-5xl lg:text-6xl text-white tracking-tight uppercase">
              Instagram
            </h2>
            <div className="w-20 h-0.5 bg-armah-red mt-6" />
          </div>
          
          <a
            href={siteConfig.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 md:mt-0 inline-flex items-center gap-3 text-white/70 hover:text-armah-red transition-colors duration-200 group"
          >
            <InstagramIcon className="w-5 h-5" />
            <span className="text-sm tracking-wide">@prodbyarmah</span>
            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </a>
        </div>

        {/* Instagram Grid */}
        <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instagramPosts.map((postUrl, index) => (
              <div key={index} className="flex justify-center">
                <blockquote
                  className="instagram-media"
                  data-instgrm-permalink={postUrl}
                  data-instgrm-version="14"
                  style={{
                    background: '#000',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    maxWidth: '540px',
                    minWidth: '326px',
                    padding: '0',
                    width: '100%',
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* View More Link */}
        <div className={`text-center mt-10 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <a
            href={siteConfig.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white/60 hover:text-armah-red text-sm tracking-wide transition-colors duration-200"
          >
            <span>View more on Instagram</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Decorative Line */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-armah-red/30 to-transparent" />
    </section>
  );
}
