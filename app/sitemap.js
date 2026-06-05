import { SITE_URL } from '@/lib/seo';

export const dynamic = 'force-static';

export default function sitemap() {
  const lastModified = new Date();
  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/terms-of-use`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];
}
