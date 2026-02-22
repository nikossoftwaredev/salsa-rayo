"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { FaBolt } from "react-icons/fa";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";
import { Link } from "@/i18n/routing";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { FAQ_ITEMS, FAQ_CATEGORIES, type FaqCategory } from "@/data/faq";

const CATEGORY_KEYS = {
  all: "categories.all",
  gettingStarted: "categories.gettingStarted",
  classesSchedule: "categories.classesSchedule",
  pricingPackages: "categories.pricingPackages",
  locationLogistics: "categories.locationLogistics",
  aboutSchool: "categories.aboutSchool",
} as const;

const CATEGORIES = ["all" as const, ...FAQ_CATEGORIES];

const FaqSection = () => {
  const t = useTranslations("Faq");
  const [activeCategory, setActiveCategory] = useState<FaqCategory | "all">(
    "all"
  );

  const filteredItems = useMemo(
    () =>
      activeCategory === "all"
        ? FAQ_ITEMS
        : FAQ_ITEMS.filter((item) => item.category === activeCategory),
    [activeCategory]
  );

  return (
    <section className="relative pt-32 pb-16 px-4 md:px-8">
        {/* Page Header */}
        <motion.div
          className="text-center mb-12 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center items-center gap-3 mb-4">
            <FaBolt className="text-primary text-3xl" />
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight">
              {t("pageTitle")}
            </h1>
            <FaBolt className="text-accent text-3xl" />
          </div>
          <p className="text-lg text-muted-foreground mt-4">
            {t("pageSubtitle")}
          </p>
        </motion.div>

        {/* Category Filter Pills */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 md:gap-3 mb-14 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`
                  relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer
                  ${
                    isActive
                      ? "text-white shadow-lg shadow-primary/30"
                      : "text-foreground/70 hover:text-foreground border border-foreground/10 hover:border-foreground/25 hover:bg-foreground/5"
                  }
                `}
              >
                {isActive && (
                  <motion.span
                    layoutId="activePill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
                <span className="relative z-10">
                  {t(CATEGORY_KEYS[cat])}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <Accordion type="single" collapsible className="space-y-3">
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.questionKey}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.04 }}
                  >
                    <AccordionItem
                      value={item.questionKey}
                      className="group border border-foreground/8 rounded-xl bg-gradient-to-br from-foreground/[0.02] to-transparent hover:from-primary/[0.04] hover:to-accent/[0.02] hover:border-primary/20 transition-all duration-300 px-5 md:px-6 overflow-hidden shadow-sm hover:shadow-md hover:shadow-primary/5"
                    >
                      <AccordionTrigger className="text-base md:text-[17px] font-semibold text-foreground/90 hover:text-foreground hover:no-underline py-5 gap-4">
                        <span className="flex items-start gap-3">
                          <HiOutlineQuestionMarkCircle className="text-primary/60 group-hover:text-primary shrink-0 mt-0.5 size-5 transition-colors duration-300" />
                          <span>{t(item.questionKey)}</span>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-foreground/65 text-[15px] leading-relaxed pl-8 pr-2 pb-5">
                        {t(item.answerKey)}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-20 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 backdrop-blur-md rounded-2xl p-8 border border-primary/20 shadow-lg shadow-primary/20">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              {t("stillHaveQuestions")}
            </h3>
            <p className="text-foreground/70 mb-6">
              {t("stillHaveQuestionsText")}
            </p>
            <Link
              href="/#contact-form"
              className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors duration-300 font-semibold"
            >
              {t("contactUs")}
              <span className="animate-bounce-x">→</span>
            </Link>
          </div>
        </motion.div>
    </section>
  );
};

export default FaqSection;
