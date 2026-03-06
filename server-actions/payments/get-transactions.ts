"use server"

import { prisma, type Prisma } from "@/lib/db"
import { isAdmin } from "../is-admin"

export type TransactionWithStudent = Prisma.TransactionGetPayload<{
  include: { student: true; subscription: true }
}>

export const getTransactions = async (studentId?: string) => {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck)
      return { success: false as const, error: "Unauthorized: Admin access required" }

    const transactions = await prisma.transaction.findMany({
      where: studentId ? { studentId } : undefined,
      include: { student: true, subscription: true },
      orderBy: { createdAt: "desc" },
    })

    return { success: true as const, data: transactions }
  } catch (error) {
    console.error("Database Error:", error)
    return { success: false as const, error: "Failed to fetch transactions" }
  }
}
