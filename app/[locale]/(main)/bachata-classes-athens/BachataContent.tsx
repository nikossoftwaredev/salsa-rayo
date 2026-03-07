"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  FaMusic,
  FaUsers,
  FaHeart,
  FaGlobe,
  FaStar,
  FaMapMarkerAlt,
  FaClock,
  FaSubway,
} from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa6";
import { useState } from "react";

const whyLearnItems = [
  { icon: FaHeart, key: "connection" },
  { icon: FaUsers, key: "accessible" },
  { icon: FaGlobe, key: "community" },
  { icon: FaMusic, key: "expression" },
] as const;

const classLevels = [
  { key: "level1", icon: FaStar },
  { key: "level2", icon: FaStar },
] as const;

const pricingTiers = [
  { key: "rayo8" },
  { key: "rayo12" },
  { key: "rayo16" },
] as const;

const instructors = [
  {
    key: "konstantinos",
    image: "/images/instructor-konstantinos.jpg",
  },
  {
    key: "anna",
    image: "/images/instructor-anna.jpg",
  },
] as const;

export const BachataContent = () => {
  const t = useTranslations("BachataClasses");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  return (
    <main className="bg-background">
      {/* Hero Section */}
      <section className="relative flex min-h-[60vh] items-center justify-center px-4 py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            <span className="bg-gradient-to-r from-primary to-brand-pink bg-clip-text text-transparent">
              {t("hero.title")}
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-foreground/70 sm:text-xl">
            {t("hero.subtitle")}
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button variant="gradient" size="lg" asChild>
              <Link href="/#contact-form">{t("hero.cta")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Learn Bachata */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground sm:text-4xl">
            {t("whyLearn.title")}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyLearnItems.map(({ icon: Icon, key }) => (
              <div
                key={key}
                className="rounded-xl border border-border/30 bg-card/80 p-6 text-center"
              >
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="size-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {t(`whyLearn.${key}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t(`whyLearn.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Bachata Classes */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground sm:text-4xl">
            {t("classes.title")}
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            {classLevels.map(({ key, icon: Icon }, index) => (
              <div
                key={key}
                className="rounded-xl border border-border/30 bg-card/80 p-8"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: index + 1 }).map((_, i) => (
                      <Icon key={i} className="size-5 text-primary" />
                    ))}
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    {t(`classes.${key}.title`)}
                  </h3>
                </div>
                <p className="mb-4 text-foreground/70">
                  {t(`classes.${key}.description`)}
                </p>
                <ul className="space-y-2">
                  {(["0", "1", "2", "3"] as const).map((i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                      {t(`classes.${key}.points.${i}` as `classes.level1.points.0`)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Your Instructors */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground sm:text-4xl">
            {t("instructors.title")}
          </h2>
          <div className="grid gap-8 sm:grid-cols-2">
            {instructors.map(({ key, image }) => (
              <div
                key={key}
                className="overflow-hidden rounded-xl border border-border/30 bg-card/80"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={image}
                    alt={t(`instructors.${key}.name`)}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <h3 className="mb-1 text-xl font-bold text-foreground">
                    {t(`instructors.${key}.name`)}
                  </h3>
                  <p className="mb-3 text-sm font-medium text-primary">
                    {t(`instructors.${key}.role`)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t(`instructors.${key}.bio`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule & Location */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground sm:text-4xl">
            {t("schedule.title")}
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border border-border/30 bg-card/80 p-6">
              <div className="mb-4 flex items-center gap-3">
                <FaClock className="size-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                  {t("schedule.days.title")}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {t("schedule.days.description")}
              </p>
            </div>
            <div className="rounded-xl border border-border/30 bg-card/80 p-6">
              <div className="mb-4 flex items-center gap-3">
                <FaMapMarkerAlt className="size-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                  {t("schedule.address.title")}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {t("schedule.address.description")}
              </p>
            </div>
            <div className="rounded-xl border border-border/30 bg-card/80 p-6">
              <div className="mb-4 flex items-center gap-3">
                <FaSubway className="size-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                  {t("schedule.transport.title")}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {t("schedule.transport.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground sm:text-4xl">
            {t("pricing.title")}
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {pricingTiers.map(({ key }) => (
              <div
                key={key}
                className="rounded-xl border border-border/30 bg-card/80 p-6 text-center"
              >
                <h3 className="mb-2 text-lg font-bold text-foreground">
                  {t(`pricing.${key}.name`)}
                </h3>
                <p className="mb-1 text-3xl font-bold text-primary">
                  {t(`pricing.${key}.price`)}
                </p>
                <p className="mb-4 text-sm text-muted-foreground">
                  {t(`pricing.${key}.period`)}
                </p>
                <p className="text-sm text-foreground/70">
                  {t(`pricing.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button variant="gradient" size="lg" asChild>
              <Link href="/pricing">{t("pricing.cta")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground sm:text-4xl">
            {t("faq.title")}
          </h2>
          <div className="space-y-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-xl border border-border/30 bg-card/80"
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="flex w-full items-center justify-between p-5 text-left"
                >
                  <span className="pr-4 font-semibold text-foreground">
                    {t(`faq.items.${i}.question` as `faq.items.0.question`)}
                  </span>
                  <FaChevronDown
                    className={`size-4 shrink-0 text-muted-foreground transition-transform ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-sm text-muted-foreground">
                      {t(`faq.items.${i}.answer` as `faq.items.0.answer`)}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold sm:text-4xl">
            <span className="bg-gradient-to-r from-primary to-brand-pink bg-clip-text text-transparent">
              {t("cta.title")}
            </span>
          </h2>
          <p className="mb-8 text-lg text-foreground/70">{t("cta.subtitle")}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="gradient" size="lg" asChild>
              <Link href="/#contact-form">{t("cta.button")}</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/salsa-classes-athens">{t("cta.salsaLink")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};
