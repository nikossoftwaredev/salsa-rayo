"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ProfileDropdown } from "@/components/admin/ProfileDropdown";
import { RayoPoints } from "@/components/ui/rayo-points";
import { SignInDialog } from "@/components/SignInDialog";
import { LogIn } from "lucide-react";

interface AuthButtonProps {
  showNavRoutes?: boolean;
}

export const AuthButton = ({ showNavRoutes = false }: AuthButtonProps) => {
  const { data: session, status } = useSession();
  const [signInOpen, setSignInOpen] = useState(false);

  if (status === "loading")
    return <div className="size-8 rounded-full bg-muted animate-pulse" />;

  if (!session && !showNavRoutes)
    return (
      <>
        <Button
          onClick={() => setSignInOpen(true)}
          variant="outline"
          size="sm"
          className="rounded-full border-primary/40 text-primary hover:text-primary-foreground hover:bg-primary/90 hover:border-primary transition-all duration-300"
        >
          <LogIn className="size-4" />
          Sign In
        </Button>
        <SignInDialog open={signInOpen} onOpenChange={setSignInOpen} />
      </>
    );

  if (session && !showNavRoutes)
    return (
      <div className="flex items-center gap-2">
        <ProfileDropdown showNavRoutes={showNavRoutes} />
        <RayoPoints points={session.user.rayoPoints} size="sm" showPopover />
      </div>
    );

  return (
    <div className="flex items-center gap-2">
      {session && <RayoPoints points={session.user.rayoPoints} size="sm" showPopover />}
      <ProfileDropdown showNavRoutes={showNavRoutes} />
    </div>
  );
};
