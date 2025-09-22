import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.salsarayo.com'
  const locales = ['en', 'el']
  
  const routes = [
    { path: '', priority: 1.0 },
    { path: '/pricing', priority: 0.9 },
    { path: '/gallery', priority: 0.8 },
  ]
  
  return routes.flatMap(route => 
    locales.map(locale => ({
      url: `${baseUrl}/${locale}${route.path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route.priority,
    }))
  )
}