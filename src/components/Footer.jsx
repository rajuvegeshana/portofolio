import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-theme-border py-12 mt-20 text-theme-muted text-sm">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <p className="font-medium text-theme-text">Harikrishna — Senior Product Designer & Lead</p>
          <p className="text-xs mt-1">Specializing in SaaS, Fintech, and Design Systems.</p>
        </div>
        <div className="flex items-center gap-6">
          <a href="https://www.linkedin.com/in/harikrishnam-raju/" target="_blank" rel="noopener noreferrer" className="hover:text-theme-text transition-colors">
            LinkedIn
          </a>
          <a href="https://dribbble.com/Designer_Kid" target="_blank" rel="noopener noreferrer" className="hover:text-theme-text transition-colors">
            Dribbble
          </a>
          <a href="https://medium.com/@rajuvegeshana" target="_blank" rel="noopener noreferrer" className="hover:text-theme-text transition-colors">
            Medium
          </a>
          <a href="mailto:rajuvegeshana@gmail.com" className="hover:text-theme-text transition-colors">
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
