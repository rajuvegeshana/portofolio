import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Download, Menu, X } from 'lucide-react';
import { getAbout } from '../lib/api';

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');
  const isHome = location.pathname === '/';

  useEffect(() => {
    let active = true;
    getAbout().then((data) => {
      if (!active) return;
      try {
        const url = new URL(data?.about?.resumeUrl);
        if (url.protocol === 'https:') setResumeUrl(url.href);
      } catch {
        setResumeUrl('');
      }
    }).catch(() => { if (active) setResumeUrl(''); });
    return () => { active = false; };
  }, []);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-theme-bg/80 border-b border-theme-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 min-h-20 flex items-center justify-between gap-3">
        <Link to="/" className="shrink-0 text-xl font-bold tracking-tight text-theme-text flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-theme-accent text-white flex items-center justify-center text-sm font-sans">
            HK
          </span>
          <span className="hidden lg:inline">Harikrishna</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <nav id="site-navigation" aria-label="Main navigation" className={`${menuOpen ? 'flex' : 'hidden'} absolute left-0 right-0 top-full flex-col items-stretch gap-1 p-6 bg-theme-bg border-b border-theme-border sm:static sm:flex sm:flex-row sm:items-center sm:gap-4 lg:gap-8 sm:p-0 sm:border-0 text-sm font-medium text-theme-muted`}>
            <Link to="/" onClick={() => setMenuOpen(false)} aria-current={isHome ? 'page' : undefined} className={`py-2 sm:py-0 hover:text-theme-text transition-colors ${isHome ? 'text-theme-text font-semibold' : ''}`}>
              Work
            </Link>
            <Link to="/about" onClick={() => setMenuOpen(false)} aria-current={location.pathname === '/about' ? 'page' : undefined} className={`py-2 sm:py-0 hover:text-theme-text transition-colors ${location.pathname === '/about' ? 'text-theme-text font-semibold' : ''}`}>
              About & Experience
            </Link>
            <a href="mailto:rajuvegeshana@gmail.com"
              className="inline-flex px-4 py-2 rounded-full border border-theme-border hover:border-theme-accent hover:text-theme-accent transition-colors">
              Get in Touch
            </a>
          </nav>
          {resumeUrl && (
            <a href={resumeUrl} download="Harikrishna-Raju-Resume.pdf" aria-label="Download résumé PDF"
              className="inline-flex shrink-0 items-center justify-center gap-1.5 min-h-10 px-3 sm:px-4 rounded-full bg-theme-accent text-white text-sm font-semibold hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme-accent">
              <Download className="w-4 h-4" aria-hidden="true" />
              <span className="sm:hidden">Résumé</span>
              <span className="hidden sm:inline">Download résumé</span>
            </a>
          )}
          <button type="button" className="sm:hidden shrink-0 p-2 rounded border border-theme-border" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="site-navigation" onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
