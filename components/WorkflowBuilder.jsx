'use client';
import React from 'react';

/* ---------- Workflow + Coordination ---------- */
const WorkflowBuilder = () => {
  const [selected, setSelected] = React.useState(1);
  const steps = [
    { id: 'trigger', label: 'WHEN', title: 'Opportunity moves to Proposal', type: 'trigger' },
    { id: 'filter', label: 'IF', title: 'Amount > $50,000', type: 'filter' },
    { id: 'action1', label: 'THEN', title: 'Notify owner + finance', type: 'action' },
    { id: 'ai', label: 'AI', title: 'Draft proposal email (Copilot)', type: 'ai' },
    { id: 'task', label: 'AND', title: 'Create approval task · 48h SLA', type: 'action' },
  ];
  return (
    <div className="workflow">
      <div className="workflow__canvas">
        {steps.map((s, i) => (
          <React.Fragment key={s.id}>
            <div className={'workflow__step workflow__step--' + s.type + (selected === i ? ' is-sel' : '')} onClick={() => setSelected(i)}>
              <div className="mono workflow__step-kind">{s.label}</div>
              <div className="workflow__step-title">{s.title}</div>
            </div>
            {i < steps.length - 1 && (
              <div className="workflow__connector">
                <svg viewBox="0 0 20 30"><path d="M10 0 V24 M4 18 L10 24 L16 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default WorkflowBuilder;
