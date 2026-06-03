const SITE_URL = 'https://eijent.com';

export const dynamic = 'force-static';

export default function sitemap() {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
