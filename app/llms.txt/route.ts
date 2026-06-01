import { getAllPosts } from "@/lib/blog";

const BASE_URL = "https://www.salsarayo.com";

export const revalidate = 3600;

export const GET = () => {
  const posts = getAllPosts("en");

  const blogList = posts
    .map(
      (post) =>
        `- [${post.frontmatter.title}](${BASE_URL}/en/blog/${post.slug}): ${post.frontmatter.description}`
    )
    .join("\n");

  const body = `# Salsa Rayo Dance School

> Salsa Rayo is a New York Style Salsa (On2) and Bachata dance school in Agios Dimitrios, Athens, Greece. We offer classes for all levels, plus Mambo, Pachanga, and Styling. Founded September 2025.

## About

- Location: Thermopylon 19, Agios Dimitrios, Athens, Greece
- Primary dances: New York Style Salsa (On2), Bachata, Mambo, Pachanga
- Class hours: Mon-Tue 19:00-22:00, Wed-Thu 19:00-23:00
- Packages: Rayo 8 (€50/mo), Rayo 16 (€75/mo), Rayo 24 (€99/mo)
- Languages: English, Greek, Spanish

## Key Pages

- [Home](${BASE_URL}/en): Overview, schedule, contact
- [Pricing](${BASE_URL}/en/pricing): Monthly subscription packages
- [FAQ](${BASE_URL}/en/faq): Common questions about classes, levels, partners
- [Blog](${BASE_URL}/en/blog): Articles about salsa, bachata, and Latin dance
- [Orishas](${BASE_URL}/en/orishas): Educational guide to Afro-Cuban Orisha rhythms
- [Gallery](${BASE_URL}/en/gallery): Photos and videos of classes and events

## Blog Articles

${blogList}

## Machine-Readable Resources

- Sitemap: ${BASE_URL}/sitemap.xml
- RSS feed: ${BASE_URL}/feed.xml
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
};
