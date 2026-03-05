"use server"

import { prisma } from "@/lib/db"
import { isAdmin } from "../is-admin"

const INSTRUCTORS_DATA = [
  { name: "Konstantinos", image: "/images/instructor-konstantinos.jpg" },
  { name: "Anna", image: "/images/instructor-anna.jpg" },
  { name: "Natasha", image: "/images/instructor-natasha.jpg" },
]

const SCHEDULE_DATA = [
  { dayIndex: 1, time: "19:00 - 20:00", title: "Salsa", hint: "Beginners", instructors: ["Konstantinos", "Anna"], sortOrder: 0 },
  { dayIndex: 1, time: "20:00 - 21:00", title: "Bachata 1", hint: "", instructors: ["Anna", "Konstantinos"], sortOrder: 1 },
  { dayIndex: 1, time: "21:00 - 22:00", title: "Bachata 2", hint: "", instructors: ["Anna", "Konstantinos"], sortOrder: 2 },
  { dayIndex: 2, time: "19:00 - 20:00", title: "Salsa Powerup", hint: "Open level", instructors: ["Natasha"], sortOrder: 0 },
  { dayIndex: 2, time: "20:00 - 21:00", title: "Salsa", hint: "Improvers", instructors: ["Konstantinos", "Anna"], sortOrder: 1 },
  { dayIndex: 2, time: "21:00 - 22:00", title: "Ladies Styling", hint: "Open level", instructors: ["Anna"], sortOrder: 2 },
  { dayIndex: 3, time: "19:00 - 20:00", title: "Salsa", hint: "Beginners", instructors: ["Konstantinos", "Anna"], sortOrder: 0 },
  { dayIndex: 3, time: "20:00 - 21:00", title: "Salsa Techniques", hint: "Open level", instructors: ["Natasha"], sortOrder: 1 },
  { dayIndex: 3, time: "21:00 - 22:00", title: "Mambo / Pachanga", hint: null, instructors: ["Konstantinos"], sortOrder: 2 },
  { dayIndex: 3, time: "22:00 - 23:00", title: "Salsa", hint: "Intermediate", instructors: ["Konstantinos", "Anna"], sortOrder: 3 },
  { dayIndex: 4, time: "19:00 - 20:00", title: "Bachata 1", hint: "", instructors: ["Konstantinos", "Anna"], sortOrder: 0 },
  { dayIndex: 4, time: "20:00 - 21:00", title: "Salsa", hint: "Improvers", instructors: ["Konstantinos", "Anna"], sortOrder: 1 },
  { dayIndex: 4, time: "21:00 - 22:00", title: "Movement & Styling", hint: null, instructors: ["Anna"], sortOrder: 2 },
  { dayIndex: 4, time: "22:00 - 23:00", title: "Salsa", hint: "Intermediate", instructors: ["Konstantinos", "Anna"], sortOrder: 3 },
  { dayIndex: 5, time: "20:00", title: "Early Social", hint: "Starting March", instructors: [], sortOrder: 0 },
]

export const seedSchedule = async () => {
  const adminCheck = await isAdmin()
  if (!adminCheck) return { success: false as const, error: "Unauthorized" }

  try {
    const existingCount = await prisma.scheduleEntry.count()
    if (existingCount > 0) return { success: false as const, error: "Schedule data already exists" }

    // Create instructors
    const instructorMap = new Map<string, string>()
    for (const data of INSTRUCTORS_DATA) {
      const instructor = await prisma.instructor.create({ data })
      instructorMap.set(data.name, instructor.id)
    }

    // Create schedule entries with instructor connections
    for (const entry of SCHEDULE_DATA) {
      const instructorIds = entry.instructors
        .map(name => instructorMap.get(name))
        .filter((id): id is string => !!id)

      await prisma.scheduleEntry.create({
        data: {
          dayIndex: entry.dayIndex,
          time: entry.time,
          title: entry.title,
          hint: entry.hint,
          sortOrder: entry.sortOrder,
          instructors: { connect: instructorIds.map(id => ({ id })) },
        },
      })
    }

    return { success: true as const }
  } catch (error) {
    console.error("Seed error:", error)
    return { success: false as const, error: "Failed to seed schedule data" }
  }
}
