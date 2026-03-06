"use client";

import { useTranslations } from "next-intl";
import { SectionTitle } from "@/components/SectionTitle";
import { motion } from "framer-motion";
import Image from "next/image";
import { type ScheduleEntryWithInstructors } from "@/lib/db";

interface ScheduleSectionProps {
  entries: ScheduleEntryWithInstructors[]
}

const DAY_KEYS = ["", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

const getTodayDayIndex = () => {
  const day = new Date().getDay();
  return day === 0 ? 7 : day;
}

const ScheduleSection = ({ entries }: ScheduleSectionProps) => {
  const todayDayIndex = getTodayDayIndex();
  const t = useTranslations("Schedule");

  const days = Array.from(
    entries.reduce((map, entry) => {
      const existing = map.get(entry.dayIndex) ?? []
      existing.push(entry)
      map.set(entry.dayIndex, existing)
      return map
    }, new Map<number, ScheduleEntryWithInstructors[]>())
  ).sort(([a], [b]) => a - b)

  return (
    <section
      id="schedule"
      className="flex items-center justify-center flex-col space-y-12 relative scroll-mt-20"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-brand-pink/10 rounded-full blur-3xl"></div>
      </div>

      <SectionTitle title={t("title")} isMainSection />

      <div className="w-full max-w-4xl space-y-4">
        {days.map(([dayIndex, schedule], index) => {
          const dayKey = DAY_KEYS[dayIndex] ?? "unknown"

          return (
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
              <div className="relative flex flex-col md:flex-row items-stretch bg-card/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-border/20">
                <div className="relative md:w-44 p-5 md:p-8 flex items-center justify-center bg-gradient-to-br from-primary/15 to-brand-pink/10 border-b md:border-b-0 md:border-r border-border/10">
                  <h3 className="relative text-2xl md:text-3xl font-black uppercase tracking-wider">
                    <span className="bg-gradient-to-r from-primary to-brand-pink bg-clip-text text-transparent">
                      {/* @ts-expect-error Dynamic key access for days */}
                      {t(`days.${dayKey}`).slice(0, 3)}
                    </span>
                  </h3>
                </div>

                <div className="relative flex-1 p-4 md:p-6 flex items-center">
                  <div className="space-y-3 w-full">
                    {schedule.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between gap-4"
                      >
                        <div className="w-24 md:w-28 text-xs md:text-sm font-bold text-foreground/70 whitespace-nowrap">
                          {entry.time}
                        </div>

                        <div className="flex-1">
                          <div className="text-sm md:text-base font-semibold text-foreground">
                            {entry.title}
                          </div>
                          {entry.hint && (
                            <div className="text-xs md:text-sm font-normal text-muted-foreground">
                              ({entry.hint})
                            </div>
                          )}
                        </div>

                        {entry.instructors.length > 0 && (
                          <div className="flex -space-x-2">
                            {entry.instructors.map((instructor) => (
                              <div
                                key={instructor.id}
                                className="relative w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-border/30 shadow-sm"
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

              {todayDayIndex === dayIndex && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-primary to-brand-pink text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-primary/30 animate-pulse">
                  {t("today")}
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </section>
  );
};

export default ScheduleSection;
