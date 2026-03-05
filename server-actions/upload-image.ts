"use server"

import { uploadFile, deleteFile } from "@/lib/files/upload"
import { isAdmin } from "./is-admin"

export const uploadImage = async (formData: FormData) => {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck)
      return { success: false as const, error: "Unauthorized: Admin access required" }

    const file = formData.get("file") as File | null
    const folder = (formData.get("folder") as string) || "general"

    if (!file) return { success: false as const, error: "No file provided" }

    if (!file.type.startsWith("image/"))
      return { success: false as const, error: "File must be an image" }

    if (file.size > 5 * 1024 * 1024)
      return { success: false as const, error: "File must be under 5MB" }

    const buffer = Buffer.from(await file.arrayBuffer())
    const ext = file.name.split(".").pop() || "jpg"
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    const url = await uploadFile(buffer, fileName)

    return { success: true as const, url }
  } catch (error) {
    console.error("Upload Error:", error)
    return { success: false as const, error: "Failed to upload image" }
  }
}

export const removeImage = async (url: string) => {
  try {
    const adminCheck = await isAdmin()
    if (!adminCheck)
      return { success: false as const, error: "Unauthorized: Admin access required" }

    await deleteFile(url)
    return { success: true as const }
  } catch (error) {
    console.error("Delete Error:", error)
    return { success: false as const, error: "Failed to delete image" }
  }
}
