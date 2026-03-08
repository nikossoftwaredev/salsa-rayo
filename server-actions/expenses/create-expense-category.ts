"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/db"
import { isAdmin } from "../is-admin"

export const createExpenseCategory = async (name: string) => {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck)
      return { success: false as const, error: "Unauthorized: Admin access required" }

    const trimmed = name.trim()
    if (!trimmed)
      return { success: false as const, error: "Category name is required" }

    const existing = await prisma.expenseCategory.findUnique({
      where: { name: trimmed },
    })
    if (existing)
      return { success: false as const, error: "Category already exists" }

    const category = await prisma.expenseCategory.create({
      data: { name: trimmed },
    })

    revalidatePath("/admin/expenses")
    return { success: true as const, data: category }
  } catch (error) {
    console.error("Database Error:", error)
    return { success: false as const, error: "Failed to create category" }
  }
}
