const Footer = () => (
  <footer className="foot">
    <div className="container">
      <div className="foot__row">
        <div className="foot__brand">
          <span className="foot__brand-mark"><img src="/assets/mark-static.png" alt="" /></span>
          Eijent
        </div>
        <div className="foot__links">
          <a href="#architecture">System</a>
          <a href="#pipelines">Pipelines</a>
          <a href="#ai">AI</a>
          <a href="#pulse">Pulse</a>
          <a href="#cases">Use cases</a>
        </div>
        <div className="foot__links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="mailto:hello@eijent.app">hello@eijent.app</a>
        </div>
      </div>
      <div className="foot__legal">© 2026 Eijent · Run your company as a system.</div>
    </div>
  </footer>
);

export default Footer;
