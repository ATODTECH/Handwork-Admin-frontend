import type { MetadataRoute } from 'next'
import { CATEGORY_LINKS } from '@/modules/site/categories-details/data'

const SITE_URL = 'https://www.handworkexpert.com'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/categories`, changeFrequency: 'weekly', priority: 0.9 },
    ...CATEGORY_LINKS.map(({ id }) => ({
      url: `${SITE_URL}/categories/${id}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    { url: `${SITE_URL}/about-us`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/faq`, changeFrequency: 'monthly', priority: 0.6 },
  ]
}
