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
      {/* Background Image with preload */}
      <div className="absolute inset-0">
        {/* Mobile Image */}
        <Image
          src="/images/gallery/our-space-vertical.jpg"
          alt="Dance Studio"
          fill
          className="object-cover md:hidden"
          priority
          sizes="100vw"
          quality={85}
        />
        {/* Desktop Image */}
        <Image
          src="/images/gallery/our-space.jpg"
          alt="Dance Studio"
          fill
          className="object-cover hidden md:block"
          priority
          sizes="100vw"
          quality={85}
        />
        <div className="absolute inset-0 bg-background/60"></div>
      </div>

      {/* Main Content Container - removed animated overlay and particles for performance */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Center Content */}
          <div
            className={`flex flex-col items-center text-center text-foreground space-y-2 md:space-y-6 transform transition-all duration-1000 md:bg-foreground/10 md:backdrop-blur-md md:border md:border-border/20 md:shadow-2xl md:rounded-2xl p-8 md:p-12 ${
              isLoaded
                ? "translate-y-0 opacity-100"
                : "translate-y-20 opacity-0"
            }`}
          >

            {/* Main Title - Now smaller than logo */}
            <div className="relative">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 tracking-tight">
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
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