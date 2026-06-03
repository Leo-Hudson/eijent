'use client';
import React from 'react';

/* ---------- Activity ---------- */
const Activity = () => {
  const events = [
    { t: '0:14', type: 'pulse', from: 'PULSE', text: 'Meeting with Maya (Acme) — 42 min · transcribed', accent: 'var(--ink-900)' },
    { t: '0:14', type: 'ai', from: 'Eijent · Meeting Digest', text: 'Extracted 3 action items · Updated Opportunity · Acme', accent: 'var(--lilac-300)' },
    { t: '1:03', type: 'transition', from: 'Pipeline', text: 'Acme Corp → Proposal', accent: 'var(--indigo-500)' },
    { t: '1:03', type: 'workflow', from: 'Workflow', text: 'Notify @maya · Create approval task', accent: 'var(--indigo-600)' },
    { t: '2:20', type: 'email', from: 'Email', text: 'From: maya@acme.com — "Let\'s discuss pricing"', accent: 'var(--peach-300)' },
    { t: '2:22', type: 'copilot', from: 'Copilot', text: 'Drafted follow-up · grounded in pricing policy v3', accent: 'var(--indigo-500)' },
    { t: '2:45', type: 'task', from: 'Task', text: 'Maya · Review revised proposal before Thursday', accent: 'var(--mint-200)' },
    { t: '3:10', type: 'comment', from: 'Comment · Paulo', text: '"Can we push the timeline by a week?"', accent: 'var(--ink-300)' },
  ];
  return (
    <div className="activity">
      <div className="activity__head">
        <div>
          <div className="mono" style={{ color: 'var(--ink-400)' }}>ACTIVITY · Acme Corp</div>
          <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 18, marginTop: 2 }}>Unified timeline</div>
        </div>
        <div className="activity__filters">
          {['All','Pulse','AI','Pipeline','Email','Tasks'].map((f, i) => (
            <span key={f} className={'activity__filter' + (i === 0 ? ' is-active' : '')}>{f}</span>
          ))}
        </div>
      </div>
      <div className="activity__stream">
        {events.map((e, i) => (
          <div key={i} className="activity__event" style={{ '--accent': e.accent, animationDelay: `${i * 60}ms` }}>
            <div className="activity__rail">
              <div className="activity__dot" />
              {i < events.length - 1 && <div className="activity__line" />}
            </div>
            <div className="activity__body">
              <div className="activity__meta">
                <span className="mono" style={{ color: 'var(--ink-400)' }}>{e.t}</span>
                <span className="activity__from">{e.from}</span>
              </div>
              <div className="activity__text">{e.text}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Activity;
