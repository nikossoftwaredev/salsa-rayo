"use client";
import { useEffect, useState } from "react";
import Logo from "@/components/Logo";
import GetStartedButton from "@/components/GetStartedButton";
import Image from "next/image";
import { useTranslations } from "next-intl";

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const t = useTranslations('HomePage');
  const tHero = useTranslations('Hero');

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section
      id="hero"
      className="h-screen max-h-screen w-full flex items-center justify-center relative overflow-hidden bg-black"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 animate-pulse"></div>
      
      {/* Animated particles */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-float-slow opacity-60"></div>
        <div className="absolute top-3/4 right-1/3 w-3 h-3 bg-accent rounded-full animate-float-medium opacity-40"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-white rounded-full animate-float-fast opacity-30"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-16 md:py-20">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center h-full">
          
          {/* Left Content */}
          <div
            className={`flex flex-col items-center lg:items-start text-center lg:text-left text-white space-y-4 md:space-y-6 transform transition-all duration-1000 ${
              isLoaded ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
            }`}
          >
            {/* Logo - Hidden on mobile */}
            <div className="hidden md:block mb-2">
              <Logo size="xxl" />
            </div>

            {/* Main Title - Now smaller than logo */}
            <div className="relative">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
                <span className="bg-gradient-to-r from-white via-primary to-white bg-clip-text text-transparent animate-gradient-x">{tHero('dance')}</span>
                <span className="text-white">{tHero('and')}</span>
                <span className="bg-gradient-to-r from-white via-accent to-white bg-clip-text text-transparent animate-gradient-x animation-delay-200">{tHero('connect')}</span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl lg:text-3xl font-light text-white tracking-wide">
              {t('title')}
            </p>

            {/* Description */}
            <div className="text-base md:text-lg lg:text-xl space-y-3 max-w-2xl">
              <p className="opacity-90 leading-relaxed">
                {t('description')}
              </p>
              <p className="font-semibold text-lg md:text-xl mt-4">
                {tHero('joinCommunity')}
              </p>
            </div>

            {/* Call to Action */}
            <div className="mt-6 md:mt-8">
              <GetStartedButton />
            </div>
          </div>

          {/* Right Image */}
          <div
            className={`relative transform transition-all duration-1000 delay-300 ${
              isLoaded ? "translate-x-0 opacity-100 scale-100" : "translate-x-20 opacity-0 scale-95"
            }`}
          >
            <div className="relative mx-auto max-w-sm lg:max-w-md">
              {/* Glow effect behind image */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-accent/20 to-transparent blur-3xl scale-110"></div>
              
              {/* Image container with border */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10"></div>
                <Image
                  src="/images/hero.jpg"
                  alt={tHero('imageAlt')}
                  width={400}
                  height={600}
                  className="object-cover w-full h-auto max-h-[70vh]"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;