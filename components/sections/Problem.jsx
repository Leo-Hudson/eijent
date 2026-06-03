const Problem = () => (
  <section className="sec problem">
    <div className="container container--narrow reveal">
      <div className="eyebrow eyebrow--indigo">The problem</div>
      <h2 className="display-lg" style={{ marginTop: 12 }}>Your team is the <em style={{ color: 'var(--peach-300)', fontStyle: 'normal', fontWeight: 800 }}>integration.</em></h2>
      <p className="lede" style={{ marginTop: 20 }}>People copy from CRM to spreadsheets, paste from email into notes, retype meeting takeaways into tickets. The work is real. The system is improvised.</p>
    </div>
    <div className="container reveal" style={{ marginTop: 56 }}>
      <div className="problem__human">
        <div className="problem__person">
          <div className="problem__avatar problem__avatar--maya">
            <svg viewBox="0 0 80 80" width="56" height="56" aria-hidden="true">
              <circle cx="40" cy="32" r="14" fill="currentColor" opacity="0.85"/>
              <path d="M14 72 C14 56 26 50 40 50 C54 50 66 56 66 72" fill="currentColor" opacity="0.85"/>
            </svg>
          </div>
          <div className="problem__name">Maya · Account Executive</div>
          <div className="problem__quote">&ldquo;I close on the call, then spend an hour updating six places.&rdquo;</div>
        </div>
        <div className="problem__tabs">
          {[['CRM','one record'],['Notes','one truth'],['Email','one thread'],['Sheet','one forecast'],['Slack','one update'],['Tasks','one list']].map(([t, s]) => (
            <div key={t} className="problem__tab">
              <span className="problem__tab-name">{t}</span>
              <span className="problem__tab-sub">{s}</span>
            </div>
          ))}
          <div className="problem__seam" />
        </div>
        <div className="problem__result">
          <div className="mono" style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, marginBottom: 10 }}>THE COST</div>
          <h4>Hours a day stitching tools.</h4>
          <p>Knowledge fragments. Hand-offs slip. AI is bolted on, not built in. Leaders see snapshots, never the system.</p>
        </div>
      </div>
    </div>
  </section>
);

export default Problem;
