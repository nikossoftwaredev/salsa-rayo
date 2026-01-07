"use server"

import { prisma } from "@/lib/db"
import { isAdmin } from "../is-admin"

export const getClients = async () => {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck) return { success: false, error: "Unauthorized: Admin access required" }

    const clients = await prisma.client.findMany({
      include: {
        user: true
      },
      orderBy: {
        createdAt: "desc"
      }
    })
    return { success: true, data: clients }
  } catch (error) {
    console.error("Database Error:", error)
    return { success: false, error: "Failed to fetch clients" }
  }
}