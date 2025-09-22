"use client";

import { useTranslations } from "next-intl";
import { SectionTitle } from "@/components/SectionTitle";
import { motion } from "framer-motion";
import { SCHEDULE, INSTRUCTORS } from "@/data/schedule";
import Image from "next/image";
import { useState, useEffect } from "react";

type Instructor = typeof INSTRUCTORS[keyof typeof INSTRUCTORS];

interface ScheduleItem {
  time: string;
  title: string;
  instructors: Instructor[];
  hint?: string;
}


const ScheduleSection = () => {
  const t = useTranslations("Schedule");
  const [currentDayIndex, setCurrentDayIndex] = useState<number | null>(null);
  
  useEffect(() => {
    setCurrentDayIndex(new Date().getDay());
  }, []);

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
            <div className="relative flex flex-col md:flex-row items-stretch bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 hover:border-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:bg-gradient-to-br hover:from-primary/15 hover:to-accent/15">
              {/* Subtle pattern overlay */}
              <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(24, 160, 123) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}></div>
              {/* Day Badge */}
              <div className="relative md:w-48 p-6 md:p-8 flex items-center justify-center bg-white/10 backdrop-blur-md border-r border-white/10">
                {/* Glass shine effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50"></div>
                {/* Hover shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                <h3 className="relative text-2xl md:text-3xl font-black text-white uppercase tracking-wider drop-shadow-lg">
                  {/* @ts-expect-error Dynamic key access for days */}
                  {t(`days.${dayKey}`).slice(0, 3)}
                </h3>
              </div>

              {/* Classes Container */}
              <div className="relative flex-1 p-4 md:p-6">
                <div className="space-y-3">
                  {schedule.map(({ time, title, hint, instructors }: ScheduleItem) => (
                    <div
                      key={`${dayKey}-${time}`}
                      className="flex items-center justify-between gap-4 group"
                    >
                      {/* Time */}
                      <div className="w-24 md:w-28 text-xs md:text-sm font-bold text-white/70 group-hover:text-primary transition-colors duration-300 whitespace-nowrap">
                        {time}
                      </div>

                      {/* Title with hint */}
                      <div className="flex-1">
                        <div className="text-sm md:text-base font-semibold text-white group-hover:text-primary transition-colors duration-300">
                          {title}
                        </div>
                        {hint && (
                          <div className="text-xs md:text-sm font-normal text-gray-400">
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
                              className="relative w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-primary/50 transition-all duration-300"
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
              <div className="absolute -top-2 -right-2 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
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
