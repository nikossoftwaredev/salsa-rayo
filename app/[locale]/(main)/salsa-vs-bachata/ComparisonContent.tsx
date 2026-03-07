"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { FaMusic, FaHeart, FaUsers, FaArrowRight } from "react-icons/fa";
import { IoFlash } from "react-icons/io5";

const comparisonRows = [
  { key: "musicTempo", salsaKey: "salsaTempo", bachataKey: "bachataTempo" },
  {
    key: "difficulty",
    salsaKey: "salsaDifficulty",
    bachataKey: "bachataDifficulty",
  },
  { key: "partnerHold", salsaKey: "salsaHold", bachataKey: "bachataHold" },
  {
    key: "energyLevel",
    salsaKey: "salsaEnergy",
    bachataKey: "bachataEnergy",
  },
  {
    key: "socialScene",
    salsaKey: "salsaScene",
    bachataKey: "bachataScene",
  },
  { key: "bestFor", salsaKey: "salsaBestFor", bachataKey: "bachataBestFor" },
] as const;

export const ComparisonContent = () => {
  const t = useTranslations("SalsaVsBachata");

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
          <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto">
            {t("hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Quick Answer */}
      <section className="py-16 md:py-20 px-4">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-border/30 bg-card/80 p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
              {t("quickAnswer.title")}
            </h2>
            <p className="text-foreground/70 leading-relaxed text-lg">
              {t("quickAnswer.text")}
            </p>
          </div>
        </div>
      </section>

      {/* What Is Salsa */}
      <section className="py-16 md:py-20 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <FaMusic className="size-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-brand-pink bg-clip-text text-transparent">
              {t("whatIsSalsa.title")}
            </h2>
          </div>
          <p className="text-foreground/70 leading-relaxed text-lg">
            {t("whatIsSalsa.text")}
          </p>
        </div>
      </section>

      {/* What Is Bachata */}
      <section className="py-16 md:py-20 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <FaHeart className="size-6 text-brand-pink" />
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-brand-pink to-primary bg-clip-text text-transparent">
              {t("whatIsBachata.title")}
            </h2>
          </div>
          <p className="text-foreground/70 leading-relaxed text-lg">
            {t("whatIsBachata.text")}
          </p>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 md:py-24 px-4">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-brand-pink bg-clip-text text-transparent">
            {t("comparison.title")}
          </h2>

          {/* Desktop Table */}
          <div className="hidden md:block rounded-2xl border border-border/30 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-card/80">
                  <th className="p-5 text-left text-foreground font-semibold w-1/4">
                    {t("comparison.category")}
                  </th>
                  <th className="p-5 text-left text-primary font-semibold w-[37.5%]">
                    {t("comparison.salsa")}
                  </th>
                  <th className="p-5 text-left text-brand-pink font-semibold w-[37.5%]">
                    {t("comparison.bachata")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, index) => (
                  <tr
                    key={row.key}
                    className={
                      index % 2 === 0 ? "bg-card/40" : "bg-card/20"
                    }
                  >
                    <td className="p-5 text-foreground font-medium">
                      {t(`comparison.${row.key}`)}
                    </td>
                    <td className="p-5 text-foreground/70">
                      {t(`comparison.${row.salsaKey}`)}
                    </td>
                    <td className="p-5 text-foreground/70">
                      {t(`comparison.${row.bachataKey}`)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {comparisonRows.map((row) => (
              <div
                key={row.key}
                className="rounded-xl border border-border/30 bg-card/80 p-5"
              >
                <p className="text-sm font-semibold text-foreground/50 uppercase tracking-wider mb-3">
                  {t(`comparison.${row.key}`)}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-primary mb-1">
                      {t("comparison.salsa")}
                    </p>
                    <p className="text-foreground/70 text-sm">
                      {t(`comparison.${row.salsaKey}`)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-brand-pink mb-1">
                      {t("comparison.bachata")}
                    </p>
                    <p className="text-foreground/70 text-sm">
                      {t(`comparison.${row.bachataKey}`)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Do I Need a Partner */}
      <section className="py-16 md:py-20 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-border/30 bg-card/80 p-8 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <FaUsers className="size-6 text-primary" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                {t("noPartner.title")}
              </h2>
            </div>
            <p className="text-foreground/70 leading-relaxed text-lg">
              {t("noPartner.text")}
            </p>
          </div>
        </div>
      </section>

      {/* Can I Learn Both */}
      <section className="py-16 md:py-20 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-border/30 bg-card/80 p-8 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <IoFlash className="size-6 text-brand-pink" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                {t("learnBoth.title")}
              </h2>
            </div>
            <p className="text-foreground/70 leading-relaxed text-lg">
              {t("learnBoth.text")}
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-brand-pink bg-clip-text text-transparent">
            {t("cta.title")}
          </h2>
          <p className="text-lg text-foreground/70 mb-10 max-w-xl mx-auto">
            {t("cta.text")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="gradient" size="lg" asChild>
              <Link href="/salsa-classes-athens">
                {t("cta.salsaClasses")}
                <FaArrowRight className="!size-4" />
              </Link>
            </Button>
            <Button variant="gradient" size="lg" asChild>
              <Link href="/bachata-classes-athens">
                {t("cta.bachataClasses")}
                <FaArrowRight className="!size-4" />
              </Link>
            </Button>
            <Button variant="gradient" size="lg" asChild>
              <Link href="/pricing">
                {t("cta.viewPricing")}
                <FaArrowRight className="!size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};
