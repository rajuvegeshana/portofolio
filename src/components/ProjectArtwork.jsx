import React from 'react';

// Editorial diagrams drawn from the public case-study summaries. These are
// illustrations of the narrative, not screenshots of shipped products.
const C = {
  bg: 'rgb(var(--bg-rgb))',
  card: 'rgb(var(--card-rgb))',
  text: 'rgb(var(--text-rgb))',
  muted: 'rgb(var(--muted-rgb))',
  border: 'rgb(var(--border-rgb))',
  accent: 'rgb(var(--accent-rgb))',
};

function Text({ x, y, children, size = 16, muted = false, mono = false, weight = 500, anchor }) {
  return <text x={x} y={y} fill={muted ? C.muted : C.text} textAnchor={anchor} style={{ fontSize: size, fontWeight: weight, fontFamily: mono ? 'JetBrains Mono, monospace' : 'Inter, sans-serif' }}>{children}</text>;
}

function Box({ x, y, w, h, accent = false, fill = C.card, radius = 12 }) {
  return <rect x={x} y={y} width={w} height={h} rx={radius} fill={fill} stroke={accent ? C.accent : C.border} strokeWidth={accent ? 2 : 1.5} />;
}

function Rule({ x1, y1, x2, y2, accent = false, dashed = false }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={accent ? C.accent : C.border} strokeWidth={accent ? 2.5 : 1.5} strokeDasharray={dashed ? '5 5' : undefined} />;
}

function Bar({ x, y, w, accent = false }) {
  return <rect x={x} y={y} width={w} height="7" rx="3.5" fill={accent ? C.accent : C.border} opacity={accent ? 0.7 : 1} />;
}

function Shell({ children, label }) {
  return <>
    <rect width="800" height="480" fill={C.bg} />
    <path d="M0 80H800M0 400H800M80 0V480M720 0V480" fill="none" stroke={C.border} strokeOpacity="0.45" />
    <rect x="70" y="50" width="660" height="380" rx="20" fill={C.card} stroke={C.border} strokeWidth="2" />
    <rect x="70" y="50" width="660" height="46" rx="20" fill={C.bg} />
    <rect x="70" y="78" width="660" height="18" fill={C.bg} />
    <Rule x1="70" y1="96" x2="730" y2="96" />
    <circle cx="96" cy="73" r="5" fill={C.border} />
    <circle cx="112" cy="73" r="5" fill={C.border} />
    <circle cx="128" cy="73" r="5" fill={C.accent} opacity="0.65" />
    <Text x={708} y={78} size={12} muted mono anchor="end">{label}</Text>
    {children}
  </>;
}

function Zenith() {
  const stages = [['01', 'Application'], ['02', 'Environment'], ['03', 'Service canvas'], ['04', 'Review'], ['05', 'Status']];
  return <Shell label="SYSTEM JOURNEY">
    <Text x={104} y={139} size={24} weight={700}>One guided platform journey</Text>
    <Text x={104} y={163} size={14} muted>From request to provisioned service</Text>
    <Rule x1="140" y1="260" x2="660" y2="260" accent />
    {stages.map(([num, name], i) => {
      const x = 107 + i * 132;
      return <g key={num}>
        <Box x={x} y={205} w={104} h={110} accent={i === 2} />
        <circle cx={x + 52} cy="260" r="13" fill={C.card} stroke={C.accent} strokeWidth="2" />
        <Text x={x + 52} y={247} size={12} mono muted anchor="middle">{num}</Text>
        <Text x={x + 52} y={288} size={12} anchor="middle">{name}</Text>
      </g>;
    })}
    <Text x={104} y={365} size={13} mono muted>REQUEST  /  CONFIGURE  /  APPROVE  /  PROVISION</Text>
  </Shell>;
}

function ZenithAI() {
  return <Shell label="PRODUCT DEFINITION">
    <Text x={105} y={139} size={24} weight={700}>From open brief to testable scope</Text>
    {[['Problem', 'One user, one job'], ['MVP', 'Explicit criteria'], ['Evaluation', 'Pass / fail evidence']].map(([title, sub], i) => {
      const x = 105 + i * 205;
      return <g key={title}>
        <Box x={x} y={185} w={180} h={174} accent={i === 2} />
        <rect x={x + 18} y="205" width="32" height="32" rx="9" fill={C.accent} opacity="0.18" />
        <Text x={x + 18} y={270} size={18} weight={700}>{title}</Text>
        <Text x={x + 18} y={295} size={12} muted>{sub}</Text>
        <Bar x={x + 18} y={320} w={i === 1 ? 90 : 130} accent={i === 2} />
        {i < 2 && <path d={`M${x + 184} 270h17m-6-6 6 6-6 6`} stroke={C.accent} strokeWidth="2" fill="none" />}
      </g>;
    })}
  </Shell>;
}

function Xflow() {
  const rows = [174, 232, 290, 348];
  return <Shell label="DATA LINEAGE">
    <Text x={105} y={139} size={24} weight={700}>Trace a value through the system</Text>
    {[['Source', 115], ['Transform', 325], ['Result', 535]].map(([label, x]) => <g key={label}><Text x={x} y={172} size={12} mono muted>{label.toUpperCase()}</Text><Box x={x} y={190} w={150} h={190} /></g>)}
    {rows.map((y, i) => <g key={y}>
      <Box x={128} y={y + 34} w={124} h={29} accent={i === 1} radius={6} />
      <Bar x={140} y={y + 45} w={72 + i * 7} accent={i === 1} />
      <Box x={338} y={y + 34} w={124} h={29} accent={i === 1} radius={6} />
      <Bar x={350} y={y + 45} w={78} accent={i === 1} />
      <Box x={548} y={y + 34} w={124} h={29} accent={i === 1} radius={6} />
      <Bar x={560} y={y + 45} w={70 + i * 7} accent={i === 1} />
      <Rule x1="266" y1={y + 48} x2="325" y2={y + 48} accent={i === 1} />
      <Rule x1="476" y1={y + 48} x2="535" y2={y + 48} accent={i === 1} />
    </g>)}
  </Shell>;
}

