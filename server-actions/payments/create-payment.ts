"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/db"
import { isAdmin } from "../is-admin"
import { fulfillSubscription } from "./fulfill-subscription"
import {
  type PaymentType,
  type PaymentMethod,
} from "@/data/payment-constants"

interface CreatePaymentInput {
  studentId: string
  type: PaymentType
  paymentMethod: PaymentMethod
  amount: number
  description?: string
  packageName?: string
  lessonsPerWeek?: number
  durationDays?: number
  startDate?: string
}

export const createPayment = async (data: CreatePaymentInput) => {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck)
      return { success: false as const, error: "Unauthorized: Admin access required" }

    if (data.amount <= 0)
      return { success: false as const, error: "Amount must be greater than 0" }

    if (data.type === "subscription") {
      if (!data.packageName || !data.lessonsPerWeek || !data.durationDays)
        return { success: false as const, error: "Subscription requires package details" }

      await fulfillSubscription({
        studentId: data.studentId,
        packageName: data.packageName,
        lessonsPerWeek: data.lessonsPerWeek,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        durationDays: data.durationDays,
        description: data.description,
        startDate: data.startDate,
      })
    } else {
      const student = await prisma.student.findUnique({
        where: { id: data.studentId },
        select: { name: true },
      })

      if (!student)
        return { success: false as const, error: "Student not found" }

      const transaction = await prisma.transaction.create({
        data: {
          studentId: data.studentId,
          studentName: student.name,
          amount: data.amount,
          type: data.type,
          paymentMethod: data.paymentMethod,
          description: data.description || undefined,
        },
      })

      revalidatePath("/admin")
      revalidatePath("/admin/income")
      revalidatePath("/admin/subscriptions")
    }

    return { success: true as const }
  } catch (error) {
    console.error("Database Error:", error)
    return { success: false as const, error: "Failed to create payment" }
  }
}
