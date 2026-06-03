import WaitlistForm from '@/components/WaitlistForm';

const InviteBand = () => (
  <section className="invite-band">
    <div className="invite-band__inner">
      <div className="invite-band__copy">
        <div className="invite-band__eyebrow">Private beta · Spring 2026</div>
        <h2 className="invite-band__title">You&rsquo;re early. Eijent is currently <em>invite-only.</em></h2>
        <p className="invite-band__sub">We onboard a small cohort of revenue teams every two weeks. Leave your email and we&rsquo;ll be in touch personally — usually within a week.</p>
      </div>
      <div className="invite-band__form">
        <WaitlistForm variant="band" />
      </div>
    </div>
  </section>
);

export default InviteBand;
