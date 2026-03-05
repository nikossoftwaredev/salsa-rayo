"use server"

import { prisma } from "@/lib/db"
import { isAdmin } from "../is-admin"

export const getStudents = async () => {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck)
      return { success: false as const, error: "Unauthorized: Admin access required" }

    const students = await prisma.student.findMany({
      include: { user: true, subscriptions: true },
      orderBy: { createdAt: "desc" },
    })

    return { success: true as const, data: students }
  } catch (error) {
    console.error("Database Error:", error)
    return { success: false as const, error: "Failed to fetch students" }
  }
}
