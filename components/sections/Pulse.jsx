const PULSE_STEPS = [
  { n: '01', t: 'Capture', d: 'Conversations and meetings, picked up by device or app.' },
  { n: '02', t: 'Transcribe', d: 'On-device first pass. Cloud refines into structured signal.' },
  { n: '03', t: 'Enrich', d: 'Eijents extract entities, action items, and updates.' },
  { n: '04', t: 'Update', d: 'Pipelines, entities, and Activity move — in real time.' },
];

const PULSE_VARIANTS = [
  { src: '/assets/device-black.jpg', name: 'Pulse · Carbon' },
  { src: '/assets/device-silver.jpg', name: 'Pulse · Silver' },
  { src: '/assets/device-gold.jpg', name: 'Pulse · Gold' },
];

const Pulse = () => (
  <section className="pulse" id="pulse">
    <div className="pulse__cine">
      <video className="pulse__video" autoPlay muted loop playsInline poster="/assets/pulse-hand.jpg" preload="metadata">
        <source src="/assets/pulse-in-use.mp4" type="video/mp4" />
      </video>
      <div className="pulse__cine-overlay" />
      <div className="container pulse__cine-copy">
        <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.85)' }}>Pulse</div>
        <h2 className="pulse__cine-title" style={{ marginTop: 18, color: 'white' }}>
          <span className="pulse__cine-line">The signal layer</span>
          <span className="pulse__cine-line">for the <em>real world.</em></span>
        </h2>
        <p className="pulse__cine-sub">Pocket-sized. Always with you. Pulse captures the conversations and moments that never make it into your CRM — and streams them into Eijent.</p>
        <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
          <a href="#waitlist" className="btn btn--light">Reserve Pulse</a>
          <a href="#pulse-spec" className="btn" style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(12px)' }}>Specs ↓</a>
        </div>
      </div>
    </div>

    <div className="container reveal" style={{ marginTop: 120 }}>
      <div className="pulse__hero pulse__hero--single">
        <div className="pulse__copy">
          <div className="mono" style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>HARDWARE</div>
          <h3 className="display-lg" style={{ color: 'white' }}>Built like a tool. Worn like a habit.</h3>
          <p style={{ marginTop: 20, maxWidth: 560 }}>Brushed aluminum. One button. No screen. Pulse disappears into your day — clip it on, slip it in a pocket, set it on the table.</p>
          <ul className="pulse__bullets">
            <li><span /> Always-on, tap to stop</li>
            <li><span /> Pairs with the Pulse app</li>
            <li><span /> Streams into your Workspace</li>
          </ul>
        </div>
        <div className="pulse__inuse">
          <video muted loop playsInline poster="/assets/pulse-hand.jpg" preload="metadata" data-lazy-video>
            <source src="/assets/pulse-in-use-2.mp4" type="video/mp4" />
          </video>
          <div className="pulse__inuse-tag mono">In motion · pocket to pipeline</div>
        </div>
      </div>

      <div className="pulse__flow" id="pulse-spec" style={{ marginTop: 80 }}>
        {PULSE_STEPS.map(s => (
          <div key={s.n} className="pulse__step">
            <div className="pulse__step-num">{s.n}</div>
            <div className="pulse__step-title">{s.t}</div>
            <div className="pulse__step-desc">{s.d}</div>
          </div>
        ))}
      </div>

      <div className="pulse__specs">
        <div className="pulse__spec">
          <div className="pulse__spec-label">CAPTURE</div>
          <div className="pulse__spec-value">42 hr</div>
          <div className="pulse__spec-desc">Per charge. Auto-syncs over Wi-Fi or LTE.</div>
        </div>
        <div className="pulse__spec">
          <div className="pulse__spec-label">LATENCY</div>
          <div className="pulse__spec-value">&lt; 8 sec</div>
          <div className="pulse__spec-desc">From spoken word to entity update.</div>
        </div>
        <div className="pulse__spec">
          <div className="pulse__spec-label">PRIVACY</div>
          <div className="pulse__spec-value">On-device</div>
          <div className="pulse__spec-desc">First-pass transcription stays local. Encrypted in flight.</div>
        </div>
      </div>

      <div className="pulse__variants">
        {PULSE_VARIANTS.map(v => (
          <div key={v.name} className="pulse__variant">
            <img src={v.src} alt={v.name} loading="lazy" />
            <div className="pulse__variant-name">{v.name}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Pulse;
