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
        time: "19:00 - 20:00",
        title: "Salsa",
        hint: "Beginners",
        instructors: [INSTRUCTORS.konstantinos, INSTRUCTORS.anna],
      },
      {
        time: "21:00 - 22:00",
        title: "Bachata 1",
        hint: "",
        instructors: [INSTRUCTORS.anna, INSTRUCTORS.konstantinos],
        title: "Bachata 1",
        hint: "",
        instructors: [INSTRUCTORS.anna, INSTRUCTORS.konstantinos],
      },
      {
        time: "22:00 - 23:00",
        title: "Bachata 2",
        hint: "",
        instructors: [INSTRUCTORS.anna, INSTRUCTORS.konstantinos],
        title: "Bachata 2",
        hint: "",
        instructors: [INSTRUCTORS.anna, INSTRUCTORS.konstantinos],
      },
    ],
  },
  {
    dayKey: "tuesday",
    dayIndex: 2,
    schedule: [
      {
        time: "19:00 - 20:00",
        title: "Salsa Powerup",
        hint: "Open level",
        instructors: [INSTRUCTORS.natasha],
        title: "Salsa Powerup",
        hint: "Open level",
        instructors: [INSTRUCTORS.natasha],
      },
      {
        time: "20:00 - 21:00",
        title: "Salsa",
        hint: "Improvers",
        title: "Salsa",
        hint: "Improvers",
        instructors: [INSTRUCTORS.konstantinos, INSTRUCTORS.anna],
      },
      {
        time: "21:00 - 22:00",
        title: "Ladies Styling",
        hint: "Open level",
        instructors: [INSTRUCTORS.anna],
        title: "Ladies Styling",
        hint: "Open level",
        instructors: [INSTRUCTORS.anna],
      },
    ],
  },
  {
    dayKey: "wednesday",
    dayIndex: 3,
    schedule: [
      {
        time: "19:00 - 20:00",
        title: "Salsa",
        hint: "Beginners",
        instructors: [INSTRUCTORS.konstantinos, INSTRUCTORS.anna],
      },
      {
        time: "20:00 - 21:00",
        title: "Salsa Techniques",
        hint: "Open level",
        instructors: [INSTRUCTORS.natasha],
      },
      {
        time: "21:00 - 22:00",
        title: "Mambo / Pachanga",
        instructors: [INSTRUCTORS.konstantinos],
      },
      {
        time: "22:00 - 23:00",
        title: "Salsa",
        hint: "Intermediate",
        title: "Mambo / Pachanga",
        instructors: [INSTRUCTORS.konstantinos],
      },
      {
        time: "22:00 - 23:00",
        title: "Salsa",
        hint: "Intermediate",
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
        title: "Bachata 1",
        hint: "",
        title: "Bachata 1",
        hint: "",
        instructors: [INSTRUCTORS.konstantinos, INSTRUCTORS.anna],
      },
      {
        time: "20:00 - 21:00",
        title: "Salsa",
        hint: "Improvers",
        title: "Salsa",
        hint: "Improvers",
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
        hint: "Intermediate",
        hint: "Intermediate",
        instructors: [INSTRUCTORS.konstantinos, INSTRUCTORS.anna],
      },
    ],
  },
  {
    dayKey: "friday",
    dayIndex: 5,
    schedule: [
      {
        time: "20:00 ",
        title: "Early Social",
        instructors: [],
        time: "20:00 ",
        title: "Early Social",
        instructors: [],
      },
    ],
  },
];
