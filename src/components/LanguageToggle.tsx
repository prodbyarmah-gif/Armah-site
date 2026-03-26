import { LANGS, type Lang, useI18n } from "../i18n";

const FLAGS: Record<Lang, string> = {
  en: "🇬🇧",
  de: "🇩🇪",
  fr: "🇫🇷",
  pt: "🇵🇹",
  es: "🇪🇸",
};

export default function LanguageToggle() {
  const { lang, setLang } = useI18n();

  return (
    <div className="flex items-center gap-2">
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value as Lang)}
        className="bg-black/40 backdrop-blur border border-white/15 rounded-md px-2 py-1 text-xs text-white/90 outline-none focus:border-armah-red/60"
        aria-label="Language"
      >
        {LANGS.map((l) => (
          <option key={l} value={l} className="text-black">
            {FLAGS[l]} {l.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}