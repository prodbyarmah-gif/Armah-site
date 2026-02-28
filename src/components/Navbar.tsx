import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-black/90 backdrop-blur-md border-b border-white/5' : 'bg-black/75 backdrop-blur'
        }`}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-center gap-4 sm:gap-8 px-4 py-4">
          {/* Left Links */}
          <div className="flex items-center gap-4 sm:gap-8">
            <button 
              onClick={() => scrollToSection('live')} 
              className="text-xs sm:text-sm tracking-[0.22em] text-white/80 hover:text-armah-red transition-colors uppercase font-head"
            >
              Live
            </button>
            <button 
              onClick={() => scrollToSection('shows')} 
              className="text-xs sm:text-sm tracking-[0.22em] text-white/80 hover:text-armah-red transition-colors uppercase font-head"
            >
              Shows
            </button>
          </div>

          {/* Logo - Centered */}
          <button 
            onClick={() => scrollToSection('top')} 
            className="px-4 sm:px-8"
            aria-label="ARMAH home"
          >
            <img
              src="/assets/ARMAH_logo_transparent_white.png"
              alt="ARMAH logo"
              title="ARMAH"
              className="h-12 sm:h-16 w-auto drop-shadow-[0_0_14px_rgba(251,54,64,0.28)]"
            />
          </button>

          {/* Right Links */}
          <div className="flex items-center gap-4 sm:gap-8">
            <button 
              onClick={() => scrollToSection('producer')} 
              className="text-xs sm:text-sm tracking-[0.22em] text-white/80 hover:text-armah-red transition-colors uppercase font-head"
            >
              Producer
            </button>
            <button 
              onClick={() => scrollToSection('booking')} 
              className="text-xs sm:text-sm tracking-[0.22em] text-white/80 hover:text-armah-red transition-colors uppercase font-head"
            >
              Booking
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 right-4 z-[60] md:hidden text-white p-2"
        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[55] bg-black/98 flex flex-col items-center justify-center gap-8 md:hidden">
          <img
            src="/assets/ARMAH_logo_transparent_white.png"
            alt="ARMAH logo"
            className="h-16 w-auto mb-8"
          />
          {['Live', 'Shows', 'Producer', 'Booking'].map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item.toLowerCase())}
              className="text-white text-2xl tracking-[0.2em] uppercase hover:text-armah-red transition-colors font-head"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
