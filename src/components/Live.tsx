import { useState, useEffect, useRef } from 'react';
import { Play } from 'lucide-react';

// clip type used locally in this component
interface Clip {
  id: string;
  title: string;
  videoUrl: string;
  posterUrl: string;
}

export default function Live() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeClipId, setActiveClipId] = useState<string | null>(null);

  // clip definitions with R2 video URLs and local posters
  const clips: Clip[] = [
    {
      id: '01',
      title: 'Live Clip 01',
      videoUrl: 'https://pub-17d9dfc949e942378e7463ab8ecb35d3.r2.dev/live01_web.mp4',
      posterUrl: '/assets/live01.jpg',
    },
    {
      id: '02',
      title: 'Live Clip 02',
      videoUrl: 'https://pub-17d9dfc949e942378e7463ab8ecb35d3.r2.dev/live02_web.mp4',
      posterUrl: '/assets/live02.jpg',
    },
    {
      id: '03',
      title: 'Live Clip 03',
      videoUrl: 'https://pub-17d9dfc949e942378e7463ab8ecb35d3.r2.dev/live03_signature_smaller.mp4',
      posterUrl: '/assets/live03.jpg',
    },
    {
      id: '04',
      title: 'Live Clip 04',
      videoUrl: 'https://pub-17d9dfc949e942378e7463ab8ecb35d3.r2.dev/live04_web.mp4',
      posterUrl: '/assets/live04.jpg',
    },
  ];

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


  const toggleClip = (clipId: string) => {
    if (activeClipId === clipId) {
      setActiveClipId(null);
    } else {
      setActiveClipId(clipId);
    }
  };

  const handleCardClick = (clip: Clip) => {
    toggleClip(clip.id);
  };

  return (
    <section 
      id="live" 
      ref={sectionRef}
      className="relative w-full bg-black py-24 md:py-32"
    >
      <div className="w-full px-6 lg:px-12 xl:px-24">
        {/* Section Title */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="font-head text-4xl md:text-5xl lg:text-6xl text-white tracking-tight uppercase">
            Live Moments
          </h2>
          <div className="w-20 h-0.5 bg-armah-red mt-6 mx-auto" />
        </div>

        {/* Video Grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {clips.map((clip, index) => {
            const isActive = activeClipId === clip.id;
            return (
              <div
                key={clip.id}
                className="relative aspect-[9/16] overflow-hidden bg-black cursor-pointer group"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => handleCardClick(clip)}
              >
                {isActive ? (
                  // Active inline player
                  <div className="absolute inset-0">
                    <video
                      controls
                      playsInline
                      preload="metadata"
                      autoPlay
                      className="w-full h-full bg-black object-contain"
                      style={{ objectFit: 'contain' }}
                      muted={false}
                      disablePictureInPicture
                      disableRemotePlayback
                      controlsList="nodownload noplaybackrate nofullscreen"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <source src={clip.videoUrl} type="video/mp4" />
                    </video>
                  </div>
                ) : (
                  // Thumbnail preview
                  <>
                    <video
                      src={clip.videoUrl}
                      poster={clip.posterUrl}
                      muted
                      playsInline
                      preload="none"
                      className="w-full h-full object-cover object-top"
                      style={{ pointerEvents: 'none' }}
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300 z-20" />
                    
                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center z-30">
                      <div className="w-16 h-16 rounded-full bg-armah-red/90 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-armah-red">
                        <Play className="w-7 h-7 text-white ml-1" fill="white" />
                      </div>
                    </div>
                  </>
                )}
                
                {/* Title */}
                <div className="absolute bottom-4 left-4 right-4 z-40">
                  <p className="text-white/80 text-sm font-medium tracking-wide">
                    {clip.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Decorative Line */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-armah-red/30 to-transparent" />
    </section>
  );
}
