'use client';
import React from 'react';

/* ---------- PipelineDemo ---------- */
const PipelineDemo = () => {
  const states = [
    { id: 'discovery', label: 'Discovery' }, { id: 'qualified', label: 'Qualified' },
    { id: 'proposal',  label: 'Proposal' }, { id: 'negotiation', label: 'Negotiation' },
    { id: 'won', label: 'Won' },
  ];
  const [cur, setCur] = React.useState(1);
  const [log, setLog] = React.useState([
    { t: 0, k: 'system', msg: 'Opportunity · Acme Corp — state: Qualified' },
  ]);
  const transitionsFor = i => {
    const to = states[i].label;
    if (i === 2) return ['Workflow → notify @maya', 'AI action → draft proposal email', 'Validation → check deal size > $50k'];
    if (i === 3) return ['Workflow → create approval task', 'Knowledge → inject pricing policy', 'Eijent → summarize call history'];
    if (i === 4) return ['Workflow → notify Finance', 'AI action → kickoff onboarding', 'Enrichment → update Account tier'];
    return [`Workflow → log transition to ${to}`, 'AI action → summarize context'];
  };
  const move = (i) => {
    if (i === cur) return;
    const newLog = [
      { t: Date.now(), k: 'transition', msg: `${states[cur].label} → ${states[i].label}` },
      ...transitionsFor(i).map((m, j) => ({ t: Date.now() + j + 1, k: 'trigger', msg: m })),
      ...log,
    ].slice(0, 8);
    setCur(i); setLog(newLog);
  };
  return (
    <div className="pipe-demo">
      <div className="pipe-demo__entity">
        <div className="mono" style={{ color: 'var(--ink-400)' }}>ENTITY</div>
        <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 18, marginTop: 2 }}>Acme Corp — Renewal</div>
        <div style={{ color: 'var(--fg-soft)', fontSize: 13, marginTop: 2 }}>Owner: Maya · Amount: $128,000 · Close: May 12</div>
      </div>
      <div className="pipe-demo__rail">
        {states.map((s, i) => (
          <React.Fragment key={s.id}>
            <button onClick={() => move(i)} className={'pipe-demo__state' + (i === cur ? ' is-active' : '') + (i < cur ? ' is-done' : '')}>
              <span className="pipe-demo__dot" />
              <span className="pipe-demo__state-label">{s.label}</span>
              {i === cur && <span className="pipe-demo__state-pulse" />}
            </button>
            {i < states.length - 1 && (
              <div className={'pipe-demo__arr' + (i < cur ? ' is-done' : '')}>
                <svg viewBox="0 0 40 20" width="40" height="20"><path d="M2 10 L34 10 M28 4 L34 10 L28 16" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="pipe-demo__grid">
        <div className="pipe-demo__panel">
          <div className="pipe-demo__panel-head">
            <span className="mono" style={{ color: 'var(--ink-400)' }}>TRANSITION LOGIC</span>
          </div>
          <div className="pipe-demo__panel-body">
            <div style={{ fontWeight: 600, marginBottom: 10 }}>On enter <span style={{ color: 'var(--indigo-600)' }}>{states[cur].label}</span></div>
            {transitionsFor(cur).map((t, i) => (
              <div key={i} className="pipe-demo__rule">
                <span className="pipe-demo__rule-dot" />
                <span className="mono" style={{ fontSize: 11 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="pipe-demo__panel pipe-demo__panel--log">
          <div className="pipe-demo__panel-head">
            <span className="mono" style={{ color: 'var(--ink-400)' }}>SYSTEM LOG</span>
            <span className="mono" style={{ color: 'var(--indigo-600)', fontSize: 11 }}>● live</span>
          </div>
          <div className="pipe-demo__log scroll-nice">
            {log.map((e, i) => (
              <div key={e.t + '-' + i} className={'pipe-demo__log-line pipe-demo__log-line--' + e.k}>
                <span className="mono" style={{ color: 'var(--ink-300)' }}>{e.k === 'transition' ? '→' : e.k === 'trigger' ? '✦' : '·'}</span>
                <span className="mono" style={{ fontSize: 11 }}>{e.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="pipe-demo__hint mono">Click any state to transition →</div>
    </div>
  );
};

export default PipelineDemo;
