import { useState, useEffect, useRef } from 'react';
import { Music, ExternalLink } from 'lucide-react';
import { producerTracks, toSpotifyEmbed } from '../data/armah';

export default function Producer() {
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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="producer" 
      ref={sectionRef}
      className="relative w-full bg-black py-24 md:py-32 overflow-hidden"
    >
      {/* Purple Bloom Effect */}
      <div className="purple-bloom opacity-70" />

      <div className="relative z-10 w-full px-6 lg:px-12 xl:px-24">
        {/* Section Title */}
        <div className={`text-center mb-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="font-head text-4xl md:text-5xl lg:text-6xl text-white tracking-tight uppercase">
            Producer
          </h2>
          <div className="w-20 h-0.5 bg-armah-purple mt-6 mx-auto" />
        </div>

        {/* Subline */}
        <div className={`text-center mb-16 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-white/60 text-lg md:text-xl tracking-wide">
            Current collaboration: <span className="text-white font-medium">Stephen Jounior</span>
          </p>
        </div>

        {/* Spotify Embeds */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {producerTracks.map((track, index) => (
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

        {/* Additional Links */}
        <div className={`flex flex-wrap justify-center gap-6 mt-12 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {['SoundCloud', 'BeatStars', 'YouTube'].map((platform) => (
            <a
              key={platform}
              href="#"
              className="inline-flex items-center gap-2 text-white/50 hover:text-armah-purple text-sm tracking-wide transition-colors duration-200"
              onClick={(e) => e.preventDefault()}
            >
              {platform}
              <ExternalLink className="w-3 h-3" />
            </a>
          ))}
        </div>
      </div>

      {/* Decorative Line */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-armah-purple/30 to-transparent" />
    </section>
  );
}
