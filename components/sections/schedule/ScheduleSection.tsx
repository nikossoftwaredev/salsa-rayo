"use client";

import { useTranslations } from "next-intl";
import { SectionTitle } from "@/components/SectionTitle";
import { motion } from "framer-motion";
import { SCHEDULE, INSTRUCTORS } from "@/data/schedule";
import Image from "next/image";

type Instructor = typeof INSTRUCTORS[keyof typeof INSTRUCTORS];

interface ScheduleItem {
  time: string;
  title: string;
  instructors: Instructor[];
  hint?: string;
}

const currentDayIndex = new Date().getDay();

const ScheduleSection = () => {
  const t = useTranslations("Schedule");

  return (
    <section
      id="schedule"
      className="flex items-center justify-center flex-col space-y-12 relative scroll-mt-20"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      </div>

      <SectionTitle title={t("title")} isMainSection />

      <div className="w-full max-w-4xl space-y-4">
        {SCHEDULE.map(({ dayKey, schedule, dayIndex }, index) => (
          <motion.div
            key={dayKey}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
              delay: index * 0.1,
            }}
            className="relative"
          >
            {/* Day Container */}
            <div className="relative flex flex-col md:flex-row items-stretch bg-card/80 backdrop-blur-xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 border border-border/20 hover:border-primary/20">
              {/* Day Badge */}
              <div className="relative md:w-44 p-5 md:p-8 flex items-center justify-center bg-gradient-to-br from-primary/15 to-accent/10 border-b md:border-b-0 md:border-r border-border/10">
                <h3 className="relative text-2xl md:text-3xl font-black uppercase tracking-wider">
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {/* @ts-expect-error Dynamic key access for days */}
                    {t(`days.${dayKey}`).slice(0, 3)}
                  </span>
                </h3>
              </div>

              {/* Classes Container */}
              <div className="relative flex-1 p-4 md:p-6 flex items-center">
                <div className="space-y-3 w-full">
                  {schedule.map(({ time, title, hint, instructors }: ScheduleItem) => (
                    <div
                      key={`${dayKey}-${time}`}
                      className="flex items-center justify-between gap-4 group"
                    >
                      {/* Time */}
                      <div className="w-24 md:w-28 text-xs md:text-sm font-bold text-foreground/70 group-hover:text-primary transition-colors duration-300 whitespace-nowrap">
                        {time}
                      </div>

                      {/* Title with hint */}
                      <div className="flex-1">
                        <div className="text-sm md:text-base font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                          {title}
                        </div>
                        {hint && (
                          <div className="text-xs md:text-sm font-normal text-muted-foreground">
                            ({hint})
                          </div>
                        )}
                      </div>

                      {/* Instructors */}
                      {instructors && instructors.length > 0 && (
                        <div className="flex -space-x-2">
                          {instructors.map((instructor) => (
                            <div
                              key={instructor.name}
                              className="relative w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-border/30 group-hover:border-primary/50 transition-all duration-300 shadow-sm"
                            >
                              <Image
                                src={instructor.image}
                                alt={instructor.name}
                                fill
                                className="object-cover object-top scale-125 -translate-y-1"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Current Day Indicator */}
            {currentDayIndex === dayIndex && (
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-primary to-accent text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-primary/30 animate-pulse">
                {t("today")}
              </div>
            )}
          </motion.div>
        ))}
      </div>

    </section>
  );
};

export default ScheduleSection;
