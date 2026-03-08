"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/db"
import { isAdmin } from "../is-admin"

export const deleteTransaction = async (id: string) => {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck)
      return { success: false as const, error: "Unauthorized: Admin access required" }

    const transaction = await prisma.transaction.findUnique({
      where: { id },
    })

    if (!transaction)
      return { success: false as const, error: "Transaction not found" }

    const subscriptionId = transaction.subscriptionId

    await prisma.$transaction(async (tx) => {
      await tx.transaction.delete({ where: { id } })

      // If linked to a subscription, delete it when no transactions remain
      if (subscriptionId) {
        const remaining = await tx.transaction.count({ where: { subscriptionId } })
        if (remaining === 0) {
          await tx.subscription.delete({ where: { id: subscriptionId } })
        }
      }
    })

    revalidatePath("/admin/income")
    revalidatePath("/admin/subscriptions")
    revalidatePath("/admin/students")
    return { success: true as const }
  } catch (error) {
    console.error("Database Error:", error)
    return { success: false as const, error: "Failed to delete transaction" }
  }
}
