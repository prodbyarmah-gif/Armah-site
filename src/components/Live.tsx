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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedClipId, setSelectedClipId] = useState<string>('01');

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

  const selectedClip = clips.find(clip => clip.id === selectedClipId) || clips[0];

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

  // Autoplay and reset when selectedClipId changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [selectedClipId]);

  const handlePreviewClick = (clipId: string) => {
    setSelectedClipId(clipId);
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

        {/* Player + Playlist Layout */}
        <div className={`grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Main Player */}
          <div className="relative">
            <div className="relative aspect-video bg-black overflow-hidden rounded-lg">
              <video
                ref={videoRef}
                controls
                playsInline
                preload="metadata"
                autoPlay
                poster={selectedClip.posterUrl}
                disablePictureInPicture
                disableRemotePlayback
                controlsList="nodownload noplaybackrate"
                className="w-full h-full object-contain"
              >
                <source src={selectedClip.videoUrl} type="video/mp4" />
              </video>
            </div>
            <p className="text-white/80 text-sm font-medium tracking-wide mt-4">
              {selectedClip.title}
            </p>
          </div>

          {/* Preview Cards Grid (2x2) */}
          <div className="grid grid-cols-2 gap-4">
            {clips.map((clip) => {
              const isSelected = clip.id === selectedClipId;
              return (
                <div
                  key={clip.id}
                  className={`relative aspect-[9/16] overflow-hidden bg-black cursor-pointer group rounded-lg transition-all duration-200 ${
                    isSelected ? 'ring-2 ring-armah-red' : 'hover:ring-1 hover:ring-armah-red/50'
                  }`}
                  onClick={() => handlePreviewClick(clip.id)}
                >
                  {/* Preview Thumbnail */}
                  <img
                    src={clip.posterUrl}
                    alt={clip.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-top pointer-events-none"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300 z-10" />

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="w-12 h-12 rounded-full bg-armah-red/90 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-armah-red">
                      <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                    </div>
                  </div>

                  {/* Title */}
                  <div className="absolute bottom-3 left-3 right-3 z-30">
                    <p className="text-white/80 text-xs font-medium tracking-wide truncate">
                      {clip.title}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Decorative Line */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-armah-red/30 to-transparent" />
    </section>
  );
}
