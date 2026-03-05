/* eslint-disable no-var */
import { PrismaClient } from "./generated/prisma/client/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? [] : ["error"],
  });

export * from "./generated/prisma/client/client";

// Composite types used across admin + public components
export type { Instructor, ScheduleEntry } from "./generated/prisma/client/client";
import type { Instructor, ScheduleEntry } from "./generated/prisma/client/client";
export type ScheduleEntryWithInstructors = ScheduleEntry & { instructors: Instructor[] };

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
