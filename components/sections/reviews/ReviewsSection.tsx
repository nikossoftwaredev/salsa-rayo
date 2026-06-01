import { FcGoogle } from "react-icons/fc";
import { Star } from "lucide-react";
import { getTranslations } from "next-intl/server";
import {
  getGoogleReviews,
  type PlaceReviewsResponse,
} from "@/server-actions/getGoogleReviews";
import { SUPPORTED_LOCALES } from "@/i18n/routing";

interface ReviewsSectionProps {
  placeId: string;
  locale: (typeof SUPPORTED_LOCALES)[number];
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((value) => {
      const filled = rating >= value;
      const partial = rating >= value - 0.5 && rating < value;
      return (
        <Star
          key={value}
          className={`size-4 ${
            filled || partial
              ? "fill-yellow-400 text-yellow-400"
              : "fill-none text-muted-foreground/40"
          }`}
        />
      );
    })}
  </div>
);

const truncate = (text: string, max = 220) =>
  text.length > max ? `${text.slice(0, max).trim()}...` : text;

const ReviewsSection = async ({ placeId, locale }: ReviewsSectionProps) => {
  const t = await getTranslations({ locale, namespace: "Reviews" });
  let data: PlaceReviewsResponse | null = null;
  try {
    data = await getGoogleReviews(placeId);
  } catch {
    return null;
  }
  if (!data || !data.reviews?.length || !data.rating) return null;

  const featured = data.reviews
    .filter((r) => r.rating >= 4 && r.text.trim().length > 30)
    .sort((a, b) => b.rating - a.rating || b.time - a.time)
    .slice(0, 6);

  if (featured.length === 0) return null;

  return (
    <section className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-3 mb-4">
          <FcGoogle className="size-8" />
          <span className="text-3xl font-bold text-foreground">
            {data.rating.toFixed(1)}
          </span>
          <StarRating rating={data.rating} />
          <span className="text-sm text-muted-foreground">
            ({data.user_ratings_total ?? featured.length})
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          <span className="bg-gradient-to-r from-primary to-brand-pink bg-clip-text text-transparent">
            {t("title")}
          </span>
        </h2>
        <p className="text-foreground/70 max-w-2xl mx-auto">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featured.map((review) => (
          <article
            key={`${review.author_name}-${review.time}`}
            className="rounded-xl border border-border/30 bg-card/80 p-6 flex flex-col gap-3 hover:border-primary/30 transition-colors"
            itemScope
            itemType="https://schema.org/Review"
          >
            <meta itemProp="reviewBody" content={review.text} />
            <meta itemProp="datePublished" content={new Date(review.time * 1000).toISOString()} />
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="font-medium text-foreground" itemProp="author" itemScope itemType="https://schema.org/Person">
                  <span itemProp="name">{review.author_name}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {review.relative_time_description}
                </p>
              </div>
              <div itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                <meta itemProp="ratingValue" content={String(review.rating)} />
                <meta itemProp="bestRating" content="5" />
                <StarRating rating={review.rating} />
              </div>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {truncate(review.text)}
            </p>
          </article>
        ))}
      </div>

      {data.url && (
        <div className="flex justify-center mt-10">
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-brand-pink transition-colors underline-offset-4 hover:underline"
          >
            <FcGoogle className="size-4" />
            {t("readMore", { count: data.user_ratings_total ?? featured.length })}
          </a>
        </div>
      )}
    </section>
  );
};

export default ReviewsSection;
