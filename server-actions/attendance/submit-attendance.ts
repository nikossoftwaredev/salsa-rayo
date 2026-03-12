"use server"

import { prisma } from "@/lib/db"
import { isAdmin } from "../is-admin"

interface SubmitAttendanceInput {
  scheduleEntryId: string
  date: string
  studentIds: string[]
  instructorIds: string[]
}

export const submitAttendance = async ({
  scheduleEntryId,
  date,
  studentIds,
  instructorIds,
}: SubmitAttendanceInput) => {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck)
      return { success: false as const, error: "Unauthorized: Admin access required" }

    if (studentIds.length === 0)
      return { success: false as const, error: "No students selected" }

    const dateObj = new Date(date)
    dateObj.setUTCHours(0, 0, 0, 0)

    await prisma.$transaction(async (tx) => {
      const scheduleEntry = await tx.scheduleEntry.findUniqueOrThrow({
        where: { id: scheduleEntryId },
        select: { title: true, time: true },
      })

      const existing = await tx.danceClass.findFirst({
        where: { scheduleEntryId, date: dateObj },
        select: { id: true },
      })

      const danceClass = existing
        ? await tx.danceClass.update({
            where: { id: existing.id },
            data: {
              title: scheduleEntry.title,
              time: scheduleEntry.time,
              instructors: { set: instructorIds.map((id) => ({ id })) },
            },
          })
        : await tx.danceClass.create({
            data: {
              scheduleEntryId,
              date: dateObj,
              title: scheduleEntry.title,
              time: scheduleEntry.time,
              instructors: { connect: instructorIds.map((id) => ({ id })) },
            },
          })

      await tx.attendance.createMany({
        data: studentIds.map((studentId) => ({
          danceClassId: danceClass.id,
          studentId,
        })),
        skipDuplicates: true,
      })

      // TODO: Enable in September 2026
      // await tx.student.updateMany({
      //   where: { id: { in: studentIds } },
      //   data: { rayoPoints: { increment: 30 } },
      // })
    })

    return { success: true as const }
  } catch (error) {
    console.error("Submit attendance error:", error)
    return { success: false as const, error: "Failed to submit attendance" }
  }
}
