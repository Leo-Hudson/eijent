import { SITE_URL, isProduction } from '@/lib/seo';

export const dynamic = 'force-static';

export default function robots() {
  // Block all crawling on non-production (preview/staging) deploys.
  if (!isProduction) {
    return {
      rules: { userAgent: '*', disallow: '/' },
    };
  }

  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
