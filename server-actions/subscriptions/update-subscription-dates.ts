"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/db"
import { isAdmin } from "../is-admin"

export const updateSubscriptionDates = async (subscriptionId: string, startDate: Date) => {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck)
      return { success: false as const, error: "Unauthorized: Admin access required" }

    // Preserve the original duration of the subscription
    const existing = await prisma.subscription.findUnique({ where: { id: subscriptionId } })
    if (!existing)
      return { success: false as const, error: "Subscription not found" }

    const durationMs = existing.expiresAt.getTime() - existing.startDate.getTime()
    const expiresAt = new Date(startDate.getTime() + durationMs)

    const subscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: { startDate, expiresAt },
    })

    revalidatePath("/admin/students")
    revalidatePath("/admin/subscriptions")
    return { success: true as const, data: subscription }
  } catch (error) {
    console.error("Database Error:", error)
    return { success: false as const, error: "Failed to update subscription dates" }
  }
}
