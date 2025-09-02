import AboutSection from "@/components/sections/about/AboutSection";
import ContactForm from "@/components/sections/contact-form/ContactForm";
import HeroSection from "@/components/sections/hero/HeroSection";
import MapSection from "@/components/sections/map/MapSection";
import ScheduleSection from "@/components/sections/schedule/ScheduleSection";
import GallerySection from "@/components/sections/gallery/GallerySection";
import BackgroundEffects from "@/components/BackgroundEffects";

export const revalidate = 0;

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <BackgroundEffects />
      <div className="relative">
        <HeroSection />
        <div className="w-full flex flex-col items-center">
          <div className="w-full py-24 px-4 md:px-8 bg-gradient-to-b from-transparent via-base-200/20 to-transparent relative">
            <AboutSection />
          </div>
          <div className="w-full py-24 px-4 md:px-8 relative">
            <ScheduleSection />
          </div>
          <div className="w-full py-24 px-4 md:px-8 relative">
            <GallerySection />
          </div>
          {/* <BookingSection /> */}
          <div className="w-full py-24 px-4 md:px-8 bg-gradient-to-b from-transparent via-base-200/20 to-transparent relative">
            <MapSection />
          </div>
          <div className="w-full py-24 px-4 md:px-8 relative">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
