import React from 'react';
import ProjectArtwork from './ProjectArtwork';

const A = 'rgb(var(--accent-rgb))';
const MUTED = 'rgb(var(--muted-rgb))';
const BORDER = 'rgb(var(--border-rgb))';
const CARD = 'rgb(var(--card-rgb))';

function Frame({ title, meta, children }) {
  return (
    <div className="rounded-xl border border-theme-border bg-theme-card overflow-hidden">
      <div className="flex items-center justify-between gap-4 px-4 py-2.5 border-b border-theme-border bg-theme-bg">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-theme-border" />
            <span className="w-2.5 h-2.5 rounded-full bg-theme-border" />
            <span className="w-2.5 h-2.5 rounded-full bg-theme-accent/60" />
          </span>
          <span className="text-xs font-mono text-theme-muted truncate">{title}</span>
        </div>
        {meta && <span className="text-[10px] font-mono uppercase tracking-widest text-theme-muted shrink-0">{meta}</span>}
      </div>
      <div>{children}</div>
    </div>
  );
}

const Label = ({ x, y, children }) => (
  <text x={x} y={y} fill={MUTED} style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace' }}>
    {children}
  </text>
);

const Body = ({ x, y, children, size = 13, weight = 400, fill = 'currentColor', anchor }) => (
  <text x={x} y={y} fill={fill} textAnchor={anchor} className="text-theme-text" style={{ fontSize: size, fontWeight: weight, fontFamily: 'Inter, sans-serif' }}>
    {children}
  </text>
);

const Mono = ({ x, y, children, size = 11, fill = MUTED, anchor }) => (
  <text x={x} y={y} fill={fill} textAnchor={anchor} style={{ fontSize: size, fontFamily: 'JetBrains Mono, monospace' }}>
    {children}
  </text>
);

/* ---------- Concept: definition canvas ---------- */

function ProblemCanvas() {
  const fields = [
    ['Primary user', 'Single committed segment — not a list of five plausible ones'],
    ['Job to be done', 'One core workflow, stated as a sentence a user could say'],
    ['Current alternative', 'What they do today, and what that costs them'],
  ];
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto block" role="img" aria-label="Concept of a product definition canvas with a problem statement and a highlighted success metric field">
      <rect x="0" y="0" width="800" height="500" fill={CARD} />
      <Label x="40" y="44">Problem statement</Label>
      <rect x="40" y="60" width="720" height="96" rx="10" fill="none" stroke={BORDER} />
      <Body x="60" y="92" size={14}>[User] struggles to [task] because [cause]; current alternatives</Body>
      <Body x="60" y="116" size={14}>cost [measurable cost]; the product helps achieve [outcome],</Body>
      <rect x="252" y="126" width="322" height="24" rx="6" fill={A} opacity="0.12" />
      <rect x="252" y="126" width="322" height="24" rx="6" fill="none" stroke={A} />
      <Body x="60" y="143" size={14} weight={600}>measured by [metric]</Body>
      <text x="586" y="143" fill={A} style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>← required to close</text>

      {fields.map(([k, v], i) => (
        <g key={k}>
          <Body x="40" y={196 + i * 46} size={13} weight={600}>{k}</Body>
          <Body x="40" y={214 + i * 46} size={13} fill={MUTED}>{v}</Body>
          <line x1="40" y1={228 + i * 46} x2="760" y2={228 + i * 46} stroke={BORDER} />
        </g>
      ))}

      <rect x="40" y="340" width="720" height="122" rx="10" fill="none" stroke={A} strokeDasharray="4 4" />
      <Label x="60" y="368">Why the metric is fixed here</Label>
      <Body x="60" y="394" size={13}>Choosing the success metric after the features are built turns it into a</Body>
      <Body x="60" y="414" size={13}>number picked to flatter what already exists. Fixed at the statement</Body>
      <Body x="60" y="434" size={13}>stage, every later feature argument gets settled by evidence.</Body>
    </svg>
  );
}

