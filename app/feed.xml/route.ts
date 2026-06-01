import { getAllPosts } from "@/lib/blog";

const BASE_URL = "https://www.salsarayo.com";
const BLOG_LOCALES = ["en", "el"] as const;

const escapeXml = (str: string) =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export const revalidate = 3600;

export const GET = () => {
  const allEntries = BLOG_LOCALES.flatMap((locale) =>
    getAllPosts(locale).map((post) => ({ post, locale }))
  ).sort(
    (a, b) =>
      new Date(b.post.frontmatter.date).getTime() -
      new Date(a.post.frontmatter.date).getTime()
  );

  const lastBuildDate =
    allEntries.length > 0
      ? new Date(allEntries[0].post.frontmatter.date).toUTCString()
      : new Date().toUTCString();

  const items = allEntries
    .map(({ post, locale }) => {
      const url = `${BASE_URL}/${locale}/blog/${post.slug}`;
      const pubDate = new Date(post.frontmatter.date).toUTCString();
      return `    <item>
      <title>${escapeXml(post.frontmatter.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.frontmatter.description)}</description>
      <category>${escapeXml(post.frontmatter.category)}</category>
      <pubDate>${pubDate}</pubDate>
      <author>noreply@salsarayo.com (${escapeXml(post.frontmatter.author)})</author>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Salsa Rayo Dance School - Blog</title>
    <link>${BASE_URL}/en/blog</link>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Articles about salsa, bachata, and Latin dance from Salsa Rayo Dance School in Athens, Greece.</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
};
