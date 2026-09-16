"use server";

import { prisma } from "@/lib/db";

// Future bookings are attendance rows too - only classes up to today count
const todayClassDate = () => {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
};

export const getProfile = async (userId: string) =>
  prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      image: true,
      student: {
        select: {
          name: true,
          bio: true,
          instagram: true,
          website: true,
          avatarImage: true,
          dancingYears: true,
          rayoPoints: true,
          createdAt: true,
          _count: {
            select: {
              attendances: { where: { danceClass: { date: { lte: todayClassDate() } } } },
            },
          },
        },
      },
    },
  });
