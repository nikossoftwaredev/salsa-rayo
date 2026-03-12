"use server"

import { prisma } from "@/lib/db"
import { isAdmin } from "../is-admin"

interface GetAttendancesInput {
  scheduleEntryId: string
  date: string
}

export const getAttendances = async ({ scheduleEntryId, date }: GetAttendancesInput) => {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck)
      return { success: false as const, error: "Unauthorized: Admin access required" }

    const dateObj = new Date(date)
    dateObj.setUTCHours(0, 0, 0, 0)

    const danceClass = await prisma.danceClass.findFirst({
      where: { scheduleEntryId, date: dateObj },
      select: {
        attendances: {
          select: {
            id: true,
            studentId: true,
            student: {
              select: {
                name: true,
                rayoPoints: true,
                subscriptions: {
                  where: { isActive: true },
                  orderBy: { expiresAt: "desc" },
                  take: 1,
                  select: { expiresAt: true },
                },
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    })

    return {
      success: true as const,
      data: danceClass?.attendances ?? [],
    }
  } catch (error) {
    console.error("Get attendances error:", error)
    return { success: false as const, error: "Failed to fetch attendances" }
  }
}

export type AttendanceRecord = NonNullable<
  Awaited<ReturnType<typeof getAttendances>>["data"]
>[number]
