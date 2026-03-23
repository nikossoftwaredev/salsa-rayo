"use client";

import { useState, useCallback } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { Mail, Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SignInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  callbackUrl?: string;
}

export const SignInDialog = ({ open, onOpenChange, callbackUrl }: SignInDialogProps) => {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const resolvedCallbackUrl = callbackUrl || (typeof window !== "undefined" ? window.location.href : "/");

  const handleGoogleSignIn = useCallback(() => {
    setGoogleLoading(true);
    signIn("google", { callbackUrl: resolvedCallbackUrl });
  }, [resolvedCallbackUrl]);

  const handleEmailSignIn = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email.trim()) return;
    setIsLoading(true);
    try {
      await signIn("email", { email, redirect: false, callbackUrl: resolvedCallbackUrl });
      setEmailSent(true);
    } finally {
      setIsLoading(false);
    }
  }, [email, resolvedCallbackUrl]);

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setEmail("");
      setEmailSent(false);
      setIsLoading(false);
      setGoogleLoading(false);
    }
    onOpenChange(open);
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogTitle className="sr-only">Login</DialogTitle>
        <DialogDescription className="sr-only">Sign in to your account</DialogDescription>

        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/images/logo.png"
            alt="Salsa Rayo"
            width={48}
            height={48}
            className="rounded-full"
          />
        </div>

        {emailSent ? (
          <div className="text-center space-y-3">
            <Mail className="size-10 mx-auto text-primary" />
            <h2 className="text-xl font-medium">Check your email</h2>
            <p className="text-sm text-muted-foreground">
              We sent a sign-in link to <strong className="text-foreground">{email}</strong>
            </p>
            <p className="text-xs text-muted-foreground/70">
              Check your inbox and click the link to sign in.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-medium text-center">Sign up or Login with</h2>

            {/* Google */}
            <div className="relative">
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
              >
                {googleLoading ? <Loader2 className="size-5 animate-spin" /> : <FcGoogle size={20} />}
                Google
              </Button>
              <div className="absolute -top-1 -right-1 backdrop-blur-sm bg-green-100/80 dark:bg-green-900/80 border border-green-200 dark:border-green-700 rounded-full px-2 py-0.5 shadow-sm flex items-center justify-center">
                <span className="text-[10px] font-medium text-green-700 dark:text-green-300">Recommended</span>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center">
              <Separator className="flex-1 -mr-4" />
              <div className="z-10 size-8 rounded-full border border-border flex items-center justify-center text-muted-foreground text-xs bg-card">
                OR
              </div>
              <Separator className="flex-1 -ml-4" />
            </div>

            {/* Email */}
            <form onSubmit={handleEmailSignIn} className="space-y-3">
              <h3 className="text-base font-medium">Email</h3>
              <Input
                type="email"
                placeholder="name@host.com"
                size="lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                type="submit"
                disabled={isLoading || !email.trim()}
              >
                {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Mail className="size-4" />}
                Continue
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
