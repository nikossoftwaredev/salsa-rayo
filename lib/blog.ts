import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "lib/blog/posts");

export interface PostFrontmatter {
  title: string;
  description: string;
  author: string;
  date: string;
  excerpt: string;
  category: string;
  tags: string[];
  image: string;
}

export interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
  readingTime: number;
  wordCount: number;
}

const countWords = (content: string) =>
  content.split(/\s+/).filter(Boolean).length;

const calculateReadingTime = (wordCount: number) =>
  Math.ceil(wordCount / 200);

export const getPostBySlug = (slug: string, locale: string): Post | null => {
  const filePath = path.join(POSTS_DIR, `${slug}.${locale}.md`);

  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const wordCount = countWords(content);

  return {
    slug,
    frontmatter: data as PostFrontmatter,
    content,
    wordCount,
    readingTime: calculateReadingTime(wordCount),
  };
};

export const getAllPosts = (locale: string): Post[] => {
  const slugs = getAllSlugs();

  return slugs
    .map((slug) => getPostBySlug(slug, locale))
    .filter((post): post is Post => post !== null)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );
};

export const getAllSlugs = (): string[] => {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs.readdirSync(POSTS_DIR);

  const slugs = new Set(
    files
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.replace(/\.(en|el)\.md$/, ""))
  );

  return Array.from(slugs);
};

export const getRelatedPosts = (
  currentSlug: string,
  locale: string,
  limit = 3
): Post[] => {
  const current = getPostBySlug(currentSlug, locale);
  if (!current) return [];

  const others = getAllPosts(locale).filter((p) => p.slug !== currentSlug);

  const scored = others.map((post) => {
    const sharedTags = post.frontmatter.tags.filter((tag) =>
      current.frontmatter.tags.includes(tag)
    ).length;
    const sameCategory =
      post.frontmatter.category === current.frontmatter.category ? 1 : 0;
    return { post, score: sharedTags * 2 + sameCategory };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.post);
};
