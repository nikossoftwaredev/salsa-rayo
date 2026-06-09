"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Gem, Heart, Music, ListChecks, MapPin, Calendar, Clock } from "lucide-react";

const STYLE_CARDS = [
  { titleKey: "styleSalsaTitle", textKey: "styleSalsaText", accent: "primary" },
  { titleKey: "styleBachataTitle", textKey: "styleBachataText", accent: "pink" },
  { titleKey: "styleMixTitle", textKey: "styleMixText", accent: "primary" },
] as const;

const STEP_KEYS = ["step1", "step2", "step3", "step4"] as const;

const FAQ_PAIRS = [
  ["faq.q1", "faq.a1"],
  ["faq.q2", "faq.a2"],
  ["faq.q3", "faq.a3"],
  ["faq.q4", "faq.a4"],
  ["faq.q5", "faq.a5"],
] as const;

const WeddingChoreoContent = () => {
  const t = useTranslations("WeddingChoreo");

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative px-4 pt-32 pb-16 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-brand-pink/5 to-transparent" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-brand-pink bg-clip-text text-transparent">
              {t("title")}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 mb-8">{t("subtitle")}</p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-foreground/60">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4" /> Agios Dimitrios, Athens
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="size-4" /> Mon - Thu
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-4" /> 19:00 - 23:00
            </span>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button variant="gradient" size="lg" asChild>
              <Link href="/#contact-form">{t("ctaContact")}</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/pricing">{t("ctaPricing")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-lg text-foreground/80 leading-relaxed">{t("intro")}</p>
        </div>
      </section>

      {/* Why */}
      <section className="px-4 py-12 bg-gradient-to-b from-transparent via-secondary/20 to-transparent">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Heart className="size-7 text-primary" />
            {t("whyTitle")}
          </h2>
          <p className="text-foreground/80 leading-relaxed">{t("whyText")}</p>
        </div>
      </section>

      {/* Styles */}
      <section className="px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center flex items-center justify-center gap-3">
            <Music className="size-7 text-primary" />
            {t("stylesTitle")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STYLE_CARDS.map(({ titleKey, textKey, accent }) => {
              const isPink = accent === "pink";

              return (
                <article
                  key={titleKey}
                  className={`rounded-xl border bg-card/80 p-6 transition-colors ${
                    isPink
                      ? "border-brand-pink/30 hover:border-brand-pink/60"
                      : "border-primary/20 hover:border-primary/50"
                  }`}
                >
                  <h3 className={`text-xl font-bold mb-3 ${isPink ? "text-brand-pink" : "text-primary"}`}>
                    {t(titleKey)}
                  </h3>
                  <p className="text-sm text-foreground/75 leading-relaxed">{t(textKey)}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="px-4 py-12 bg-gradient-to-b from-transparent via-secondary/20 to-transparent">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 flex items-center gap-3">
            <ListChecks className="size-7 text-primary" />
            {t("processTitle")}
          </h2>
          <ol className="flex flex-col gap-4">
            {STEP_KEYS.map((stepKey, index) => (
              <li key={stepKey} className="flex gap-4 rounded-xl border border-border/30 bg-card/60 p-5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                  {index + 1}
                </span>
                <p className="text-foreground/80 leading-relaxed">{t(stepKey)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Lessons */}
      <section className="px-4 py-12">
        <div className="max-w-3xl mx-auto rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-brand-pink/5 p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 flex items-center gap-3">
            <Gem className="size-6 text-primary" />
            {t("lessonsTitle")}
          </h2>
          <p className="text-foreground/80 leading-relaxed mb-4">{t("lessonsText")}</p>
          <Link
            href="/blog/protos-horos-gamou"
            className="inline-flex items-center gap-2 font-semibold text-primary transition-colors hover:text-brand-pink"
          >
            {t("guideLink")}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-12 bg-gradient-to-b from-transparent via-secondary/20 to-transparent">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
            {t("faqTitle")}
          </h2>
          <div className="space-y-6">
            {FAQ_PAIRS.map(([qKey, aKey]) => (
              <article key={qKey} className="rounded-xl border border-border/30 bg-card/60 p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">{t(qKey)}</h3>
                <p className="text-foreground/75 leading-relaxed">{t(aKey)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20">
        <div className="max-w-2xl mx-auto text-center bg-gradient-to-br from-primary/10 via-brand-pink/10 to-primary/10 rounded-2xl p-10 border border-primary/20">
          <h2 className="text-3xl font-bold text-foreground mb-4">{t("ctaTitle")}</h2>
          <p className="text-foreground/70 mb-8">{t("ctaText")}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button variant="gradient" size="lg" asChild>
              <Link href="/#contact-form">{t("ctaContact")}</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/#schedule">{t("ctaSchedule")}</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/pricing">{t("ctaPricing")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default WeddingChoreoContent;
