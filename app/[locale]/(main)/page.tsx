import { lazy, Suspense } from "react";
import HeroSection from "@/components/sections/hero/HeroSection";
import AboutSection from "@/components/sections/about/AboutSection";
import ContactForm from "@/components/sections/contact-form/ContactForm";
import { GOOGLE_PLACE_ID } from "@/data/config";

// Lazy load non-critical sections for performance while keeping SEO-important content
const BackgroundEffects = lazy(() => import("@/components/BackgroundEffects"));
const MapSection = lazy(() => import("@/components/sections/map/MapSection"));
const ScheduleSection = lazy(() => import("@/components/sections/schedule/ScheduleSection"));
const GallerySection = lazy(() => import("@/components/sections/gallery/GallerySection"));
const GoogleReviews = lazy(() => import("@/components/GoogleReviews"));

export const revalidate = 0;

// Loading placeholder component
const SectionLoader = () => (
  <div className="w-full h-96 animate-pulse bg-secondary/10 rounded-lg" />
);

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
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
            <Suspense fallback={<SectionLoader />}>
              <ScheduleSection />
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
          <Suspense fallback={<SectionLoader />}>
            <GoogleReviews placeId={GOOGLE_PLACE_ID} />
          </Suspense>
          <div className="w-full  items-center py-24 px-4 md:px-8 relative">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}