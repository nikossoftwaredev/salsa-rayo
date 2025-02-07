import AboutSection from "@/components/AboutSection";
import ContactForm from "@/components/ContactForm";
import HeroSection from "@/components/HeroSection";
import MapSection from "@/components/MapSection";
import ScheduleSection from "@/components/ScheduleSection";
import SocialsSection from "@/components/SocialsSection";

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
      <div className="w-full max-w-7xl flex flex-col px-4">
        <ScheduleSection />
        <AboutSection />
        <SocialsSection />
        <MapSection />
        <ContactForm />
      </div>
    </main>
  );
}
