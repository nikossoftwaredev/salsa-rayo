"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Rocket, CalendarDays, DollarSign, MapPin, GraduationCap } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
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

const CATEGORY_ICONS: Record<FaqCategory, React.ReactNode> = {
  gettingStarted: <Rocket className="size-6" />,
  classesSchedule: <CalendarDays className="size-6" />,
  pricingPackages: <DollarSign className="size-6" />,
  locationLogistics: <MapPin className="size-6" />,
  aboutSchool: <GraduationCap className="size-6" />,
};

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

  const groupedItems = useMemo(() => {
    const groups: { category: FaqCategory; items: typeof FAQ_ITEMS }[] = [];
    FAQ_CATEGORIES.forEach((cat) => {
      const items = FAQ_ITEMS.filter((item) => item.category === cat);
      if (items.length > 0) groups.push({ category: cat, items });
    });
    return groups;
  }, []);

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
          <Zap className="size-8 text-primary" />
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary to-brand-pink bg-clip-text text-transparent leading-tight">
            {t("pageTitle")}
          </h1>
          <Zap className="size-8 text-brand-pink" />
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
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-brand-pink"
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

      {/* FAQ Content */}
      <div className="max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          {activeCategory === "all" ? (
            /* Grouped by category view */
            <motion.div
              key="all-grouped"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
            >
              {groupedItems.map((group, groupIndex) => (
                <motion.div
                  key={group.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: groupIndex * 0.08,
                  }}
                >
                  {/* Category Section Header */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex items-center gap-3 text-primary">
                      {CATEGORY_ICONS[group.category]}
                      <h2 className="text-lg font-semibold text-foreground/90">
                        {t(CATEGORY_KEYS[group.category])}
                      </h2>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-primary/20 via-brand-pink/10 to-transparent" />
                  </div>

                  {/* Category Items */}
                  <Accordion type="single" collapsible className="space-y-4">
                    {group.items.map((item) => (
                        <AccordionItem
                          key={item.questionKey}
                          value={item.questionKey}
                          className="group border border-foreground/[0.06] rounded-xl bg-card/40 hover:bg-card/60 hover:border-primary/15 transition-all duration-300 px-5 md:px-6 overflow-hidden shadow-sm hover:shadow-md hover:shadow-primary/5"
                        >
                          <AccordionTrigger className="text-base md:text-[17px] font-semibold text-foreground/90 hover:text-foreground hover:no-underline py-5 gap-4">
                            <span className="flex items-start gap-3">
                              <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gradient-to-br from-primary to-brand-pink opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                              <span>{t(item.questionKey)}</span>
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="text-foreground/60 text-[15px] leading-relaxed pl-[1.125rem] pr-2 pb-5">
                            {t(item.answerKey)}
                          </AccordionContent>
                        </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* Single category view */
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <Accordion type="single" collapsible className="space-y-4">
                {filteredItems.map((item) => (
                    <AccordionItem
                      key={item.questionKey}
                      value={item.questionKey}
                      className="group border border-foreground/[0.06] rounded-xl bg-card/40 hover:bg-card/60 hover:border-primary/15 transition-all duration-300 px-5 md:px-6 overflow-hidden shadow-sm hover:shadow-md hover:shadow-primary/5"
                    >
                      <AccordionTrigger className="text-base md:text-[17px] font-semibold text-foreground/90 hover:text-foreground hover:no-underline py-5 gap-4">
                        {t(item.questionKey)}
                      </AccordionTrigger>
                      <AccordionContent className="text-foreground/60 text-[15px] leading-relaxed pr-2 pb-5">
                        {t(item.answerKey)}
                      </AccordionContent>
                    </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      <motion.div
        className="text-center mt-20 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 p-8 shadow-lg shadow-primary/10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-brand-pink/5 to-primary/10" />
          <div className="relative">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              {t("stillHaveQuestions")}
            </h3>
            <p className="text-foreground/70 mb-6">
              {t("stillHaveQuestionsText")}
            </p>
            <Button variant="gradient" size="lg" asChild>
              <Link href="/#contact-form">
                {t("contactUs")}
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default FaqSection;
