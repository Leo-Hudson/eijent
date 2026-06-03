import HeroFlow from '@/components/HeroFlow';

const Hero = () => (
  <section className="hero">
    <div className="container container--wide">
      <div className="hero__inner">
        <div className="hero__copy">
          <div className="hero-status" role="note" aria-label="Eijent is currently invite-only">
            <span className="hero-status__dot" aria-hidden="true"></span>
            <span>Eijent is currently invite-only</span>
          </div>
          <h1 className="display-2xl hero__title">Run your company<br />as a <em>system.</em></h1>
          <p className="hero__sub">One platform for your data, pipelines, workflows, and AI — designed together, so your team operates end to end.</p>
          <div className="hero__ctas">
            <a href="#waitlist" className="btn btn--primary">Join the waitlist</a>
            <a href="#architecture" className="btn btn--ghost">Explore the system →</a>
          </div>
          <dl className="hero__stat">
            <div><dt>8</dt><dd>Pillars composed<br />into one platform</dd></div>
            <div><dt>0</dt><dd>Vendors to stitch<br />into a system</dd></div>
            <div><dt>1</dt><dd>System from signal<br />to action</dd></div>
          </dl>
        </div>
        <div className="hero__viz">
          <HeroFlow />
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
