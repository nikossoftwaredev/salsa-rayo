"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { SERVICE_ITEMS, SERVICE_FAQ_KEYS } from "@/data/services";

const ServicesContent = () => {
  const t = useTranslations("Services");

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative px-4 pt-32 pb-12 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-brand-pink/5 to-transparent" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-brand-pink bg-clip-text text-transparent">
              {t("title")}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 mb-6">{t("subtitle")}</p>
          <p className="text-base text-foreground/70 leading-relaxed">{t("intro")}</p>
        </div>
      </section>

      {/* Cards */}
      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICE_ITEMS.map(({ titleKey, textKey, Icon, accent, href, linkKey }) => {
            const isPink = accent === "pink";

            return (
              <article
                key={titleKey}
                className={`group flex flex-col rounded-xl border bg-card/80 p-6 transition-colors ${
                  isPink
                    ? "border-brand-pink/30 hover:border-brand-pink/60"
                    : "border-primary/20 hover:border-primary/50"
                }`}
              >
                <div
                  className={`mb-4 flex size-12 items-center justify-center rounded-lg ${
                    isPink ? "bg-brand-pink/10 text-brand-pink" : "bg-primary/10 text-primary"
                  }`}
                >
                  <Icon className="size-6" />
                </div>
                <h2 className={`mb-2 text-xl font-bold ${isPink ? "text-brand-pink" : "text-primary"}`}>
                  {t(titleKey)}
                </h2>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-foreground/75">{t(textKey)}</p>
                <Link
                  href={href}
                  className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                    isPink
                      ? "text-brand-pink hover:text-brand-pink/80"
                      : "text-primary hover:text-primary/80"
                  }`}
                >
                  {t(linkKey)}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 pb-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-3xl md:text-4xl font-bold text-foreground">
            {t("faqTitle")}
          </h2>
          <div className="flex flex-col gap-4">
            {SERVICE_FAQ_KEYS.map(([qKey, aKey]) => (
              <div key={qKey} className="rounded-xl border border-border/30 bg-card/80 p-6">
                <h3 className="mb-2 text-lg font-bold text-foreground">{t(qKey)}</h3>
                <p className="text-sm leading-relaxed text-foreground/75">{t(aKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-24">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border/30 bg-gradient-to-b from-secondary/30 to-transparent p-8 text-center md:p-12">
          <h2 className="mb-3 text-2xl font-bold md:text-3xl">{t("ctaTitle")}</h2>
          <p className="mb-6 text-foreground/70">{t("ctaText")}</p>
          <Button asChild size="lg" variant="gradient">
            <Link href="/#contact-form">{t("ctaButton")}</Link>
          </Button>
        </div>
      </section>
    </main>
  );
};

export default ServicesContent;
