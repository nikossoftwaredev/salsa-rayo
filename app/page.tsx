import AboutSection from "@/components/sections/about/AboutSection";
import { BookingSection } from "@/components/sections/booking/BookingSection";
import ContactForm from "@/components/sections/contact-form/ContactForm";
import HeroSection from "@/components/sections/hero/HeroSection";
import MapSection from "@/components/sections/map/MapSection";
import ScheduleSection from "@/components/sections/schedule/ScheduleSection";
import SocialsSection from "@/components/sections/socials/SocialsSection";
import BackgroundEffects from "@/components/BackgroundEffects";

export const revalidate = 0;

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <BackgroundEffects />
      <div className="relative">
        <HeroSection />
        <div className="w-full flex flex-col items-center gap-16 pb-16">
          <ScheduleSection />
          <AboutSection />
          <SocialsSection />
          <BookingSection />
          <MapSection />
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
