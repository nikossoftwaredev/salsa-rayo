"use server"

import { unstable_cache } from "next/cache"
import { prisma } from "@/lib/db"

const parseTime = (time: string) => {
  const match = time.match(/^(\d{1,2}):(\d{2})/)
  if (!match) return 0
  return parseInt(match[1]) * 60 + parseInt(match[2])
}

const getCachedSchedule = unstable_cache(
  async () => {
    const entries = await prisma.scheduleEntry.findMany({
      where: { isActive: true },
      include: { instructors: true },
    })

    entries.sort((a, b) => a.dayIndex - b.dayIndex || parseTime(a.time) - parseTime(b.time))

    return entries
  },
  ["schedule"],
  { revalidate: 300 }
)

export const getSchedule = async () => {
  try {
    const data = await getCachedSchedule()
    return { success: true as const, data }
  } catch (error) {
    console.error("Database Error:", error)
    return { success: false as const, error: "Failed to fetch schedule" }
  }
}
