import WorkflowBuilder from '@/components/WorkflowBuilder';
import CoordinationFlows from '@/components/CoordinationFlows';

const Workflows = () => (
  <section className="sec" style={{ background: 'var(--bg-soft)' }}>
    <div className="container reveal">
      <div className="grid grid-2" style={{ alignItems: 'start', gap: 48 }}>
        <div>
          <div className="eyebrow eyebrow--indigo">Workflows</div>
          <h2 className="display-md" style={{ marginTop: 12 }}>Native event-driven automation.</h2>
          <p className="lede" style={{ marginTop: 16 }}>Workflows live with your data and pipelines — listening to transitions, emails, and Pulse signals. No iPaaS required.</p>
          <div style={{ marginTop: 24 }}>
            <WorkflowBuilder />
          </div>
        </div>
        <div>
          <div className="eyebrow eyebrow--indigo">Coordination flows</div>
          <h2 className="display-md" style={{ marginTop: 12 }}>Pipelines that listen to pipelines.</h2>
          <p className="lede" style={{ marginTop: 16 }}>Sales hands off to Onboarding. Onboarding to Success. Cross-pipeline dependencies are a first-class primitive — not glue in someone&rsquo;s head.</p>
          <CoordinationFlows />
        </div>
      </div>
    </div>
  </section>
);

export default Workflows;
