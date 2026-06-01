import { lazy, Suspense } from "react";
import { getTranslations } from "next-intl/server";
import HeroSection from "@/components/sections/hero/HeroSection";
import AboutSection from "@/components/sections/about/AboutSection";
import ContactForm from "@/components/sections/contact-form/ContactForm";
import ScheduleLoader from "@/components/sections/schedule/ScheduleLoader";
import ScheduleSkeleton from "@/components/sections/schedule/ScheduleSkeleton";
import BlogTeaserSection from "@/components/sections/blog-teaser/BlogTeaserSection";
import ReviewsSection from "@/components/sections/reviews/ReviewsSection";
import { GOOGLE_PLACE_ID } from "@/data/config";
import JsonLd from "@/components/JsonLd";
import {
  getCourseSchemas,
  getFAQPageSchema,
  getAggregateRatingSchema,
} from "@/lib/schema";
import { getGoogleReviews } from "@/server-actions/getGoogleReviews";
import { FAQ_ITEMS } from "@/data/faq";
import { SUPPORTED_LOCALES } from "@/i18n/routing";
import { BasePageProps } from "@/types/pageprops";

const BackgroundEffects = lazy(() => import("@/components/BackgroundEffects"));
const MapSection = lazy(() => import("@/components/sections/map/MapSection"));
const GallerySection = lazy(() => import("@/components/sections/gallery/GallerySection"));

const SectionLoader = () => (
  <div className="w-full h-96 animate-pulse bg-secondary/10 rounded-lg" />
);

export const revalidate = 3600;

const Home = async ({ params }: BasePageProps) => {
  const locale = (await params).locale as (typeof SUPPORTED_LOCALES)[number];
  const tFaq = await getTranslations({ locale, namespace: "Faq" });

  const faqItems = FAQ_ITEMS.map((item) => ({
    question: tFaq(item.questionKey),
    answer: tFaq(item.answerKey),
  }));

  const reviewsData = await getGoogleReviews(GOOGLE_PLACE_ID).catch(() => null);
  const aggregateRatingSchema =
    reviewsData?.rating && reviewsData.user_ratings_total
      ? getAggregateRatingSchema(
          reviewsData.rating,
          reviewsData.user_ratings_total
        )
      : null;

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <JsonLd
        data={[
          ...getCourseSchemas(),
          getFAQPageSchema(faqItems),
          ...(aggregateRatingSchema ? [aggregateRatingSchema] : []),
        ]}
      />
      <Suspense fallback={null}>
        <BackgroundEffects />
      </Suspense>
      <div className="relative">
        <HeroSection />
        <div className="w-full flex flex-col items-center">
          <div className="w-full py-24 px-4 md:px-8 bg-gradient-to-b from-transparent via-secondary/20 to-transparent relative">
            <AboutSection />
          </div>
          <div className="w-full py-24 px-4 md:px-8 relative">
            <Suspense fallback={<ScheduleSkeleton />}>
              <ScheduleLoader />
            </Suspense>
          </div>
          <div className="w-full py-24 px-4 md:px-8 relative">
            <Suspense fallback={<SectionLoader />}>
              <GallerySection />
            </Suspense>
          </div>
          {/* <BookingSection /> */}
          <div className="w-full py-24 px-4 md:px-8 bg-gradient-to-b from-transparent via-secondary/20 to-transparent relative">
            <Suspense fallback={<SectionLoader />}>
              <MapSection />
            </Suspense>
          </div>
          <div className="w-full py-24 px-4 md:px-8 relative">
            <ReviewsSection placeId={GOOGLE_PLACE_ID} locale={locale} />
          </div>
          <div className="w-full py-24 px-4 md:px-8 bg-gradient-to-b from-transparent via-secondary/20 to-transparent relative">
            <BlogTeaserSection locale={locale} />
          </div>
          <div className="w-full py-24 px-4 md:px-8 relative">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home
