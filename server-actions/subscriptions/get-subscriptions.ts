"use server"

import { prisma } from "@/lib/db"
import { isAdmin } from "../is-admin"

const getWeekBounds = () => {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  // DanceClass.date is stored as UTC midnight of the calendar day
  const monday = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() + mondayOffset))
  const sunday = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() + mondayOffset + 6))

  return { monday, sunday }
}

export const getSubscriptions = async () => {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck)
      return { success: false as const, error: "Unauthorized: Admin access required" }

    const { monday, sunday } = getWeekBounds()

    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)

    const subscriptions = await prisma.subscription.findMany({
      where: { studentId: { not: null } },
      select: {
        id: true,
        packageName: true,
        lessonsPerWeek: true,
        amountPaid: true,
        startDate: true,
        expiresAt: true,
        isActive: true,
        scheduleEntries: {
          select: { id: true, dayIndex: true, time: true, title: true },
          orderBy: [{ dayIndex: "asc" }, { time: "asc" }],
        },
        transactions: {
          where: {
            createdAt: { gte: monthStart },
            type: "subscription",
          },
          select: { amount: true },
        },
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            attendances: {
              where: {
                danceClass: { date: { gte: monday, lte: sunday } },
              },
              select: { id: true },
            },
          },
        },
      },
      orderBy: { expiresAt: "desc" },
    })

    return { success: true as const, data: subscriptions }
  } catch (error) {
    console.error("Database Error:", error)
    return { success: false as const, error: "Failed to fetch subscriptions" }
  }
}

export type SubscriptionWithDetails = NonNullable<
  Awaited<ReturnType<typeof getSubscriptions>>["data"]
>[number]
