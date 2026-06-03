import WaitlistForm from '@/components/WaitlistForm';

const Closer = () => (
  <section className="closer" id="waitlist">
    <div className="container container--narrow closer__inner">
      <div className="closer__mark">
        <video autoPlay muted loop playsInline poster="/assets/mark-static.png" aria-hidden="true">
          <source src="/assets/mark-animation.webm" type="video/webm" />
          <source src="/assets/mark-animation.mp4" type="video/mp4" />
          <img src="/assets/mark-static.png" alt="Eijent" />
        </video>
      </div>
      <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.7)' }}>Build your operational system</div>
      <h2 className="display-2xl" style={{ marginTop: 16, color: 'white' }}>Stop stitching tools.<br />Start operating.</h2>
      <p className="lede" style={{ color: 'rgba(255,255,255,0.85)' }}>Eijent is currently invite-only. Leave your email and we&rsquo;ll be in touch personally.</p>
      <div className="closer__form">
        <WaitlistForm variant="closer" />
      </div>
    </div>
  </section>
);

export default Closer;
