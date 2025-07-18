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
    day: "Monday",
    dayIndex: 1,
    schedule: [
      {
        time: "18:00 - 19:00",
        title: "Salsa Level 1",
        instructors: [INSTRUCTORS.konstantinos, INSTRUCTORS.anna],
      },
      {
        time: "19:00 - 20:00",
        title: "Salsa Level 2",
        instructors: [INSTRUCTORS.konstantinos, INSTRUCTORS.anna],
      },
      {
        time: "20:00 - 21:00",
        title: "Mambo",
        instructors: [INSTRUCTORS.konstantinos],
      },
      {
        time: "21:00 - 22:00",
        title: "Bachata Level 2",
        instructors: [INSTRUCTORS.konstantinos, INSTRUCTORS.anna],
      },
    ],
  },
  {
    day: "Tuesday",
    dayIndex: 2,
    schedule: [
      {
        time: "18:00 - 19:00",
        title: "Salsa Level 1",
        instructors: [INSTRUCTORS.konstantinos, INSTRUCTORS.anna],
      },
      {
        time: "19:00 - 20:00",
        title: "Salsa Level 2",
        instructors: [INSTRUCTORS.konstantinos, INSTRUCTORS.anna],
      },
      {
        time: "20:00 - 21:00",
        title: "Ladies Style",
        instructors: [INSTRUCTORS.anna],
      },
      {
        time: "21:00 - 22:00",
        title: "Bachata Level 2",
        instructors: [INSTRUCTORS.konstantinos, INSTRUCTORS.anna],
      },
    ],
  },
  {
    day: "Wednesday",
    dayIndex: 3,
    schedule: [
      {
        time: "18:00 - 19:00",
        title: "Salsa Level 1",
        instructors: [INSTRUCTORS.konstantinos, INSTRUCTORS.anna],
      },
      {
        time: "19:00 - 20:00",
        title: "Salsa Level 2",
        instructors: [INSTRUCTORS.konstantinos, INSTRUCTORS.anna],
      },
      {
        time: "20:00 - 21:00",
        title: "Bachata Level 1",
        instructors: [INSTRUCTORS.konstantinos, INSTRUCTORS.anna],
      },
      {
        time: "21:00 - 22:00",
        title: "Bachata Level 2",
        instructors: [INSTRUCTORS.konstantinos, INSTRUCTORS.anna],
      },
    ],
  },
  {
    day: "Thursday",
    dayIndex: 4,
    schedule: [
      {
        time: "18:00 - 19:00",
        title: "Salsa Level 1",
        instructors: [INSTRUCTORS.konstantinos, INSTRUCTORS.anna],
      },
      {
        time: "19:00 - 20:00",
        title: "Salsa Level 2",
        instructors: [INSTRUCTORS.konstantinos, INSTRUCTORS.anna],
      },
      {
        time: "20:00 - 21:00",
        title: "Bachata Level 1",
        instructors: [INSTRUCTORS.konstantinos, INSTRUCTORS.anna],
      },
      {
        time: "21:00 - 22:00",
        title: "Bachata Level 2",
        instructors: [INSTRUCTORS.konstantinos, INSTRUCTORS.anna],
      },
    ],
  },
  // {
  //   day: "Friday",
  //   dayIndex: 5,
  //   schedule: [
  //     {
  //       time: "18:00 - 19:00",
  //       title: "Salsa Level 1",
  //       instructors: [INSTRUCTORS.konstantinos, INSTRUCTORS.anna],
  //     },
  //     {
  //       time: "19:00 - 20:00",
  //       title: "Salsa Level 2",
  //       instructors: [INSTRUCTORS.konstantinos, INSTRUCTORS.anna],
  //     },
  //     {
  //       time: "20:00 - 21:00",
  //       title: "Bachata Level 1",
  //       instructors: [INSTRUCTORS.konstantinos, INSTRUCTORS.anna],
  //     },
  //     {
  //       time: "21:00 - 22:00",
  //       title: "Bachata Level 2",
  //       instructors: [INSTRUCTORS.konstantinos, INSTRUCTORS.anna],
  //     },
  //   ],
  // },
];