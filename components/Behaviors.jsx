'use client';
import React from 'react';

/* Renders nothing — wires up scroll-driven effects against the
   server-rendered DOM, mirroring the original vanilla-JS behavior. */
const Behaviors = () => {
  React.useEffect(() => {
    const cleanups = [];

    // Reveal-on-scroll for `.reveal` elements.
    if ('IntersectionObserver' in window) {
      const revealIO = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-in'); });
      }, { threshold: 0.12 });
      document.querySelectorAll('.reveal').forEach(el => revealIO.observe(el));
      cleanups.push(() => revealIO.disconnect());
    }

    // Mark divider — play once when in view.
    const markDiv = document.getElementById('markDivider');
    if (markDiv && 'IntersectionObserver' in window) {
      const v = markDiv.querySelector('video');
      const markIO = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting && v) {
            v.play().catch(() => {});
            v.addEventListener('ended', () => v.pause(), { once: true });
            markIO.unobserve(e.target);
          }
        });
      }, { threshold: 0.4 });
      markIO.observe(markDiv);
      cleanups.push(() => markIO.disconnect());
    }

    // Lazy-load secondary Pulse video — start only when in view.
    const lazyVideos = document.querySelectorAll('[data-lazy-video]');
    if (lazyVideos.length && 'IntersectionObserver' in window) {
      const vIO = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const v = e.target;
            v.play().catch(() => {});
            vIO.unobserve(v);
          }
        });
      }, { threshold: 0.3 });
      lazyVideos.forEach(v => vIO.observe(v));
      cleanups.push(() => vIO.disconnect());
    }

    return () => cleanups.forEach(fn => fn());
  }, []);

  return null;
};

export default Behaviors;
