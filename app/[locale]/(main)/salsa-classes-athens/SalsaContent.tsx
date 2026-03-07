"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  FaMusic,
  FaUsers,
  FaHeart,
  FaGraduationCap,
  FaStar,
  FaMapMarkerAlt,
  FaClock,
  FaChevronDown,
  FaChevronUp,
  FaArrowRight,
} from "react-icons/fa";

interface FaqItemProps {
  question: string;
  answer: string;
}

const FaqItem = ({ question, answer }: FaqItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <div className="border border-border/30 rounded-lg overflow-hidden">
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between p-5 text-left text-foreground hover:bg-card/50 transition-colors cursor-pointer"
      >
        <span className="font-medium pr-4">{question}</span>
        {isOpen ? (
          <FaChevronUp className="size-4 shrink-0 text-primary" />
        ) : (
          <FaChevronDown className="size-4 shrink-0 text-primary" />
        )}
      </button>
      {isOpen && (
        <div className="px-5 pb-5 text-foreground/70 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
};

const benefits = [
  { icon: FaUsers, key: "social" },
  { icon: FaHeart, key: "fitness" },
  { icon: FaMusic, key: "cultural" },
  { icon: FaStar, key: "fun" },
] as const;

const levels = [
  { key: "level1", icon: FaGraduationCap },
  { key: "level2", icon: FaStar },
  { key: "mambo", icon: FaMusic },
  { key: "techniques", icon: FaHeart },
] as const;

const pricingPlans = [
  { key: "rayo8", classes: "8", price: "50" },
  { key: "rayo16", classes: "16", price: "75" },
  { key: "rayo24", classes: "24", price: "99" },
] as const;

export const SalsaContent = () => {
  const t = useTranslations("SalsaClasses");

  return (
    <main className="bg-background">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-brand-pink bg-clip-text text-transparent">
              {t("hero.title")}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto mb-8">
            {t("hero.subtitle")}
          </p>
          <Button variant="gradient" size="lg" asChild>
            <Link href="/#contact-form">
              {t("hero.cta")}
              <FaArrowRight className="!size-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Why Learn Salsa */}
      <section className="py-16 md:py-24 px-4">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-primary to-brand-pink bg-clip-text text-transparent">
              {t("benefits.title")}
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map(({ icon: Icon, key }) => (
              <div
                key={key}
                className="border border-border/30 bg-card/80 rounded-xl p-6 text-center"
              >
                <div className="inline-flex items-center justify-center size-14 rounded-full bg-primary/10 mb-4">
                  <Icon className="size-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t(`benefits.${key}.title`)}
                </h3>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  {t(`benefits.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Salsa Classes */}
      <section className="py-16 md:py-24 px-4">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-primary to-brand-pink bg-clip-text text-transparent">
              {t("classes.title")}
            </span>
          </h2>
          <p className="text-center text-foreground/70 mb-12 max-w-2xl mx-auto">
            {t("classes.subtitle")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {levels.map(({ key, icon: Icon }) => (
              <div
                key={key}
                className="border border-border/30 bg-card/80 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="inline-flex items-center justify-center size-10 rounded-lg bg-primary/10">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {t(`classes.${key}.title`)}
                  </h3>
                </div>
                <p className="text-foreground/70 leading-relaxed">
                  {t(`classes.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Your Instructors */}
      <section className="py-16 md:py-24 px-4">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-primary to-brand-pink bg-clip-text text-transparent">
              {t("instructors.title")}
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Konstantinos */}
            <div className="border border-border/30 bg-card/80 rounded-xl p-6 text-center">
              <div className="relative size-24 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src="/images/instructor-konstantinos.jpg"
                  alt={t("instructors.konstantinos.name")}
                  fill
                  sizes="96px"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-1">
                {t("instructors.konstantinos.name")}
              </h3>
              <p className="text-sm text-primary mb-3">
                {t("instructors.konstantinos.role")}
              </p>
              <p className="text-sm text-foreground/70 leading-relaxed">
                {t("instructors.konstantinos.bio")}
              </p>
            </div>

            {/* Anna */}
            <div className="border border-border/30 bg-card/80 rounded-xl p-6 text-center">
              <div className="relative size-24 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src="/images/instructor-anna.jpg"
                  alt={t("instructors.anna.name")}
                  fill
                  sizes="96px"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-1">
                {t("instructors.anna.name")}
              </h3>
              <p className="text-sm text-primary mb-3">
                {t("instructors.anna.role")}
              </p>
              <p className="text-sm text-foreground/70 leading-relaxed">
                {t("instructors.anna.bio")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule & Location */}
      <section className="py-16 md:py-24 px-4">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-primary to-brand-pink bg-clip-text text-transparent">
              {t("schedule.title")}
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-border/30 bg-card/80 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaClock className="size-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                  {t("schedule.hours.title")}
                </h3>
              </div>
              <p className="text-foreground/70 leading-relaxed">
                {t("schedule.hours.days")}
              </p>
              <p className="text-foreground/70">
                {t("schedule.hours.time")}
              </p>
            </div>
            <div className="border border-border/30 bg-card/80 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaMapMarkerAlt className="size-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                  {t("schedule.location.title")}
                </h3>
              </div>
              <p className="text-foreground/70 mb-3">
                {t("schedule.location.address")}
              </p>
              <a
                href="https://maps.google.com/?q=Thermopylon+19,+Agios+Dimitrios,+Athens"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
              >
                {t("schedule.location.mapLink")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Summary */}
      <section className="py-16 md:py-24 px-4">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-primary to-brand-pink bg-clip-text text-transparent">
              {t("pricing.title")}
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {pricingPlans.map(({ key, classes, price }) => (
              <div
                key={key}
                className="border border-border/30 bg-card/80 rounded-xl p-6 text-center"
              >
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {t(`pricing.${key}.name`)}
                </h3>
                <p className="text-sm text-foreground/70 mb-3">
                  {t(`pricing.${key}.classes`, { count: classes })}
                </p>
                <p className="text-3xl font-bold text-primary">
                  €{price}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{t("pricing.perMonth")}
                  </span>
                </p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Button variant="gradient" size="lg" asChild>
              <Link href="/pricing">
                {t("pricing.viewAll")}
                <FaArrowRight className="!size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-primary to-brand-pink bg-clip-text text-transparent">
              {t("faq.title")}
            </span>
          </h2>
          <div className="space-y-3">
            <FaqItem
              question={t("faq.q1.question")}
              answer={t("faq.q1.answer")}
            />
            <FaqItem
              question={t("faq.q2.question")}
              answer={t("faq.q2.answer")}
            />
            <FaqItem
              question={t("faq.q3.question")}
              answer={t("faq.q3.answer")}
            />
            <FaqItem
              question={t("faq.q4.question")}
              answer={t("faq.q4.answer")}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-brand-pink bg-clip-text text-transparent">
              {t("cta.title")}
            </span>
          </h2>
          <p className="text-foreground/70 mb-8 max-w-xl mx-auto">
            {t("cta.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="gradient" size="lg" asChild>
              <Link href="/#contact-form">
                {t("cta.button")}
                <FaArrowRight className="!size-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/bachata-classes-athens">
                {t("cta.bachataLink")}
                <FaArrowRight className="!size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};
