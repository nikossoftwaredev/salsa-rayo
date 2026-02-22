export const FAQ_CATEGORIES = [
  "gettingStarted",
  "classesSchedule",
  "pricingPackages",
  "locationLogistics",
  "aboutSchool",
] as const;

export type FaqCategory = (typeof FAQ_CATEGORIES)[number];

type FaqQuestionKey =
  | "q1" | "q2" | "q3" | "q4"
  | "q5" | "q6" | "q7" | "q8"
  | "q9" | "q10" | "q11"
  | "q12" | "q13"
  | "q14" | "q15" | "q16";

type FaqAnswerKey =
  | "a1" | "a2" | "a3" | "a4"
  | "a5" | "a6" | "a7" | "a8"
  | "a9" | "a10" | "a11"
  | "a12" | "a13"
  | "a14" | "a15" | "a16";

export interface FaqItem {
  questionKey: FaqQuestionKey;
  answerKey: FaqAnswerKey;
  category: FaqCategory;
}

export const FAQ_ITEMS: FaqItem[] = [
  // Getting Started
  { questionKey: "q1", answerKey: "a1", category: "gettingStarted" },
  { questionKey: "q2", answerKey: "a2", category: "gettingStarted" },
  { questionKey: "q3", answerKey: "a3", category: "gettingStarted" },
  { questionKey: "q4", answerKey: "a4", category: "gettingStarted" },

  // Classes & Schedule
  { questionKey: "q5", answerKey: "a5", category: "classesSchedule" },
  { questionKey: "q6", answerKey: "a6", category: "classesSchedule" },
  { questionKey: "q7", answerKey: "a7", category: "classesSchedule" },
  { questionKey: "q8", answerKey: "a8", category: "classesSchedule" },

  // Pricing & Packages
  { questionKey: "q9", answerKey: "a9", category: "pricingPackages" },
  { questionKey: "q10", answerKey: "a10", category: "pricingPackages" },
  { questionKey: "q11", answerKey: "a11", category: "pricingPackages" },

  // Location & Logistics
  { questionKey: "q12", answerKey: "a12", category: "locationLogistics" },
  { questionKey: "q13", answerKey: "a13", category: "locationLogistics" },

  // About the School
  { questionKey: "q14", answerKey: "a14", category: "aboutSchool" },
  { questionKey: "q15", answerKey: "a15", category: "aboutSchool" },
  { questionKey: "q16", answerKey: "a16", category: "aboutSchool" },
];
