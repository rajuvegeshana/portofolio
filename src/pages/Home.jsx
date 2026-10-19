import React from 'react';
import { Link } from 'react-router-dom';
import projectsData from '../../content/projects.json';
import aboutData from '../../content/about.json';
import { ArrowUpRight, Sparkles, Layers, Cpu } from 'lucide-react';
import { useTheme } from '../components/ThemeContext';

export default function Home() {
  const { theme } = useTheme();
  const { hero } = aboutData;
  const publishedProjects = projectsData.filter(p => p.status === 'published');
  const featuredProjects = publishedProjects.filter(p => p.isFeatured);
  const supportingProjects = publishedProjects.filter(p => !p.isFeatured);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
      {/* Hero Section */}
      <section className="mb-28">
        {theme === 'editorial' && (
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-theme-border text-xs tracking-wider uppercase mb-6 text-theme-accent bg-theme-card">
              <Sparkles className="w-3.5 h-3.5" /> Senior Product Design Lead
            </div>
            <h1 className="text-5xl md:text-7xl font-serif tracking-tight leading-[1.08] text-theme-text mb-6">
              {hero.greeting}, crafting thoughtful enterprise systems & digital experiences.
            </h1>
            <p className="text-xl md:text-2xl font-serif text-theme-muted leading-relaxed mb-10">
              {hero.subtitle}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-y border-theme-border text-sm">
              <div className="flex flex-col">
                <span className="font-serif text-3xl font-normal text-theme-text">{hero.experienceYears}</span>
                <span className="text-theme-muted text-xs uppercase tracking-wider mt-1">Years Experience</span>
              </div>
              <div className="flex flex-col sm:border-l sm:border-theme-border sm:pl-6">
                <span className="font-serif text-3xl font-normal text-theme-text">{hero.studentsMentored}</span>
                <span className="text-theme-muted text-xs uppercase tracking-wider mt-1">Students Mentored</span>
              </div>
              <div className="flex flex-col sm:border-l sm:border-theme-border sm:pl-6">
                <span className="font-serif text-3xl font-normal text-theme-text">Accenture</span>
                <span className="text-theme-muted text-xs uppercase tracking-wider mt-1">Current Role (Visa)</span>
              </div>
            </div>
          </div>
        )}

        {theme === 'swiss' && (
          <div className="border-2 border-theme-border p-8 md:p-12 bg-theme-card shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-theme-border">
              <span className="text-xs font-mono bg-theme-accent text-white px-3 py-1 rounded font-bold uppercase tracking-widest">
                SYS_ID // PORTFOLIO_V2.6
              </span>
              <span className="text-xs font-mono text-theme-muted">
                LOC: HYDERABAD / BENGALURU / REMOTE
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-sans tracking-tight text-theme-text mb-6 uppercase">
              {hero.title}
            </h1>
            <p className="text-lg md:text-xl text-theme-muted max-w-3xl mb-10 font-sans leading-relaxed">
              {hero.subtitle}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-theme-border font-mono text-xs">
              <div className="p-4 bg-theme-bg border border-theme-border">
                <span className="text-theme-muted block mb-1">EXPERIENCE</span>
                <span className="font-bold text-theme-text text-base">{hero.experienceYears}</span>
              </div>
              <div className="p-4 bg-theme-bg border border-theme-border">
                <span className="text-theme-muted block mb-1">MENTORSHIP</span>
                <span className="font-bold text-theme-text text-base">{hero.studentsMentored}</span>
              </div>
              <div className="p-4 bg-theme-bg border border-theme-border">
                <span className="text-theme-muted block mb-1">CLIENT ASSIGNMENT</span>
                <span className="font-bold text-theme-accent text-base">VISA</span>
              </div>
              <div className="p-4 bg-theme-bg border border-theme-border">
                <span className="text-theme-muted block mb-1">SYSTEM STATUS</span>
                <span className="font-bold text-theme-text text-base">ONLINE</span>
              </div>
            </div>
          </div>
        )}

        {theme === 'creative' && (
          <div className="relative py-8">
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-theme-accent/10 rounded-full blur-3xl pointer-events-none" />
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-theme-accent/20 text-theme-accent mb-6 border border-theme-accent/30">
              <Cpu className="w-3.5 h-3.5" /> Lead Product Designer & Systems Architect
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-theme-text mb-6 leading-tight">
              Crafting <span className="text-transparent bg-clip-text bg-gradient-to-r from-theme-accent via-indigo-400 to-pink-500">immersive SaaS & fintech</span> architectures.
            </h1>
            <p className="text-xl text-theme-muted max-w-2xl leading-relaxed mb-8">
              {hero.subtitle}
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-mono text-theme-muted">
              <span className="px-3 py-1.5 rounded bg-theme-card border border-theme-border text-theme-text">AI Workflows</span>
              <span className="px-3 py-1.5 rounded bg-theme-card border border-theme-border text-theme-text">Design Systems</span>
              <span className="px-3 py-1.5 rounded bg-theme-card border border-theme-border text-theme-text">Enterprise B2B</span>
              <span className="px-3 py-1.5 rounded bg-theme-card border border-theme-border text-theme-text">Fintech UX</span>
            </div>
          </div>
        )}
      </section>

      {/* Selected Case Studies */}
      <section>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-theme-border pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-theme-accent font-semibold mb-2">
              <Layers className="w-4 h-4" /> Portfolio Showcase
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-theme-text tracking-tight">Selected Case Studies</h2>
          </div>
          <p className="text-sm text-theme-muted max-w-md">
            End-to-end product design case studies covering complex problem solving, systems thinking, and the decisions behind each screen.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
          {featuredProjects.map((project, index) => (
            <Link
              key={project.slug}
              to={`/project/${project.slug}`}
              className="group flex flex-col rounded-2xl overflow-hidden border border-theme-border bg-theme-card hover:border-theme-accent transition-all duration-300 shadow-sm hover:shadow-xl"
            >
              <div className="h-72 bg-gradient-to-br from-theme-border/20 to-theme-border/60 relative flex items-center justify-center p-8 overflow-hidden">
                <div className="absolute inset-0 bg-theme-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="text-center relative z-10 transform group-hover:-translate-y-1 transition-transform duration-300">
                  <span className="text-xs font-mono text-theme-accent uppercase tracking-widest block mb-3 font-semibold px-3 py-1 rounded-full bg-theme-card/80 border border-theme-border inline-block">
                    {project.category}
                  </span>
                  <h3 className="text-3xl font-bold text-theme-text group-hover:text-theme-accent transition-colors">
                    {project.title}
                  </h3>
                </div>
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-theme-card border border-theme-border flex items-center justify-center text-theme-muted group-hover:text-theme-text group-hover:border-theme-accent transition-all shadow-sm">
                  <ArrowUpRight className="w-5 h-5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <div className="absolute bottom-4 left-6 text-xs font-mono text-theme-muted">
                  CASE STUDY #{index + 1}
                </div>
              </div>

              <div className="p-8 flex flex-col flex-grow justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4 text-xs font-medium">
                    <span className="px-2.5 py-1 rounded-md bg-theme-border/40 text-theme-text">
                      {project.role}
                    </span>
                    <span className="text-theme-muted">•</span>
                    <span className="text-theme-muted font-mono">{project.year}</span>
                  </div>
                  <p className="text-base text-theme-muted leading-relaxed mb-6">
                    {project.shortDescription}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-theme-border">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-xs font-mono px-2.5 py-1 rounded bg-theme-bg border border-theme-border text-theme-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Supporting Work */}
      {supportingProjects.length > 0 && (
        <section className="mt-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-theme-border pb-5 gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-theme-muted font-semibold mb-2">
                <Layers className="w-4 h-4" /> Supporting Work
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-theme-text tracking-tight">Also in the portfolio</h2>
            </div>
            <p className="text-sm text-theme-muted max-w-md">
              Projects I have worked on that are not yet written up as full case studies. Where a detail still needs
              verifying, I say so on the page rather than filling the gap.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {supportingProjects.map((project) => (
              <Link
                key={project.slug}
                to={`/project/${project.slug}`}
                className="group flex flex-col rounded-xl border border-theme-border bg-theme-card p-6 hover:border-theme-accent transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-theme-text group-hover:text-theme-accent transition-colors">
                      {project.title}
                    </h3>
                    <span className="text-xs font-mono text-theme-muted">
                      {project.category} · {project.year}
                    </span>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-theme-muted group-hover:text-theme-accent transition-colors shrink-0" />
                </div>
                <p className="text-sm text-theme-muted leading-relaxed">{project.shortDescription}</p>
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-theme-border">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-xs font-mono px-2 py-0.5 rounded bg-theme-bg border border-theme-border text-theme-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Experience & Credibility Section */}
      <section className="mt-28 pt-16 border-t border-theme-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-xl bg-theme-card border border-theme-border">
            <h3 className="text-lg font-bold text-theme-text mb-2">Enterprise Scale</h3>
            <p className="text-sm text-theme-muted leading-relaxed">
              Currently leading design initiatives for global payment infrastructure at Accenture for Visa, ensuring rigorous accessibility and scale.
            </p>
          </div>
          <div className="p-8 rounded-xl bg-theme-card border border-theme-border">
            <h3 className="text-lg font-bold text-theme-text mb-2">Design Systems</h3>
            <p className="text-sm text-theme-muted leading-relaxed">
              Building robust 0-to-1 design systems in Figma that bridge engineering constraints and deliver consistent cross-platform UX.
            </p>
          </div>
          <div className="p-8 rounded-xl bg-theme-card border border-theme-border">
            <h3 className="text-lg font-bold text-theme-text mb-2">Mentorship</h3>
            <p className="text-sm text-theme-muted leading-relaxed">
              Mentored 20+ students and junior designers across UI/UX fundamentals, design systems architecture, and rapid prototyping workflows.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