/* ---------- Concept: scope board ---------- */

function ScopeBoard() {
  const inScope = [
    ['Primary workflow end to end', 'core value demonstrable'],
    ['Structured AI output', 'schema, validation, fallback'],
    ['Human confirmation on write actions', 'irreversible steps'],
  ];
  const outScope = [
    ['Broad feature expansion', 'no validated need'],
    ['Unnecessary integrations', 'scope and cost risk'],
    ['Premature enterprise infrastructure', 'not required to prove value'],
    ['Complex autonomous agents', 'no demonstrated need'],
  ];
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto block" role="img" aria-label="Concept of an MVP scope board with an in-scope column, an out-of-scope column, and a five-criteria checklist">
      <rect x="0" y="0" width="800" height="500" fill={CARD} />
      <rect x="32" y="32" width="300" height="436" rx="12" fill="none" stroke={A} />
      <rect x="356" y="32" width="412" height="436" rx="12" fill="none" stroke={BORDER} />
      <Label x="52" y="60" >In scope</Label>
      <Label x="376" y="60">Out of scope — written down</Label>

      {inScope.map(([t, s], i) => (
        <g key={t}>
          <rect x="52" y={80 + i * 116} width="260" height="96" rx="9" fill="none" stroke={A} strokeOpacity="0.45" />
          <Body x="68" y={106 + i * 116} size={13} weight={600}>{t}</Body>
          <Mono x="68" y={128 + i * 116}>{s}</Mono>
          <Body x="68" y={152 + i * 116} size={12} fill={MUTED}>Meets all five criteria</Body>
        </g>
      ))}

      {outScope.map(([t, s], i) => (
        <g key={t}>
          <circle cx="386" cy={92 + i * 92} r="7" fill="none" stroke={BORDER} />
          <line x1="381" y1="87" x2="391" y2="97" stroke={MUTED} strokeWidth="1.5" />
          <line x1="391" y1="87" x2="381" y2="97" stroke={MUTED} strokeWidth="1.5" />
          <Body x="404" y={97 + i * 92} size={13}>{t}</Body>
          <Mono x="404" y={115 + i * 92}>{s}</Mono>
        </g>
      ))}

      <rect x="376" y="396" width="372" height="52" rx="9" fill="none" stroke={BORDER} />
      <Mono x="392" y="418">A feature enters the MVP only if it clears</Mono>
      <Body x="392" y="438" size={12}>all five — otherwise it belongs in the list on the right.</Body>
    </svg>
  );
}

/* ---------- Concept: evaluation harness ---------- */

function EvalHarness() {
  const rows = [
    ['Case 014', 'Invoice extraction', 'pass', '0.42'],
    ['Case 015', 'Invoice extraction', 'pass', '0.38'],
    ['Case 016', 'Policy Q&A', 'fail', '1.14'],
    ['Case 017', 'Policy Q&A', 'pass', '0.51'],
    ['Case 018', 'Edge: missing field', 'fail', '0.96'],
  ];
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto block" role="img" aria-label="Concept of an AI evaluation harness showing a dataset, task-specific pass criteria, model and prompt versions, and cost per successful task">
      <rect x="0" y="0" width="800" height="500" fill={CARD} />
      <Label x="40" y="44">Evaluation run</Label>
      <rect x="40" y="60" width="720" height="40" rx="8" fill="none" stroke={BORDER} />
      <Mono x="56" y="85">model: claude-sonnet-4-6</Mono>
      <Mono x="290" y="85">prompt: v3.2</Mono>
      <Mono x="470" y="85">dataset: 50 cases, representative</Mono>

      <Label x="40" y="136">Task</Label>
      <Label x="330" y="136">Result</Label>
      <Label x="440" y="136">Cost / task</Label>
      <line x1="40" y1="148" x2="760" y2="148" stroke={BORDER} />

      {rows.map(([id, name, verdict, cost], i) => (
        <g key={id}>
          <Mono x="40" y={176 + i * 46}>{id}</Mono>
          <Body x="118" y={176 + i * 46} size={13}>{name}</Body>
          <circle cx="342" cy={172 + i * 46} r="5" fill={verdict === 'pass' ? A : 'none'} stroke={verdict === 'pass' ? A : MUTED} strokeWidth="1.4" />
          <Mono x="358" y={176 + i * 46} fill={verdict === 'pass' ? A : MUTED}>{verdict}</Mono>
          <Mono x="440" y={176 + i * 46}>${cost}</Mono>
          <line x1="40" y1={192 + i * 46} x2="760" y2={192 + i * 46} stroke={BORDER} strokeOpacity="0.6" />
        </g>
      ))}

      <rect x="40" y="416" width="720" height="52" rx="9" fill="none" stroke={A} />
      <Mono x="56" y="438">cost per successful task</Mono>
      <Body x="290" y="438" size={13} weight={600}>$0.61</Body>
      <Body x="56" y="458" size={12} fill={MUTED}>Read next to task completion rate — never optimised separately.</Body>
    </svg>
  );
}

