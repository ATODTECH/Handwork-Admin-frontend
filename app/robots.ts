import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Block authenticated/dashboard routes from indexing
      disallow: ['/dashboard', '/admin/'],
    },
    sitemap: 'https://www.handworkexpert.com/sitemap.xml',
  }
}
