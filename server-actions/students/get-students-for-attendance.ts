"use server"

import { prisma } from "@/lib/db"
import { matchesSearch } from "@/lib/greek-search"
import { isAdmin } from "../is-admin"

interface GetStudentsForAttendanceInput {
  search?: string
}

export const getStudentsForAttendance = async (
  input?: GetStudentsForAttendanceInput
) => {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck)
      return { success: false as const, error: "Unauthorized: Admin access required" }

    const search = input?.search?.trim() ?? ""

    const students = await prisma.student.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        email: true,
        rayoPoints: true,
        subscriptions: {
          where: { isActive: true },
          orderBy: { expiresAt: "desc" },
          take: 1,
          select: { expiresAt: true },
        },
        attendances: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { createdAt: true },
        },
      },
      orderBy: { name: "asc" },
    })

    const filtered = search
      ? students.filter((s) => matchesSearch(s.name, search) || matchesSearch(s.email, search))
      : students

    return { success: true as const, data: filtered.slice(0, 100) }
  } catch (error) {
    console.error("Database Error:", error)
    return { success: false as const, error: "Failed to fetch students" }
  }
}

export type StudentForAttendance = NonNullable<
  Awaited<ReturnType<typeof getStudentsForAttendance>>["data"]
>[number]
