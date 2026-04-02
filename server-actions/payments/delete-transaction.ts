"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/db"
import { isAdmin } from "../is-admin"
import { getPackageDurationMs } from "@/data/packages"

export const deleteTransaction = async (id: string) => {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck)
      return { success: false as const, error: "Unauthorized: Admin access required" }

    await prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.findUnique({
        where: { id },
        include: { subscription: true },
      })

      if (!transaction) throw new Error("Transaction not found")

      await tx.transaction.delete({ where: { id } })

      const sub = transaction.subscription
      if (transaction.subscriptionId && sub) {
        const remaining = await tx.transaction.count({ where: { subscriptionId: transaction.subscriptionId } })

        if (remaining === 0) {
          await tx.subscription.delete({ where: { id: transaction.subscriptionId } })
        } else if (transaction.type === "subscription") {
          const newExpiry = new Date(sub.expiresAt.getTime() - getPackageDurationMs(sub.packageName))
          await tx.subscription.update({
            where: { id: transaction.subscriptionId },
            data: { expiresAt: newExpiry },
          })
        }
      }
    })

    revalidatePath("/admin/income")
    revalidatePath("/admin/subscriptions")
    revalidatePath("/admin")
    return { success: true as const }
  } catch (error) {
    console.error("Database Error:", error)
    return { success: false as const, error: "Failed to delete transaction" }
  }
}
