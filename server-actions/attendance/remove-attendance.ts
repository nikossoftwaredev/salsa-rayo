"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/db"
import { isAdmin } from "../is-admin"

export const removeAttendance = async (attendanceId: string) => {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck)
      return { success: false as const, error: "Unauthorized: Admin access required" }

    await prisma.$transaction(async (tx) => {
      await tx.attendance.delete({
        where: { id: attendanceId },
        select: { studentId: true },
      })

      // TODO: Enable in September 2026
      // await tx.student.update({
      //   where: { id: attendance.studentId },
      //   data: { rayoPoints: { decrement: 30 } },
      // })
      //
      // // Floor at 0
      // await tx.student.updateMany({
      //   where: { id: attendance.studentId, rayoPoints: { lt: 0 } },
      //   data: { rayoPoints: 0 },
      // })
    })

    revalidatePath("/admin/attendance")
    return { success: true as const }
  } catch (error) {
    console.error("Remove attendance error:", error)
    return { success: false as const, error: "Failed to remove attendance" }
  }
}
