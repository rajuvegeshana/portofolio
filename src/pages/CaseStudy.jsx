import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import projectsData from '../../content/projects.json';
import { getProject, unlock } from '../lib/api';
import { ArrowLeft, ArrowRight, Target, AlertTriangle, CheckCircle2, Lightbulb, Quote, ListChecks, Layers, Compass, Lock, KeyRound, Route, Gauge, CircleHelp, Images, Users, Blocks } from 'lucide-react';
import { CaseVisual } from '../components/CaseVisuals';

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

function KeyGate({ project, onUnlocked }) {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await unlock(key);
      onUnlocked();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-20 md:py-28">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-theme-muted hover:text-theme-text mb-10 transition-colors">
        <ArrowLeft className="w-4 h-4" /> All projects
      </Link>

      <div className="w-14 h-14 rounded-2xl bg-theme-accent/10 flex items-center justify-center mb-6">
        <Lock className="w-6 h-6 text-theme-accent" />
      </div>

      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-theme-text mb-4">
        {project?.title || 'Protected case study'}
      </h1>
      <p className="text-theme-muted leading-relaxed mb-8">
        {project?.shortDescription || 'This case study is only shared with a key.'}
      </p>

      <form onSubmit={handleSubmit} className="bg-theme-card border border-theme-border rounded-xl p-6 space-y-4">
        <label htmlFor="case-access-key" className="block text-xs font-mono uppercase tracking-wider text-theme-muted">
          Access key
        </label>
        <input
          id="case-access-key"
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          autoFocus
          placeholder="Enter the key"
          className="w-full bg-theme-bg border border-theme-border rounded-lg px-4 py-3 text-theme-text focus:border-theme-accent outline-none"
        />
        {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={busy || !key}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-theme-accent text-white rounded-full text-sm font-medium disabled:opacity-60 transition-opacity"
        >
          <KeyRound className="w-4 h-4" />
          {busy ? 'Checking…' : 'Unlock case study'}
        </button>
        <p className="text-xs text-theme-muted leading-relaxed">
          The key is set in the admin dashboard. It unlocks every protected case study on this site.
        </p>
      </form>
    </div>
  );
}

