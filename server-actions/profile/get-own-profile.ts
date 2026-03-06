"use server";

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const getOwnProfile = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      student: {
        select: {
          name: true,
          bio: true,
          phone: true,
          instagram: true,
          website: true,
        },
      },
    },
  });

  if (!user?.student) return null;

  return {
    name: user.student.name || user.name || "",
    bio: user.student.bio,
    phone: user.student.phone,
    instagram: user.student.instagram,
    website: user.student.website,
  };
};
