'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem('campusconnect-theme');
    const next = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', next);
    setDark(next);
  }, []);

  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle('dark', next);
    window.localStorage.setItem('campusconnect-theme', next ? 'dark' : 'light');
    setDark(next);
  };

  return <button type="button" onClick={toggle} title={dark ? 'Use light theme' : 'Use dark theme'} className="rounded-xl border bg-card p-2 text-muted-foreground hover:text-foreground">{dark ? <Sun size={17} /> : <Moon size={17} />}</button>;
}
