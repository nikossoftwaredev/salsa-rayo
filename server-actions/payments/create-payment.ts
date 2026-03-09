"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/db"
import { isAdmin } from "../is-admin"
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
}

export const createPayment = async (data: CreatePaymentInput) => {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck)
      return { success: false as const, error: "Unauthorized: Admin access required" }

    if (data.amount <= 0)
      return { success: false as const, error: "Amount must be greater than 0" }

    const student = await prisma.student.findUnique({
      where: { id: data.studentId },
      select: { name: true },
    })

    if (!student)
      return { success: false as const, error: "Student not found" }

    if (data.type === "subscription") {
      if (!data.packageName || !data.lessonsPerWeek || !data.durationDays)
        return { success: false as const, error: "Subscription requires package details" }

      await prisma.$transaction(async (tx) => {
        const now = new Date()
        const durationMs = data.durationDays! * 24 * 60 * 60 * 1000

        const existingSub = await tx.subscription.findFirst({
          where: {
            studentId: data.studentId,
            isActive: true,
            expiresAt: { gt: now },
          },
          orderBy: { expiresAt: "desc" },
        })

        let subscriptionId: string

        if (existingSub) {
          const newExpiry = new Date(existingSub.expiresAt.getTime() + durationMs)
          await tx.subscription.update({
            where: { id: existingSub.id },
            data: {
              expiresAt: newExpiry,
              packageName: data.packageName!,
              lessonsPerWeek: data.lessonsPerWeek!,
              amountPaid: data.amount,
            },
          })
          subscriptionId = existingSub.id
        } else {
          const SWEET_SPOT_DAYS = 4
          const sweetSpotCutoff = new Date(
            now.getTime() - SWEET_SPOT_DAYS * 24 * 60 * 60 * 1000
          )

          const recentlyExpiredSub = await tx.subscription.findFirst({
            where: {
              studentId: data.studentId,
              expiresAt: { gte: sweetSpotCutoff, lte: now },
            },
            orderBy: { expiresAt: "desc" },
          })

          const startDate = recentlyExpiredSub
            ? recentlyExpiredSub.expiresAt
            : now

          const subscription = await tx.subscription.create({
            data: {
              studentId: data.studentId,
              packageName: data.packageName!,
              lessonsPerWeek: data.lessonsPerWeek!,
              amountPaid: data.amount,
              startDate,
              expiresAt: new Date(startDate.getTime() + durationMs),
            },
          })
          subscriptionId = subscription.id
        }

        await tx.transaction.create({
          data: {
            studentId: data.studentId,
            studentName: student.name,
            subscriptionId,
            amount: data.amount,
            type: "subscription",
            paymentMethod: data.paymentMethod,
            description: data.description || `${data.packageName} subscription`,
          },
        })
      })
    } else {
      await prisma.transaction.create({
        data: {
          studentId: data.studentId,
          studentName: student.name,
          amount: data.amount,
          type: data.type,
          paymentMethod: data.paymentMethod,
          description: data.description || undefined,
        },
      })
    }

    revalidatePath("/admin/students")
    revalidatePath("/admin/income")
    revalidatePath("/admin/subscriptions")
    return { success: true as const }
  } catch (error) {
    console.error("Database Error:", error)
    return { success: false as const, error: "Failed to create payment" }
  }
}
