import AboutSection from "@/components/sections/about/AboutSection";
import { BookingSection } from "@/components/sections/booking/BookingSection";
import ContactForm from "@/components/sections/contact-form/ContactForm";
import HeroSection from "@/components/sections/hero/HeroSection";
import MapSection from "@/components/sections/map/MapSection";
import ScheduleSection from "@/components/sections/schedule/ScheduleSection";
import SocialsSection from "@/components/sections/socials/SocialsSection";

export const revalidate = 0;

export default function Home() {
  return (
    <main
      className="flex flex-col min-h-screen items-center justify-center gap-16 w-full pb-4 bg-base-100"
      style={{
        backgroundImage: "url('/images/background.jpg')",
        backgroundRepeat: "repeat",
        backgroundSize: "",
        backgroundPosition: "top left",
        minHeight: "100vh",
        margin: 0,
      }}
    >
      <HeroSection />
      <div className="w-full max-w-7xl flex flex-col px-4 gap-4">
        <ScheduleSection />
        <AboutSection />
        <SocialsSection />
        <BookingSection />
        <MapSection />
        <ContactForm />
      </div>
    </main>
  );
}
