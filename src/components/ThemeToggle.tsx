import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

type Theme = 'dark' | 'light';
const STORAGE_KEY = 'armah-theme';

function preferredTheme(): Theme {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export default function ThemeToggle(): JSX.Element {
  const [theme, setTheme] = useState<Theme>(() => preferredTheme());

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      className="theme-toggle inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-armah-red hover:text-armah-red focus:outline-none focus-visible:ring-2 focus-visible:ring-armah-red"
      aria-label={`Use ${nextTheme} theme`}
      title={`Use ${nextTheme} theme`}
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
    </button>
  );
}
