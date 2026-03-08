"use server"

import { prisma } from "@/lib/db"
import { isAdmin } from "../is-admin"

export const getExpenseCategories = async () => {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck)
      return { success: false as const, error: "Unauthorized: Admin access required" }

    const categories = await prisma.expenseCategory.findMany({
      orderBy: { name: "asc" },
    })

    return { success: true as const, data: categories }
  } catch (error) {
    console.error("Database Error:", error)
    return { success: false as const, error: "Failed to fetch expense categories" }
  }
}
