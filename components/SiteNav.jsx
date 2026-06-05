'use client';
import React from 'react';

const NAV_SECTIONS = ['architecture', 'pipelines', 'ai', 'pulse', 'cases'];

// Root-relative hashes so the links also work from sub-pages (e.g. /privacy-policy);
// on the home page the browser just scrolls to the anchor.
const NAV_LINKS = [
  { href: '/#architecture', label: 'System' },
  { href: '/#pipelines', label: 'Pipelines' },
  { href: '/#ai', label: 'AI' },
  { href: '/#pulse', label: 'Pulse' },
  { href: '/#cases', label: 'Use cases' },
];

const SiteNav = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [active, setActive] = React.useState(null);

  // Lock scroll while the mobile menu is open + close on Escape.
  React.useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Scroll-active section highlighting.
  React.useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const sections = NAV_SECTIONS
      .map(id => document.getElementById(id))
      .filter(Boolean);
    if (!sections.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach(s => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* Skip link */}
      <a className="skip" href="#main">Skip to content</a>

      {/* Floating nav */}
      <nav className="nav-pill" aria-label="Primary">
        <a href="/" className="nav-pill__brand" aria-label="Eijent home">
          <span className="nav-pill__brand-mark">
            <video autoPlay muted loop playsInline poster="/assets/mark-static.png" aria-hidden="true">
              <source src="/assets/mark-animation.webm" type="video/webm" />
              <source src="/assets/mark-animation.mp4" type="video/mp4" />
              <img src="/assets/mark-static.png" alt="" />
            </video>
          </span>
          <span>Eijent</span>
        </a>
        <div className="nav-pill__links">
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href}
               className={'nav-pill__link' + (active === l.href.split('#')[1] ? ' is-active' : '')}>
              {l.label}
            </a>
          ))}
        </div>
        <a href="/#waitlist" className="nav-pill__cta">Join waitlist</a>
        <button className="nav-pill__menu-btn" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 5h12M3 9h12M3 13h12"/></svg>
        </button>
      </nav>

      {/* Mobile menu sheet */}
      <div className={'mobile-menu' + (menuOpen ? ' is-open' : '')} role="dialog" aria-modal="true" aria-label="Mobile menu"
           onClick={(e) => { if (e.target === e.currentTarget) setMenuOpen(false); }}>
        <div className="mobile-menu__sheet">
          <button className="mobile-menu__close" aria-label="Close menu" onClick={() => setMenuOpen(false)}>×</button>
          <div className="mobile-menu__title">Navigate</div>
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} className="mobile-menu__link" onClick={() => setMenuOpen(false)}>{l.label}</a>
          ))}
          <a href="/#waitlist" className="mobile-menu__cta" onClick={() => setMenuOpen(false)}>Join the waitlist</a>
        </div>
      </div>
    </>
  );
};

export default SiteNav;
