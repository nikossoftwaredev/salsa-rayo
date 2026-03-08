"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/db"
import { isAdmin } from "../is-admin"

interface UpdateExpenseInput {
  id: string
  amount: number
  date: string
  categoryId: string
  paymentMethod: string
  description?: string
}

export const updateExpense = async (data: UpdateExpenseInput) => {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck)
      return { success: false as const, error: "Unauthorized: Admin access required" }

    if (data.amount <= 0)
      return { success: false as const, error: "Amount must be greater than 0" }

    await prisma.expense.update({
      where: { id: data.id },
      data: {
        amount: data.amount,
        date: new Date(data.date),
        categoryId: data.categoryId,
        paymentMethod: data.paymentMethod,
        description: data.description || undefined,
      },
    })

    revalidatePath("/admin/expenses")
    return { success: true as const }
  } catch (error) {
    console.error("Database Error:", error)
    return { success: false as const, error: "Failed to update expense" }
  }
}
