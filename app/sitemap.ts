import { MetadataRoute } from 'next'
import { getAllSlugs, getPostBySlug } from '@/lib/blog'

const BASE_URL = 'https://www.salsarayo.com'
const LOCALES = ['en', 'el', 'es'] as const
const BLOG_LOCALES = ['en', 'el'] as const

const sitemap = (): MetadataRoute.Sitemap => {
  const now = new Date()
  const staticPaths = ['', '/pricing', '/gallery', '/blog', '/faq', '/orishas', '/bachata']

  const staticRoutes = staticPaths.map(path => ({
    url: `${BASE_URL}/en${path}`,
    lastModified: now,
    alternates: {
      languages: {
        ...Object.fromEntries(
          LOCALES.map(locale => [locale, `${BASE_URL}/${locale}${path}`])
        ),
        'x-default': `${BASE_URL}/en${path}`,
      },
    },
  }))

  const blogSlugs = getAllSlugs()
  const blogRoutes = blogSlugs.map(slug => {
    const post = getPostBySlug(slug, 'en')
    const lastModified = post?.frontmatter.date
      ? new Date(post.frontmatter.date)
      : now
    return {
      url: `${BASE_URL}/en/blog/${slug}`,
      lastModified,
      alternates: {
        languages: {
          ...Object.fromEntries(
            BLOG_LOCALES.map(locale => [locale, `${BASE_URL}/${locale}/blog/${slug}`])
          ),
          'x-default': `${BASE_URL}/en/blog/${slug}`,
        },
      },
    }
  })

  return [...staticRoutes, ...blogRoutes]
}

export default sitemap
