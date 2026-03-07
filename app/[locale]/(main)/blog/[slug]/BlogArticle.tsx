"use client";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { FaArrowLeft, FaClock, FaCalendarAlt } from "react-icons/fa";
import type { Post } from "@/lib/blog";

interface BlogArticleProps {
  post: Post;
  locale: string;
}

export const BlogArticle = ({ post, locale }: BlogArticleProps) => {
  const formattedDate = new Date(post.frontmatter.date).toLocaleDateString(
    locale === "el" ? "el-GR" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-20 md:py-28 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative z-10 mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <FaArrowLeft className="size-3" />
            {locale === "el" ? "Πίσω στο Blog" : "Back to Blog"}
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
              {post.frontmatter.category}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <FaCalendarAlt className="size-3" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <FaClock className="size-3" />
              {post.readingTime} min {locale === "el" ? "ανάγνωση" : "read"}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-brand-pink bg-clip-text text-transparent">
              {post.frontmatter.title}
            </span>
          </h1>

          <p className="text-lg text-foreground/70">
            {post.frontmatter.description}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 pb-16">
        <div className="mx-auto max-w-3xl">
          <article className="rounded-2xl border border-border/30 bg-card/80 p-6 sm:p-8 md:p-12">
            <div className="prose prose-lg prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground/80 prose-strong:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-li:text-foreground/80 prose-th:text-foreground prose-td:text-foreground/70 [word-break:break-word] overflow-wrap-anywhere">
              <Markdown
                remarkPlugins={[remarkGfm]}
                components={{
                  img: ({ src, alt }) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={src}
                      alt={alt || ""}
                      className="rounded-lg shadow-md max-w-full h-auto"
                      loading="lazy"
                    />
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                      <table className="w-full">{children}</table>
                    </div>
                  ),
                  tr: ({ children }) => (
                    <tr className="hover:bg-card/60 transition-colors">
                      {children}
                    </tr>
                  ),
                  th: ({ children }) => (
                    <th className="bg-card/40 p-3 text-left font-semibold">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="p-3 border-t border-border/20">
                      {children}
                    </td>
                  ),
                  a: ({ href, children }) => {
                    const isExternal =
                      href?.startsWith("http") || href?.startsWith("//");
                    if (isExternal)
                      return (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {children}
                        </a>
                      );
                    return <a href={href}>{children}</a>;
                  },
                }}
              >
                {post.content}
              </Markdown>
            </div>
          </article>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-brand-pink bg-clip-text text-transparent">
            {locale === "el"
              ? "Έτοιμοι να Ξεκινήσετε;"
              : "Ready to Get Started?"}
          </h2>
          <p className="text-foreground/70 mb-8 max-w-xl mx-auto">
            {locale === "el"
              ? "Ελάτε να χορέψουμε μαζί στη Salsa Rayo. Επικοινωνήστε μαζί μας για να κλείσετε το πρώτο σας μάθημα."
              : "Come dance with us at Salsa Rayo. Get in touch to book your first class."}
          </p>
          <Button variant="gradient" size="lg" asChild>
            <Link href="/#contact-form">
              {locale === "el" ? "Επικοινωνήστε Μαζί Μας" : "Contact Us"}
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
};
