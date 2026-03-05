import { MetadataRoute } from 'next'

const BASE_URL = 'https://www.salsarayo.com'
const LOCALES = ['en', 'el', 'es'] as const

const routes: {
  path: string
  priority: number
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
}[] = [
  { path: '', priority: 1.0, changeFrequency: 'monthly' },
  { path: '/pricing', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/gallery', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/faq', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/orishas', priority: 0.7, changeFrequency: 'monthly' },
]

const sitemap = (): MetadataRoute.Sitemap =>
  routes.map(route => ({
    url: `${BASE_URL}/en${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    alternates: {
      languages: Object.fromEntries(
        LOCALES.map(locale => [locale, `${BASE_URL}/${locale}${route.path}`])
      ),
    },
  }))

export default sitemap
