"use server";

import { cache } from "react";
import { prisma } from "@/lib/db";

export const getProfile = cache(async (userId: string) =>
  prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      image: true,
      student: {
        select: {
          name: true,
          bio: true,
          rayoPoints: true,
          createdAt: true,
          _count: {
            select: { attendances: true },
          },
        },
      },
    },
  }));
