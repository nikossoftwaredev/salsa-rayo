"use server"

import { prisma, type Prisma } from "@/lib/db"
import { isAdmin } from "../is-admin"

export type ExpenseWithCategory = Prisma.ExpenseGetPayload<{
  include: { category: true }
}>

export const getExpenses = async () => {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck)
      return { success: false as const, error: "Unauthorized: Admin access required" }

    const expenses = await prisma.expense.findMany({
      include: { category: true },
      orderBy: { date: "desc" },
    })

    return { success: true as const, data: expenses }
  } catch (error) {
    console.error("Database Error:", error)
    return { success: false as const, error: "Failed to fetch expenses" }
  }
}
