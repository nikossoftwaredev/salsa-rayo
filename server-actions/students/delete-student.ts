"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/db"
import { isAdmin } from "../is-admin"

export const deleteStudent = async (id: string) => {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck)
      return { success: false as const, error: "Unauthorized: Admin access required" }

    await prisma.$transaction(async (tx) => {
      const student = await tx.student.findUnique({
        where: { id },
        select: { name: true, userId: true },
      })

      if (!student) throw new Error("Student not found")

      // Backfill studentName on all transactions before deleting
      await tx.transaction.updateMany({
        where: { studentId: id },
        data: { studentName: student.name },
      })

      // Delete the student (cascades: attendance deleted, subscriptions/transactions set null)
      await tx.student.delete({ where: { id } })

      // Delete the linked User account if exists
      if (student.userId) {
        await tx.user.delete({ where: { id: student.userId } })
      }
    })

    revalidatePath("/admin")
    revalidatePath("/admin/attendance")
    revalidatePath("/admin/subscriptions")
    revalidatePath("/admin/income")
    return { success: true as const }
  } catch (error) {
    console.error("Delete student error:", error)
    return { success: false as const, error: "Failed to delete student" }
  }
}
