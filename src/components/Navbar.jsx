import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from './ThemeContext';

export default function Navbar() {
  const { theme } = useTheme();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-theme-bg/80 border-b border-theme-border">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight text-theme-text flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-theme-accent text-white flex items-center justify-center text-sm font-sans">
            HK
          </span>
          <span className="hidden sm:inline">Harikrishna</span>
        </Link>

        <nav className="flex items-center gap-8 text-sm font-medium text-theme-muted">
          <Link to="/" className={`hover:text-theme-text transition-colors ${isHome ? 'text-theme-text font-semibold' : ''}`}>
            Work
          </Link>
          <Link to="/about" className={`hover:text-theme-text transition-colors ${location.pathname === '/about' ? 'text-theme-text font-semibold' : ''}`}>
            About & Experience
          </Link>
          <Link to="/admin" className={`hover:text-theme-text transition-colors ${location.pathname === '/admin' ? 'text-theme-text font-semibold' : ''}`}>
            Admin Panel
          </Link>
          <a
            href="mailto:rajuvegeshana@gmail.com"
            className="hidden sm:inline-flex px-4 py-2 rounded-full border border-theme-border hover:border-theme-accent hover:text-theme-accent transition-colors"
          >
            Get in Touch
          </a>
        </nav>
      </div>
    </header>
  );
}
