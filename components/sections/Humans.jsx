const ROLES = [
  { role: 'Account Executive', moment: 'Closes from anywhere. Pulse captures every call.', accent: 'var(--indigo-500)', bg: 'linear-gradient(135deg, #EEF1FF 0%, #DDE3FF 100%)',
    art: (<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="20" y="60" width="160" height="120" rx="14" fill="#fff" opacity="0.7"/>
      {[0,1,2,3].map(i => (<g key={i}>
        <circle cx={40 + i*40} cy="120" r="14" fill={i < 3 ? '#6B6AFF' : '#FFD9C4'} opacity={i < 3 ? 0.85 : 1} stroke={i === 3 ? '#E89770' : 'none'} strokeWidth="2"/>
        {i < 3 && <line x1={54 + i*40} y1="120" x2={66 + i*40} y2="120" stroke="#6B6AFF" strokeWidth="2" opacity="0.4"/>}
      </g>))}
      <text x="160" y="125" fontSize="14" fontFamily="system-ui" fontWeight="700" fill="#1a1a2e" textAnchor="middle">✓</text>
      <rect x="40" y="148" width="40" height="6" rx="3" fill="#1a1a2e" opacity="0.15"/>
      <rect x="84" y="148" width="56" height="6" rx="3" fill="#1a1a2e" opacity="0.1"/>
      <g transform="translate(140, 30)">
        <rect x="0" y="0" width="32" height="48" rx="6" fill="#1a1a2e"/>
        <rect x="3" y="6" width="26" height="32" rx="2" fill="#6B6AFF" opacity="0.3"/>
        <circle cx="16" cy="44" r="2" fill="#6B6AFF"/>
      </g>
    </svg>) },
  { role: 'Marketing Lead', moment: 'Ships campaigns as living systems — not launches.', accent: 'var(--peach-300)', bg: 'linear-gradient(135deg, #FFF4ED 0%, #FCE0CC 100%)',
    art: (<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="20" y="50" width="160" height="140" rx="14" fill="#fff" opacity="0.7"/>
      <g transform="translate(40, 100)">
        {[18, 36, 24, 48, 30, 42, 22, 38].map((h, i) => (
          <rect key={i} x={i*16} y={-h} width="10" height={h*2} rx="3" fill={i % 3 === 0 ? '#E89770' : '#1a1a2e'} opacity={i % 3 === 0 ? 1 : 0.2}/>
        ))}
      </g>
      <circle cx="60" cy="70" r="6" fill="#E89770"/>
      <circle cx="100" cy="70" r="6" fill="#FFD9C4"/>
      <circle cx="140" cy="70" r="6" fill="#FFD9C4"/>
      <line x1="60" y1="70" x2="100" y2="70" stroke="#E89770" strokeWidth="1.5" opacity="0.4"/>
      <line x1="100" y1="70" x2="140" y2="70" stroke="#E89770" strokeWidth="1.5" opacity="0.4" strokeDasharray="2 3"/>
    </svg>) },
  { role: 'Founder', moment: 'Sees the whole company in one model.', accent: 'var(--lilac-300)', bg: 'linear-gradient(135deg, #F4EFFF 0%, #E2D5FF 100%)',
    art: (<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="100" cy="120" r="22" fill="#1a1a2e"/>
      <text x="100" y="125" fontSize="11" fontFamily="system-ui" fontWeight="700" fill="#fff" textAnchor="middle">CO</text>
      {[{ x: 50, y: 70, label: 'S' },{ x: 150, y: 70, label: 'M' },{ x: 40, y: 160, label: 'O' },{ x: 160, y: 160, label: 'F' }].map((n, i) => (
        <g key={i}>
          <line x1="100" y1="120" x2={n.x} y2={n.y} stroke="#9C8AE0" strokeWidth="1.5" opacity="0.6"/>
          <circle cx={n.x} cy={n.y} r="14" fill="#fff" stroke="#9C8AE0" strokeWidth="2"/>
          <text x={n.x} y={n.y + 4} fontSize="11" fontFamily="system-ui" fontWeight="700" fill="#1a1a2e" textAnchor="middle">{n.label}</text>
        </g>
      ))}
    </svg>) },
  { role: 'Ops Manager', moment: 'Coordinates five pipelines without integration glue.', accent: 'var(--mint-200)', bg: 'linear-gradient(135deg, #EAF7F1 0%, #CFEDDF 100%)',
    art: (<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="20" y="50" width="160" height="140" rx="14" fill="#fff" opacity="0.7"/>
      {[0,1,2,3].map(row => (
        <g key={row} transform={`translate(0, ${75 + row*28})`}>
          <rect x="40" y="0" width="120" height="14" rx="7" fill="#1a1a2e" opacity="0.08"/>
          <rect x="40" y="0" width={[80, 50, 100, 30][row]} height="14" rx="7" fill="#7DC9A6"/>
          <circle cx={40 + [80, 50, 100, 30][row]} cy="7" r="5" fill="#fff" stroke="#7DC9A6" strokeWidth="2"/>
        </g>
      ))}
      <path d="M 130 89 Q 145 103 130 117" fill="none" stroke="#E89770" strokeWidth="1.5" strokeDasharray="3 2"/>
      <path d="M 90 117 Q 105 131 90 145" fill="none" stroke="#E89770" strokeWidth="1.5" strokeDasharray="3 2"/>
    </svg>) },
];

const Humans = () => (
  <section className="humans">
    <div className="container reveal">
      <div className="humans__head">
        <div className="eyebrow eyebrow--indigo">Built for humans</div>
        <h2 className="display-lg" style={{ marginTop: 12 }}>The system runs in the background.<br /><em style={{ fontWeight: 700, color: 'var(--indigo-700)' }}>People</em> stay in the foreground.</h2>
        <p className="lede" style={{ marginTop: 16, maxWidth: 720 }}>Built for the person on the call, the founder between meetings, the operator running five teams. The system handles the structure — so they stay present.</p>
      </div>
      <div className="humans__feature humans__feature--type">
        <div className="humans__feature-mark" aria-hidden="true">&ldquo;</div>
        <div className="humans__feature-copy">
          <div className="mono humans__feature-eyebrow">A day with Eijent</div>
          <blockquote className="humans__quote">I used to lose <span className="humans__hl">90 minutes a day</span> updating systems after calls. Now Pulse captures the conversation, Eijent updates the deal, and I&rsquo;m on the next call.</blockquote>
          <div className="humans__cite">
            <div className="humans__cite-name">Maya</div>
            <div className="humans__cite-role">Account Executive · Series B SaaS</div>
          </div>
        </div>
      </div>
      <div className="humans__roles">
        {ROLES.map((h, i) => (
          <div key={h.role} className="humans__role-card" style={{ '--accent': h.accent, animationDelay: `${i * 60}ms` }}>
            <div className="humans__role-art" style={{ background: h.bg }}>
              {h.art}
            </div>
            <div className="humans__role-body">
              <div className="humans__role-name">{h.role}</div>
              <div className="humans__role-moment">{h.moment}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Humans;
