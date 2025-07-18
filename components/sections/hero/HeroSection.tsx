"use client";
import { useEffect, useState } from "react";
import Logo from "@/components/Logo";
import GetStartedButton from "@/components/GetStartedButton";
import Image from "next/image";

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section
      id="hero"
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-black"
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
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pt-32 pb-20 md:pt-24 md:pb-0">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Content */}
          <div
            className={`flex flex-col items-center lg:items-start text-center lg:text-left text-white space-y-6 md:space-y-8 transform transition-all duration-1000 ${
              isLoaded ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
            }`}
          >
            {/* Logo - Hidden on mobile */}
            <div className="hidden md:block mb-4">
              <Logo size="lg" />
            </div>

            {/* Main Title */}
            <div className="relative">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-tight">
                <span className="bg-gradient-to-r from-white via-primary to-white bg-clip-text text-transparent animate-gradient-x">Dance</span>
                <span className="text-white"> & </span>
                <span className="bg-gradient-to-r from-white via-accent to-white bg-clip-text text-transparent animate-gradient-x animation-delay-200">Connect</span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl lg:text-3xl font-light text-white tracking-wide">
              This is your <span className="font-bold text-primary animate-pulse">getaway</span> to the magical world of social dancing!
            </p>

            {/* Description */}
            <div className="text-base md:text-lg lg:text-xl space-y-3 max-w-2xl">
              <p className="opacity-90 leading-relaxed">
                <span className="inline-block transform hover:scale-105 transition-transform">Learn to dance</span>, 
                <span className="inline-block transform hover:scale-105 transition-transform mx-2">make friends</span>, 
                and <span className="inline-block transform hover:scale-105 transition-transform">extend your skills</span>.
              </p>
              <p className="font-semibold text-lg md:text-xl mt-4">
                Join our <span className="text-primary">passionate</span> salsa community today!
              </p>
            </div>

            {/* Call to Action */}
            <div className="mt-6 md:mt-8">
              <GetStartedButton />
            </div>
          </div>

          {/* Right Image */}
          <div
            className={`relative transform transition-all duration-1000 delay-300 pb-8 ${
              isLoaded ? "translate-x-0 opacity-100 scale-100" : "translate-x-20 opacity-0 scale-95"
            }`}
          >
            <div className="relative mx-auto max-w-md lg:max-w-full">
              {/* Glow effect behind image */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-accent/20 to-transparent blur-3xl scale-110"></div>
              
              {/* Image container with border */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10"></div>
                <Image
                  src="/images/hero.jpg"
                  alt="Salsa dancers in vibrant costumes"
                  width={600}
                  height={800}
                  className="object-cover w-full h-auto"
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