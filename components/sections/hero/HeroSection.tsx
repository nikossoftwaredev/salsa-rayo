"use client";
import { useEffect, useState } from "react";
import GetStartedButton from "@/components/GetStartedButton";
import Image from "next/image";
import { useTranslations } from "next-intl";

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const tHero = useTranslations("Hero");

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section
      id="hero"
      className="h-screen w-full flex items-center justify-center relative overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        {/* Mobile Image */}
        <Image
          src="/images/gallery/our-space-vertical.jpg"
          alt="Dance Studio"
          fill
          className="object-cover md:hidden"
          priority
        />
        {/* Desktop Image */}
        <Image
          src="/images/gallery/our-space.jpg"
          alt="Dance Studio"
          fill
          className="object-cover hidden md:block"
          priority
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 animate-pulse"></div>

      {/* Animated particles */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-float-slow opacity-60"></div>
        <div className="absolute top-3/4 right-1/3 w-3 h-3 bg-accent rounded-full animate-float-medium opacity-40"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-white rounded-full animate-float-fast opacity-30"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Center Content */}
          <div
            className={`flex flex-col items-center text-center text-white space-y-2 md:space-y-6 transform transition-all duration-1000 md:bg-white/10 md:backdrop-blur-md md:border md:border-white/20 md:shadow-2xl md:rounded-2xl p-8 md:p-12 ${
              isLoaded
                ? "translate-y-0 opacity-100"
                : "translate-y-20 opacity-0"
            }`}
          >

            {/* Main Title - Now smaller than logo */}
            <div className="relative">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 tracking-tight">
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-gradient-x">
                  {tHero("dance")} {tHero("and")} {tHero("connect")}
                </span>
              </h1>
            </div>

            {/* Main CTA Text */}
            <div className="text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl">
              <p className="font-semibold text-base sm:text-lg md:text-xl">
                {tHero("joinCommunity")}
              </p>
            </div>

            {/* Call to Action */}
            <div className="mt-2 md:mt-4">
              <GetStartedButton />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
