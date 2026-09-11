import { useI18n } from "../i18n";
import { Instagram, Youtube, Mail } from 'lucide-react';
import { siteConfig } from '../data/armah';
import { bookingResources } from '../data/bookingResources';
import { NAV_LINKS } from '../lib/navigation';

export default function Footer() {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();


  return (
    <footer className="theme-footer relative w-full bg-black pt-16 pb-8">
      {/* Top Border */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-armah-red/50 to-transparent" />

      <div className="w-full px-6 lg:px-12 xl:px-24">
        <div className="max-w-6xl mx-auto">
          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Brand */}
            <div className="text-center md:text-left">
              <img
                src="/assets/ARMAH_logo_trimmed.png"
                alt="ARMAH"
                className="h-10 w-auto mx-auto md:mx-0 mb-4 object-contain"
              />
              <p className="text-white/50 text-sm tracking-wide">
               {t("footer.tagline")}
              </p>
            </div>

            {/* Navigation */}
            <div className="text-center">
              <h4 className="text-white font-head mb-4 tracking-wide uppercase">{t("footer.navigation")}</h4>
              <ul className="space-y-2">
                {NAV_LINKS.map((item) => (
                  <li key={item.key}>
                    <a
                      href={item.href}
                      className="text-white/50 hover:text-armah-red text-sm transition-colors duration-200"
                    >
                      {t(`nav.${item.key}`)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div className="text-center md:text-right">
              <h4 className="text-white font-head mb-4 tracking-wide uppercase">{t("footer.connect")}</h4>
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
                  href="https://www.youtube.com/@Prodbyarmah"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-armah-red/20 flex items-center justify-center text-white/60 hover:text-armah-red transition-all duration-200"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5" />
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

          <nav aria-label={t('accessibility.resources')} className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 border-t border-white/10 pt-6">
            {bookingResources.map(resource => <a key={resource.id} href={resource.href} className="inline-flex min-h-11 items-center text-sm text-white/70 hover:text-white">{t(resource.labelKey)}</a>)}
          </nav>
          {/* Divider */}
          <div className="w-full h-px bg-white/10 mb-8" />

          {/* Legal & Copyright */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <a
                href="/legal/impressum.html"
                className="text-white/65 hover:text-armah-red text-sm transition-colors duration-200"
              >
                {t("legal.impressum")}
              </a>
              <a
                href="/legal/datenschutz.html"
                className="text-white/65 hover:text-armah-red text-sm transition-colors duration-200"
              >
                {t("legal.privacy")}
              </a>
            </div>
            <p className="text-white/65 text-sm">
             &copy; {currentYear} ARMAH. {t("footer.rights")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
