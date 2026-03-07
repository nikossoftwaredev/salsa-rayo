"use client";
import GetStartedButton from "@/components/GetStartedButton";
import Logo from "@/components/Logo";
import Image from "next/image";
import { useTranslations } from "next-intl";

const HeroSection = () => {
  const tHero = useTranslations("Hero");

  return (
    <section
      id="hero"
      className="h-screen w-full flex items-center justify-center relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/gallery/our-space-vertical.jpg"
          alt="Salsa Rayo dance studio interior in Agios Dimitrios, Athens"
          fill
          className="object-cover md:hidden"
          priority
          sizes="100vw"
          quality={85}
        />
        <Image
          src="/images/gallery/our-space.jpg"
          alt="Salsa Rayo dance studio with hardwood floor in Athens, Greece"
          fill
          className="object-cover hidden md:block"
          priority
          sizes="100vw"
          quality={85}
        />
        <div className="absolute inset-0 bg-background/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <Logo size="xxl" />

        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight">
          <span className="sr-only">Salsa Rayo — Salsa & Bachata Dance School in Athens, Greece — </span>
          <span className="bg-gradient-to-r from-primary to-brand-pink bg-clip-text text-transparent">
            {tHero("dance")}
            {tHero("and")}
            {tHero("connect")}
          </span>
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-foreground/70 font-medium max-w-lg leading-relaxed">
          {tHero("tagline")}
          <br />
          <span className="text-foreground/40 text-sm sm:text-base tracking-wide">
            {tHero("cta")}
          </span>
        </p>

        <GetStartedButton />
      </div>
    </section>
  );
};

export default HeroSection;
