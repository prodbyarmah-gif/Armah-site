import { useI18n } from "../i18n";
import { useState, useEffect, useRef, useMemo } from 'react';
import { Play } from 'lucide-react';

interface Clip {
  id: string;
  title: string;
  videoUrl: string;
  posterUrl: string;
}

export default function Live() {
  const { t } = useI18n();

  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedClipId, setSelectedClipId] = useState<string>('01');
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const clips: Clip[] = useMemo(() => [
    {
      id: '01',
      title: `${t("live.clipLabel")} 01`,
      videoUrl: 'https://pub-17d9dfc949e942378e7463ab8ecb35d3.r2.dev/live01_web.mp4',
      posterUrl: '/assets/live01.jpg',
    },
    {
      id: '02',
      title: `${t("live.clipLabel")} 02`,
      videoUrl: 'https://pub-17d9dfc949e942378e7463ab8ecb35d3.r2.dev/live02_web.mp4',
      posterUrl: '/assets/live02.jpg',
    },
    {
      id: '03',
      title: `${t("live.clipLabel")} 03`,
      videoUrl: 'https://pub-17d9dfc949e942378e7463ab8ecb35d3.r2.dev/live03_signature_smaller.mp4',
      posterUrl: '/assets/live03.jpg',
    },
    {
      id: '04',
      title: `${t("live.clipLabel")} 04`,
      videoUrl: 'https://pub-17d9dfc949e942378e7463ab8ecb35d3.r2.dev/live04_web.mp4',
      posterUrl: '/assets/live04.jpg',
    },
  ], [t]);

  const selectedClip = clips.find((clip) => clip.id === selectedClipId) || clips[0];

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

  useEffect(() => {
    const handleVisibility = () => {
      const v = videoRef.current;
      if (!v) return;

      // When the tab/page is hidden (sleep, lock screen, tab switch), pause so it won't resume unexpectedly.
      if (document.hidden) {
        try {
          v.pause();
        } catch {
          // ignore
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('pagehide', handleVisibility);
    window.addEventListener('blur', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('pagehide', handleVisibility);
      window.removeEventListener('blur', handleVisibility);
    };
  }, []);

  // Force the main player to actually switch sources across browsers
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // Set src explicitly (more reliable than <source> swapping across browsers)
    v.pause();
    v.currentTime = 0;
    v.src = selectedClip.videoUrl;

    try {
      v.load();
      // No autoplay. User must press play manually.
    } catch {
      // ignore
    }
  }, [selectedClip.videoUrl, hasUserInteracted]);

  const handlePreviewClick = (clipId: string) => {
    if (!hasUserInteracted) setHasUserInteracted(true);
    setSelectedClipId(clipId);
  };

  return (
    <section id="live" ref={sectionRef} className="relative w-full bg-black py-24 md:py-32">
      <div className="w-full px-6 lg:px-12 xl:px-24">
        {/* Section Title */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="font-head text-4xl md:text-5xl lg:text-6xl text-white tracking-tight uppercase">
            {t("live.title")}
          </h2>
          <div className="w-20 h-0.5 bg-armah-red mt-6 mx-auto" />
        </div>

        {/* Player + Playlist Layout */}
        {/*
            Layout:
            - Mobile/tablet: player on top, previews below in 2 columns.
            - Desktop (lg+): player centered, previews in a single row (4 columns) underneath.
          */}
        <div className="flex flex-col items-center gap-6">
          {/* Main Player */}
          <div className="w-full">
            <div className="relative w-full max-w-[420px] mx-auto">
              <div className="relative aspect-[9/16] bg-black overflow-hidden rounded-lg">
                <video
                  key={selectedClipId}
                  ref={videoRef}
                  controls
                  playsInline
                  preload="metadata"
                  poster={selectedClip.posterUrl}
                  disablePictureInPicture
                  disableRemotePlayback
                  controlsList="nodownload noplaybackrate"
                  className="w-full h-full object-contain"
                  src={selectedClip.videoUrl}
                  onPlay={() => setHasUserInteracted(true)}
                />
              </div>
              <p className="text-white/80 text-sm font-medium tracking-wide mt-4">{selectedClip.title}</p>
            </div>
          </div>

          {/* Preview Cards Grid (2x2) */}
          <div className="w-full max-w-6xl mx-auto grid grid-cols-2 gap-4 lg:grid-cols-4">
            {clips.map((clip) => {
              const isSelected = clip.id === selectedClipId;
              return (
                <div
                  key={clip.id}
                  className={`relative aspect-[9/16] overflow-hidden bg-black cursor-pointer group rounded-lg transition-all duration-200 lg:aspect-[9/16] ${
                    isSelected ? 'ring-2 ring-armah-red' : 'hover:ring-1 hover:ring-armah-red/50'
                  }`}
                  onClick={() => handlePreviewClick(clip.id)}
                >
                  {/* Preview Thumbnail */}
                  <img
                    src={clip.posterUrl}
                    alt={clip.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-top pointer-events-none select-none"
                    draggable={false}
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300 z-10 pointer-events-none" />

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-armah-red/90 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-armah-red">
                      <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                    </div>
                  </div>

                  {/* Title */}
                  <div className="absolute bottom-3 left-3 right-3 z-30 pointer-events-none">
                    <p className="text-white/80 text-xs font-medium tracking-wide truncate">{clip.title}</p>
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
