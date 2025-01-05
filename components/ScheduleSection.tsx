"use client";
import { SCHEDULE } from "@/data/config";

import { SectionTitle } from "./SectionTitle";
import Card from "./Card";
import Chip from "./Chip";
import { FaRegClock } from "react-icons/fa";
import { twMerge } from "tailwind-merge";

const ScheduleSection = () => {
  const currentDayIndex = new Date().getDay();

  return (
    <section id="schedule w-full ">
      <div className="w-full grid gap-4">
        {SCHEDULE.map(({ day, schedule, dayIndex }) => (
          <Card
            key={day}
            className={twMerge(
              `px-4 pb-4`,
              currentDayIndex === dayIndex ? "outline-primary " : ""
            )}
          >
            <SectionTitle title={day} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {schedule.map(({ time, title, instructors }) => (
                <div
                  key={time}
                  className="flex flex-col gap-4 items-center justify-start p-2 card bg-base-200 shadow-xl"
                >
                  <div className="flex items-center gap-2 text-primary">
                    <FaRegClock />
                    <h3 className="text-lg font-bold">{time}</h3>
                  </div>
                  <h4 className="text-xl font-extrabold ">{title}</h4>
                  <div className="flex flex-wrap gap-2 items-center justify-center">
                    {instructors.map(({ image, name }) => (
                      <Chip key={name} image={image} label={name} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ScheduleSection;
