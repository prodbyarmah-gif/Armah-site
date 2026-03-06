import { useEffect, useRef, useState } from 'react';
import { Instagram as InstagramIcon, ExternalLink } from 'lucide-react';
import { siteConfig } from '../data/armah';

export default function Instagram() {
  const sectionRef = useRef<HTMLElement>(null);
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

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Load Instagram embed script when the section becomes visible
  useEffect(() => {
    if (!isVisible) return;
    if ((window as any).instgrm) return;
    const s = document.createElement('script');
    s.src = 'https://www.instagram.com/embed.js';
    s.async = true;
    document.body.appendChild(s);
  }, [isVisible]);

  return (
    <section ref={sectionRef} className="relative w-full bg-black py-24 md:py-32">
      <div className="w-full px-6 lg:px-12 xl:px-24">
        <div className={`flex flex-col md:flex-row md:items-center md:justify-between mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div>
            <h2 className="font-head text-4xl md:text-5xl lg:text-6xl text-white tracking-tight uppercase">Instagram</h2>
            <div className="w-20 h-0.5 bg-armah-red mt-6" />
          </div>

          <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" className="mt-6 md:mt-0 inline-flex items-center gap-3 text-white/70 hover:text-armah-red transition-colors duration-200 group">
            <InstagramIcon className="w-5 h-5" />
            <span className="text-sm tracking-wide">@prodbyarmah</span>
            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </a>
        </div>

        <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex justify-center">
              <blockquote className="instagram-media" data-instgrm-permalink={siteConfig.instagram} data-instgrm-version="14" style={{ background: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', maxWidth: '540px', minWidth: '326px', padding: 0, width: '100%' }}></blockquote>
            </div>
          </div>
        </div>

        <div className={`text-center mt-10 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white/60 hover:text-armah-red text-sm tracking-wide transition-colors duration-200">
            <span>View more on Instagram</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-armah-red/30 to-transparent" />
    </section>
  );
}
