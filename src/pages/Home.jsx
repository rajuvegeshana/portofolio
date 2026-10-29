import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import projectsData from '../../content/projects.json';
import aboutData from '../../content/about.json';
import { getAbout, getProjects } from '../lib/api';
import { ArrowUpRight, Sparkles, Layers, Cpu, Lock } from 'lucide-react';
import { useTheme } from '../components/ThemeContext';
import ProjectArtwork from '../components/ProjectArtwork';

function ProjectCover({ project }) {
  if (project.coverImage && !project.locked) {
    const src = project.coverImage.startsWith('images/')
      ? `${import.meta.env.BASE_URL}${project.coverImage}`
      : project.coverImage;
    return <img src={src} alt={project.coverAlt || `${project.title} design`} className="w-full h-full object-cover object-top" loading="lazy" />;
  }
  return <ProjectArtwork slug={project.slug} locked={project.locked} decorative />;
}

export default function Home() {
  const { theme } = useTheme();
  const [aboutContent, setAboutContent] = useState(aboutData);
  const { hero } = aboutContent;
  const [projects, setProjects] = useState(projectsData);

  useEffect(() => {
    let cancelled = false;
    getProjects()
      .then((data) => {
        if (!cancelled && Array.isArray(data) && data.length) setProjects(data);
      })
      .catch(() => {});
    getAbout().then((data) => { if (!cancelled && data?.hero) setAboutContent(data); }).catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const publishedProjects = projects.filter(p => p.status === 'published');
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
              <div className="h-64 sm:h-72 relative overflow-hidden border-b border-theme-border">
                <ProjectCover project={project} />
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-theme-card border border-theme-border flex items-center justify-center text-theme-muted group-hover:text-theme-text group-hover:border-theme-accent transition-all shadow-sm">
                  <ArrowUpRight className="w-5 h-5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <div className="absolute bottom-4 left-6 text-[10px] font-mono uppercase tracking-wider bg-theme-card/95 px-2.5 py-1 rounded border border-theme-border text-theme-muted">
                  {project.coverImage && !project.locked ? 'Figma design' : 'Illustrative visual'} · {String(index + 1).padStart(2, '0')}
                </div>
              </div>

              <div className="p-8 flex flex-col flex-grow justify-between">
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-theme-accent mb-2">{project.category}</p>
                  <h3 className="text-2xl md:text-3xl font-bold text-theme-text group-hover:text-theme-accent transition-colors mb-5">{project.title}</h3>
                  <div className="flex items-center gap-3 mb-4 text-xs font-medium">
                    {project.locked && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-theme-border text-theme-muted font-mono">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )}
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
                  {(project.tags || []).map((tag) => (
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
                className="group flex flex-col rounded-xl border border-theme-border bg-theme-card overflow-hidden hover:border-theme-accent transition-colors"
              >
                <div className="h-36 sm:h-40 border-b border-theme-border relative overflow-hidden">
                  <ProjectCover project={project} />
                  <span className="absolute bottom-3 left-4 text-[10px] font-mono uppercase tracking-wider bg-theme-card/95 px-2 py-1 rounded border border-theme-border text-theme-muted">{project.coverImage && !project.locked ? 'Figma design' : 'Illustrative visual'}</span>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-theme-text group-hover:text-theme-accent transition-colors">
                      {project.title}
                    </h3>
                    <span className="text-xs font-mono text-theme-muted">
                      {project.category} · {project.year}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {project.locked && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-theme-border text-theme-muted font-mono text-xs">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )}
                    <ArrowUpRight className="w-5 h-5 text-theme-muted group-hover:text-theme-accent transition-colors shrink-0" />
                  </div>
                </div>
                <p className="text-sm text-theme-muted leading-relaxed">{project.shortDescription}</p>
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-theme-border">
                  {(project.tags || []).map((tag) => (
                    <span key={tag} className="text-xs font-mono px-2 py-0.5 rounded bg-theme-bg border border-theme-border text-theme-muted">
                      {tag}
                    </span>
                  ))}
                </div>
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
              Mentored {hero.studentsMentored} students and junior designers across UI/UX fundamentals, design systems architecture, and rapid prototyping workflows.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
