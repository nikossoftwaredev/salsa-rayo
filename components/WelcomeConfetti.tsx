"use client";

import { useEffect, useState, useCallback, startTransition } from "react";
import { useSession } from "next-auth/react";
import confetti from "canvas-confetti";
import { CheckCircle, Pencil } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { EditProfileSheet } from "@/components/EditProfileSheet";

const WELCOMED_KEY = "salsa-rayo-welcomed";
const CONFETTI_COLORS = ["#5b4fdb", "#d946ef", "#fbbf24", "#34d399"];
const BASE_CONFETTI = { particleCount: 3, spread: 55, colors: CONFETTI_COLORS };

export const WelcomeConfetti = () => {
  const { data: session } = useSession();
  const [show, setShow] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleDismiss = useCallback(() => setShow(false), []);

  const handleEditProfile = useCallback(() => {
    setShow(false);
    setEditOpen(true);
  }, []);

  useEffect(() => {
    if (!session?.user?.isNewUser) return;
    if (localStorage.getItem(WELCOMED_KEY)) return;

    localStorage.setItem(WELCOMED_KEY, "1");
    startTransition(() => setShow(true));

    const end = Date.now() + 2000;
    let rafId = 0;
    const frame = () => {
      confetti({ ...BASE_CONFETTI, angle: 60, origin: { x: 0, y: 0.7 } });
      confetti({ ...BASE_CONFETTI, angle: 120, origin: { x: 1, y: 0.7 } });
      if (Date.now() < end) rafId = requestAnimationFrame(frame);
    };
    rafId = requestAnimationFrame(frame);

    return () => cancelAnimationFrame(rafId);
  }, [session?.user?.isNewUser]);

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/60" onClick={handleDismiss} />
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="relative bg-background border rounded-2xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl"
            >
              <CheckCircle className="size-12 mx-auto text-green-500" />
              <h2 className="text-xl font-semibold">Welcome to Salsa Rayo!</h2>
              <p className="text-sm text-muted-foreground">
                Your account has been created successfully. Edit your profile to add more information.
              </p>
              <div className="flex flex-col gap-2 pt-2">
                <Button variant="gradient" onClick={handleEditProfile}>
                  <Pencil className="size-4" />
                  Edit Profile
                </Button>
                <Button variant="ghost" size="sm" onClick={handleDismiss}>
                  Maybe later
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <EditProfileSheet open={editOpen} onOpenChange={setEditOpen} />
    </>
  );
};
