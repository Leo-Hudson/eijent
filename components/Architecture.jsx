'use client';
import React from 'react';

/* ---------- Architecture (interactive only) ---------- */
const PILLARS = [
  { id: 'workspaces', label: 'Workspaces', short: 'Isolated execution environments', desc: 'Each workspace is its own operational system — its own data, pipelines, workflows, and AI behavior. Spin up a new business unit without contaminating another.', bullets: ['Isolated data & access', 'Independent pipelines', 'Per-workspace AI context', 'Cross-workspace workflows'], accent: 'var(--indigo-500)' },
  { id: 'entities', label: 'Entities', short: 'Dynamic data model', desc: 'Opportunities, Accounts, Contacts, Tasks — and anything else you need. Relationships are defined dynamically, not as a fixed schema. The model flexes to your business.', bullets: ['Custom entity types', 'Dynamic relationships', 'No rigid CRM schema', 'Structured + unstructured fields'], accent: 'var(--indigo-600)' },
  { id: 'pipelines', label: 'Pipelines', short: 'Programmable execution engines', desc: 'Pipelines are not lists. They are systems — states, progress steps, and transitions. Transitions carry logic: they can trigger workflows, AI actions, and validations.', bullets: ['States + progress steps', 'Transitions carry logic', 'Trigger workflows on change', 'Enforce validations'], accent: 'var(--indigo-700)' },
  { id: 'workflows', label: 'Workflows', short: 'Native event-driven automation', desc: 'Workflows react to events — entity changes, email events, Pulse signals — across entities and workspaces. No external integration glue required.', bullets: ['Event-driven', 'Cross-entity & cross-workspace', 'No integration dependencies', 'Composable steps'], accent: 'var(--indigo-500)' },
  { id: 'copilot', label: 'Copilot', short: 'Overlay intelligence', desc: 'Not a chat widget. Copilot is embedded across the platform — it understands your entities, workflows, and context, and can act on your behalf.', bullets: ['Embedded across surfaces', 'Understands your system', 'Suggests next steps', 'Executes operations'], accent: 'var(--peach-300)' },
  { id: 'eijents', label: 'Custom Eijents', short: 'Autonomous AI agents', desc: 'User-defined AI agents that run with permissions like a team member. Triggered by events, workflows, or manual actions. They decide, summarize, orchestrate.', bullets: ['Decision-making', 'Summarization', 'Data updates', 'Orchestration across systems'], accent: 'var(--lilac-300)' },
  { id: 'knowledge', label: 'Knowledge Base', short: 'Context engine for AI', desc: 'Centralized company knowledge — docs, structured data, workflows. Copilot and Eijents ground themselves here. Your AI answers from your system, not a generic LLM.', bullets: ['Docs + structured data', 'Grounds Copilot & Eijents', 'Workflow-aware context', 'Adaptive retrieval'], accent: 'var(--mint-200)' },
  { id: 'pulse', label: 'Pulse', short: 'Real-world signal capture', desc: 'A physical device and a mobile/web app that capture conversations, meetings, and events — then stream them into Eijent in real time as entity updates.', bullets: ['Hardware + app', 'Captures conversations & meetings', 'Streams into the system', 'Offline → structured signal'], accent: 'var(--ink-900)' },
];

const Architecture = () => {
  const [active, setActive] = React.useState('pipelines');
  const [hovered, setHovered] = React.useState(null);
  const current = PILLARS.find(p => p.id === (hovered || active));
  const ring = PILLARS.map((p, i) => {
    const angle = (i / PILLARS.length) * Math.PI * 2 - Math.PI / 2;
    const rx = 280, ry = 200;
    return { ...p, x: 400 + Math.cos(angle) * rx, y: 260 + Math.sin(angle) * ry };
  });
  return (
    <div className="arch-int">
      <div className="arch-int__viz">
        <svg viewBox="0 0 800 520" className="arch-int__svg" role="img" aria-label="Architecture diagram with eight pillars">
          <defs>
            <radialGradient id="archCore" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--indigo-500)" stopOpacity="0.2"/>
              <stop offset="100%" stopColor="var(--indigo-500)" stopOpacity="0"/>
            </radialGradient>
          </defs>
          {ring.map(n => (
            <line key={n.id} x1="400" y1="260" x2={n.x} y2={n.y}
              stroke={current.id === n.id ? n.accent : 'var(--indigo-100)'}
              strokeWidth={current.id === n.id ? 2 : 1}
              strokeDasharray={current.id === n.id ? '' : '3 4'}
              style={{ transition: 'all 300ms var(--ease)' }} />
          ))}
          <circle cx="400" cy="260" r="120" fill="url(#archCore)" />
          <circle cx="400" cy="260" r="70" fill="var(--white)" stroke="var(--indigo-100)" strokeWidth="1.5" />
          <text x="400" y="250" textAnchor="middle" fontFamily="var(--display)" fontWeight="800" fontSize="18" fill="var(--ink-900)">Eijent</text>
          <text x="400" y="272" textAnchor="middle" fontFamily="var(--mono)" fontSize="10" fill="var(--ink-400)">operational system</text>
          {ring.map(n => {
            const isCur = current.id === n.id;
            const dim = !isCur && current.id !== null;
            return (
              <g key={n.id}
                 role="button" tabIndex="0" aria-label={`${n.label} pillar`} aria-pressed={isCur}
                 onMouseEnter={() => setHovered(n.id)} onMouseLeave={() => setHovered(null)}
                 onClick={() => setActive(n.id)}
                 onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActive(n.id); } }}
                 style={{ cursor: 'pointer', opacity: dim ? 0.45 : 1, transition: 'all 300ms var(--ease)' }}>
                <circle cx={n.x} cy={n.y} r={isCur ? 44 : 38} fill="white" stroke={n.accent}
                  strokeWidth={isCur ? 2.5 : 1.5}
                  style={{ transition: 'all 300ms var(--ease)', filter: isCur ? `drop-shadow(0 8px 20px ${n.accent}66)` : 'none' }} />
                <circle cx={n.x} cy={n.y} r="10" fill={n.accent}>
                  {isCur && <animate attributeName="r" values="10;14;10" dur="1.6s" repeatCount="indefinite" />}
                </circle>
                <text x={n.x} y={n.y + 58} textAnchor="middle" fontFamily="var(--display)" fontWeight="700" fontSize="13" fill="var(--ink-900)">{n.label}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="arch-int__panel" key={current.id}>
        <div className="arch-int__panel-dot" style={{ background: current.accent }} />
        <div className="eyebrow eyebrow--indigo">Pillar</div>
        <h3 className="display-md" style={{ marginTop: 8 }}>{current.label}</h3>
        <div className="mono" style={{ color: 'var(--ink-400)', marginTop: 4 }}>{current.short}</div>
        <p style={{ marginTop: 16, color: 'var(--fg-soft)', fontSize: 15, lineHeight: 1.6 }}>{current.desc}</p>
        <ul className="arch-int__bullets">
          {current.bullets.map(b => (
            <li key={b}><span className="arch-int__check" style={{ background: current.accent }} />{b}</li>
          ))}
        </ul>
        <div className="arch-int__hint mono">Click a pillar to explore →</div>
      </div>
    </div>
  );
};

export default Architecture;
