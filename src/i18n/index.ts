import { useEffect, useMemo, useState } from "react";

import en from "./en";
import de from "./de";
import fr from "./fr";
import pt from "./pt";
import es from "./es";

export const LANGS = ["en", "de", "fr", "pt", "es"] as const;
export type Lang = (typeof LANGS)[number];

const STORAGE_KEY = "armah_lang";

function applyLangToDocument(lang: Lang) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("lang", lang);
  document.documentElement.setAttribute("data-lang", lang);
}

// ✅ recursive dict (allows nav: { live: ... }, hero: { ... }, etc.)
export type Dict = { readonly [k: string]: string | Dict };

const DICTS: Record<Lang, Dict> = {
  en: en as unknown as Dict,
  de: de as unknown as Dict,
  fr: fr as unknown as Dict,
  pt: pt as unknown as Dict,
  es: es as unknown as Dict,
};

function normalizeLang(input: string | null | undefined): Lang {
  if (!input) return "en";
  const lower = input.toLowerCase();
  const base = lower.split("-")[0];
  if ((LANGS as readonly string[]).includes(base)) return base as Lang;
  if ((LANGS as readonly string[]).includes(lower)) return lower as Lang;
  return "en";
}

function detectBrowserLang(): Lang {
  return normalizeLang(typeof navigator !== "undefined" ? navigator.language : "en");
}

export function getLang(): Lang {
  try {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (stored) return normalizeLang(stored);
  } catch {}
  return detectBrowserLang();
}

export function setAppLang(lang: Lang): void {
  const safe = normalizeLang(lang);
  applyLangToDocument(safe);
  try {
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, safe);
  } catch {}
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("armah:i18n", { detail: { lang: safe } }));
  }
}

function getByPath(obj: unknown, path: string): string | undefined {
  if (!obj || typeof obj !== "object") return undefined;
  const parts = path.split(".");
  let cur: unknown = obj;

  for (const p of parts) {
    if (!cur || typeof cur !== "object") return undefined;
    cur = (cur as Dict)[p];
  }

  return typeof cur === "string" ? cur : undefined;
}

export function t(key: string, lang?: Lang): string {
  const l = lang ?? getLang();
  const dict = DICTS[l] ?? DICTS.en;

  const direct = (dict as Dict)[key];
  if (typeof direct === "string") return direct;

  const byPath = getByPath(dict, key);
  if (byPath) return byPath;

  const enDict = DICTS.en;
  const enDirect = (enDict as Dict)[key];
  if (typeof enDirect === "string") return enDirect;
  const enByPath = getByPath(enDict, key);
  if (enByPath) return enByPath;

  return key;
}

export function useI18n() {
  const [lang, setLangState] = useState<Lang>(() => getLang());

  useEffect(() => {
    applyLangToDocument(lang);
  }, [lang]);

  useEffect(() => {
    const onEvt = (e: Event) => {
      const ce = e as CustomEvent<{ lang?: string }>;
      setLangState(normalizeLang(ce.detail?.lang));
    };
    window.addEventListener("armah:i18n", onEvt);
    return () => window.removeEventListener("armah:i18n", onEvt);
  }, []);

  return useMemo(
    () => ({
      lang,
      setLang: (l: Lang) => setAppLang(l),
      t: (k: string) => t(k, lang),
    }),
    [lang]
  );
}