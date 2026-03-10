"use client";

import { signIn, signOut } from "next-auth/react";
import { IoHome } from "react-icons/io5";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

interface AdminAuthGuardProps {
  isSignedIn: boolean;
}

export const AdminAuthGuard = ({ isSignedIn }: AdminAuthGuardProps) => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="text-center">
        <h1 className="mb-2 text-2xl font-bold">Whoops!</h1>
        <p className="mb-6 text-muted-foreground">You are not an admin.</p>
        <div className="flex gap-2">
          {isSignedIn ? (
            <Button variant="outline" onClick={() => signOut()}>
              Sign out
            </Button>
          ) : (
            <Button onClick={() => signIn("google")}>Sign in</Button>
          )}
          <Button variant="outline" asChild>
            <Link href="/"><IoHome size={16} /> Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
