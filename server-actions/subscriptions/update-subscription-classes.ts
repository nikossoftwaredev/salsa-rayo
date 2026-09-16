"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/db"
import { syncBookings } from "@/lib/attendance/bookings"
import { isAdmin } from "../is-admin"

interface UpdateSubscriptionClassesInput {
  subscriptionId: string
  scheduleEntryIds: string[]
}

export const updateSubscriptionClasses = async ({ subscriptionId, scheduleEntryIds }: UpdateSubscriptionClassesInput) => {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck)
      return { success: false as const, error: "Unauthorized: Admin access required" }

    await prisma.$transaction(async (tx) => {
      const subscription = await tx.subscription.findUniqueOrThrow({
        where: { id: subscriptionId },
        include: { scheduleEntries: { select: { id: true } } },
      })

      await tx.subscription.update({
        where: { id: subscriptionId },
        data: { scheduleEntries: { set: scheduleEntryIds.map((id) => ({ id })) } },
      })

      if (!subscription.studentId) return

      await syncBookings({
        db: tx,
        studentId: subscription.studentId,
        previousEntryIds: subscription.scheduleEntries.map((e) => e.id),
        nextEntryIds: scheduleEntryIds,
        from: subscription.startDate,
        to: subscription.expiresAt,
      })
    }, { timeout: 20000 })

    revalidatePath("/admin")
    revalidatePath("/admin/subscriptions")
    revalidatePath("/admin/attendance")
    return { success: true as const }
  } catch (error) {
    console.error("Database Error:", error)
    return { success: false as const, error: "Failed to update subscription classes" }
  }
}