/* ---------- Diagram: definition pipeline ---------- */

function DefinitionPipeline() {
  const steps = [
    ['Open brief', 'no user, no scope'],
    ['Customer\ndefinition', 'one user, one job'],
    ['Problem +\nmetric', 'closes with a metric'],
    ['MVP criteria', 'in and out of scope'],
    ['AI layer spec', 'evaluated component'],
    ['Phased\nroadmap', 'exit gate per phase'],
  ];
  const w = 116, gap = 12, start = 34;
  return (
    <svg viewBox="0 0 800 260" className="w-full h-auto block" role="img" aria-label="Diagram of the definition pipeline: open brief, customer definition, problem and metric, MVP criteria, AI layer specification, phased roadmap">
      <rect x="0" y="0" width="800" height="260" fill={CARD} />
      {steps.map(([title, sub], i) => {
        const x = start + i * (w + gap);
        const isFirst = i === 0;
        const isLast = i === steps.length - 1;
        return (
          <g key={title}>
            <rect x={x} y="66" width={w} height="86" rx="10" fill="none" stroke={isFirst || isLast ? A : BORDER} />
            {title.split('\n').map((line, j) => (
              <Body key={line} x={x + w / 2} y={isFirst ? 106 : 100 + j * 17} size={13} weight={600} anchor="middle">{line}</Body>
            ))}
            <Mono x={x + w / 2} y={isFirst ? 134 : 132} anchor="middle" size={10}>{sub}</Mono>
            {!isLast && <path d={`M ${x + w + 2} 109 l 7 0 m -3 -3.5 l 3 3.5 l -3 3.5`} stroke={A} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />}
          </g>
        );
      })}
      <Label x="34" y="38">Definition pipeline</Label>
      <Body x="34" y="196" size={13} fill={MUTED}>Each stage removes a class of ambiguity, and each one is written so that the next</Body>
      <Body x="34" y="216" size={13} fill={MUTED}>stage can be argued about with evidence rather than enthusiasm.</Body>
      <rect x="34" y="236" width="732" height="0" fill="none" />
    </svg>
  );
}

/* ---------- Diagram: AI request path ---------- */

