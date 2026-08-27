"use client";
import GetStartedButton from "@/components/GetStartedButton";
import Logo from "@/components/Logo";
import { useTranslations } from "next-intl";

const HeroSection = () => {
  const tHero = useTranslations("Hero");

  return (
    <section
      id="hero"
      className="h-svh w-full flex items-center justify-center relative overflow-hidden"
    >
      {/* Background — art-directed <picture>: pre-optimized static AVIF/WebP,
          mobile loads ONLY the vertical crop, desktop ONLY the horizontal.
          Bypasses _next/image cold-encode; LCP-critical so fetchPriority high. */}
      <div className="absolute inset-0">
        <picture>
          <source
            media="(min-width: 768px)"
            srcSet="/images/gallery/salsa-class-athens.avif"
            type="image/avif"
          />
          <source
            media="(min-width: 768px)"
            srcSet="/images/gallery/salsa-class-athens.webp"
            type="image/webp"
          />
          <source
            media="(max-width: 767px)"
            srcSet="/images/gallery/salsa-class-athens-vertical.avif"
            type="image/avif"
          />
          <source
            media="(max-width: 767px)"
            srcSet="/images/gallery/salsa-class-athens-vertical.webp"
            type="image/webp"
          />
          <img
            src="/images/gallery/salsa-class-athens-vertical.jpg"
            alt="Students dancing in pairs during a New York style salsa class at Salsa Rayo in Agios Dimitrios, Athens"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 size-full object-cover object-[50%_35%] md:object-center"
          />
        </picture>
        {/* Scrim, two layers: the vertical pass darkens under the nav and fades
            the bottom into the next section; the radial pool sits behind the
            headline so the gradient type clears 3:1 over the studio's white
            wall while the dancers stay visible at the edges. */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/68 via-background/48 to-background" />
        <div className="absolute inset-0 bg-radial-[ellipse_65%_55%_at_50%_46%] from-background/88 via-background/72 via-45% to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <Logo size="xxl" />

        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-primary to-brand-pink bg-clip-text text-transparent">
            {tHero("heading")}
          </span>
        </h1>
        <p className="sr-only">{tHero("srHeading")}</p>

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
