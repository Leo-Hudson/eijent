// Public canonical URL — used for metadata, sitemap and robots.
// Set BASE_URL per environment (e.g. https://eijent.com in production).
export const SITE_URL = process.env.BASE_URL || 'https://eijent.com';

// Treat the site as production only when explicitly flagged. Preview/staging
// deploys (which don't set ENVIRONMENT=PRODUCTION) stay noindex so they never
// get crawled or indexed by Google. VERCEL_ENV is a fallback for the canonical
// Vercel production deployment.
export const isProduction =
  process.env.ENVIRONMENT === 'PRODUCTION' || process.env.VERCEL_ENV === 'production';
