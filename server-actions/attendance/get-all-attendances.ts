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
    scheduleEntry: {
      title: string
      time: string
    }
  }
}

export const getAllAttendances = async (): Promise<{
  success: boolean
  data?: AttendanceRecord[]
  error?: string
}> => {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck)
      return { success: false, error: "Unauthorized: Admin access required" }

    const attendances = await prisma.attendance.findMany({
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

    return { success: true, data: attendances }
  } catch (error) {
    console.error("Get all attendances error:", error)
    return { success: false, error: "Failed to fetch attendances" }
  }
}
