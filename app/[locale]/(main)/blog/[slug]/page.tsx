import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { getBreadcrumbSchema } from "@/lib/schema";
import { getPostBySlug, getAllSlugs } from "@/lib/blog";
import { notFound } from "next/navigation";
import { BlogArticle } from "./BlogArticle";

const BASE_URL = "https://www.salsarayo.com";

interface BlogPostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export const revalidate = 3600;

export const generateStaticParams = () =>
  getAllSlugs().flatMap((slug) => [
    { locale: "en", slug },
    { locale: "el", slug },
  ]);

export const generateMetadata = async ({
  params,
}: BlogPostPageProps): Promise<Metadata> => {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug, locale);

  if (!post) return { title: "Not Found" };

  const { title, description, image } = post.frontmatter;
  const ogImage = image
    ? { url: `${BASE_URL}${image}`, width: 1200, height: 630, alt: title }
    : {
        url: `${BASE_URL}/images/logo-big.png`,
        width: 1200,
        height: 630,
        alt: "Salsa Rayo Dance School",
      };

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/blog/${slug}`,
      languages: {
        en: `${BASE_URL}/en/blog/${slug}`,
        el: `${BASE_URL}/el/blog/${slug}`,
        "x-default": `${BASE_URL}/en/blog/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/blog/${slug}`,
      siteName: "Salsa Rayo",
      type: "article",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
};

const BlogPostPage = async ({ params }: BlogPostPageProps) => {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug, locale);

  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.frontmatter.title,
    description: post.frontmatter.description,
    url: `${BASE_URL}/${locale}/blog/${slug}`,
    inLanguage: locale,
    author: {
      "@type": "Organization",
      name: post.frontmatter.author,
      "@id": `${BASE_URL}/#organization`,
    },
    publisher: {
      "@id": `${BASE_URL}/#organization`,
    },
    image: post.frontmatter.image
      ? `${BASE_URL}${post.frontmatter.image}`
      : undefined,
    datePublished: post.frontmatter.date,
    dateModified: post.frontmatter.date,
    mainEntityOfPage: `${BASE_URL}/${locale}/blog/${slug}`,
  };

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: `${BASE_URL}/${locale}` },
    { name: "Blog", url: `${BASE_URL}/${locale}/blog` },
    {
      name: post.frontmatter.title,
      url: `${BASE_URL}/${locale}/blog/${slug}`,
    },
  ]);

  return (
    <>
      <JsonLd data={[breadcrumbSchema, articleSchema]} />
      <BlogArticle post={post} locale={locale} />
    </>
  );
};

export default BlogPostPage;
