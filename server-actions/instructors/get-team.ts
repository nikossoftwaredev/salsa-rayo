"use server"

import { unstable_cache } from "next/cache"
import { prisma } from "@/lib/db"
import { getFounderKey, sortFoundersFirst } from "@/data/team"

const getCachedTeam = unstable_cache(
  async () => {
    const instructors = await prisma.instructor.findMany({
      select: { id: true, name: true, image: true, bio: true },
      orderBy: { name: "asc" },
    })

    return sortFoundersFirst(instructors).map((instructor) => ({
      ...instructor,
      founderKey: getFounderKey(instructor.name),
    }))
  },
  ["team"],
  { revalidate: 300 }
)

// Cached version for public pages - same 5 minute window as the schedule
export const getTeam = async () => {
  try {
    const data = await getCachedTeam()
    return { success: true as const, data }
  } catch (error) {
    console.error("Database Error:", error)
    return { success: false as const, error: "Failed to fetch team" }
  }
}