function AiRequestPath() {
  const nodes = [
    ['User request', 40],
    ['Orchestration', 200],
    ['Model + tools', 360],
    ['Validation', 520],
  ];
  return (
    <svg viewBox="0 0 800 420" className="w-full h-auto block" role="img" aria-label="Diagram of the AI request path from user request through orchestration, model and tools, to validation, with a retry and fallback loop and a human confirmation gate before consequential actions">
      <rect x="0" y="0" width="800" height="420" fill={CARD} />
      <Label x="40" y="40">AI request path</Label>

      {nodes.map(([title, x], i) => (
        <g key={title}>
          <rect x={x} y="72" width="140" height="60" rx="9" fill="none" stroke={BORDER} />
          <Body x={x + 70} y="106" size={13} weight={600} anchor="middle">{title}</Body>
          {i < nodes.length - 1 && (
            <path d={`M ${x + 144} 102 l 12 0 m -4 -3.5 l 4 3.5 l -4 3.5`} stroke={A} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          )}
        </g>
      ))}

      <path d="M 590 132 l 0 46 l -420 0 l 0 -46" stroke={BORDER} strokeWidth="1.4" fill="none" strokeDasharray="5 4" />
      <Mono x="300" y="166">retry · timeout · fallback</Mono>

      <rect x="520" y="230" width="240" height="72" rx="10" fill="none" stroke={A} />
      <Body x="536" y="258" size={13} weight={600}>Human confirmation</Body>
      <Body x="536" y="278" size={12} fill={MUTED}>before any consequential or</Body>
      <Body x="536" y="294" size={12} fill={MUTED}>irreversible action</Body>
      <path d="M 590 132 l 0 98" stroke={A} strokeWidth="1.6" fill="none" />

      <rect x="40" y="230" width="240" height="72" rx="10" fill="none" stroke={BORDER} />
      <Body x="56" y="258" size={13} weight={600}>Evaluated, not demoed</Body>
      <Body x="56" y="278" size={12} fill={MUTED}>Representative dataset, task-</Body>
      <Body x="56" y="294" size={12} fill={MUTED}>specific pass criteria, versioned</Body>

      <rect x="300" y="230" width="200" height="72" rx="10" fill="none" stroke={BORDER} />
      <Body x="316" y="258" size={13} weight={600}>Least privilege</Body>
      <Body x="316" y="278" size={12} fill={MUTED}>Connected data scoped to the</Body>
      <Body x="316" y="294" size={12} fill={MUTED}>task; injection treated as input</Body>

      <Body x="40" y="352" size={13} fill={MUTED}>If the output of a feature cannot be tested, the feature is not finished — it is waiting for a demo.</Body>
    </svg>
  );
}

/* ---------- Diagram: scope decision ---------- */

function ScopeDecision() {
  const criteria = [
    'Supports the primary journey',
    'Addresses a validated need',
    'Has a clear acceptance criterion',
    'Acceptable security and running cost',
    'Necessary to demonstrate core value',
  ];
  return (
    <svg viewBox="0 0 800 400" className="w-full h-auto block" role="img" aria-label="Diagram of a scope decision: a proposed feature is tested against five MVP inclusion criteria and is either in scope or on the explicit out-of-scope list">
      <rect x="0" y="0" width="800" height="400" fill={CARD} />
      <Label x="40" y="40">Scope decision</Label>

      <rect x="40" y="72" width="180" height="60" rx="9" fill="none" stroke={BORDER} />
      <Body x="130" y="107" size={13} weight={600} anchor="middle">Proposed feature</Body>
      <path d="M 130 132 l 0 40 l 150 0" stroke={A} strokeWidth="1.6" fill="none" />

      <rect x="280" y="196" width="300" height="164" rx="10" fill="none" stroke={A} />
      <Label x="300" y="224">MVP inclusion criteria</Label>
      {criteria.map((c, i) => (
        <g key={c}>
          <rect x="300" y={238 + i * 24} width="12" height="12" rx="3" fill="none" stroke={A} />
          <path d={`M 303 ${244 + i * 24} l 3 3 l 5 -6`} stroke={A} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <Body x="324" y={249 + i * 24} size={12}>{c}</Body>
        </g>
      ))}

      <path d="M 580 278 l 60 0 m -5 -3.5 l 5 3.5 l -5 3.5" stroke={A} strokeWidth="1.6" fill="none" />

      <rect x="648" y="212" width="120" height="52" rx="9" fill="none" stroke={A} />
      <Body x="708" y="244" size={13} weight={600} anchor="middle">In scope</Body>
      <rect x="648" y="292" width="120" height="52" rx="9" fill="none" stroke={BORDER} />
      <Body x="708" y="324" size={13} weight={600} anchor="middle">Out of scope</Body>
      <path d="M 640 278 l 0 38" stroke={BORDER} strokeWidth="1.4" fill="none" strokeDasharray="4 3" />

      <Body x="40" y="196" size={12} fill={MUTED}>A feature that clears all five</Body>
      <Body x="40" y="214" size={12} fill={MUTED}>enters the build. Anything that</Body>
      <Body x="40" y="232" size={12} fill={MUTED}>fails one of them is written</Body>
      <Body x="40" y="250" size={12} fill={MUTED}>down, not quietly deferred.</Body>
    </svg>
  );
}

