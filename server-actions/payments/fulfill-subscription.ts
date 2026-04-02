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

    // Find the student's single subscription (if any)
    const existingSub = await tx.subscription.findFirst({
      where: { studentId: data.studentId },
      orderBy: { expiresAt: "desc" },
    })

    let subscriptionId: string

    if (existingSub) {
      const isStillActive = new Date(existingSub.expiresAt) > now
      // Recently expired (within 4 days) → continue from old expiry so they don't lose days
      const SWEET_SPOT_MS = 4 * 24 * 60 * 60 * 1000
      const isInSweetSpot = !isStillActive && (now.getTime() - existingSub.expiresAt.getTime()) <= SWEET_SPOT_MS

      const newStart = isStillActive ? existingSub.startDate : (isInSweetSpot ? existingSub.expiresAt : now)
      const baseDate = isStillActive ? existingSub.expiresAt : newStart
      const newExpiry = new Date(baseDate.getTime() + durationMs)

      await tx.subscription.update({
        where: { id: existingSub.id },
        data: {
          startDate: newStart,
          expiresAt: newExpiry,
          isActive: true,
          packageName: data.packageName,
          lessonsPerWeek: data.lessonsPerWeek,
          amountPaid: data.amount,
        },
      })
      subscriptionId = existingSub.id
    } else {
      const subscription = await tx.subscription.create({
        data: {
          studentId: data.studentId,
          packageName: data.packageName,
          lessonsPerWeek: data.lessonsPerWeek,
          amountPaid: data.amount,
          startDate: now,
          expiresAt: new Date(now.getTime() + durationMs),
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

  revalidatePath("/admin")
  revalidatePath("/admin/income")
  revalidatePath("/admin/subscriptions")

  return { ...result, studentName: student.name, studentAddress: student.address }
}
