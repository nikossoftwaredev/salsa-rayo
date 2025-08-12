"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";

const SummerOfferButton = () => {
  const locale = useLocale();
  const [isExpired, setIsExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = new Date("2025-08-31T23:59:59");
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        setIsExpired(true);
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeLeft({ days, hours, minutes, seconds });
    };

    // Calculate immediately
    calculateTimeLeft();
    
    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Don't render if expired
  if (isExpired) return null;

  const getLabels = () => {
    if (locale === "el") {
      return { days: "Μ", hours: "Ω", minutes: "Λ", seconds: "Δ" };
    } else if (locale === "es") {
      return { days: "D", hours: "H", minutes: "M", seconds: "S" };
    }
    return { days: "D", hours: "H", minutes: "M", seconds: "S" };
  };

  const labels = getLabels();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="absolute top-[70px] left-2 md:left-8 z-30"
    >
      {/* Countdown positioned near the button */}
      <div className="absolute top-2 left-[88px] md:left-[120px]">
        <div className="px-1.5 py-0.5">
          <div className="flex items-center gap-2 text-white/90 drop-shadow-lg">
            {/* Days */}
            <div className="flex items-baseline">
              <span className="font-mono text-sm md:text-base font-bold">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-white/50 text-[8px] md:text-[10px] ml-0.5">{labels.days}</span>
            </div>
            {/* Hours */}
            <div className="flex items-baseline">
              <span className="font-mono text-sm md:text-base font-bold">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-white/50 text-[8px] md:text-[10px] ml-0.5">{labels.hours}</span>
            </div>
            {/* Minutes */}
            <div className="flex items-baseline">
              <span className="font-mono text-sm md:text-base font-bold">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-white/50 text-[8px] md:text-[10px] ml-0.5">{labels.minutes}</span>
            </div>
            {/* Seconds */}
            <div className="flex items-baseline">
              <span className="font-mono text-sm md:text-base font-bold">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-white/50 text-[8px] md:text-[10px] ml-0.5">{labels.seconds}</span>
            </div>
          </div>
        </div>
      </div>

      <Link href="/pricing">
        <div className="relative group">
          {/* Subtle glow */}
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all duration-300" />
          
          {/* Circular button - bigger */}
          <div className="relative size-20 md:size-28 bg-gradient-to-br from-primary to-accent rounded-full shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl border-2 border-white/20 flex items-center justify-center">
            {/* Text content - strictly centered */}
            <div className="text-white text-center">
              <div className="font-bold text-xs md:text-base leading-tight">SUMMER</div>
              <div className="font-bold text-xs md:text-base leading-tight">OFFER</div>
            </div>
          </div>

          {/* Pulse animation */}
          <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
        </div>
      </Link>
    </motion.div>
  );
};

export default SummerOfferButton;