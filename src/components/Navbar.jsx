import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useTheme } from './ThemeContext';

export default function Navbar() {
  const { theme } = useTheme();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-theme-bg/80 border-b border-theme-border">
      <div className="max-w-6xl mx-auto px-6 min-h-20 flex items-center justify-between gap-4">
        <Link to="/" className="text-xl font-bold tracking-tight text-theme-text flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-theme-accent text-white flex items-center justify-center text-sm font-sans">
            HK
          </span>
          <span className="hidden sm:inline">Harikrishna</span>
        </Link>

        <button type="button" className="sm:hidden p-2 rounded border border-theme-border" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="site-navigation" onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <nav id="site-navigation" aria-label="Main navigation" className={`${menuOpen ? 'flex' : 'hidden'} absolute left-0 right-0 top-full flex-col items-stretch gap-1 p-6 bg-theme-bg border-b border-theme-border sm:static sm:flex sm:flex-row sm:items-center sm:gap-4 lg:gap-8 sm:p-0 sm:border-0 text-sm font-medium text-theme-muted`}>
          <Link to="/" onClick={() => setMenuOpen(false)} aria-current={isHome ? 'page' : undefined} className={`py-2 sm:py-0 hover:text-theme-text transition-colors ${isHome ? 'text-theme-text font-semibold' : ''}`}>
            Work
          </Link>
          <Link to="/about" onClick={() => setMenuOpen(false)} aria-current={location.pathname === '/about' ? 'page' : undefined} className={`py-2 sm:py-0 hover:text-theme-text transition-colors ${location.pathname === '/about' ? 'text-theme-text font-semibold' : ''}`}>
            About & Experience
          </Link>
          <Link to="/admin" onClick={() => setMenuOpen(false)} aria-current={location.pathname === '/admin' ? 'page' : undefined} className={`py-2 sm:py-0 hover:text-theme-text transition-colors ${location.pathname === '/admin' ? 'text-theme-text font-semibold' : ''}`}>
            Admin Panel
          </Link>
          <a
            href="mailto:rajuvegeshana@gmail.com"
            className="inline-flex px-4 py-2 rounded-full border border-theme-border hover:border-theme-accent hover:text-theme-accent transition-colors"
          >
            Get in Touch
          </a>
        </nav>
      </div>
    </header>
  );
}
