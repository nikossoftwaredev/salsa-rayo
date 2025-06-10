"use client";
import { useEffect, useState } from "react";
import Logo from "@/components/Logo";
import { SectionTitle } from "@/components/SectionTitle";
import GetStartedButton from "@/components/GetStartedButton";

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section
      id="hero"
      className="hero h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: "url(/images/hero-image.png)",
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Main Content */}
      <div
        className={`relative z-10 p-4 md:p-8 flex flex-col items-center justify-center text-center text-white space-y-6 md:space-y-8 transform transition-all duration-1000 ${
          isLoaded ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
        }`}
      >
        {/* Logo - Hidden on mobile */}
        <div className="hidden md:block">
          <Logo />
        </div>

        {/* Main Title */}
        <SectionTitle title="Dance & Connect" />

        {/* Subtitle */}
        <p className="text-xl md:text-3xl lg:text-4xl font-extrabold text-primary px-4">
          This is your getaway to the magical world of social dancing!
        </p>

        {/* Description */}
        <div className="text-base md:text-lg lg:text-2xl space-y-2 max-w-3xl px-4">
          <p>Learn to dance, make friends, and extend your skills.</p>
          <p>Join our passionate salsa community today!</p>
        </div>

        {/* Call to Action */}
        <div className="mt-6 md:mt-8">
          <GetStartedButton />
        </div>

        {/* Stats Section */}
      </div>

      {/* Scroll Indicator - Hidden on mobile */}
      <div className="hidden md:block absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
