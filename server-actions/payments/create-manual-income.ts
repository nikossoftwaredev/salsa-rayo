"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/db"
import { isAdmin } from "../is-admin"
import {
  type PaymentType,
  type PaymentMethod,
} from "@/data/payment-constants"

interface CreateManualIncomeInput {
  amount: number
  type: PaymentType
  paymentMethod: PaymentMethod
  date: string
  description?: string
  customerName?: string
}

export const createManualIncome = async (data: CreateManualIncomeInput) => {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck)
      return { success: false as const, error: "Unauthorized: Admin access required" }

    if (data.amount <= 0)
      return { success: false as const, error: "Amount must be greater than 0" }

    if (data.type === "subscription")
      return { success: false as const, error: "Subscriptions must be created through a student" }

    await prisma.transaction.create({
      data: {
        studentId: null,
        studentName: data.customerName?.trim() || "Manual entry",
        amount: data.amount,
        type: data.type,
        paymentMethod: data.paymentMethod,
        description: data.description?.trim() || undefined,
        createdAt: new Date(data.date),
      },
    })

    revalidatePath("/admin")
    revalidatePath("/admin/income")

    return { success: true as const }
  } catch (error) {
    console.error("Database Error:", error)
    return { success: false as const, error: "Failed to record income" }
  }
}
