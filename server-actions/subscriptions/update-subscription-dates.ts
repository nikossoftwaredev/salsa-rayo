"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/db"
import { createBookings, removeBookings } from "@/lib/attendance/bookings"
import { isAdmin } from "../is-admin"

export const updateSubscriptionDates = async (subscriptionId: string, startDate: Date) => {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck)
      return { success: false as const, error: "Unauthorized: Admin access required" }

    const subscription = await prisma.$transaction(async (tx) => {
      // Preserve the original duration of the subscription
      const existing = await tx.subscription.findUnique({
        where: { id: subscriptionId },
        include: { scheduleEntries: { select: { id: true } } },
      })
      if (!existing) return null

      const durationMs = existing.expiresAt.getTime() - existing.startDate.getTime()
      const expiresAt = new Date(startDate.getTime() + durationMs)

      const updated = await tx.subscription.update({
        where: { id: subscriptionId },
        data: { startDate, expiresAt },
      })

      if (existing.studentId) {
        const studentId = existing.studentId
        const scheduleEntryIds = existing.scheduleEntries.map((e) => e.id)

        // Drop bookings that fall outside the moved period, and book only the
        // days the period newly covers so hand-removed bookings stay removed.
        await removeBookings({ db: tx, studentId, scheduleEntryIds, to: startDate })
        await removeBookings({ db: tx, studentId, scheduleEntryIds, from: expiresAt })
        if (startDate < existing.startDate)
          await createBookings({ db: tx, studentId, scheduleEntryIds, from: startDate, to: existing.startDate })
        if (expiresAt > existing.expiresAt)
          await createBookings({ db: tx, studentId, scheduleEntryIds, from: existing.expiresAt, to: expiresAt })
      }

      return updated
    }, { timeout: 20000 })

    if (!subscription)
      return { success: false as const, error: "Subscription not found" }

    revalidatePath("/admin")
    revalidatePath("/admin/subscriptions")
    revalidatePath("/admin/attendance")
    return { success: true as const, data: subscription }
  } catch (error) {
    console.error("Database Error:", error)
    return { success: false as const, error: "Failed to update subscription dates" }
  }
}
