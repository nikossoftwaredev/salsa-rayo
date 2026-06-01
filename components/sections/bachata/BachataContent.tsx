"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Heart, Music, Users, MapPin, Calendar, Clock } from "lucide-react";

const FAQ_PAIRS = [
  ["faq.q1", "faq.a1"],
  ["faq.q2", "faq.a2"],
  ["faq.q3", "faq.a3"],
  ["faq.q4", "faq.a4"],
  ["faq.q5", "faq.a5"],
  ["faq.q6", "faq.a6"],
] as const;

const BachataContent = () => {
  const t = useTranslations("Bachata");

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
          <p className="text-lg md:text-xl text-foreground/70 mb-8">
            {t("subtitle")}
          </p>
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
        </div>
      </section>

      {/* Intro */}
      <section className="px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-lg text-foreground/80 leading-relaxed">
            {t("intro")}
          </p>
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
            <article className="rounded-xl border border-border/30 bg-card/80 p-6 hover:border-primary/30 transition-colors">
              <h3 className="text-xl font-bold mb-3 text-primary">
                {t("stylesTraditionalTitle")}
              </h3>
              <p className="text-sm text-foreground/75 leading-relaxed">
                {t("stylesTraditionalText")}
              </p>
            </article>
            <article className="rounded-xl border border-brand-pink/30 bg-card/80 p-6 hover:border-brand-pink/60 transition-colors">
              <h3 className="text-xl font-bold mb-3 text-brand-pink">
                {t("stylesModernTitle")}
              </h3>
              <p className="text-sm text-foreground/75 leading-relaxed">
                {t("stylesModernText")}
              </p>
            </article>
            <article className="rounded-xl border border-border/30 bg-card/80 p-6 hover:border-primary/30 transition-colors">
              <h3 className="text-xl font-bold mb-3 text-primary">
                {t("stylesSensualTitle")}
              </h3>
              <p className="text-sm text-foreground/75 leading-relaxed">
                {t("stylesSensualText")}
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* First Class */}
      <section className="px-4 py-12 bg-gradient-to-b from-transparent via-secondary/20 to-transparent">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Users className="size-7 text-primary" />
            {t("firstClassTitle")}
          </h2>
          <p className="text-foreground/80 leading-relaxed">
            {t("firstClassText")}
          </p>
        </div>
      </section>

      {/* Wedding */}
      <section className="px-4 py-12">
        <div className="max-w-3xl mx-auto rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-brand-pink/5 p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            {t("weddingTitle")}
          </h2>
          <p className="text-foreground/80 leading-relaxed mb-4">
            {t("weddingText")}
          </p>
          <Link
            href="/blog/protos-horos-gamou"
            className="inline-flex items-center gap-2 text-primary hover:text-brand-pink transition-colors font-semibold"
          >
            <span>→</span>
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
              <article
                key={qKey}
                className="rounded-xl border border-border/30 bg-card/60 p-6"
              >
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t(qKey)}
                </h3>
                <p className="text-foreground/75 leading-relaxed">{t(aKey)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20">
        <div className="max-w-2xl mx-auto text-center bg-gradient-to-br from-primary/10 via-brand-pink/10 to-primary/10 rounded-2xl p-10 border border-primary/20">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {t("ctaTitle")}
          </h2>
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

export default BachataContent;
