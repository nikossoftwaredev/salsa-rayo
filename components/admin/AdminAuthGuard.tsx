"use client";

import { signIn, signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";

interface AdminAuthGuardProps {
  isSignedIn: boolean;
}

export const AdminAuthGuard = ({ isSignedIn }: AdminAuthGuardProps) => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="text-center">
        <h1 className="mb-2 text-2xl font-bold">Whoops!</h1>
        <p className="mb-6 text-muted-foreground">You are not an admin.</p>
        {isSignedIn ? (
          <Button variant="outline" onClick={() => signOut()}>
            Sign out
          </Button>
        ) : (
          <Button onClick={() => signIn("google")}>Sign in</Button>
        )}
      </div>
    </div>
  );
};
