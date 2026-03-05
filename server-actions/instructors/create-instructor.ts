"use server"

import { prisma, type Instructor } from "@/lib/db"
import { isAdmin } from "../is-admin"

type CreateInstructorInput = Pick<Instructor, "name" | "image"> &
  Partial<Pick<Instructor, "bio">>

export const createInstructor = async (data: CreateInstructorInput) => {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck)
      return { success: false as const, error: "Unauthorized: Admin access required" }

    const instructor = await prisma.instructor.create({ data })

    return { success: true as const, data: instructor }
  } catch (error) {
    console.error("Database Error:", error)
    return { success: false as const, error: "Failed to create instructor" }
  }
}
