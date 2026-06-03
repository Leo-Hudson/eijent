import React from 'react';

const DEPARTMENTS = [
  { team: 'Sales', entity: 'Opportunity', pipeline: ['Lead', 'Quote', 'Contract', 'Won'], labels: ['High Value', 'At Risk', 'Renewal'], eijent: 'Email alert when a deal stalls 5+ days' },
  { team: 'Talent Acquisition', entity: 'Candidate', pipeline: ['Applied', 'Screened', 'Interview', 'Offer', 'Hired'], labels: ['Top Talent', 'Urgent Hire', 'On Hold'], eijent: 'Creates Employee record when Hired' },
  { team: 'Operations', entity: 'Project', pipeline: ['Scoping', 'In Production', 'QA', 'Delivered'], labels: ['Requires Vendor', 'Blocked', 'Rush'], eijent: 'Blocks Won unless feedback form complete' },
  { team: 'Finance', entity: 'Invoice', pipeline: ['Draft', 'Sent', 'Partial', 'Paid'], labels: ['Overdue', 'High Value', 'Recurring'], eijent: 'Reminder sent 3 days before due date' },
];

const Departments = () => (
  <section className="depts">
    <div className="container reveal">
      <div className="depts__head">
        <div className="eyebrow eyebrow--indigo">Across departments</div>
        <h2 className="display-lg" style={{ marginTop: 12 }}>Same platform. <em style={{ fontWeight: 700, color: 'var(--indigo-700)' }}>Different lenses.</em></h2>
        <p className="lede" style={{ marginTop: 16, maxWidth: 720 }}>Each team works in their own context — Workspace, Entity, Pipeline, Labels — but the data, AI, and signals are shared across the whole system.</p>
      </div>
      <div className="depts__grid">
        {DEPARTMENTS.map((d) => (
          <div key={d.team} className="depts__card">
            <div className="depts__card-team">{d.team}</div>
            <div className="depts__row">
              <span className="depts__row-label">Entity</span>
              <span className="depts__row-value">{d.entity}</span>
            </div>
            <div className="depts__row depts__row--col">
              <span className="depts__row-label">Pipeline</span>
              <div className="depts__pipe">
                {d.pipeline.map((s, i) => (
                  <React.Fragment key={s}>
                    <span className="depts__pipe-stage">{s}</span>
                    {i < d.pipeline.length - 1 && <span className="depts__pipe-arrow">→</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="depts__row depts__row--col">
              <span className="depts__row-label">Labels</span>
              <div className="depts__labels">
                {d.labels.map(l => <span key={l} className="depts__label">{l}</span>)}
              </div>
            </div>
            <div className="depts__eijent">
              <span className="depts__eijent-bolt">⚡</span> {d.eijent}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Departments;
