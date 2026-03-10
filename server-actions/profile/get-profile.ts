"use server";

import { prisma } from "@/lib/db";

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
            select: { attendances: true },
          },
        },
      },
    },
  });
