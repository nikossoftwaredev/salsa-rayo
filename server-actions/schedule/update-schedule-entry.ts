"use server"

import { revalidatePath } from "next/cache"
import { prisma, type ScheduleEntry } from "@/lib/db"
import { isAdmin } from "../is-admin"

type UpdateScheduleEntryInput = Partial<
  Pick<ScheduleEntry, "dayIndex" | "time" | "title" | "hint">
> & { instructorIds?: string[] }

export const updateScheduleEntry = async (id: string, data: UpdateScheduleEntryInput) => {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck)
      return { success: false as const, error: "Unauthorized: Admin access required" }

    const { instructorIds, ...rest } = data

    const entry = await prisma.scheduleEntry.update({
      where: { id },
      data: {
        ...rest,
        ...(instructorIds !== undefined && {
          instructors: { set: instructorIds.map((id) => ({ id })) },
        }),
      },
      include: { instructors: true },
    })

    revalidatePath("/admin/schedule")
    return { success: true as const, data: entry }
  } catch (error) {
    console.error("Database Error:", error)
    return { success: false as const, error: "Failed to update schedule entry" }
  }
}
