import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { getAllPosts } from "@/lib/blog";
import BlogCard, { BlogCardGrid } from "@/components/blog/BlogCard";
import { SUPPORTED_LOCALES } from "@/i18n/routing";

interface BlogTeaserSectionProps {
  locale: (typeof SUPPORTED_LOCALES)[number];
}

const BlogTeaserSection = async ({ locale }: BlogTeaserSectionProps) => {
  const t = await getTranslations({ locale, namespace: "BlogTeaser" });
  const posts = getAllPosts(locale).slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-primary to-brand-pink bg-clip-text text-transparent">
            {t("title")}
          </span>
        </h2>
        <p className="text-foreground/70 max-w-2xl mx-auto">{t("subtitle")}</p>
      </div>

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

      <div className="flex justify-center mt-10">
        <Button variant="gradient" size="lg" asChild>
          <Link href="/blog">
            {t("cta")}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default BlogTeaserSection;
