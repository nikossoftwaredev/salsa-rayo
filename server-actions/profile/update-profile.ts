"use server";

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BIO_MAX_LENGTH } from "@/data/config";

interface UpdateProfileData {
  name?: string;
  bio?: string;
  phone?: string;
  instagram?: string;
  website?: string;
}

export const updateProfile = async (data: UpdateProfileData) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const update: Record<string, string | null | undefined> = {};

  if (data.name !== undefined) {
    const name = data.name.trim().slice(0, 100);
    update.name = name || undefined;
  }
  if (data.bio !== undefined) {
    const bio = data.bio.trim().slice(0, BIO_MAX_LENGTH);
    update.bio = bio || null;
  }
  if (data.phone !== undefined) {
    const phone = data.phone.trim().slice(0, 20);
    update.phone = phone || null;
  }
  if (data.instagram !== undefined) {
    const instagram = data.instagram.trim().replace(/^@/, "").slice(0, 50);
    update.instagram = instagram || null;
  }
  if (data.website !== undefined) {
    const website = data.website.trim().slice(0, 200);
    update.website = website || null;
  }

  await prisma.student.updateMany({
    where: { userId: session.user.id },
    data: update,
  });

  return { success: true };
};
