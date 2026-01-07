"use client";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Lightning from "@/components/react-bits/Backgrounds/Lightning/Lightning";

const GetStartedButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  const t = useTranslations('Common');

  return (
    <Link
      href="#contact-form"
      className="relative inline-flex h-16 px-10 bg-transparent border-2 border-primary hover:border-accent text-foreground font-bold rounded-xl transition-all duration-300 hover:scale-105 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Lightning background */}
      <div className="absolute inset-0 pointer-events-none">
        <Lightning 
          hue={isHovered ? 280 : 220}
          xOffset={0}
          speed={1}
          intensity={1}
          size={1}
        />
      </div>

      {/* Text content */}
      <div className="relative z-10 flex items-center justify-center gap-3">
        <span className="text-lg font-extrabold">{t('getStarted')}</span>
        <FaArrowRight className={`transition-transform duration-300 ${isHovered ? "translate-x-2" : ""}`} />
      </div>
    </Link>
  );
};

export default GetStartedButton;
