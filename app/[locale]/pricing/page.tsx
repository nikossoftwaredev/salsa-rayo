"use client";

import { useTranslations } from "next-intl";
import BackgroundEffects from "@/components/BackgroundEffects";
import PackageCard from "@/components/PackageCard";
import { motion } from "framer-motion";
import { FaBolt } from "react-icons/fa";
import Logo from "@/components/Logo";
import Link from "next/link";

export default function PricingPage() {
  const t = useTranslations("Pricing");

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <BackgroundEffects />
      
      <div className="relative pt-32 pb-16 px-4 md:px-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <div className="flex justify-center items-center gap-3 mb-4">
            <FaBolt className="text-primary text-3xl" />
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t("pageTitle")}
            </h1>
            <FaBolt className="text-accent text-3xl" />
          </div>
          <p className="text-xl text-white/70 mt-4">
            {t("pageSubtitle")}
          </p>
        </motion.div>

        {/* Packages Grid - Ready for multiple cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Beginner Package */}
          <div className="md:col-span-2 lg:col-span-3 flex justify-center">
            <PackageCard />
          </div>
          
          {/* Future packages can be added here */}
        </div>

        {/* Logo with Dance School text - Temporary for Screenshot */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="flex justify-center mt-12 mb-8"
        >
          <div className="relative">
            <Logo size="xxl" />
            <p className="absolute bottom-0 right-0 top-[95px] text-sm font-light text-white/90 tracking-wider">
              Dance School
            </p>
          </div>
        </motion.div>

        {/* Coming Soon Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <p className="text-white/60 text-base md:text-lg">
            {t("morePackagesComing")}
          </p>
        </motion.div>

        {/* Additional Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-20 max-w-2xl mx-auto"
        >
          <div className="bg-gradient-to-r from-base-300/50 to-base-200/50 backdrop-blur-md rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold text-white/90 mb-4">
              {t("needHelp")}
            </h3>
            <p className="text-white/70 mb-6">
              {t("contactUs")}
            </p>
            <Link
              href="/#contact-form"
              className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors duration-300 font-semibold"
            >
              {t("getInTouch")}
              <span className="animate-bounce-x">→</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}