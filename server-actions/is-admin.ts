"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { MAIL } from "@/data/config"

const ADMIN_EMAILS = [
  "nikossoftwaredev@gmail.com",
  MAIL
]

export const isAdmin = async (): Promise<boolean> => {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) return false
  
  return ADMIN_EMAILS.includes(session.user.email)
}