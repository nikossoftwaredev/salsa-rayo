"use server"

import { prisma, type Instructor } from "@/lib/db"
import { isAdmin } from "../is-admin"

type UpdateInstructorInput = Partial<Pick<Instructor, "name" | "image" | "bio">>

export const updateInstructor = async (id: string, data: UpdateInstructorInput) => {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck)
      return { success: false as const, error: "Unauthorized: Admin access required" }

    const instructor = await prisma.instructor.update({
      where: { id },
      data,
    })

    return { success: true as const, data: instructor }
  } catch (error) {
    console.error("Database Error:", error)
    return { success: false as const, error: "Failed to update instructor" }
  }
}
