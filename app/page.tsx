import AboutSection from "@/components/AboutSection";
import ContactForm from "@/components/ContactForm";
import HeroSection from "@/components/HeroSection";
import MapSection from "@/components/MapSection";
import ScheduleSection from "@/components/ScheduleSection";
import SocialsSection from "@/components/SocialsSection";

export const revalidate = 0;

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-base-100 gap-16 w-full pb-4">
      <HeroSection />
      <ScheduleSection />
      <AboutSection />
      <SocialsSection />
      <MapSection />
      <ContactForm />
    </main>
  );
}
