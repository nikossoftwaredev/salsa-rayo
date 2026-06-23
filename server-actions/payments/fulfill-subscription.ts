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
      const isStillActive = existingSub.expiresAt > now

      // "Days late" = whole calendar days between the expiry date and today, ignoring the
      // time-of-day, so it matches how late the renewal actually is ("expired N days ago").
      // Negative or zero while the subscription is still active.
      const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
      const daysLate = Math.round(
        (startOfDay(now).getTime() - startOfDay(existingSub.expiresAt).getTime()) / (24 * 60 * 60 * 1000)
      )

      // Grace window: renewing up to 5 days late keeps continuity from the old expiry, so the
      // student loses no days. From 6 days late onward the subscription resets to a fresh
      // period starting today (the gap is forfeited).
      const GRACE_DAYS = 5
      const isInGrace = !isStillActive && daysLate <= GRACE_DAYS

      // Active or in-grace: extend from the old expiry. Otherwise start fresh from today.
      const baseDate = isStillActive || isInGrace ? existingSub.expiresAt : now
      const newStart = isStillActive ? existingSub.startDate : baseDate
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