export default function CaseStudy() {
  const { slug } = useParams();
  const [state, setState] = useState('loading');
  const [project, setProject] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const staticEntry = projectsData.find((p) => p.slug === slug);
    setState('loading');

    getProject(slug)
      .then((data) => {
        if (cancelled) return;
        setProject(data);
        setState('ready');
      })
      .catch((err) => {
        if (cancelled) return;
        if (err.status === 401 && err.data?.locked) {
          setProject(err.data.stub || staticEntry);
          setState('locked');
          return;
        }
        if (err.status === 404) {
          if (staticEntry && !staticEntry.locked) {
            setProject(staticEntry);
            setState('ready');
          } else {
            setState(err.data?.locked ? 'unavailable' : 'notfound');
          }
          return;
        }
        // The content server is unreachable: fall back to what shipped in the bundle.
        if (staticEntry && !staticEntry.locked) {
          setProject(staticEntry);
          setState('ready');
        } else {
          setState('unavailable');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (state === 'loading') {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center text-theme-muted text-sm font-mono">
        Loading case study…
      </div>
    );
  }

  if (state === 'notfound') {
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

  if (state === 'locked') {
    return (
      <KeyGate
        project={project}
        onUnlocked={async () => {
          const data = await getProject(slug);
          setProject(data);
          setState('ready');
        }}
      />
    );
  }

  if (state === 'unavailable') {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="w-14 h-14 rounded-2xl bg-theme-accent/10 flex items-center justify-center mx-auto mb-6">
          <Lock className="w-6 h-6 text-theme-accent" />
        </div>
        <h1 className="text-3xl font-bold mb-4 text-theme-text">Protected case study</h1>
        <p className="text-theme-muted mb-8 leading-relaxed">
          This case study is only shared through the content server, and it could not be reached from here. If you
          have the key, try again once the server is reachable.
        </p>
        <Link to="/" className="px-6 py-3 bg-theme-accent text-white rounded-full text-sm font-medium">
          Return Home
        </Link>
      </div>
    );
  }

  const published = projectsData.filter(p => p.status === 'published');
  const publishedIdx = published.findIndex(p => p.slug === slug);
  const next = publishedIdx >= 0 ? published[(publishedIdx + 1) % published.length] : null;

  const meta = [
    { label: 'Role', value: project.role },
    { label: 'Client', value: project.client || project.title },
    { label: 'Year', value: project.year },
    { label: 'Project timeline', value: project.projectTimeline },
    { label: 'Team size', value: project.teamSize },
    { label: project.designContributionEstimate ? 'Share of design work (estimate)' : 'Share of design work', value: project.designContributionPercent !== undefined && project.designContributionPercent !== null && project.designContributionPercent !== '' ? `${project.designContributionPercent}%` : null, detail: project.designContributionBasis },
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
          {project.locked && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-full border border-theme-border text-theme-muted">
              <Lock className="w-3 h-3" /> Protected
            </span>
          )}
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
                {m.detail && <dd className="text-xs text-theme-muted mt-1 leading-snug">{m.detail}</dd>}
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

          {(project.designApproach || project.designSystem) && (
            <Section icon={Compass} title="Design approach">
              {project.designApproach && <p>{project.designApproach}</p>}
              {project.designSystem && (
                <div className="mt-5">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-theme-text mb-2"><Blocks className="w-4 h-4 text-theme-accent" /> Design system</h3>
                  <p>{project.designSystem}</p>
                </div>
              )}
            </Section>
          )}

          {(project.teamComposition || project.developerCollaboration || project.stakeholderCollaboration) && (
            <Section icon={Users} title="Team and collaboration">
              <div className="space-y-5">
                {project.teamComposition && <p><strong className="text-theme-text">Team:</strong> {project.teamComposition}</p>}
                {project.developerCollaboration && <p><strong className="text-theme-text">With developers:</strong> {project.developerCollaboration}</p>}
                {project.stakeholderCollaboration && <p><strong className="text-theme-text">With stakeholders:</strong> {project.stakeholderCollaboration}</p>}
              </div>
            </Section>
          )}

          {project.visuals && project.visuals.length > 0 && (
            <Section icon={Images} title={project.visualsTitle || 'The work, drawn'}>
              <div className="space-y-10">
                {project.visuals.map((v, i) => (
                  <figure key={v.id || v.src || i} className="space-y-3">
                    <CaseVisual visual={v} />
                    <figcaption className="text-sm leading-relaxed text-theme-muted flex flex-wrap items-baseline gap-x-2">
                      {v.label && (
                        <span className="text-xs font-mono uppercase tracking-widest text-theme-accent shrink-0">{v.label}</span>
                      )}
                      <span>{v.caption}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </Section>
          )}

          {(project.contributions?.length || project.roleScope) && (
            <Section icon={ListChecks} title="My role">
              {project.roleScope && <p className="mb-5">{project.roleScope}</p>}
              {project.contributions?.length > 0 && <ul className="space-y-2.5">
                {project.contributions.map((c, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-theme-accent font-mono text-sm shrink-0 pt-0.5">{String(i + 1).padStart(2, '0')}</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>}
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

          {project.roadmap && (
            <Section icon={Route} title="Roadmap">
              <div className="space-y-5">
                {project.roadmap.map((r, i) => (
                  <div key={i} className="pl-5 border-l-2 border-theme-accent/40">
                    <h3 className="font-semibold text-theme-text mb-1">{r.phase}</h3>
                    <p className="text-sm leading-relaxed">{r.focus}</p>
                    <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-xs font-mono text-theme-muted">
                      {r.duration && <span>{r.duration}</span>}
                      {r.status && <span>Status: {r.status}</span>}
                    </div>
                    {r.exitGate && (
                      <p className="text-xs leading-relaxed mt-2 text-theme-muted">
                        <span className="font-semibold text-theme-accent">Exit gate:</span> {r.exitGate}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {project.metrics && (
            <Section icon={Gauge} title="How success is measured">
              <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
                {project.metrics.map((m, i) => (
                  <div key={i}>
                    <dt className="text-sm font-semibold text-theme-text">{m.name}</dt>
                    <dd className="text-sm leading-relaxed">{m.measures}</dd>
                  </div>
                ))}
              </dl>
            </Section>
          )}

          {project.openQuestions && (
            <Section icon={CircleHelp} title="Decisions still open">
              <div className="space-y-4">
                {project.openQuestions.map((q, i) => (
                  <div key={i}>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-theme-text">{q.area}</span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-theme-accent/10 text-theme-accent">
                        {q.priority}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">{q.question}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

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
            {(project.tags || []).map(tag => (
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
