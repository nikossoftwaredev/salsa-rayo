"use client";

import { useTranslations } from "next-intl";
import BackgroundEffects from "@/components/BackgroundEffects";
import PackageCard from "@/components/PackageCard";
import { motion } from "framer-motion";
import { FaBolt } from "react-icons/fa";
import Logo from "@/components/Logo";
import { Link } from "@/i18n/routing";
import { PACKAGES } from "@/data/packages";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function PricingPage() {
  const t = useTranslations("Pricing");
  const [isStudentDiscount, setIsStudentDiscount] = useState(false);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <BackgroundEffects />

      <div className="relative pt-32 pb-16 px-4 md:px-8">
        {/* Page Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="flex justify-center items-center gap-3 mb-4">
            <FaBolt className="text-primary text-3xl" />
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t("pageTitle")}
            </h1>
            <FaBolt className="text-accent text-3xl" />
          </div>
          <p className="text-xl text-white/70 mt-4">{t("pageSubtitle")}</p>
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
              className="text-white/80 cursor-pointer"
            >
              {t("studentOrYouth")}
            </Label>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PACKAGES.map((pkg, index) => (
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
              />
            </motion.div>
          ))}
        </div>

        {/* Logo with Dance School text - Temporary for Screenshot */}
        <div className="flex justify-center mt-12 mb-8">
          <div className="relative">
            <Logo size="xxl" />
            <p className="absolute bottom-0 right-0 top-[95px] text-sm font-light text-white/90 tracking-wider">
              Dance School
            </p>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="text-center mt-20 max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-muted/50 to-secondary/50 backdrop-blur-md rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold text-white/90 mb-4">
              {t("needHelp")}
            </h3>
            <p className="text-white/70 mb-6">{t("contactUs")}</p>
            <Link
              href="/#contact-form"
              className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors duration-300 font-semibold"
            >
              {t("getInTouch")}
              <span className="animate-bounce-x">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
