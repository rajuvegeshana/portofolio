import React from 'react';
import { ArrowDown, ArrowRight, CircleHelp, GitBranch, Layers3, Search, Waypoints } from 'lucide-react';

function Stage({ number, title, children, accent = false }) {
  return (
    <section className={`rounded-2xl border p-5 sm:p-7 ${accent ? 'border-theme-accent/40 bg-theme-accent/5' : 'border-theme-border bg-theme-card'}`}>
      <h3 className="mb-5 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-theme-accent">
        <span className="rounded-full border border-theme-accent/50 px-2 py-0.5">{number}</span>{title}
      </h3>
      {children}
    </section>
  );
}

function Connector() {
  return <div className="flex justify-center py-3 text-theme-accent/70" aria-hidden="true"><ArrowDown className="h-5 w-5" /></div>;
}

function ConceptMap({ story }) {
  const nodes = Array.isArray(story.conceptNodes) ? story.conceptNodes : [];
  if (story.conceptVariant === 'hub') {
    return (
      <div className="rounded-xl border border-theme-border bg-theme-bg p-4 sm:p-5">
        <div className="mx-auto max-w-sm rounded-xl border border-theme-accent bg-theme-accent/10 p-4 text-center text-sm font-semibold text-theme-text">{story.conceptCenter}</div>
        <div className="mx-auto h-6 w-px bg-theme-accent/50" aria-hidden="true" />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {nodes.map((node) => <div key={node} className="rounded-lg border border-theme-border bg-theme-card px-3 py-3 text-center text-xs font-semibold text-theme-text">{node}</div>)}
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-theme-border bg-theme-bg p-4 sm:p-5">
      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
        {nodes.map((node, index) => (
          <React.Fragment key={`${index}-${node}`}>
            {index > 0 && <ArrowRight className="mx-auto hidden h-4 w-4 shrink-0 text-theme-accent sm:block" aria-hidden="true" />}
            {index > 0 && <ArrowDown className="mx-auto h-4 w-4 shrink-0 text-theme-accent sm:hidden" aria-hidden="true" />}
            <div className="flex min-h-14 min-w-0 flex-1 items-center justify-center rounded-lg border border-theme-accent/35 bg-theme-card px-2 py-3 text-center text-xs font-semibold leading-snug text-theme-text">{node}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default function CaseProcessStory({ project }) {
  const story = project.processStory;
  if (!story || !Array.isArray(story.inputs) || !Array.isArray(story.connections)) return null;
  const sourceImage = project.visuals?.find((visual) => visual.type === 'image' && visual.src);

  return (
    <div>
      <p className="mb-6 text-sm leading-relaxed text-theme-muted">A visual trace from the documented problem and inputs to the design structure and its known review or delivery status.</p>

      <Stage number="01" title="Frame the problem">
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center">
          <div className="rounded-xl border border-theme-border bg-theme-bg p-4">
            <p className="mb-3 text-[10px] font-mono uppercase tracking-wider text-theme-muted">What needed attention</p>
            <div className="flex flex-wrap gap-2">
              {(story.problemNodes || []).map((node) => <span key={node} className="rounded-lg border border-theme-border bg-theme-card px-3 py-2 text-xs font-medium text-theme-text">{node}</span>)}
            </div>
          </div>
          <ArrowRight className="mx-auto hidden h-5 w-5 text-theme-accent sm:block" aria-hidden="true" />
          <ArrowDown className="mx-auto h-5 w-5 text-theme-accent sm:hidden" aria-hidden="true" />
          <div className="rounded-xl border border-theme-accent/40 bg-theme-accent/5 p-4">
            <p className="mb-2 text-[10px] font-mono uppercase tracking-wider text-theme-accent">Design question</p>
            <p className="text-sm font-semibold leading-snug text-theme-text">{story.question}</p>
          </div>
        </div>
      </Stage>

      <Connector />

      <Stage number="02" title="Sources and methods">
        <div className="grid gap-3 sm:grid-cols-2">
          {story.inputs.map((item, index) => (
            <div key={`${index}-${item.title}`} className="rounded-xl border border-theme-border bg-theme-bg p-4">
              <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-theme-accent/10 text-theme-accent" aria-hidden="true"><Search className="h-4 w-4" /></span>
              <h4 className="text-sm font-semibold text-theme-text">{item.title}</h4>
              {item.detail && <p className="mt-2 text-xs leading-relaxed text-theme-muted">{item.detail}</p>}
            </div>
          ))}
        </div>
        {story.inputNote && <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-theme-muted"><CircleHelp className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{story.inputNote}</p>}
      </Stage>

      <Connector />

      <Stage number="03" title="Turn evidence into decisions">
        <div className="overflow-hidden rounded-xl border border-theme-border">
          <div className="hidden grid-cols-[1fr_1fr_0.9fr] gap-3 bg-theme-accent/10 px-4 py-2 text-[10px] font-mono uppercase tracking-wider text-theme-accent sm:grid"><span>Input or constraint</span><span>Design response</span><span>Visible structure</span></div>
          {story.connections.map((item, index) => (
            <div key={`${index}-${item.from}`} className={`grid gap-2 p-4 text-sm sm:grid-cols-[1fr_1fr_0.9fr] sm:items-center sm:gap-3 ${index ? 'border-t border-theme-border' : ''}`}>
              <p className="text-theme-muted">{item.from}</p>
              <p className="flex items-center gap-2 font-medium text-theme-text"><GitBranch className="h-4 w-4 shrink-0 text-theme-accent" aria-hidden="true" />{item.decision}</p>
              <p className="rounded-lg bg-theme-accent/10 px-3 py-2 text-xs font-semibold text-theme-accent">{item.output}</p>
            </div>
          ))}
        </div>
        {story.connectionNote && <p className="mt-3 text-xs leading-relaxed text-theme-muted">{story.connectionNote}</p>}
      </Stage>

      <Connector />

      <Stage number="04" title="Design the structure">
        <div className="mb-3 flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-theme-muted"><Waypoints className="h-4 w-4 text-theme-accent" aria-hidden="true" />{story.conceptTitle || 'Interaction model'}</div>
        <ConceptMap story={story} />
        <p className="mt-3 text-xs leading-relaxed text-theme-muted">{story.conceptNote || 'Conceptual map of the documented design structure, not an original production screen.'}</p>
        {sourceImage && (
          <div className="mt-5 border-t border-theme-border pt-5">
            <div className="mb-3 flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-theme-muted"><Layers3 className="h-4 w-4 text-theme-accent" aria-hidden="true" />Source Figma frame</div>
            <div className="overflow-hidden rounded-xl border border-theme-border bg-theme-bg"><img src={sourceImage.src} alt={sourceImage.alt || 'Project Figma design'} loading="lazy" className="max-h-72 w-full object-contain" /></div>
            <p className="mt-2 text-xs leading-relaxed text-theme-muted">{sourceImage.caption}</p>
          </div>
        )}
      </Stage>

      <Connector />

      <Stage number="05" title={story.validationTitle || 'Review and delivery'} accent>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {(story.validationSteps || []).map((step, index) => (
            <React.Fragment key={`${index}-${step}`}>
              {index > 0 && <ArrowRight className="mx-auto hidden h-4 w-4 shrink-0 text-theme-accent sm:block" aria-hidden="true" />}
              {index > 0 && <ArrowDown className="mx-auto h-4 w-4 shrink-0 text-theme-accent sm:hidden" aria-hidden="true" />}
              <div className="flex min-h-14 min-w-0 flex-1 items-center justify-center rounded-xl border border-theme-border bg-theme-card px-3 py-3 text-center text-xs font-semibold leading-snug text-theme-text">{step}</div>
            </React.Fragment>
          ))}
        </div>
        {story.validationNote && <p className="mt-4 text-xs leading-relaxed text-theme-muted">{story.validationNote}</p>}
      </Stage>
    </div>
  );
}
