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

        let student = await prisma.student.findUnique({
          where: { userId: user.id },
          include: {
            subscriptions: {
              where: { isActive: true },
              orderBy: { expiresAt: "desc" },
              take: 1,
              select: { expiresAt: true },
            },
          },
        });

        const googleImage = (user as { image?: string }).image || null;

        if (!student) {
          const studentByEmail = user.email
            ? await prisma.student.findFirst({ where: { email: user.email, userId: null } })
            : null;

          if (studentByEmail) {
            student = await prisma.student.update({
              where: { id: studentByEmail.id },
              data: {
                userId: user.id,
                ...(!studentByEmail.avatarImage && googleImage ? { avatarImage: googleImage } : {}),
              },
              include: {
                subscriptions: {
                  where: { isActive: true },
                  orderBy: { expiresAt: "desc" },
                  take: 1,
                  select: { expiresAt: true },
                },
              },
            });
          } else {
            student = await prisma.student.create({
              data: {
                userId: user.id,
                name: user.name || "",
                email: user.email || "",
                ...(googleImage ? { avatarImage: googleImage } : {}),
              },
              include: {
                subscriptions: {
                  where: { isActive: true },
                  orderBy: { expiresAt: "desc" },
                  take: 1,
                  select: { expiresAt: true },
                },
              },
            });
          }
        }

        if (!student.avatarImage && googleImage) {
          await prisma.student.update({
            where: { id: student.id },
            data: { avatarImage: googleImage },
          });
          student.avatarImage = googleImage;
        }

        session.user.rayoPoints = student.rayoPoints;
        session.user.avatarImage = student.avatarImage;
        session.user.subscriptionExpiresAt =
          student.subscriptions[0]?.expiresAt?.toISOString() ?? null;
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
