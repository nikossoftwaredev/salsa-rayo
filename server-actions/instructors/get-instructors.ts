"use server"

import { prisma } from "@/lib/db"

export const getInstructors = async () => {
  try {
    const instructors = await prisma.instructor.findMany({
      include: { _count: { select: { scheduleEntries: true } } },
      orderBy: { name: "asc" },
    })

    return { success: true as const, data: instructors }
  } catch (error) {
    console.error("Database Error:", error)
    return { success: false as const, error: "Failed to fetch instructors" }
  }
}
