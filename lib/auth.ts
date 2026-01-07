import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"
import { MAIL } from "@/data/config"

// Static array of admin emails
const ADMIN_EMAILS = [
  "nikossoftwaredev@gmail.com",
  MAIL
]

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      if (session.user) {
        session.user.id = user.id
        
        // Check if user is admin based on email
        const userEmail = user.email?.toLowerCase() || ""
        session.user.isAdmin = ADMIN_EMAILS.some(adminEmail => 
          adminEmail.toLowerCase() === userEmail
        )
        
        // Check if client exists for this user
        const client = await prisma.client.findUnique({
          where: { userId: user.id }
        })
        
        // Create client if it doesn't exist
        if (!client) {
          await prisma.client.create({
            data: {
              userId: user.id,
              name: user.name || "",
              email: user.email || "",
            }
          })
        }
      }

      return session
    },
  },
  session: {
    strategy: "database",
    maxAge: 365 * 24 * 60 * 60, // 365 days in seconds
    updateAge: 24 * 60 * 60, // 24 hours in seconds
  },
  secret: process.env.NEXTAUTH_SECRET,
}