"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/db"
import { isAdmin } from "../is-admin"
import { SUBSCRIPTION_PERIOD_MS } from "@/data/packages"
import { removeBookings } from "@/lib/attendance/bookings"

export const deleteTransaction = async (id: string) => {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck)
      return { success: false as const, error: "Unauthorized: Admin access required" }

    await prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.findUnique({
        where: { id },
        include: { subscription: { include: { scheduleEntries: { select: { id: true } } } } },
      })

      if (!transaction) throw new Error("Transaction not found")

      await tx.transaction.delete({ where: { id } })

      const sub = transaction.subscription
      if (transaction.subscriptionId && sub) {
        const remaining = await tx.transaction.count({ where: { subscriptionId: transaction.subscriptionId } })
        const bookingScope = sub.studentId && {
          db: tx,
          studentId: sub.studentId,
          scheduleEntryIds: sub.scheduleEntries.map((e) => e.id),
        }

        if (remaining === 0) {
          await tx.subscription.delete({ where: { id: transaction.subscriptionId } })
          if (bookingScope) await removeBookings({ ...bookingScope, from: sub.startDate, to: sub.expiresAt })
        } else if (transaction.type === "subscription") {
          const newExpiry = new Date(sub.expiresAt.getTime() - SUBSCRIPTION_PERIOD_MS)
          await tx.subscription.update({
            where: { id: transaction.subscriptionId },
            data: { expiresAt: newExpiry },
          })
          if (bookingScope) await removeBookings({ ...bookingScope, from: newExpiry, to: sub.expiresAt })
        }
      }
    }, { timeout: 20000 })

    revalidatePath("/admin/income")
    revalidatePath("/admin/subscriptions")
    revalidatePath("/admin")
    revalidatePath("/admin/attendance")
    return { success: true as const }
  } catch (error) {
    console.error("Database Error:", error)
    return { success: false as const, error: "Failed to delete transaction" }
  }
}
