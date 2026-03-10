import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      isAdmin: boolean
      isNewUser?: boolean
      rayoPoints: number
      subscriptionExpiresAt: string | null
      avatarImage: string | null
    } & DefaultSession["user"]
  }
}