import type { Metadata } from "next";
import type { BasePageProps } from "@/types/pageprops";
import JsonLd from "@/components/JsonLd";
import { getBreadcrumbSchema } from "@/lib/schema";
import { getAllPosts } from "@/lib/blog";
import BlogCard, { BlogCardGrid } from "@/components/blog/BlogCard";

const BASE_URL = "https://www.salsarayo.com";

const metadata: Record<string, { title: string; description: string }> = {
  en: {
    title: "Blog | Salsa Rayo Dance School — Articles & Tips",
    description:
      "Read articles about salsa, bachata, dance tips, and Latin dance culture. Expert insights from Salsa Rayo Dance School in Athens, Greece.",
  },
  el: {
    title: "Blog | Salsa Rayo — Άρθρα & Συμβουλές Χορού",
    description:
      "Διαβάστε άρθρα για salsa, bachata, συμβουλές χορού και κουλτούρα Latin χορού. Εξειδικευμένες γνώσεις από τη Salsa Rayo στην Αθήνα.",
  },
};

export const generateMetadata = async ({
  params,
}: BasePageProps): Promise<Metadata> => {
  const { locale } = await params;
  const localeMetadata = metadata[locale] || metadata.en;

  return {
    title: localeMetadata.title,
    description: localeMetadata.description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/blog`,
      languages: {
        en: `${BASE_URL}/en/blog`,
        el: `${BASE_URL}/el/blog`,
        "x-default": `${BASE_URL}/en/blog`,
      },
    },
    openGraph: {
      title: localeMetadata.title,
      description: localeMetadata.description,
      url: `${BASE_URL}/${locale}/blog`,
      siteName: "Salsa Rayo",
      type: "website",
    },
  };
};

const BlogPage = async ({ params }: BasePageProps) => {
  const { locale } = await params;
  const posts = getAllPosts(locale);

  return (
    <main className="min-h-screen bg-background">
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", url: `${BASE_URL}/${locale}` },
          { name: "Blog", url: `${BASE_URL}/${locale}/blog` },
        ])}
      />

      {/* Hero Section */}
      <section className="relative py-24 md:py-32 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-brand-pink bg-clip-text text-transparent">
              {locale === "el" ? "Άρθρα & Συμβουλές" : "Articles & Tips"}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto">
            {locale === "el"
              ? "Ανακαλύψτε τον κόσμο της Salsa και της Bachata μέσα από τα άρθρα μας."
              : "Discover the world of Salsa and Bachata through our articles."}
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="px-4 pb-24">
        <div className="mx-auto max-w-6xl">
          {posts.length > 0 ? (
            <BlogCardGrid>
              {posts.map((post) => (
                <BlogCard
                  key={post.slug}
                  slug={post.slug}
                  title={post.frontmatter.title}
                  excerpt={post.frontmatter.excerpt}
                  date={post.frontmatter.date}
                  readingTime={post.readingTime}
                  category={post.frontmatter.category}
                  locale={locale}
                />
              ))}
            </BlogCardGrid>
          ) : (
            <p className="text-center text-muted-foreground">
              {locale === "el"
                ? "Δεν υπάρχουν ακόμη άρθρα."
                : "No articles yet."}
            </p>
          )}
        </div>
      </section>
    </main>
  );
};

export default BlogPage;
