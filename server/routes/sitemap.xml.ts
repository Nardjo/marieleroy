import { prisma } from '../utils/prisma'

export default defineEventHandler(async event => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.siteUrl || 'https://marie-leroy.com'

  // Static pages
  const staticPages = [
    {
      loc: baseUrl,
      lastmod: new Date().toISOString(),
      priority: 1.0,
      changefreq: 'weekly',
    },
  ]

  // Get all public pages from database (for future blog posts, portfolio items, etc.)
  // For now, we only have the homepage

  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map(
    page => `  <url>
    <loc>${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`

  setHeader(event, 'Content-Type', 'application/xml')
  setHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=3600')

  return sitemap
})
