"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { FaBolt } from "react-icons/fa";
import { IoCardOutline, IoChatbubblesOutline, IoReloadOutline } from "react-icons/io5";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ContactFormModal from "@/components/ContactFormModal";

interface PackageChoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageTitle: string;
  packageIndex: number;
  priceId?: string;
  numberOfLessons: number;
  isStudentDiscount: boolean;
  isLoggedIn: boolean;
  isCheckingOut: boolean;
  onCheckout: () => void;
  onRequestSignIn: (packageIndex: number) => void;
}

export const PackageChoiceDialog = ({
  open,
  onOpenChange,
  packageTitle,
  packageIndex,
  priceId,
  numberOfLessons,
  isStudentDiscount,
  isLoggedIn,
  isCheckingOut,
  onCheckout,
  onRequestSignIn,
}: PackageChoiceDialogProps) => {
  const t = useTranslations("Pricing");
  const [showContact, setShowContact] = useState(false);

  const handlePayOnline = useCallback(() => {
    if (!isLoggedIn) {
      onRequestSignIn(packageIndex);
      return;
    }
    if (priceId) onCheckout();
  }, [isLoggedIn, priceId, onCheckout, onRequestSignIn, packageIndex]);

  const handleContactUs = useCallback(() => {
    onOpenChange(false);
    setShowContact(true);
  }, [onOpenChange]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-sm">
          <DialogTitle className="sr-only">{packageTitle}</DialogTitle>
          <DialogDescription className="sr-only">Choose how to proceed</DialogDescription>

          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-brand-pink flex items-center justify-center">
                <FaBolt className="text-white text-xl" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-foreground">{packageTitle}</h2>
            <p className="text-sm text-muted-foreground">
              {t("classesPerWeek", { count: numberOfLessons })}
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {priceId && (
              <Button
                variant="gradient"
                size="lg"
                className="w-full"
                onClick={handlePayOnline}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? (
                  <IoReloadOutline size={18} className="animate-spin" />
                ) : (
                  <IoCardOutline size={18} />
                )}
                {t("payOnline")}
              </Button>
            )}

            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={handleContactUs}
            >
              <IoChatbubblesOutline size={18} />
              {t("contactUs2")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ContactFormModal
        isOpen={showContact}
        onClose={() => setShowContact(false)}
        initialMessage={t("interestedIn", { package: packageTitle, classes: numberOfLessons })}
      />
    </>
  );
};
