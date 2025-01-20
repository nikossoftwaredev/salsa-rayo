"use client";

import { SectionTitle } from "./SectionTitle";
import Card from "./Card";
import Chip from "./Chip";
import { FaRegClock } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import { SCHEDULE } from "@/data/schedule";

const ScheduleSection = () => {
  const currentDayIndex = new Date().getDay();

  return (
    <section
      id="schedule"
      className="flex items-center justify-center flex-col"
    >
      <div className="w-full grid md:grid-cols-2 gap-4 max-w-96 md:max-w-3xl">
        {SCHEDULE.map(({ day, schedule, dayIndex }) => (
          <Card
            key={day}
            className={twMerge(
              `px-4 pb-4 bg-base-300`,
              currentDayIndex === dayIndex ? "outline outline-primary " : ""
            )}
          >
            <SectionTitle title={day} />
            <div className="grid grid-cols-1 gap-4">
              {schedule.map(({ time, title, instructors }) => (
                <div
                  key={time}
                  className="flex flex-col gap-4 items-center justify-start p-2 card bg-base-200 shadow-xl"
                >
                  <div className="font-sans  flex items-center gap-2 ">
                    <FaRegClock />
                    <h3 className="text-lg ">{time}</h3>
                  </div>
                  <h4 className="text-xl font-extrabold text-primary">
                    {title}
                  </h4>
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
