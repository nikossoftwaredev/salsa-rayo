"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/db"
import { DELETED_USER_NAME } from "@/data/student-constants"
import { isAdmin } from "../is-admin"

export const softDeleteStudent = async (id: string) => {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck)
      return { success: false as const, error: "Unauthorized: Admin access required" }

    await prisma.student.update({
      where: { id },
      data: {
        name: DELETED_USER_NAME,
        email: "",
        phone: null,
        address: null,
        notes: null,
        bio: null,
        instagram: null,
        website: null,
        isActive: false,
        rayoPoints: 0,
        userId: null,
      },
    })

    revalidatePath("/admin/students")
    revalidatePath("/admin/attendance")
    revalidatePath("/admin/subscriptions")
    return { success: true as const }
  } catch (error) {
    console.error("Soft delete student error:", error)
    return { success: false as const, error: "Failed to delete student" }
  }
}
