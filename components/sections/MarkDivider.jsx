const MarkDivider = () => (
  <section className="mark-divider" aria-label="Brand moment">
    <div className="container">
      <div className="mark-divider__inner">
        <div className="mark-divider__mark" id="markDivider">
          <video muted playsInline poster="/assets/mark-static.png" preload="metadata">
            <source src="/assets/mark-animation.webm" type="video/webm" />
            <source src="/assets/mark-animation.mp4" type="video/mp4" />
            <img src="/assets/mark-static.png" alt="Eijent" />
          </video>
        </div>
        <p className="mark-divider__caption">Eight pillars. <em>One system.</em></p>
        <div className="mark-divider__sub">composed, not assembled</div>
      </div>
    </div>
  </section>
);

export default MarkDivider;
