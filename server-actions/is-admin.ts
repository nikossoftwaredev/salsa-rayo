"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin/config";

export const isAdmin = async (): Promise<boolean> => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) return false;

  return isAdminEmail(session.user.email);
};
