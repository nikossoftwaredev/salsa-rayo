import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { isAdminEmail } from "@/lib/admin/config";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;

        session.user.isAdmin = isAdminEmail(user.email || "");

        const existingStudent = await prisma.student.findUnique({
          where: { userId: user.id },
        });

        if (!existingStudent) {
          const studentByEmail = user.email
            ? await prisma.student.findFirst({ where: { email: user.email, userId: null } })
            : null;

          if (studentByEmail) {
            await prisma.student.update({
              where: { id: studentByEmail.id },
              data: { userId: user.id },
            });
          } else {
            await prisma.student.create({
              data: {
                userId: user.id,
                name: user.name || "",
                email: user.email || "",
              },
            });
          }
        }
      }

      return session;
    },
  },
  session: {
    strategy: "database",
    maxAge: 365 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};
