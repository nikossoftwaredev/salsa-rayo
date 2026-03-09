"use server"

import { prisma } from "@/lib/db"
import { isAdmin } from "../is-admin"

const getWeekBounds = () => {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const monday = new Date(now)
  monday.setDate(now.getDate() + mondayOffset)
  monday.setHours(0, 0, 0, 0)

  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)

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
                createdAt: { gte: monday, lte: sunday },
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
