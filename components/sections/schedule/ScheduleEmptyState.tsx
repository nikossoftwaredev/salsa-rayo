"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { CalendarClock } from "lucide-react";

const DAY_KEYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const ScheduleEmptyState = () => {
  const t = useTranslations("Schedule");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-3xl"
    >
      <div className="relative overflow-hidden rounded-3xl border border-border/30 bg-card/70 backdrop-blur-xl px-6 py-12 md:px-12 md:py-16 text-center">
        {/* Ambient glow */}
        <div className="absolute -top-24 -left-20 size-64 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-20 size-64 bg-brand-pink/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative space-y-8">
          {/* Icon with expanding rings */}
          <div className="relative flex items-center justify-center">
            <span className="absolute size-24 rounded-full bg-primary/10 animate-ping [animation-duration:3s]" />
            <span className="absolute size-32 rounded-full border border-primary/15" />
            <div className="relative size-20 rounded-2xl bg-gradient-to-br from-primary/25 to-brand-pink/25 border border-primary/30 flex items-center justify-center shadow-lg shadow-primary/20">
              <CalendarClock className="size-9 text-primary" />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-3xl md:text-4xl font-black uppercase tracking-wider bg-gradient-to-r from-primary to-brand-pink bg-clip-text text-transparent">
              {t("comingSoon")}
            </h3>
            <p className="text-base md:text-lg text-foreground/70 max-w-md mx-auto leading-relaxed">
              {t("comingSoonDescription")}
            </p>
          </div>

          {/* Week strip - shows the shape of what is coming, rather than a
              shimmering skeleton, which would read as "still loading". */}
          <div className="flex flex-wrap justify-center gap-2">
            {DAY_KEYS.map((dayKey, index) => (
              <motion.div
                key={dayKey}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.06 }}
                className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border/40 bg-muted/20 px-3 py-3 md:px-4"
              >
                <span className="text-[11px] md:text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {/* @ts-expect-error Dynamic key access for days */}
                  {t(`days.${dayKey}`).slice(0, 3)}
                </span>
                <span className="h-1.5 w-8 md:w-10 rounded-full bg-gradient-to-r from-primary/25 to-brand-pink/25" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ScheduleEmptyState;
