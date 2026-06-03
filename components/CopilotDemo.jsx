'use client';
import React from 'react';

/* ---------- Copilot demo + Eijent trigger ---------- */
const CopilotDemo = () => {
  const starters = ['Summarize my top 3 opportunities','Why did Acme stall?','Draft a follow-up to Maya','What changed in the pipeline this week?'];
  const [thread, setThread] = React.useState([
    { from: 'user', text: 'Why did Acme stall?' },
    { from: 'copilot', text: 'Acme last moved to Proposal 11 days ago. Maya has not opened the proposal doc (per Knowledge). The last Pulse call mentioned a pricing concern. Suggested next step: send a revised tier.', grounded: ['Knowledge · Pricing Policy v3', 'Pulse · Call 04/14 · Maya'] },
  ]);
  const [input, setInput] = React.useState('');
  const send = (t) => {
    const text = (t ?? input).trim();
    if (!text) return;
    setThread([...thread, { from: 'user', text }, { from: 'copilot', text: 'Pulling context from Knowledge and recent Pulse events…', thinking: true }]);
    setInput('');
    setTimeout(() => {
      setThread(prev => [
        ...prev.slice(0, -1),
        { from: 'copilot', text: 'Drafted a response based on the last three interactions with Maya and your pricing policy. Want me to send it?', grounded: ['Knowledge · Pricing Policy v3', 'Activity · Thread with Maya'] },
      ]);
    }, 900);
  };
  return (
    <div className="copilot">
      <div className="copilot__thread scroll-nice">
        {thread.map((m, i) => (
          <div key={i} className={'copilot__msg copilot__msg--' + m.from}>
            {m.from === 'copilot' && (<div className="copilot__avatar"><img src="/assets/mark-static.png" alt="" width="16" /></div>)}
            <div className="copilot__bubble">
              {m.thinking ? <span className="copilot__thinking"><span /><span /><span /></span> : null}
              {m.text}
              {m.grounded && (
                <div className="copilot__grounded">
                  {m.grounded.map(g => <span key={g} className="copilot__ground-chip">✦ {g}</span>)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="copilot__starters">
        {starters.map(s => <button key={s} onClick={() => send(s)} className="copilot__starter">✦ {s}</button>)}
      </div>
      <div className="copilot__input">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Ask Copilot about your system…" aria-label="Ask Copilot" />
        <button onClick={() => send()} className="copilot__send" aria-label="Send">→</button>
      </div>
    </div>
  );
};

export default CopilotDemo;
