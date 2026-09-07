'use client';

import { Check, Moon, Palette, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

const themes = [
  { id: 'rose', label: 'Rose', swatch: '#f34364' },
  { id: 'ocean', label: 'Ocean', swatch: '#168aad' },
  { id: 'emerald', label: 'Emerald', swatch: '#0f9f79' },
  { id: 'amber', label: 'Amber', swatch: '#d97706' },
  { id: 'violet', label: 'Violet', swatch: '#7c5ce5' },
] as const;

type ThemeId = (typeof themes)[number]['id'];

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [theme, setTheme] = useState<ThemeId>('rose');
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const savedMode = window.localStorage.getItem('campusconnect-theme');
    const savedTheme = window.localStorage.getItem('campusconnect-color') as ThemeId | null;
    const next = savedMode === 'dark' || (!savedMode && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const nextTheme = themes.some((item) => item.id === savedTheme) ? savedTheme as ThemeId : 'rose';
    document.documentElement.classList.toggle('dark', next);
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = next ? 'dark' : 'light';
    setDark(next);
    setTheme(nextTheme);
  }, []);

  const toggleMode = () => {
    const next = !dark;
    document.documentElement.classList.toggle('dark', next);
    document.documentElement.style.colorScheme = next ? 'dark' : 'light';
    window.localStorage.setItem('campusconnect-theme', next ? 'dark' : 'light');
    setDark(next);
  };

  const selectTheme = (nextTheme: ThemeId) => {
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem('campusconnect-color', nextTheme);
    setTheme(nextTheme);
    setPaletteOpen(false);
  };

  return (
    <div className="relative flex items-center rounded-xl border bg-card text-muted-foreground">
      <button
        type="button"
        onClick={toggleMode}
        title={dark ? 'Use light mode' : 'Use dark mode'}
        aria-label={dark ? 'Use light mode' : 'Use dark mode'}
        className="rounded-l-xl p-2 transition hover:text-foreground"
      >
        {dark ? <Sun size={17} /> : <Moon size={17} />}
      </button>
      <button
        type="button"
        onClick={() => setPaletteOpen((open) => !open)}
        title="Choose interface colour"
        aria-label="Choose interface colour"
        aria-expanded={paletteOpen}
        className="rounded-r-xl border-l p-2 transition hover:text-foreground"
      >
        <Palette size={17} />
      </button>
      {paletteOpen && (
        <div className="app-popover absolute left-0 top-12 z-50 w-44 rounded-2xl border bg-card p-2 shadow-card">
          <p className="px-2 py-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">Interface colour</p>
          {themes.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => selectTheme(item.id)}
              className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-sm transition hover:bg-muted"
            >
              <span className="h-4 w-4 rounded-full" style={{ backgroundColor: item.swatch }} />
              <span className="flex-1">{item.label}</span>
              {theme === item.id && <Check size={15} className="text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
