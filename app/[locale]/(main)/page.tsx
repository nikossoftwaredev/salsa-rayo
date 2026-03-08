import { lazy, Suspense } from "react";
import HeroSection from "@/components/sections/hero/HeroSection";
import AboutSection from "@/components/sections/about/AboutSection";
import ContactForm from "@/components/sections/contact-form/ContactForm";
import ScheduleLoader from "@/components/sections/schedule/ScheduleLoader";
import ScheduleSkeleton from "@/components/sections/schedule/ScheduleSkeleton";
import { GOOGLE_PLACE_ID } from "@/data/config";
import JsonLd from "@/components/JsonLd";
import { getCourseSchemas, getBreadcrumbSchema } from "@/lib/schema";
import { BasePageProps } from "@/types/pageprops";

const BackgroundEffects = lazy(() => import("@/components/BackgroundEffects"));
const MapSection = lazy(() => import("@/components/sections/map/MapSection"));
const GallerySection = lazy(() => import("@/components/sections/gallery/GallerySection"));
const GoogleReviews = lazy(() => import("@/components/GoogleReviews"));

const SectionLoader = () => (
  <div className="w-full h-96 animate-pulse bg-secondary/10 rounded-lg" />
);

const Home = async ({ params }: BasePageProps) => {
  const locale = (await params).locale;

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <JsonLd
        data={[
          getBreadcrumbSchema([
            { name: "Home", url: `https://www.salsarayo.com/${locale}` },
          ]),
          ...getCourseSchemas(),
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
          <div className="w-full py-16 px-4 md:px-8 flex justify-center">
            <Suspense fallback={<SectionLoader />}>
              <GoogleReviews placeId={GOOGLE_PLACE_ID} />
            </Suspense>
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
