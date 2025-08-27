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
  natasha: {
    name: "Natasha",
    image: "/images/instructor-natasha.jpg",
  },
};

export const SCHEDULE = [
  {
    dayKey: "monday",
    dayIndex: 1,
    schedule: [
      {
        time: "20:00 - 21:00",
        title: "Bachata",
        hint: "Open/High level",
        instructors: [INSTRUCTORS.konstantinos, INSTRUCTORS.anna],
      },
      {
        time: "21:00 - 22:00",
        title: "Salsa Powerup",
        hint: "Open level",
        instructors: [INSTRUCTORS.natasha],
      },
      {
        time: "22:00 - 23:00",
        title: "Salsa Techniques",
        hint: "Intermediate",
        instructors: [INSTRUCTORS.natasha],
      },
    ],
  },
  {
    dayKey: "tuesday",
    dayIndex: 2,
    schedule: [
      {
        time: "19:00 - 20:00",
        title: "Basics & History",
        instructors: [INSTRUCTORS.konstantinos],
      },
      {
        time: "20:00 - 21:00",
        title: "Bachata",
        hint: "Open/Low level",
        instructors: [INSTRUCTORS.konstantinos, INSTRUCTORS.anna],
      },
      {
        time: "21:00 - 22:00",
        title: "Salsa",
        hint: "Open/Low level",
        instructors: [INSTRUCTORS.konstantinos, INSTRUCTORS.anna],
      },
      {
        time: "22:00 - 23:00",
        title: "Mambo",
        instructors: [INSTRUCTORS.konstantinos],
      },
    ],
  },
  {
    dayKey: "wednesday",
    dayIndex: 3,
    schedule: [
      {
        time: "20:00 - 21:00",
        title: "Salsa",
        hint: "Open/High level",
        instructors: [INSTRUCTORS.konstantinos, INSTRUCTORS.anna],
      },
      {
        time: "21:00 - 22:00",
        title: "Pachanga",
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
        title: "Salsa",
        hint: "Open/Low level",
        instructors: [INSTRUCTORS.konstantinos, INSTRUCTORS.anna],
      },
      {
        time: "20:00 - 21:00",
        title: "Bachata",
        hint: "Open/Low level",
        instructors: [INSTRUCTORS.konstantinos, INSTRUCTORS.anna],
      },
      {
        time: "21:00 - 22:00",
        title: "Movement & Styling",
        instructors: [INSTRUCTORS.anna],
      },
      {
        time: "22:00 - 23:00",
        title: "Salsa",
        hint: "Open/High level",
        instructors: [INSTRUCTORS.konstantinos, INSTRUCTORS.anna],
      },
    ],
  },
  {
    dayKey: "friday",
    dayIndex: 5,
    schedule: [
      {
        time: "20:00 - 21:00",
        title: "Ladies Style",
        instructors: [INSTRUCTORS.anna],
      },
      {
        time: "21:00 - 22:00",
        title: "Rooftop Social",
        instructors: [INSTRUCTORS.konstantinos, INSTRUCTORS.anna],
      },
      {
        time: "22:00 - 23:00",
        title: "Rooftop Social",
        instructors: [INSTRUCTORS.konstantinos, INSTRUCTORS.anna],
      },
    ],
  },
];