/* ---------- Real screenshot slot ---------- */

function ScreenshotImage({ src, alt }) {
  const resolvedSrc = src?.startsWith('images/') ? `${import.meta.env.BASE_URL}${src}` : src;
  return (
    <img src={resolvedSrc} alt={alt} className="w-full h-auto block" loading="lazy" />
  );
}

export const VISUALS = {
  'project-zenith': { type: 'diagram', title: 'Guided platform journey', meta: 'Illustration', component: () => <ProjectArtwork slug="zenith" /> },
  'project-xflow': { type: 'diagram', title: 'Data lineage view', meta: 'Illustration', component: () => <ProjectArtwork slug="xflow" /> },
  'project-sitara': { type: 'diagram', title: 'Connected product modules', meta: 'Illustration', component: () => <ProjectArtwork slug="sitara" /> },
  'project-fingo': { type: 'diagram', title: 'Lending decision journey', meta: 'Illustration', component: () => <ProjectArtwork slug="fingo" /> },
  'project-my4score': { type: 'diagram', title: 'ESG topic selection', meta: 'Illustration', component: () => <ProjectArtwork slug="my4score" /> },
  'problem-canvas': { type: 'concept', title: 'Definition canvas', meta: 'Concept', component: ProblemCanvas, caption: 'The problem statement template, drawn as it was used. The metric field is highlighted because the template does not close without it.' },
  'scope-board': { type: 'concept', title: 'MVP scope board', meta: 'Concept', component: ScopeBoard, caption: 'Scope decided by criteria rather than a wish-list. What is not being built is written down with as much care as what is.' },
  'eval-harness': { type: 'concept', title: 'Evaluation harness', meta: 'Concept', component: EvalHarness, caption: 'The AI layer specified as a tested component: a representative dataset, task-specific pass criteria, versioned prompts and models, and cost per successful task.' },
  'definition-pipeline': { type: 'diagram', title: 'Definition pipeline', meta: 'Diagram', component: DefinitionPipeline, caption: 'The order the work happened in. Each stage removed a class of ambiguity before the next one started.' },
  'ai-request-path': { type: 'diagram', title: 'AI request path', meta: 'Diagram', component: AiRequestPath, caption: 'What makes an AI feature testable rather than demonstrable: an evaluated path, defined failure behaviour, and human confirmation before anything irreversible.' },
  'scope-decision': { type: 'diagram', title: 'Scope decision', meta: 'Diagram', component: ScopeDecision, caption: 'A feature enters the build only by clearing five criteria. Everything else is named on the out-of-scope list.' },
};

export function CaseVisual({ visual }) {
  if (visual.type === 'image') {
    return (
      <div className="rounded-xl border border-theme-border bg-theme-card overflow-hidden">
        <ScreenshotImage src={visual.src} alt={visual.alt || visual.title || 'Case study screenshot'} />
      </div>
    );
  }
  const def = VISUALS[visual.id];
  if (!def) return null;
  const C = def.component;
  return (
    <Frame title={visual.title || def.title} meta={def.meta}>
      <C />
    </Frame>
  );
}
