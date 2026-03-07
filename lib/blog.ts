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
}

const calculateReadingTime = (content: string) =>
  Math.ceil(content.split(/\s+/).length / 200);

export const getPostBySlug = (slug: string, locale: string): Post | null => {
  const filePath = path.join(POSTS_DIR, `${slug}.${locale}.md`);

  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    slug,
    frontmatter: data as PostFrontmatter,
    content,
    readingTime: calculateReadingTime(content),
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
