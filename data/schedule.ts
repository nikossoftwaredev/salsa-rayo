// Define instructors separately for reusability
export const INSTRUCTORS = {
  konstantinos: {
    name: "Konstantinos",
    image: "/images/instructor-konstantinos.jpg",
  },
  anna: {
    name: "Anna",
    image: "/images/instructor-anna.jpg",
  },
};

export const SCHEDULE = [
  {
    dayKey: "monday",
    dayIndex: 1,
    schedule: [
      {
        time: "19:00 - 20:00",
        title: "Salsa (Open Level)",
        instructors: [INSTRUCTORS.konstantinos, INSTRUCTORS.anna],
      },
      {
        time: "20:00 - 21:00",
        title: "Bachata (Open Level)",
        instructors: [INSTRUCTORS.konstantinos, INSTRUCTORS.anna],
      },
    ],
  },
  {
    dayKey: "thursday",
    dayIndex: 4,
    schedule: [
      {
        time: "19:00 - 20:00",
        title: "Salsa (Open Level)",
        instructors: [INSTRUCTORS.konstantinos, INSTRUCTORS.anna],
      },
      {
        time: "20:00 - 21:00",
        title: "Bachata (Open Level)",
        instructors: [INSTRUCTORS.konstantinos, INSTRUCTORS.anna],
      },
    ],
  },
];