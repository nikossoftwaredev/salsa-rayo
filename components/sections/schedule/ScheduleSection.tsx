"use client";

import { SectionTitle } from "@/components/SectionTitle";
import Card from "@/components/Card";
import Chip from "@/components/Chip";
import { FaRegClock, FaStar, FaCalendarAlt } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";
import { SCHEDULE } from "@/data/schedule";
import PartnerIcon from "@/components/icons/PartnerIcon";

const ScheduleSection = () => {
  const currentDayIndex = new Date().getDay();

  return (
    <section
      id="schedule"
      className="flex items-center justify-center flex-col space-y-12 relative"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      </div>
      <SectionTitle title="Class Schedule" isMainSection />

      <div className="w-full grid xl:grid-cols-2 gap-8 max-w-96 md:max-w-5xl">
        {SCHEDULE.map(({ day, schedule, dayIndex }) => (
          <motion.div
            key={day}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
            }}
          >
            <Card
              className={twMerge(
                `group relative overflow-hidden p-8 bg-gradient-to-br backdrop-blur-sm border-2 transition-all duration-500`,
                currentDayIndex === dayIndex
                  ? "from-primary/20 to-accent/10 border-primary shadow-2xl shadow-primary/30 scale-[1.02]"
                  : "from-base-200/50 to-base-300/50 border-white/10 hover:border-primary/50 hover:shadow-2xl hover:scale-[1.01]",
                `hover:from-primary/15 hover:to-accent/15`
              )}
            >
              <div className="relative mb-8">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {day}
                </h3>
                {currentDayIndex === dayIndex && (
                  <div className="absolute -top-3 -right-3 flex items-center gap-2 bg-primary text-white px-3 py-1 rounded-full shadow-lg animate-pulse-scale">
                    <FaCalendarAlt size={14} />
                    <span className="text-xs font-bold tracking-wider">
                      TODAY
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6">
                {schedule.map(({ time, title, instructors }) => (
                  <div
                    key={time}
                    className="relative flex flex-col gap-4 items-center justify-start p-6 rounded-2xl bg-gradient-to-r from-base-100/80 to-base-200/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 group/class border border-white/10 hover:border-primary/30 hover:transform hover:-translate-y-1"
                  >
                    {(title.toLowerCase().includes("advanced") ||
                      title.toLowerCase().includes("intensive")) && (
                      <div className="absolute top-3 right-3 animate-pulse">
                        <div className="relative">
                          <FaStar className="text-accent" size={18} />
                          <div className="absolute inset-0 blur-sm">
                            <FaStar className="text-accent" size={18} />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 mb-2 w-full">
                      <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-primary/30 to-accent/30 rounded-full shadow-lg group-hover/class:shadow-primary/50 transition-all duration-300">
                        <PartnerIcon size={24} className="text-white" />
                      </div>
                      <h4 className="text-xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent group-hover/class:scale-105 transition-transform duration-300">
                        {title}
                      </h4>
                    </div>

                    <div className="font-sans flex items-center gap-3 w-full">
                      <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-white/20 to-white/10 rounded-full backdrop-blur-sm">
                        <FaRegClock size={20} className="text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white/90 tracking-wide">{time}</h3>
                    </div>

                    <div className="flex flex-wrap gap-3 items-center justify-center mt-2">
                      {instructors.map(({ image, name }) => (
                        <div key={name} className="transition-all duration-300 hover:scale-105">
                          <Chip image={image} label={name} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ScheduleSection;
