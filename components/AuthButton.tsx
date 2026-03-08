"use client";

import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ProfileDropdown } from "@/components/admin/ProfileDropdown";
import { RayoPoints } from "@/components/ui/rayo-points";
import { IoLogInOutline } from "react-icons/io5";

interface AuthButtonProps {
  showNavRoutes?: boolean;
}

export const AuthButton = ({ showNavRoutes = false }: AuthButtonProps) => {
  const { data: session, status } = useSession();

  if (status === "loading")
    return <div className="size-8 rounded-full bg-muted animate-pulse" />;

  if (!session && !showNavRoutes)
    return (
      <Button
        onClick={() => signIn("google")}
        variant="outline"
        size="sm"
        className="rounded-full border-primary/40 text-primary hover:text-primary-foreground hover:bg-primary/90 hover:border-primary transition-all duration-300"
      >
        <IoLogInOutline />
        Sign In
      </Button>
    );

  if (session && !showNavRoutes)
    return (
      <div className="flex items-center gap-2">
        <ProfileDropdown showNavRoutes={showNavRoutes} />
        <RayoPoints points={session.user.rayoPoints} size="sm" />
      </div>
    );

  return <ProfileDropdown showNavRoutes={showNavRoutes} />;
};
