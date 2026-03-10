"use server";

import { revalidatePath } from "next/cache";
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
  avatarImage?: string | null;
  dancingYears?: number | null;
}

export const updateProfile = async (data: UpdateProfileData) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const update: Record<string, string | number | null | undefined> = {};

  if (data.name !== undefined) {
    const name = data.name.trim().slice(0, 100);
    update.name = name || undefined;
  }
  if (data.bio !== undefined) {
    const bio = data.bio.trim().slice(0, BIO_MAX_LENGTH);
    update.bio = bio || null;
  }
  if (data.phone !== undefined) {
    const phone = data.phone.trim().slice(0, 10);
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
  if (data.avatarImage !== undefined) {
    update.avatarImage = data.avatarImage || null;
  }

  if (data.dancingYears !== undefined) {
    update.dancingYears = data.dancingYears ?? null;
  }

  await prisma.student.updateMany({
    where: { userId: session.user.id },
    data: update,
  });

  revalidatePath(`/profile/${session.user.id}`);

  return { success: true };
};
