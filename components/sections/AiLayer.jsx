import CopilotDemo from '@/components/CopilotDemo';
import EijentTrigger from '@/components/EijentTrigger';

const AiLayer = () => (
  <section className="sec" id="ai">
    <div className="container reveal">
      <div style={{ maxWidth: 720 }}>
        <div className="eyebrow eyebrow--indigo">The AI layer</div>
        <h2 className="display-lg" style={{ marginTop: 12 }}>Copilot to ask. Eijents to <em style={{ fontWeight: 700, color: 'var(--indigo-700)' }}>act.</em></h2>
        <p className="lede" style={{ marginTop: 16 }}>Grounded in your Knowledge Base — not a generic LLM. They know your entities, your pipelines, your way of working.</p>
      </div>
      <div className="ai-layer__grid">
        <div className="ai-layer__block">
          <h4>Copilot</h4>
          <p>Ask, draft, summarize — embedded across the platform.</p>
          <CopilotDemo />
        </div>
        <div className="ai-layer__block">
          <h4>Custom Eijents</h4>
          <p>Autonomous agents that run with team-member permissions.</p>
          <EijentTrigger />
        </div>
      </div>
    </div>
  </section>
);

export default AiLayer;
