"use server"

import { prisma } from "@/lib/db"
import { isAdmin } from "../is-admin"

export interface AttendanceRecord {
  id: string
  createdAt: Date
  student: {
    id: string
    name: string
    email: string
    rayoPoints: number
    subscriptions: { expiresAt: Date }[]
  }
  danceClass: {
    date: Date
    title: string | null
    time: string | null
    scheduleEntry: {
      title: string
      time: string
    } | null
  }
}

export const getAllAttendances = async () => {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck)
      return { success: false as const, error: "Unauthorized: Admin access required" }

    const attendances: AttendanceRecord[] = await prisma.attendance.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        createdAt: true,
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            rayoPoints: true,
            subscriptions: {
              where: { isActive: true, expiresAt: { gt: new Date() } },
              orderBy: { expiresAt: "desc" },
              take: 1,
              select: { expiresAt: true },
            },
          },
        },
        danceClass: {
          select: {
            date: true,
            title: true,
            time: true,
            scheduleEntry: {
              select: {
                title: true,
                time: true,
              },
            },
          },
        },
      },
    })

    return { success: true as const, data: attendances }
  } catch (error) {
    console.error("Get all attendances error:", error)
    return { success: false as const, error: "Failed to fetch attendances" }
  }
}
