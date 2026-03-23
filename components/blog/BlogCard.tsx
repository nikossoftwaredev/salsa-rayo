"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { ArrowRight, Clock } from "lucide-react";

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: number;
  category: string;
  locale: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const BlogCardGrid = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <motion.div
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
  >
    {children}
  </motion.div>
);

const BlogCard = ({
  slug,
  title,
  excerpt,
  date,
  readingTime,
  category,
  locale,
}: BlogCardProps) => {
  const formattedDate = new Date(date).toLocaleDateString(
    locale === "el" ? "el-GR" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <motion.article variants={itemVariants}>
      <Link
        href={`/blog/${slug}`}
        className="group block h-full rounded-xl border border-border/30 bg-card/80 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30"
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
            {category}
          </span>
          <span className="text-xs text-muted-foreground">{formattedDate}</span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3" />
            {readingTime} min
          </span>
        </div>

        <h2 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-brand-pink group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
          {title}
        </h2>

        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
          {excerpt}
        </p>

        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <span>{locale === "el" ? "Διαβάστε περισσότερα" : "Read more"}</span>
          <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
        </div>
      </Link>
    </motion.article>
  );
};

export default BlogCard;
