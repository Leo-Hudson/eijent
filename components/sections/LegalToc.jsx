'use client';
import React from 'react';

/* Sticky table of contents with scroll-spy highlighting for the legal pages.
   `items` is an array of { id, label }; ids must match the section anchors.

   Active section is derived from heading geometry (the last heading whose top
   has scrolled above the nav offset) rather than a thin IntersectionObserver
   band — the band approach left the highlight stuck or off-by-one at the page
   extremes and while click-scrolling. A click-lock suppresses scroll-driven
   updates while the programmatic smooth scroll is animating so the clicked
   item highlights immediately and stays put. */

// Distance below the fixed nav at which a section counts as "current".
// Matches the h2 `scroll-margin-top` (100px) so a clicked section that lands
// just under the nav is recognised as active.
const NAV_OFFSET = 120;

const LegalToc = ({ items }) => {
  const [active, setActive] = React.useState(items[0]?.id ?? null);
  // While true, scroll events don't repaint the active item (set during a
  // click-driven smooth scroll so intermediate sections can't steal it).
  const lockRef = React.useRef(false);
  const releaseTimer = React.useRef(null);

  React.useEffect(() => {
    const ids = items.map((i) => i.id);

    const computeActive = () => {
      if (lockRef.current) return;

      // At the very bottom, the last heading may never reach the offset line,
      // so pin the final section once the page is scrolled to the end.
      const doc = document.documentElement;
      const atBottom =
        window.innerHeight + window.scrollY >= doc.scrollHeight - 2;
      if (atBottom) {
        setActive((prev) => (prev === ids[ids.length - 1] ? prev : ids[ids.length - 1]));
        return;
      }

      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top - NAV_OFFSET <= 1) {
          current = id;
        } else {
          break; // headings are in document order — stop at the first one below
        }
      }
      setActive((prev) => (prev === current ? prev : current));
    };

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        computeActive();
      });
    };

    computeActive();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
      if (releaseTimer.current) clearTimeout(releaseTimer.current);
    };
  }, [items]);

  const handleClick = (e, id) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();

    // Highlight the target immediately and hold it through the animation.
    setActive(id);
    lockRef.current = true;
    if (releaseTimer.current) clearTimeout(releaseTimer.current);

    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Keep the URL shareable without adding a history entry per click.
    if (window.history?.replaceState) {
      window.history.replaceState(null, '', `#${id}`);
    }

    // Release the lock once the smooth scroll settles. Prefer the native
    // `scrollend` event; otherwise fall back to a timeout.
    const release = () => {
      lockRef.current = false;
      if (releaseTimer.current) clearTimeout(releaseTimer.current);
    };
    if ('onscrollend' in window) {
      window.addEventListener('scrollend', release, { once: true });
      releaseTimer.current = setTimeout(release, 1000); // safety net
    } else {
      releaseTimer.current = setTimeout(release, 700);
    }
  };

  return (
    <aside className="toc" aria-label="Table of contents">
      <div className="toc__title">On this page</div>
      <ul className="toc__list">
        {items.map((i) => (
          <li key={i.id}>
            <a
              href={`#${i.id}`}
              aria-current={active === i.id ? 'true' : undefined}
              className={active === i.id ? 'is-active' : undefined}
              onClick={(e) => handleClick(e, i.id)}
            >
              {i.label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default LegalToc;
