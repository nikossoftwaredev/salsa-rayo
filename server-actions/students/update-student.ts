"use server"

import { prisma, type Student } from "@/lib/db"
import { isAdmin } from "../is-admin"

type UpdateStudentInput = Partial<
  Pick<Student, "name" | "email" | "phone" | "address" | "notes" | "isActive" | "rayoPoints" | "createdAt">
>

export const updateStudent = async (id: string, data: UpdateStudentInput) => {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck)
      return { success: false as const, error: "Unauthorized: Admin access required" }

    if (data.rayoPoints !== undefined && data.rayoPoints < 0) data.rayoPoints = 0
    if (data.createdAt !== undefined && new Date(data.createdAt) > new Date()) data.createdAt = new Date()

    const student = await prisma.student.update({
      where: { id },
      data,
    })

    return { success: true as const, data: student }
  } catch (error) {
    console.error("Database Error:", error)
    return { success: false as const, error: "Failed to update student" }
  }
}
