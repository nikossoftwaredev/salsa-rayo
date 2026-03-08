"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/db"
import { isAdmin } from "../is-admin"

interface CreateExpenseInput {
  amount: number
  date: string
  categoryId: string
  paymentMethod: string
  description?: string
}

export const createExpense = async (data: CreateExpenseInput) => {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck)
      return { success: false as const, error: "Unauthorized: Admin access required" }

    if (data.amount <= 0)
      return { success: false as const, error: "Amount must be greater than 0" }

    await prisma.expense.create({
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
    return { success: false as const, error: "Failed to create expense" }
  }
}
