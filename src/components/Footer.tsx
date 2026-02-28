import { Instagram, Music, Mail } from 'lucide-react';
import { siteConfig } from '../data/armah';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative w-full bg-black pt-16 pb-8">
      {/* Top Border */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-armah-red/50 to-transparent" />

      <div className="w-full px-6 lg:px-12 xl:px-24">
        <div className="max-w-6xl mx-auto">
          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Brand */}
            <div className="text-center md:text-left">
              <img
                src="/assets/ARMAH_logo_transparent_white.png"
                alt="ARMAH"
                className="h-8 w-auto mx-auto md:mx-0 mb-4 object-contain"
              />
              <p className="text-white/50 text-sm tracking-wide">
                Built in rhythm. Played worldwide.
              </p>
            </div>

            {/* Navigation */}
            <div className="text-center">
              <h4 className="text-white font-head mb-4 tracking-wide uppercase">Navigation</h4>
              <ul className="space-y-2">
                {['Live', 'Shows', 'Producer', 'Booking'].map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => scrollToSection(item.toLowerCase())}
                      className="text-white/50 hover:text-armah-red text-sm transition-colors duration-200"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div className="text-center md:text-right">
              <h4 className="text-white font-head mb-4 tracking-wide uppercase">Connect</h4>
              <div className="flex items-center justify-center md:justify-end gap-4">
                <a
                  href={siteConfig.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-armah-red/20 flex items-center justify-center text-white/60 hover:text-armah-red transition-all duration-200"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://open.spotify.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-armah-red/20 flex items-center justify-center text-white/60 hover:text-armah-red transition-all duration-200"
                  aria-label="Spotify"
                >
                  <Music className="w-5 h-5" />
                </a>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-armah-red/20 flex items-center justify-center text-white/60 hover:text-armah-red transition-all duration-200"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-white/10 mb-8" />

          {/* Legal & Copyright */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <a
                href="/legal/impressum.html"
                className="text-white/40 hover:text-armah-red text-sm transition-colors duration-200"
              >
                Impressum
              </a>
              <a
                href="/legal/datenschutz.html"
                className="text-white/40 hover:text-armah-red text-sm transition-colors duration-200"
              >
                Datenschutz
              </a>
            </div>
            <p className="text-white/30 text-sm">
              &copy; {currentYear} ARMAH. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
