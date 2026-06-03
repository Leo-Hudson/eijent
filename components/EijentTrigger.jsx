'use client';
import React from 'react';

const EijentTrigger = () => {
  const agents = [
    { id: 'lead-sweep', name: 'Lead Sweep', desc: 'Scores inbound leads and enriches with external signals.', trigger: 'event · new Contact', color: 'var(--indigo-500)' },
    { id: 'deal-nudge', name: 'Deal Nudge', desc: 'Monitors stalled opportunities and drafts follow-ups.', trigger: 'schedule · daily 9am', color: 'var(--peach-300)' },
    { id: 'meeting-digest', name: 'Meeting Digest', desc: 'Summarizes Pulse-captured meetings into action items.', trigger: 'event · Pulse meeting ended', color: 'var(--lilac-300)' },
  ];
  const [running, setRunning] = React.useState(null);
  const [output, setOutput] = React.useState(null);
  const run = (a) => {
    setRunning(a.id); setOutput(null);
    setTimeout(() => {
      setRunning(null);
      const res = {
        'lead-sweep': ['Enriched 14 contacts', 'Flagged 3 as high-fit', 'Created 3 follow-up tasks'],
        'deal-nudge': ['Found 4 stalled deals', 'Drafted 4 messages', 'Assigned to owners for review'],
        'meeting-digest': ['Processed 2 Pulse meetings', 'Extracted 7 action items', 'Updated 2 Opportunities'],
      }[a.id];
      setOutput({ id: a.id, res });
    }, 1400);
  };
  return (
    <div className="eijents">
      {agents.map(a => (
        <div key={a.id} className="eijents__card" style={{ '--accent': a.color }}>
          <div className="eijents__head">
            <div className="eijents__dot" />
            <div>
              <div className="eijents__name">{a.name}</div>
              <div className="mono" style={{ color: 'var(--ink-400)', fontSize: 11, marginTop: 2 }}>{a.trigger}</div>
            </div>
          </div>
          <div className="eijents__desc">{a.desc}</div>
          <button className="eijents__run" onClick={() => run(a)} disabled={running === a.id}>
            {running === a.id ? <><span className="eijents__spinner" /> running…</> : 'Trigger Eijent →'}
          </button>
          {output && output.id === a.id && (
            <div className="eijents__output">
              {output.res.map(r => <div key={r} className="eijents__line">✦ {r}</div>)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default EijentTrigger;
