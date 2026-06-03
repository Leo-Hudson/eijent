# Eijent — Website (Next.js)

The Eijent marketing site, converted from a single-file React/Babel HTML bundle
(`legacy/eijent-v3.html`) into a proper **Next.js 16 (App Router)** app that is
**SEO-ready**. The landing page is **statically generated (SSG)** at build time
and served by the standard Next.js runtime (`next build` / `next start`), so
server features (API routes, ISR, image optimization) stay available.

## What's here

```
app/
  layout.jsx     Root layout: SEO metadata, next/font, SiteNav, Behaviors
  page.jsx       The full landing page (server component → prerendered HTML)
  globals.css    All styles (extracted from the original inline <style>)
  robots.js      /robots.txt
  sitemap.js     /sitemap.xml
components/       Interactive widgets ('use client') + SiteNav + Behaviors
public/assets/    Images, videos, favicons
```

### How it maps to the original

- **Static, crawlable content** (hero copy, problem/solution, pulse specs,
  departments, humans, FAQ headings, footer) is rendered on the server in
  `app/page.jsx` — so search engines and social scrapers get real HTML.
- **Interactive pieces** (architecture explorer, pipeline demo, Copilot chat,
  Eijent triggers, activity feed, workflow builder, use-case tabs, FAQ
  accordion, waitlist form) are React **client components** under `components/`.
- **Scroll behaviors** from the original vanilla `<script>` (reveal-on-scroll,
  scroll-active nav, play-once mark video, lazy Pulse video) live in
  `components/Behaviors.jsx` and `components/SiteNav.jsx`.
- **Fonts** (Manrope / Inter / JetBrains Mono) are loaded via `next/font`
  instead of a render-blocking Google Fonts `<link>`.

### SEO

- Title, description, canonical, Open Graph + Twitter cards, favicons and
  `theme-color` via the App Router `metadata` / `viewport` exports in
  `app/layout.jsx`.
- `robots.txt` and `sitemap.xml` generated at build time.
- Update `SITE_URL` in `app/layout.jsx`, `app/robots.js`, and `app/sitemap.js`
  if the domain changes.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
```

## Build & run (production)

```bash
npm run build      # prerenders the page (SSG) into .next
npm start          # serves it on http://localhost:3000
```

Deploy to any Next.js host (Vercel, or a Node server / container via `next start`).

> The waitlist form is a front-end stub (stores to `localStorage`). Wire
> `components/WaitlistForm.jsx` to a real endpoint (e.g. `/api/waitlist`,
> Loops, or Resend) when ready.

The original `eijent-v3.html` and sibling source files live in `legacy/` for
reference and can be deleted once you're happy with the port.
