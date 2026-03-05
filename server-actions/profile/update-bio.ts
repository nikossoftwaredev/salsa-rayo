"use server";

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const updateBio = async (bio: string) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const trimmed = bio.trim().slice(0, 150);

  await prisma.student.updateMany({
    where: { userId: session.user.id },
    data: { bio: trimmed || null },
  });

  return { success: true };
};
