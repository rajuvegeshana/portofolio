import React from 'react';
import { useParams, Link } from 'react-router-dom';
import projectsData from '../../content/projects.json';
import { ArrowLeft, ArrowRight, Target, AlertTriangle, CheckCircle2, Lightbulb, Quote, ListChecks, Layers, Compass } from 'lucide-react';

function Section({ icon: Icon, title, children }) {
  return (
    <section className="pt-10 border-t border-theme-border">
      <h2 className="text-xl md:text-2xl font-bold text-theme-text mb-4 flex items-center gap-2.5">
        <Icon className="w-5 h-5 text-theme-accent shrink-0" />
        {title}
      </h2>
      <div className="text-theme-muted leading-relaxed">{children}</div>
    </section>
  );
}

export default function CaseStudy() {
  const { slug } = useParams();
  const idx = projectsData.findIndex(p => p.slug === slug);
  const project = projectsData[idx];

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4 text-theme-text">Project Not Found</h1>
        <p className="text-theme-muted mb-8">The case study you are looking for does not exist or has been removed.</p>
        <Link to="/" className="px-6 py-3 bg-theme-accent text-white rounded-full text-sm font-medium">
          Return Home
        </Link>
      </div>
    );
  }

  const published = projectsData.filter(p => p.status === 'published');
  const next = published[(idx + 1) % published.length];

  const meta = [
    { label: 'Role', value: project.role },
    { label: 'Client', value: project.client || project.title },
    { label: 'Year', value: project.year },
  ].filter(m => m.value);

  return (
    <article className="max-w-6xl mx-auto px-6 py-12 md:py-20">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-theme-muted hover:text-theme-text mb-10 transition-colors">
        <ArrowLeft className="w-4 h-4" /> All projects
      </Link>

      <header className="mb-14">
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <span className="px-3 py-1 text-xs font-mono rounded-full bg-theme-accent/10 text-theme-accent">
            {project.category}
          </span>
          <span className="text-sm text-theme-muted font-mono">{project.year}</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-theme-text mb-6">
          {project.title}
        </h1>
        <p className="text-xl text-theme-muted leading-relaxed max-w-3xl">
          {project.shortDescription}
        </p>
      </header>

      <div className="grid lg:grid-cols-[13rem_minmax(0,1fr)] gap-10 lg:gap-16">
        <aside className="lg:sticky lg:top-10 lg:self-start">
          <dl className="grid grid-cols-2 lg:grid-cols-1 gap-6 p-6 rounded-xl bg-theme-card border border-theme-border">
            {meta.map(m => (
              <div key={m.label}>
                <dt className="text-theme-muted text-xs uppercase font-mono tracking-wider mb-1">{m.label}</dt>
                <dd className="font-semibold text-theme-text text-sm leading-snug">{m.value}</dd>
              </div>
            ))}
          </dl>
        </aside>

        <div className="space-y-10 min-w-0">
          <Section icon={Target} title="Overview">
            <p className="text-lg">{project.overview}</p>
          </Section>

          <Section icon={AlertTriangle} title="The problem">
            <p>{project.problem}</p>
          </Section>

          <Section icon={Layers} title="What I designed">
            <p>{project.solution}</p>
          </Section>

          {project.contributions && (
            <Section icon={ListChecks} title="My role">
              <ul className="space-y-2.5">
                {project.contributions.map((c, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-theme-accent font-mono text-sm shrink-0 pt-0.5">{String(i + 1).padStart(2, '0')}</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {project.decisions && (
            <Section icon={Lightbulb} title="Key design decisions">
              <div className="space-y-6">
                {project.decisions.map((d, i) => (
                  <div key={i} className="pl-5 border-l-2 border-theme-accent/40">
                    <h3 className="font-semibold text-theme-text mb-1.5">{d.title}</h3>
                    <p className="text-sm leading-relaxed">{d.body}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          <Section icon={CheckCircle2} title="Outcome">
            <p>{project.impact}</p>
            {project.outcomes && (
              <ul className="mt-6 space-y-2.5">
                {project.outcomes.map((o, i) => (
                  <li key={i} className="flex gap-3">
                    <CheckCircle2 className="w-4 h-4 text-theme-accent shrink-0 mt-1" />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          {project.systemsWork && (
            <Section icon={Compass} title="Systems thinking">
              <p>{project.systemsWork}</p>
            </Section>
          )}

          {project.explainShort && (
            <section className="pt-10 border-t border-theme-border">
              <h2 className="text-xl md:text-2xl font-bold text-theme-text mb-4 flex items-center gap-2.5">
                <Quote className="w-5 h-5 text-theme-accent shrink-0" />
                How I explain this
              </h2>
              <blockquote className="p-6 rounded-xl bg-theme-card border border-theme-border border-l-4 border-l-theme-accent text-theme-muted leading-relaxed">
                {project.explainShort}
              </blockquote>
            </section>
          )}

          <div className="pt-10 border-t border-theme-border flex flex-wrap gap-2">
            {project.tags.map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full text-xs font-mono bg-theme-card border border-theme-border text-theme-muted">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {next && next.slug !== project.slug && (
        <Link
          to={`/project/${next.slug}`}
          className="group mt-16 flex items-center justify-between gap-6 p-8 rounded-2xl border border-theme-border bg-theme-card hover:border-theme-accent transition-colors"
        >
          <div className="min-w-0">
            <span className="text-xs uppercase tracking-widest text-theme-muted font-semibold">Next case study</span>
            <h3 className="text-2xl font-bold text-theme-text group-hover:text-theme-accent transition-colors mt-1 truncate">
              {next.title}
            </h3>
          </div>
          <ArrowRight className="w-6 h-6 text-theme-accent shrink-0 group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
    </article>
  );
}
