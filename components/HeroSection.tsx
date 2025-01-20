"use client";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { SectionTitle } from "./SectionTitle";
import GetStartedButton from "./GetStartedButton";

const HeroSection = () => {
  const [scrollOffset, setScrollOffset] = useState(55);

  useEffect(() => {
    const handleScroll = () => {
      setScrollOffset(() => {
        const result = Math.max(55 - window.scrollY * 0.1, 0);
        return result;
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section
      id="hero"
      className="hero min-h-screen w-full bg-no-repeat flex items-center justify-center"
      style={{
        backgroundImage: "url(/images/hero-image.png)",
        backgroundPosition: `${scrollOffset}% 0%`, // Move image horizontally
      }}
    >
      <div className="p-4 flex flex-col items-center justify-center card text-center text-white space-y-6 bg-black bg-opacity-50">
        <Logo />
        <SectionTitle title="Dance & Connect" />
        <p className="text-2xl font-extrabold ">
          This is your getaway to the magical world of social dancing!
        </p>
        <div className="text-base md:text-xl">
          <p>Learn to dance, make friends, and extend your skills.</p>
          <p>Join our classes today!</p>
        </div>
        <GetStartedButton />
      </div>
    </section>
  );
};

export default HeroSection;
