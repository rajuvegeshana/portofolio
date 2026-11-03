import React from 'react';
import { ArrowDown, ArrowRight, Check, CircleHelp, GitBranch, LayoutDashboard, Search } from 'lucide-react';

const methods = [
  { title: 'Workflow mapping', detail: 'Mapped how work moves across business functions.' },
  { title: 'Competitor review', detail: 'Reviewed existing approaches before shaping the suite.' },
];

const translations = [
  { friction: 'A task crosses tool boundaries', decision: 'One suite-wide navigation model', structure: 'Shared shell' },
  { friction: 'Context is lost at a hand-off', decision: 'A consistent way to read a record', structure: 'Shared record pattern' },
  { friction: 'Seven modules can drift apart', decision: 'Reuse a common component language', structure: 'Common UI foundation' },
];

function StepLabel({ number, children }) {
  return <p className="mb-4 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-theme-accent"><span className="rounded-full border border-theme-accent/50 px-2 py-0.5">{number}</span>{children}</p>;
}

function Connector() {
  return <div className="flex justify-center py-3 text-theme-accent/70" aria-hidden="true"><ArrowDown className="h-5 w-5" /></div>;
}

function WireframeSketch() {
  return (
    <div className="rounded-xl border border-theme-border bg-theme-bg p-3 sm:p-4" role="img" aria-label="Conceptual wireframe reconstruction showing shared navigation, a record area, and related information across modules">
      <div className="mb-3 flex items-center gap-1.5 border-b border-theme-border pb-3">
        <span className="h-2 w-2 rounded-full bg-theme-accent/50" /><span className="h-2 w-2 rounded-full bg-theme-border" /><span className="h-2 w-2 rounded-full bg-theme-border" />
        <span className="ml-3 h-2 w-20 rounded bg-theme-border" />
      </div>
      <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3 sm:grid-cols-[6rem_minmax(0,1fr)]">
        <div className="space-y-2 border-r border-theme-border pr-3">
          <div className="h-2 w-12 rounded bg-theme-accent/50" />
          {[1, 2, 3, 4].map((item) => <div key={item} className="h-2 w-full rounded bg-theme-border" />)}
          <span className="block pt-1 text-[9px] uppercase tracking-wider text-theme-muted">One nav</span>
        </div>
        <div className="min-w-0 space-y-3">
          <div className="h-3 w-2/5 rounded bg-theme-accent/40" />
          <div className="grid grid-cols-[minmax(0,1fr)_3.5rem] gap-2 sm:grid-cols-[minmax(0,1fr)_5rem]">
            <div className="rounded border border-theme-border p-2 space-y-2">
              <div className="h-2 w-3/4 rounded bg-theme-border" /><div className="h-2 w-1/2 rounded bg-theme-border" /><div className="h-2 w-2/3 rounded bg-theme-border" />
              <span className="block text-[9px] uppercase tracking-wider text-theme-muted">Shared record</span>
            </div>
            <div className="rounded border border-theme-accent/40 p-2 space-y-2">
              <div className="h-2 w-full rounded bg-theme-accent/30" /><div className="h-2 w-3/4 rounded bg-theme-border" />
              <span className="block text-[9px] uppercase tracking-wider text-theme-muted">Context</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SitaraProcessStory({ project }) {
  const designImage = project.visuals?.find((visual) => visual.type === 'image' && visual.src);

  return (
    <div className="space-y-0">
      <p className="mb-6 text-sm leading-relaxed text-theme-muted">How the documented research and design work connected the continuity problem to a shared product structure.</p>

      <div className="rounded-2xl border border-theme-border bg-theme-card p-5 sm:p-7">
        <StepLabel number="01">Frame the problem</StepLabel>
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center">
          <div className="rounded-xl border border-theme-border bg-theme-bg p-4">
            <p className="mb-3 text-xs font-mono uppercase tracking-wider text-theme-muted">Small-business work</p>
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold text-theme-text">
              {['Customer', 'Stock', 'Project'].map((item) => <span key={item} className="rounded-lg border border-theme-border px-2 py-3">{item}</span>)}
            </div>
            <p className="mt-3 text-xs text-theme-muted">The case brief describes one person moving between business functions.</p>
          </div>
          <ArrowRight className="mx-auto hidden h-5 w-5 text-theme-accent sm:block" aria-hidden="true" />
          <ArrowDown className="mx-auto h-5 w-5 text-theme-accent sm:hidden" aria-hidden="true" />
          <div className="rounded-xl border border-theme-accent/40 bg-theme-accent/5 p-4">
            <p className="mb-2 text-xs font-mono uppercase tracking-wider text-theme-accent">Design question</p>
            <p className="text-base font-semibold leading-snug text-theme-text">How can those tasks stay connected as one product?</p>
          </div>
        </div>
      </div>

      <Connector />

      <div className="rounded-2xl border border-theme-border bg-theme-card p-5 sm:p-7">
        <StepLabel number="02">Gather evidence</StepLabel>
        <div className="grid gap-3 sm:grid-cols-2">
          {methods.map((method) => (
            <div key={method.title} className="rounded-xl border border-theme-border bg-theme-bg p-4">
              <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-theme-accent/10 text-theme-accent" aria-hidden="true"><Search className="h-4 w-4" /></span>
              <h3 className="text-sm font-semibold text-theme-text">{method.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-theme-muted">{method.detail}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-theme-muted"><CircleHelp className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />Interview notes, participant counts, and formal persona artifacts are not in the available project record.</p>
      </div>

      <Connector />

      <div className="rounded-2xl border border-theme-border bg-theme-card p-5 sm:p-7">
        <StepLabel number="03">Turn the problem into structure</StepLabel>
        <p className="mb-4 text-xs text-theme-muted">These are design responses documented in the case study, not attributed findings from a specific interview.</p>
        <div className="overflow-hidden rounded-xl border border-theme-border">
          <div className="hidden grid-cols-[1fr_1fr_0.8fr] gap-3 bg-theme-accent/10 px-4 py-2 text-[10px] font-mono uppercase tracking-wider text-theme-accent sm:grid"><span>Problem in the brief</span><span>Design decision</span><span>Structure</span></div>
          {translations.map((item, index) => (
            <div key={item.structure} className={`grid gap-2 p-4 text-sm sm:grid-cols-[1fr_1fr_0.8fr] sm:items-center sm:gap-3 ${index ? 'border-t border-theme-border' : ''}`}>
              <p className="text-theme-muted">{item.friction}</p>
              <p className="flex items-center gap-2 font-medium text-theme-text"><GitBranch className="h-4 w-4 shrink-0 text-theme-accent" aria-hidden="true" />{item.decision}</p>
              <p className="rounded-lg bg-theme-accent/10 px-3 py-2 text-xs font-semibold text-theme-accent">{item.structure}</p>
            </div>
          ))}
        </div>
      </div>

      <Connector />

      <div className="rounded-2xl border border-theme-border bg-theme-card p-5 sm:p-7">
        <StepLabel number="04">Move from structure to interface</StepLabel>
        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-theme-muted"><LayoutDashboard className="h-4 w-4 text-theme-accent" aria-hidden="true" />Structure sketch</div>
            <WireframeSketch />
            <p className="mt-2 text-xs leading-relaxed text-theme-muted">Conceptual reconstruction of the shared shell and record logic. Original wireframes have not been provided.</p>
          </div>
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-theme-muted"><Check className="h-4 w-4 text-theme-accent" aria-hidden="true" />Figma design</div>
            {designImage && <div className="overflow-hidden rounded-xl border border-theme-border bg-theme-bg"><img src={designImage.src} alt={designImage.alt || 'Sitara Figma design'} loading="lazy" className="h-44 w-full object-cover object-top sm:h-52" /></div>}
            <p className="mt-2 text-xs leading-relaxed text-theme-muted">Selected frame from the Sitara design file. It shows a design concept, not a verified production screen.</p>
          </div>
        </div>
        <p className="mt-5 rounded-lg border border-theme-border bg-theme-bg px-4 py-3 text-xs leading-relaxed text-theme-muted">Untitled UI supplied the component foundation. The team extended it for the suite’s custom components and connected flows.</p>
      </div>

      <Connector />

      <div className="rounded-2xl border border-theme-accent/40 bg-theme-accent/5 p-5 sm:p-7">
        <StepLabel number="05">Validate and revise</StepLabel>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
          {['Show mockups to live users', 'Gather feedback', 'Update the designs'].map((item, index) => (
            <React.Fragment key={item}>
              {index > 0 && <ArrowRight className="mx-auto hidden h-4 w-4 text-theme-accent sm:block" aria-hidden="true" />}
              <div className="rounded-xl border border-theme-border bg-theme-card px-4 py-4 text-center text-sm font-semibold text-theme-text">{item}</div>
              {index < 2 && <ArrowDown className="mx-auto h-4 w-4 text-theme-accent sm:hidden" aria-hidden="true" />}
            </React.Fragment>
          ))}
        </div>
        <p className="mt-4 text-xs leading-relaxed text-theme-muted">The record confirms this feedback loop. Tasks, participant count, findings, and measured changes are not documented, so this diagram does not claim a test result.</p>
      </div>
    </div>
  );
}
