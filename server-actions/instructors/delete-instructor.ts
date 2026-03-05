"use server"

import { prisma } from "@/lib/db"
import { deleteFile } from "@/lib/files/upload"
import { isAdmin } from "../is-admin"

export const deleteInstructor = async (id: string) => {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck)
      return { success: false as const, error: "Unauthorized: Admin access required" }

    const instructor = await prisma.instructor.findUnique({
      where: { id },
      include: { _count: { select: { scheduleEntries: true } } },
    })

    if (!instructor)
      return { success: false as const, error: "Instructor not found" }

    if (instructor._count.scheduleEntries > 0)
      return {
        success: false as const,
        error: `Cannot delete instructor with ${instructor._count.scheduleEntries} connected schedule ${instructor._count.scheduleEntries === 1 ? "entry" : "entries"}. Remove them from the schedule first.`,
      }

    await prisma.instructor.delete({ where: { id } })

    if (instructor.image) {
      await deleteFile(instructor.image).catch(console.error)
    }

    return { success: true as const }
  } catch (error) {
    console.error("Database Error:", error)
    return { success: false as const, error: "Failed to delete instructor" }
  }
}
