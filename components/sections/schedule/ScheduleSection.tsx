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
      className="flex items-center justify-center flex-col space-y-8"
    >
      <SectionTitle title="Class Schedule" isMainSection />

      <div className="w-full grid xl:grid-cols-2 gap-6 max-w-96 md:max-w-4xl">
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
                `group relative overflow-hidden p-6 bg-gradient-to-br from-base-200 to-base-300 border-2 transition-all duration-500 hover:shadow-2xl`,
                currentDayIndex === dayIndex
                  ? "border-primary shadow-lg shadow-primary/25"
                  : "border-transparent hover:border-accent/50",
                `hover:from-primary/10 hover:to-accent/10`
              )}
            >
              <div className="relative mb-6">
                <SectionTitle title={day} />
                {currentDayIndex === dayIndex && (
                  <div className="absolute -top-2 -right-2 flex items-center gap-1">
                    <FaCalendarAlt className="text-primary" />
                    <span className="text-xs font-bold text-primary">
                      TODAY
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6">
                {schedule.map(({ time, title, instructors }) => (
                  <div
                    key={time}
                    className="relative flex flex-col gap-4 items-center justify-start p-6 rounded-xl bg-gradient-to-r from-base-100 to-base-200 shadow-lg hover:shadow-xl transition-all duration-300 group/class border border-white/10"
                  >
                    {(title.toLowerCase().includes("advanced") ||
                      title.toLowerCase().includes("intensive")) && (
                      <div className="absolute top-3 right-3">
                        <FaStar className="text-accent" size={16} />
                      </div>
                    )}

                    <div className="flex items-center gap-3 mb-2 w-full">
                      <div className="p-1 bg-primary/20 rounded-full">
                        <PartnerIcon size={24} className="text-primary" />
                      </div>
                      <h4 className="text-xl font-extrabold text-primary">
                        {title}
                      </h4>
                    </div>

                    <div className="font-sans flex items-center gap-3 w-full">
                      <div className="p-2 bg-white/10 rounded-full">
                        <FaRegClock size={16} className="text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white">{time}</h3>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center justify-center">
                      {instructors.map(({ image, name }) => (
                        <div key={name} className="transition-all duration-300">
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
