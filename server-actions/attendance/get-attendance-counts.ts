"use server"

import { prisma } from "@/lib/db"
import { isAdmin } from "../is-admin"

interface GetAttendanceCountsInput {
  date: string
}

export const getAttendanceCounts = async ({ date }: GetAttendanceCountsInput) => {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck)
      return { success: false as const, error: "Unauthorized: Admin access required" }

    const dateObj = new Date(date)
    dateObj.setUTCHours(0, 0, 0, 0)

    const results = await prisma.danceClass.findMany({
      where: { date: dateObj },
      select: {
        scheduleEntryId: true,
        _count: { select: { attendances: true } },
      },
    })

    const data: Record<string, number> = {}
    for (const r of results) {
      if (r.scheduleEntryId) data[r.scheduleEntryId] = r._count.attendances
    }

    return { success: true as const, data }
  } catch (error) {
    console.error("Get attendance counts error:", error)
    return { success: false as const, error: "Failed to fetch attendance counts" }
  }
}
