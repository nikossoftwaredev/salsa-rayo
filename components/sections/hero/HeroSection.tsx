"use client";
import { useEffect, useState } from "react";
import Logo from "@/components/Logo";
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
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20 animate-pulse"></div>
      
      {/* Animated particles */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-float-slow opacity-60"></div>
        <div className="absolute top-3/4 right-1/3 w-3 h-3 bg-accent rounded-full animate-float-medium opacity-40"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-white rounded-full animate-float-fast opacity-30"></div>
      </div>

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
        <div className="relative">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-white via-primary to-white bg-clip-text text-transparent animate-gradient-x">Dance</span>
            <span className="text-white"> & </span>
            <span className="bg-gradient-to-r from-white via-accent to-white bg-clip-text text-transparent animate-gradient-x animation-delay-200">Connect</span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-xl md:text-3xl lg:text-4xl font-light text-white px-4 tracking-wide">
          This is your <span className="font-bold text-primary animate-pulse">getaway</span> to the magical world of social dancing!
        </p>

        {/* Description */}
        <div className="text-base md:text-lg lg:text-2xl space-y-3 max-w-4xl px-4">
          <p className="opacity-90 leading-relaxed">
            <span className="inline-block transform hover:scale-105 transition-transform">Learn to dance</span>, 
            <span className="inline-block transform hover:scale-105 transition-transform mx-2">make friends</span>, 
            and <span className="inline-block transform hover:scale-105 transition-transform">extend your skills</span>.
          </p>
          <p className="font-semibold text-lg md:text-xl lg:text-2xl mt-4">
            Join our <span className="text-primary">passionate</span> salsa community today!
          </p>
        </div>

        {/* Call to Action */}
        <div className="mt-6 md:mt-8">
          <GetStartedButton />
        </div>

        {/* Stats Section */}
      </div>

      {/* Enhanced Scroll Indicator */}
      <div className="hidden md:block absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 border-2 border-white/70 rounded-full flex justify-center relative overflow-hidden group hover:border-primary transition-colors">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/10 group-hover:to-primary/20 transition-colors"></div>
          <div className="w-1.5 h-4 bg-white rounded-full mt-2 animate-scroll-down"></div>
        </div>
        <p className="text-white/60 text-xs mt-2 tracking-wider">SCROLL</p>
      </div>
    </section>
  );
};

export default HeroSection;