function Sitara() {
  const modules = [['CRM', 110, 185], ['HR', 320, 185], ['Inventory', 530, 185], ['Projects', 110, 285], ['Learning', 320, 285], ['Service', 530, 285]];
  return <Shell label="PRODUCT ECOSYSTEM">
    <Text x={105} y={139} size={24} weight={700}>One system, many business jobs</Text>
    {modules.map(([name, x, y], i) => <g key={name}>
      <Box x={x} y={y} w={160} h={78} accent={i === 0} />
      <rect x={x + 16} y={y + 18} width="24" height="24" rx="6" fill={C.accent} opacity="0.2" />
      <Text x={x + 51} y={y + 35} size={15} weight={650}>{name}</Text>
      <Bar x={x + 16} y={y + 57} w={82} />
    </g>)}
  </Shell>;
}

function Fingo() {
  const steps = ['Understand', 'Compare', 'Choose', 'Track'];
  return <Shell label="LENDING JOURNEY">
    <Text x={105} y={139} size={24} weight={700}>Make a complex choice legible</Text>
    <Text x={105} y={164} size={14} muted>Illustrative steps for a loan mediation experience</Text>
    <Rule x1="150" y1="265" x2="650" y2="265" accent />
    {steps.map((step, i) => {
      const x = 110 + i * 160;
      return <g key={step}>
        <Box x={x} y={218} w={130} h={96} accent={i === 1} />
        <circle cx={x + 65} cy="265" r="13" fill={C.card} stroke={C.accent} strokeWidth="2" />
        <Text x={x + 65} y={252} size={12} mono muted anchor="middle">0{i + 1}</Text>
        <Text x={x + 65} y={292} size={13} anchor="middle">{step}</Text>
      </g>;
    })}
    <Text x={105} y={360} size={13} mono muted>CLARITY AT EACH DECISION POINT</Text>
  </Shell>;
}

function My4Score() {
  return <Shell label="ESG BRAND SCORING">
    <Text x={105} y={139} size={24} weight={700}>Rank what matters to you</Text>
    <Box x={112} y={175} w={210} h={210} accent />
    <Text x={136} y={213} size={13} mono muted>BRAND TOPICS</Text>
    {['Energy', 'Resources', 'Sustainability'].map((topic, i) => <g key={topic}>
      <Box x={136} y={230 + i * 44} w={160} h={32} accent={i === 0} radius={6} />
      <Text x={148} y={251 + i * 44} size={12}>{topic}</Text>
    </g>)}
    {[['Most important', 190], ['Somewhat important', 256], ['Least important', 322]].map(([title, y], i) => <g key={title}>
      <Box x={360} y={y} w={310} h={53} accent={i === 0} />
      <Text x={380} y={y + 31} size={15}>{title}</Text>
      <Bar x={580} y={y + 24} w={62} accent={i === 0} />
    </g>)}
  </Shell>;
}

function Protected() {
  return <Shell label="ACCESS CONTROLLED">
    <Box x={108} y={155} w={584} h={220} />
    {[0, 1, 2].map((i) => <g key={i}>
      <Bar x={136} y={185 + i * 55} w={330 - i * 55} />
      <Bar x={136} y={202 + i * 55} w={250 + i * 20} />
    </g>)}
    <circle cx="572" cy="262" r="55" fill={C.bg} stroke={C.accent} strokeWidth="2" />
    <rect x="550" y="256" width="44" height="32" rx="7" fill={C.accent} opacity="0.22" stroke={C.accent} />
    <path d="M558 256v-13a14 14 0 0 1 28 0v13" fill="none" stroke={C.accent} strokeWidth="4" />
    <Text x={136} y={348} size={12} mono muted>DETAILS AVAILABLE WITH AN ACCESS KEY</Text>
  </Shell>;
}

function Generic() {
  return <Shell label="PROJECT ILLUSTRATION">
    <Text x={105} y={139} size={24} weight={700}>Work in progress</Text>
    {[0, 1, 2].map((i) => <g key={i}>
      <Box x={110 + i * 205} y={190} w={180} h={150} />
      <Bar x={130 + i * 205} y={224} w={112} accent={i === 1} />
      <Bar x={130 + i * 205} y={246} w={136} />
      <Bar x={130 + i * 205} y={268} w={90} />
      <Box x={130 + i * 205} y={296} w={55} h={22} accent={i === 1} radius={6} />
    </g>)}
  </Shell>;
}

const views = {
  zenith: Zenith,
  'zenith-ai': ZenithAI,
  xflow: Xflow,
  sitara: Sitara,
  fingo: Fingo,
  my4score: My4Score,
};

export default function ProjectArtwork({ slug, locked = false, decorative = false }) {
  const View = locked ? Protected : views[slug] || Generic;
  return <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" className="block w-full h-full" role={decorative ? undefined : 'img'} aria-hidden={decorative || undefined} aria-label={decorative ? undefined : `${slug} case-study illustration, not a product screenshot`}>
    <View />
  </svg>;
}
