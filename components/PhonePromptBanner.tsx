"use client";

import { useState, useEffect, useRef, useCallback, startTransition } from "react";
import { useSession } from "next-auth/react";
import { Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { EditProfileSheet } from "@/components/EditProfileSheet";
import { getOwnProfile } from "@/server-actions/profile/get-own-profile";

export const PhonePromptBanner = () => {
  const { status } = useSession();
  const [needsPhone, setNeedsPhone] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const isMountedRef = useRef(true);

  const checkPhone = useCallback(async () => {
    try {
      const profile = await getOwnProfile();
      if (isMountedRef.current) startTransition(() => setNeedsPhone(!profile?.phone));
    } catch {
      // silently fail
    }
  }, []);

  const handleSheetChange = useCallback((open: boolean) => {
    setEditOpen(open);
    if (!open) checkPhone();
  }, [checkPhone]);

  useEffect(() => {
    isMountedRef.current = true;

    if (status !== "authenticated") return;

    checkPhone();

    return () => {
      isMountedRef.current = false;
    };
  }, [status, checkPhone]);

  return (
    <>
      <AnimatePresence>
        {needsPhone && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="fixed top-[60px] left-0 right-0 z-30"
          >
            <div className="bg-primary/10 backdrop-blur-xl border-b border-primary/20">
              <div className="max-w-7xl mx-auto flex items-center justify-center px-4 py-2">
                <button
                  onClick={() => setEditOpen(true)}
                  className="flex items-center gap-2 text-sm text-foreground/80 hover:text-foreground transition-colors cursor-pointer"
                >
                  <Phone className="size-3.5 text-primary shrink-0" />
                  <span>
                    Please add your <strong className="text-primary">phone number</strong> to your profile - we need it to contact you about classes.
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <EditProfileSheet open={editOpen} onOpenChange={handleSheetChange} />
    </>
  );
};
