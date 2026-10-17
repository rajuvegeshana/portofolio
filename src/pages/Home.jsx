import React from 'react';
import { Link } from 'react-router-dom';
import projectsData from '../../content/projects.json';
import aboutData from '../../content/about.json';
import { ArrowUpRight } from 'lucide-react';
import { useTheme } from '../components/ThemeContext';

export default function Home() {
  const { theme } = useTheme();
  const { hero } = aboutData;
  const publishedProjects = projectsData.filter(p => p.status === 'published');

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-20">
      {/* Hero Section */}
      <section className="mb-24">
        {theme === 'editorial' && (
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-widest text-theme-accent font-semibold mb-4">Portfolio & Selected Works</p>
            <h1 className="text-5xl md:text-7xl font-serif tracking-tight leading-none text-theme-text mb-6">
              {hero.greeting}
            </h1>
            <p className="text-xl md:text-2xl font-serif text-theme-muted leading-relaxed mb-8">
              {hero.subtitle}
            </p>
            <div className="flex gap-8 py-4 border-y border-theme-border text-sm">
              <div>
                <span className="block font-semibold text-theme-text text-lg">{hero.experienceYears}</span>
                <span className="text-theme-muted text-xs">Years Experience</span>
              </div>
              <div className="border-l border-theme-border pl-8">
                <span className="block font-semibold text-theme-text text-lg">{hero.studentsMentored}</span>
                <span className="text-theme-muted text-xs">Designers Mentored</span>
              </div>
              <div className="border-l border-theme-border pl-8">
                <span className="block font-semibold text-theme-text text-lg">Accenture / Visa</span>
                <span className="text-theme-muted text-xs">Current Client Role</span>
              </div>
            </div>
          </div>
        )}

        {theme === 'swiss' && (
          <div className="border border-theme-border p-8 bg-theme-card">
            <div className="flex justify-between items-start mb-6">
              <span className="text-xs font-mono bg-theme-accent/10 text-theme-accent px-2 py-1 rounded">SYS://PORTFOLIO_V2</span>
              <span className="text-xs font-mono text-theme-muted">HYDERABAD / REMOTE</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-display tracking-tight text-theme-text mb-4">
              {hero.title}
            </h1>
            <p className="text-lg text-theme-muted max-w-2xl mb-8 font-sans">
              {hero.subtitle}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-theme-border pt-6 font-mono text-xs">
              <div>
                <span className="text-theme-muted block">EXP_YEARS:</span>
                <span className="font-bold text-theme-text text-sm">{hero.experienceYears}</span>
              </div>
              <div>
                <span className="text-theme-muted block">MENTOR_COUNT:</span>
                <span className="font-bold text-theme-text text-sm">{hero.studentsMentored}</span>
              </div>
              <div>
                <span className="text-theme-muted block">STATUS:</span>
                <span className="font-bold text-theme-accent text-sm">ACTIVE</span>
              </div>
              <div>
                <span className="text-theme-muted block">FOCUS:</span>
                <span className="font-bold text-theme-text text-sm">SAAS & FINTECH</span>
              </div>
            </div>
          </div>
        )}

        {theme === 'creative' && (
          <div className="relative py-12">
            <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-theme-accent/20 text-theme-accent mb-6">
              Product Design Lead & Senior Designer
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-theme-text mb-6">
              Architecting <span className="text-transparent bg-clip-text bg-gradient-to-r from-theme-accent to-pink-500">scalable interfaces</span> for enterprise.
            </h1>
            <p className="text-lg text-theme-muted max-w-xl leading-relaxed">
              {hero.subtitle}
            </p>
          </div>
        )}
      </section>

      {/* Selected Case Studies */}
      <section>
        <div className="flex justify-between items-end mb-12 border-b border-theme-border pb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-theme-text">Selected Case Studies</h2>
            <p className="text-sm text-theme-muted mt-1">Enterprise SaaS, AI workflows, and Fintech products.</p>
          </div>
          <span className="text-xs font-mono text-theme-muted">{publishedProjects.length} PROJECTS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {publishedProjects.map((project) => (
            <Link
              key={project.slug}
              to={`/project/${project.slug}`}
              className="group block rounded-xl overflow-hidden border border-theme-border bg-theme-card hover:border-theme-accent transition-all duration-300"
            >
              <div className="h-64 bg-theme-border/40 relative flex items-center justify-center p-8 group-hover:scale-[1.01] transition-transform">
                <div className="text-center">
                  <span className="text-xs font-mono text-theme-muted uppercase tracking-wider block mb-2">{project.category}</span>
                  <h3 className="text-2xl font-bold text-theme-text group-hover:text-theme-accent transition-colors">{project.title}</h3>
                </div>
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-theme-card border border-theme-border flex items-center justify-center text-theme-muted group-hover:text-theme-text group-hover:border-theme-accent transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-theme-border/50 text-theme-muted">
                    {project.role}
                  </span>
                  <span className="text-xs text-theme-muted">•</span>
                  <span className="text-xs text-theme-muted">{project.year}</span>
                </div>
                <p className="text-sm text-theme-muted line-clamp-2 leading-relaxed">
                  {project.shortDescription}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
