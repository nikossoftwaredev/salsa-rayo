"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/db"
import { isAdmin } from "../is-admin"

export const deleteExpenseCategory = async (id: string) => {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck)
      return { success: false as const, error: "Unauthorized: Admin access required" }

    const category = await prisma.expenseCategory.findUnique({
      where: { id },
      include: { _count: { select: { expenses: true } } },
    })

    if (!category)
      return { success: false as const, error: "Category not found" }

    if (category._count.expenses > 0)
      return { success: false as const, error: `Cannot delete "${category.name}" - it has ${category._count.expenses} expense(s). Reassign them first.` }

    await prisma.expenseCategory.delete({ where: { id } })

    revalidatePath("/admin/expenses")
    return { success: true as const }
  } catch (error) {
    console.error("Database Error:", error)
    return { success: false as const, error: "Failed to delete category" }
  }
}
