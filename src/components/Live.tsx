import { useState, useEffect, useRef } from 'react';
import { Play, X } from 'lucide-react';
import { liveClips } from '../data/armah';

interface VideoModalProps {
  isOpen: boolean;
  videoUrl: string;
  title: string;
  onClose: () => void;
}

function VideoModal({ isOpen, videoUrl, title, onClose }: VideoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="video-modal-overlay" onClick={onClose}>
      <div 
        className="relative w-full max-w-5xl aspect-video bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/80 hover:text-white transition-colors"
          aria-label="Close video"
        >
          <X size={32} />
        </button>
        {videoUrl ? (
          <iframe
            src={videoUrl}
            className="w-full h-full"
            allow="autoplay; fullscreen"
            allowFullScreen
            title={title}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-white/60 text-center">
              Video coming soon
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Live() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState({ url: '', title: '' });

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
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [modalOpen]);

  const openVideo = (url: string, title: string) => {
    setActiveVideo({ url, title });
    setModalOpen(true);
  };

  return (
    <>
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
            {liveClips.map((clip, index) => (
              <div
                key={clip.id}
                className="relative aspect-[9/16] overflow-hidden bg-black cursor-pointer group"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => openVideo(clip.videoUrl, clip.title)}
              >
                {/* Thumbnail */}
                <img
                  src={clip.thumbnail}
                  alt={clip.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
                
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-armah-red/90 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-armah-red">
                    <Play className="w-7 h-7 text-white ml-1" fill="white" />
                  </div>
                </div>
                
                {/* Title */}
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white/80 text-sm font-medium tracking-wide">
                    {clip.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative Line */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-armah-red/30 to-transparent" />
      </section>

      {/* Video Modal */}
      <VideoModal
        isOpen={modalOpen}
        videoUrl={activeVideo.url}
        title={activeVideo.title}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
