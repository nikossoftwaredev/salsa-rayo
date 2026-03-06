"use server"

import { prisma, type Student } from "@/lib/db"
import { isAdmin } from "../is-admin"

type CreateStudentInput = Pick<Student, "name" | "email"> &
  Partial<Pick<Student, "phone" | "address" | "notes" | "createdAt">>

export const createStudent = async (data: CreateStudentInput) => {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck)
      return { success: false as const, error: "Unauthorized: Admin access required" }

    if (data.createdAt !== undefined && new Date(data.createdAt) > new Date()) data.createdAt = new Date()

    const student = await prisma.student.create({ data })

    return { success: true as const, data: student }
  } catch (error) {
    console.error("Database Error:", error)
    return { success: false as const, error: "Failed to create student" }
  }
}
