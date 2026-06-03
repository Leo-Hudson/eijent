import PipelineDemo from '@/components/PipelineDemo';

const Pipelines = () => (
  <section className="sec" id="pipelines" style={{ background: 'var(--bg-soft)' }}>
    <div className="container reveal">
      <div className="grid grid-2" style={{ alignItems: 'center', marginBottom: 56 }}>
        <div>
          <div className="eyebrow eyebrow--indigo">Pipelines as systems</div>
          <h2 className="display-lg" style={{ marginTop: 12 }}>A pipeline isn&rsquo;t a list.<br /><em style={{ fontWeight: 700, color: 'var(--indigo-700)' }}>It&rsquo;s programmable execution.</em></h2>
        </div>
        <div>
          <p className="lede">States, transitions, validations. Every move fires workflows and hands context to AI. Move a deal — the system moves with it.</p>
          <p className="mono" style={{ color: 'var(--ink-400)', marginTop: 16, fontSize: 12 }}>↓ click a state to transition</p>
        </div>
      </div>
      <PipelineDemo />
    </div>
  </section>
);

export default Pipelines;
