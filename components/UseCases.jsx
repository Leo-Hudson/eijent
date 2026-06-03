'use client';
import React from 'react';

/* ---------- Use Cases (tabbed) ---------- */
const cases = [
  { tab: 'Sales', title: 'Run the entire revenue cycle as one system',
    copy: 'From inbound lead to closed-won, the same Workspace, the same data, the same AI context. Pipelines transition deals; Workflows fire follow-ups; Eijents enrich and summarize; Pulse captures the call.',
    flow: ['<em>Pulse</em> captures call → meeting digest extracted','<em>Pipeline</em> moves Acme → Proposal','<em>Workflow</em> notifies owner + drafts proposal','<em>Copilot</em> grounds reply in pricing policy','<em>Eijent</em> creates approval task for Finance']},
  { tab: 'Marketing', title: 'Campaigns become living systems, not one-off launches',
    copy: 'A campaign is a pipeline with stages, validations, and triggers. Knowledge holds your brand voice. Eijents draft variants. Activity rolls every interaction up to the right account.',
    flow: ['<em>Knowledge</em> holds brand + product context','<em>Pipeline</em> moves campaign through stages','<em>Eijent</em> drafts variants per persona','<em>Workflow</em> publishes + tracks engagement','<em>Activity</em> rolls signals up to Accounts']},
  { tab: 'Operations', title: 'Coordinate departments without integration glue',
    copy: 'Sales hands off to Onboarding. Onboarding hands off to Success. Coordination Flows make these handoffs first-class — pipelines that listen to other pipelines, with workflows for the seams.',
    flow: ['<em>Sales</em> moves Acme → Won','<em>Coordination Flow</em> kicks off Onboarding','<em>Knowledge</em> carries account context across','<em>Workflow</em> creates kickoff + owner tasks','<em>Eijent</em> monitors SLAs across both pipelines']},
  { tab: 'Founders', title: 'Your company in one model, before you outgrow it',
    copy: 'Spin up Workspaces as you grow. Define entities as your business changes. The system flexes — you don\'t buy and stitch tools, you compose them inside one platform.',
    flow: ['<em>Workspace</em> per business unit','<em>Entities</em> defined for your model','<em>Pipelines</em> for every operational flow','<em>Pulse</em> captures the work happening offline','<em>Copilot</em> answers across the whole system']},
];

const UseCases = () => {
  const [activeCase, setActiveCase] = React.useState(0);
  return (
    <section className="sec" id="cases">
      <div className="container reveal">
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto' }}>
          <div className="eyebrow eyebrow--indigo">Use cases</div>
          <h2 className="display-lg" style={{ marginTop: 12 }}>Built for teams that <em style={{ fontWeight: 700, color: 'var(--indigo-700)' }}>operate.</em></h2>
        </div>
        <div className="cases__tabs">
          {cases.map((c, i) => (
            <button key={c.tab} onClick={() => setActiveCase(i)} className={'cases__tab' + (i === activeCase ? ' is-active' : '')}>{c.tab}</button>
          ))}
        </div>
        <div className="cases__panel" key={activeCase}>
          <div className="cases__grid">
            <div>
              <h3 className="display-md">{cases[activeCase].title}</h3>
              <p className="lede" style={{ marginTop: 16 }}>{cases[activeCase].copy}</p>
            </div>
            <div className="cases__flow">
              {cases[activeCase].flow.map((step, i) => (
                <div key={i} className="cases__flow-step" dangerouslySetInnerHTML={{ __html: step }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCases;
