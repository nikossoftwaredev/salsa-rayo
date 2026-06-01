"use client";

import { useTranslations } from "next-intl";
import BackgroundEffects from "@/components/BackgroundEffects";
import PackageCard from "@/components/PackageCard";
import { motion } from "framer-motion";
import { Zap, Check, Sparkles, CalendarX, GraduationCap, PartyPopper } from "lucide-react";
import Logo from "@/components/Logo";
import { Link } from "@/i18n/routing";
import { PACKAGES } from "@/data/packages";
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import type { StripePackage } from "@/lib/stripe/types";
import { SignInDialog } from "@/components/SignInDialog";
import ContactFormModal from "@/components/ContactFormModal";

interface PricingContentProps {
  stripePackages?: StripePackage[];
}

const PricingContent = ({ stripePackages }: PricingContentProps) => {
  const t = useTranslations("Pricing");
  const [isStudentDiscount, setIsStudentDiscount] = useState(false);
  const [checkingOutIndex, setCheckingOutIndex] = useState<number | null>(null);
  const [showSignIn, setShowSignIn] = useState(false);
  const [signInPackageIndex, setSignInPackageIndex] = useState<number>(0);
  const [showContact, setShowContact] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const { data: session } = useSession();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const hasAutoOpenedRef = useRef(false);

  const packages = useMemo(() =>
    stripePackages?.length
      ? stripePackages.map((sp) => ({
          title: sp.name,
          price: sp.priceAmount.toString(),
          numberOfLessons: parseInt(sp.metadata.lessonsPerWeek || "2"),
          isMostPopular: sp.metadata.mostPopular === "true",
          priceId: sp.priceId,
        }))
      : PACKAGES.map((pkg) => ({
          ...pkg,
          priceId: undefined as string | undefined,
        })),
    [stripePackages]
  );

  const handlePayOnline = useCallback(async (index: number) => {
    const pkg = packages[index];
    if (!session) {
      setSignInPackageIndex(index);
      setShowSignIn(true);
      return;
    }
    if (!pkg.priceId) return;
    setCheckingOutIndex(index);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: pkg.priceId, isStudentDiscount, locale }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Failed to start checkout");
        setCheckingOutIndex(null);
      }
    } catch {
      toast.error("Failed to start checkout");
      setCheckingOutIndex(null);
    }
  }, [packages, session, isStudentDiscount, locale]);

  const handleContactUs = useCallback((index: number) => {
    const pkg = packages[index];
    setContactMessage(t("interestedIn", { package: pkg.title, classes: pkg.numberOfLessons }));
    setShowContact(true);
  }, [packages, t]);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";
  const signInCallbackUrl = `${appUrl}/${locale}/pricing?pkg=${signInPackageIndex}`;

  // After login redirect: auto-checkout for the selected package
  useEffect(() => {
    if (hasAutoOpenedRef.current) return;
    const pkgParam = searchParams.get("pkg");
    if (pkgParam === null || !session) return;
    const idx = parseInt(pkgParam);
    if (!isNaN(idx) && idx >= 0 && idx < packages.length && packages[idx].priceId) {
      hasAutoOpenedRef.current = true;
      requestAnimationFrame(() => handlePayOnline(idx));
    }
  }, [searchParams, session, packages, handlePayOnline]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <BackgroundEffects />

      <div className="relative pt-32 pb-16 px-4 md:px-8">
        {/* Page Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Zap className="size-8 text-primary" />
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary to-brand-pink bg-clip-text text-transparent leading-tight">
              {t("pageTitle")}
            </h1>
            <Zap className="size-8 text-brand-pink" />
          </div>
          <p className="text-xl text-muted-foreground mt-4">{t("pageSubtitle")}</p>
        </div>

        {/* Student Discount Toggle */}
        <div className="flex justify-center items-center gap-3 mb-8">
          <div className="flex items-center gap-3">
            <Switch
              id="student-discount"
              checked={isStudentDiscount}
              onCheckedChange={setIsStudentDiscount}
            />
            <Label
              htmlFor="student-discount"
              className="text-foreground/80 cursor-pointer"
            >
              {t("studentOrYouth")}
            </Label>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            >
              <PackageCard
                title={pkg.title}
                price={pkg.price}
                numberOfLessons={pkg.numberOfLessons}
                isMostPopular={pkg.isMostPopular}
                isStudentDiscount={isStudentDiscount}
                isLoading={checkingOutIndex === index}
                onPayOnline={() => handlePayOnline(index)}
                onContactUs={() => handleContactUs(index)}
              />
            </motion.div>
          ))}
        </div>

        {/* Logo with Dance School text - Temporary for Screenshot */}
        <div className="flex justify-center mt-12 mb-8">
          <div className="relative">
            <Logo size="xxl" />
            <p className="absolute bottom-0 right-0 top-[95px] text-sm font-light text-foreground/90 tracking-wider">
              Dance School
            </p>
          </div>
        </div>

        {/* What's Included */}
        <section className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
            <Sparkles className="size-6 inline-block mr-2 text-primary" />
            {t("includedTitle")}
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {t("includedItems")
              .split(" | ")
              .map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-foreground/80"
                >
                  <Check className="size-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
          </ul>
        </section>

        {/* How to Choose */}
        <section className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
            {t("chooseTitle")}
          </h2>
          <div className="space-y-4">
            <article className="rounded-xl border border-border/30 bg-card/60 p-6">
              <p className="text-foreground/85 leading-relaxed">
                {t("chooseRayo8")}
              </p>
            </article>
            <article className="rounded-xl border border-primary/30 bg-card/60 p-6">
              <p className="text-foreground/85 leading-relaxed">
                {t("chooseRayo16")}
              </p>
            </article>
            <article className="rounded-xl border border-border/30 bg-card/60 p-6">
              <p className="text-foreground/85 leading-relaxed">
                {t("chooseRayo24")}
              </p>
            </article>
          </div>
        </section>

        {/* Trial + Cancel + Student */}
        <section className="mt-16 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <article className="rounded-xl border border-border/30 bg-card/60 p-6">
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <PartyPopper className="size-5 text-primary" />
              {t("trialTitle")}
            </h3>
            <p className="text-sm text-foreground/75 leading-relaxed">
              {t("trialText")}
            </p>
          </article>
          <article className="rounded-xl border border-border/30 bg-card/60 p-6">
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <CalendarX className="size-5 text-primary" />
              {t("cancelTitle")}
            </h3>
            <p className="text-sm text-foreground/75 leading-relaxed">
              {t("cancelText")}
            </p>
          </article>
          <article className="rounded-xl border border-border/30 bg-card/60 p-6">
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <GraduationCap className="size-5 text-primary" />
              {t("studentTitle")}
            </h3>
            <p className="text-sm text-foreground/75 leading-relaxed">
              {t("studentText")}
            </p>
          </article>
        </section>

        {/* Additional Info Section */}
        <div className="text-center mt-20 max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-primary/10 via-brand-pink/10 to-primary/10 backdrop-blur-md rounded-2xl p-8 border border-primary/20 shadow-lg shadow-primary/20">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              {t("needHelp")}
            </h3>
            <p className="text-foreground/70 mb-6">{t("contactUs")}</p>
            <Link
              href="/#contact-form"
              className="inline-flex items-center gap-2 text-primary hover:text-brand-pink transition-colors duration-300 font-semibold"
            >
              {t("getInTouch")}
              <span className="animate-bounce-x">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Sign-in dialog */}
      <SignInDialog
        open={showSignIn}
        onOpenChange={setShowSignIn}
        callbackUrl={signInCallbackUrl}
      />

      {/* Contact form */}
      <ContactFormModal
        isOpen={showContact}
        onClose={() => setShowContact(false)}
        initialMessage={contactMessage}
      />
    </div>
  );
}

export default PricingContent
