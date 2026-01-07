"use server"

import { prisma } from "@/lib/db"
import { isAdmin } from "../is-admin"

interface ClientFormData {
  name: string
  email: string
  phone: string
  company: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
  notes: string
  isActive: boolean
}

export const createClient = async (data: ClientFormData) => {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck) return { success: false, error: "Unauthorized: Admin access required" }

    // First create a user for the client
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
      }
    })

    // Then create the client linked to the user
    const client = await prisma.client.create({
      data: {
        userId: user.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        address: data.address,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        notes: data.notes,
        isActive: data.isActive,
      }
    })
    return { success: true, data: client }
  } catch (error) {
    console.error("Database Error:", error)
    return { success: false, error: "Failed to create client" }
  }
}