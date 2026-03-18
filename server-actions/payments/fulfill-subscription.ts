"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

interface FulfillSubscriptionInput {
  studentId: string
  packageName: string
  lessonsPerWeek: number
  amount: number
  paymentMethod: string
  durationDays: number
  description?: string
  stripePaymentIntentId?: string
  startDate?: string
}

export const fulfillSubscription = async (data: FulfillSubscriptionInput) => {
  const student = await prisma.student.findUnique({
    where: { id: data.studentId },
    select: { name: true, address: true },
  })

  if (!student) throw new Error("Student not found")

  const result = await prisma.$transaction(async (tx) => {
    const now = data.startDate ? new Date(data.startDate + "T00:00:00") : new Date()
    const durationMs = data.durationDays * 24 * 60 * 60 * 1000

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
          packageName: data.packageName,
          lessonsPerWeek: data.lessonsPerWeek,
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
          packageName: data.packageName,
          lessonsPerWeek: data.lessonsPerWeek,
          amountPaid: data.amount,
          startDate,
          expiresAt: new Date(startDate.getTime() + durationMs),
        },
      })
      subscriptionId = subscription.id
    }

    const transaction = await tx.transaction.create({
      data: {
        studentId: data.studentId,
        studentName: student.name,
        subscriptionId,
        amount: data.amount,
        type: "subscription",
        paymentMethod: data.paymentMethod,
        description: data.description || `${data.packageName} subscription`,
        stripePaymentIntentId: data.stripePaymentIntentId,
      },
    })

    return { subscriptionId, transactionId: transaction.id }
  })

  revalidatePath("/admin/students")
  revalidatePath("/admin/income")
  revalidatePath("/admin/subscriptions")

  return { ...result, studentName: student.name, studentAddress: student.address }
}
