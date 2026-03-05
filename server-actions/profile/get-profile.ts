"use server";

import { prisma } from "@/lib/db";

export const getProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      image: true,
      student: {
        select: {
          name: true,
          rayoPoints: true,
          createdAt: true,
          _count: {
            select: { attendances: true },
          },
        },
      },
    },
  });

  return user;
};
