"use server"

import { revalidatePath } from "next/cache"
import { prisma, type ScheduleEntry } from "@/lib/db"
import { isAdmin } from "../is-admin"

type CreateScheduleEntryInput = Pick<ScheduleEntry, "dayIndex" | "time" | "title"> &
  Partial<Pick<ScheduleEntry, "hint">> & { instructorIds: string[] }

export const createScheduleEntry = async (data: CreateScheduleEntryInput) => {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck)
      return { success: false as const, error: "Unauthorized: Admin access required" }

    const { instructorIds, ...rest } = data

    const entry = await prisma.scheduleEntry.create({
      data: {
        ...rest,
        instructors: { connect: instructorIds.map((id) => ({ id })) },
      },
      include: { instructors: true },
    })

    revalidatePath("/admin/schedule")
    return { success: true as const, data: entry }
  } catch (error) {
    console.error("Database Error:", error)
    return { success: false as const, error: "Failed to create schedule entry" }
  }
}
