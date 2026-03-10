import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/db";
import { isAdminEmail } from "@/lib/admin/config";
import { MAIL, BUSINESS_NAME } from "@/data/config";
import { orishas } from "@/data/orishas";

const ORISHA_AVATARS = orishas.map((o) => o.image);

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: MAIL,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      server: {},
      from: `${BUSINESS_NAME} <${MAIL}>`,
      sendVerificationRequest: async ({ identifier: email, url }) => {
        const logoUrl = "https://www.salsarayo.com/images/logo.png";
        await transporter.sendMail({
          from: `${BUSINESS_NAME} <${MAIL}>`,
          to: email,
          subject: `Sign in to ${BUSINESS_NAME}`,
          text: `Sign in to ${BUSINESS_NAME}\n\nClick the link below to sign in:\n${url}\n\nIf you didn't request this, you can safely ignore this email.`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background: #0a0a0a;">
              <div style="text-align: center; margin-bottom: 32px;">
                <img src="${logoUrl}" alt="${BUSINESS_NAME}" width="64" height="64" style="border-radius: 50%; margin-bottom: 12px;" />
                <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 700;">${BUSINESS_NAME}</h1>
              </div>
              <div style="background: #141428; padding: 36px 28px; border-radius: 16px; text-align: center; border: 1px solid #1e1e3a;">
                <h2 style="color: #ffffff; font-size: 18px; margin: 0 0 8px; font-weight: 600;">Sign in to your account</h2>
                <p style="color: #9090a0; font-size: 14px; margin: 0 0 28px; line-height: 1.5;">Click the button below to sign in</p>
                <a href="${url}" style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #5b4fdb, #d946ef); color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 15px; letter-spacing: 0.3px;">
                  Sign In
                </a>
                <p style="color: #555; font-size: 12px; margin: 28px 0 0; line-height: 1.5;">
                  If you didn't request this email, you can safely ignore it.
                </p>
              </div>
              <p style="color: #333; font-size: 11px; text-align: center; margin-top: 24px;">
                &copy; ${new Date().getFullYear()} ${BUSINESS_NAME}
              </p>
            </div>
          `,
        });
      },
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

          // Derive name from email if provider didn't give one (e.g. email magic link)
          const derivedName = user.name || (user.email ? user.email.split("@")[0] : "");

          // Update User record name if it's missing
          if (!user.name && derivedName) {
            await prisma.user.update({ where: { id: user.id }, data: { name: derivedName } });
          }

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
            session.user.isNewUser = true;
            student = await prisma.student.create({
              data: {
                userId: user.id,
                name: derivedName,
                email: user.email || "",
                avatarImage: googleImage || ORISHA_AVATARS[Math.floor(Math.random() * ORISHA_AVATARS.length)],
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
    maxAge: 10 * 365 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};
