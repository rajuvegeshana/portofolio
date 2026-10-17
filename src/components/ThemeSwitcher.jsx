import React from 'react';
import { useTheme } from './ThemeContext';
import { Palette, Sparkles, Grid, SlidersHorizontal } from 'lucide-react';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 p-2 rounded-full shadow-lg backdrop-blur-md bg-theme-card/90 border border-theme-border">
      <span className="px-2 text-xs font-medium text-theme-muted flex items-center gap-1">
        <Palette className="w-3.5 h-3.5" />
      </span>
      <button
        onClick={() => setTheme('editorial')}
        className={`px-3 py-1.5 text-xs rounded-full transition-all ${
          theme === 'editorial'
            ? 'bg-theme-accent text-white font-medium shadow-sm'
            : 'text-theme-muted hover:text-theme-text'
        }`}
      >
        Editorial
      </button>
      <button
        onClick={() => setTheme('swiss')}
        className={`px-3 py-1.5 text-xs rounded-full transition-all ${
          theme === 'swiss'
            ? 'bg-theme-accent text-white font-medium shadow-sm'
            : 'text-theme-muted hover:text-theme-text'
        }`}
      >
        Swiss
      </button>
      <button
        onClick={() => setTheme('creative')}
        className={`px-3 py-1.5 text-xs rounded-full transition-all ${
          theme === 'creative'
            ? 'bg-theme-accent text-white font-medium shadow-sm'
            : 'text-theme-muted hover:text-theme-text'
        }`}
      >
        Creative
      </button>
    </div>
  );
}
