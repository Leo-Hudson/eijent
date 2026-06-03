'use client';
import React from 'react';

/* ---------- FAQ ---------- */
const FAQ = () => {
  const items = [
    { q: 'When will I get access?', a: 'We onboard a small group of partners every two weeks. Most invitees hear back within 7–10 days. We prioritize teams whose use case helps us learn — early-stage GTM teams, multi-pipeline operators, and anyone running revenue + onboarding + success in one motion.' },
    { q: 'What does access include?', a: 'Full Eijent platform (all eight pillars), unlimited Workspaces during partner program, weekly office hours with the team, and direct Slack with our founders. Pulse hardware ships separately when ready and is included for design partners at no extra cost.' },
    { q: 'Is it really free during private beta?', a: 'Yes — through the design partner program. We\'ll work with you to define a long-term price as we approach general availability. Partners get founding-team pricing in perpetuity.' },
    { q: 'Can I refer someone to skip the line?', a: 'Yes. Once you\'re in, you can refer up to 3 teams that move to the front of the queue. We protect the cohort size on purpose so the experience stays high-touch.' },
    { q: 'What about my existing CRM and tools?', a: 'Eijent doesn\'t require you to migrate. Connect your CRM, email, calendar, and call tools — Eijent reads and writes alongside them. Most partners migrate gradually as their pipelines move into Eijent natively.' },
    { q: 'Where is data stored? Is it secure?', a: 'Data is stored in US-East and EU regions (you choose). Encrypted at rest and in transit. Pulse does first-pass transcription on-device so audio never leaves your context unencrypted. SOC 2 Type II in progress.' },
  ];
  const [open, setOpen] = React.useState(0);
  return (
    <div className="faq__list">
      {items.map((it, i) => (
        <div key={i} className={'faq__item' + (open === i ? ' is-open' : '')}>
          <button className="faq__q" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
            {it.q}
            <span className="faq__plus" aria-hidden="true" />
          </button>
          <div className="faq__a">{it.a}</div>
        </div>
      ))}
    </div>
  );
};

export default FAQ;
