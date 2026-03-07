"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  FaArrowRight,
  FaGraduationCap,
  FaHeart,
  FaUsers,
} from "react-icons/fa";
import { GiShurikenAperture } from "react-icons/gi";
import { IoFlash } from "react-icons/io5";
import { MdLocationOn } from "react-icons/md";

export const AboutContent = () => {
  const t = useTranslations("AboutPage");

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
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-20 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-8">
            <IoFlash className="size-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-brand-pink bg-clip-text text-transparent">
              {t("story.title")}
            </h2>
          </div>
          <div className="space-y-6 text-foreground/70 leading-relaxed text-lg">
            <p>{t("story.p1")}</p>
            <p>{t("story.p2")}</p>
            <p>{t("story.p3")}</p>
            <p>{t("story.p4")}</p>
          </div>
        </div>
      </section>

      {/* Konstantinos Bitsis */}
      <section className="py-16 md:py-20 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-border/30 bg-card/80 p-8 md:p-10">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12">
              <div className="w-full md:w-1/3 shrink-0">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
                  <Image
                    src="/images/instructor-konstantinos.jpg"
                    alt={t("konstantinos.imageAlt")}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  {t("konstantinos.name")}
                </h2>
                <p className="text-primary font-medium mb-6">
                  {t("konstantinos.role")}
                </p>
                <div className="space-y-4 text-foreground/70 leading-relaxed">
                  <p>{t("konstantinos.bio")}</p>
                  <p>{t("konstantinos.philosophy")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Anna Lontou */}
      <section className="py-16 md:py-20 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-border/30 bg-card/80 p-8 md:p-10">
            <div className="flex flex-col md:flex-row-reverse gap-8 md:gap-12">
              <div className="w-full md:w-1/3 shrink-0">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
                  <Image
                    src="/images/instructor-anna.jpg"
                    alt={t("anna.imageAlt")}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  {t("anna.name")}
                </h2>
                <p className="text-brand-pink font-medium mb-6">
                  {t("anna.role")}
                </p>
                <div className="space-y-4 text-foreground/70 leading-relaxed">
                  <p>{t("anna.bio")}</p>
                  <p>{t("anna.philosophy")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Studio */}
      <section className="py-16 md:py-20 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center gap-3 mb-8">
            <MdLocationOn className="size-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-brand-pink bg-clip-text text-transparent">
              {t("studio.title")}
            </h2>
          </div>
          <div className="rounded-2xl border border-border/30 bg-card/80 overflow-hidden">
            <div className="relative aspect-video">
              <Image
                src="/images/gallery/our-space.jpg"
                alt={t("studio.imageAlt")}
                fill
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-8 md:p-10">
              <p className="text-foreground/70 leading-relaxed text-lg">
                {t("studio.text")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Teaching Philosophy */}
      <section className="py-16 md:py-24 px-4">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-brand-pink bg-clip-text text-transparent">
            {t("philosophy.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-border/30 bg-card/80 p-6 md:p-8">
              <FaGraduationCap className="size-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {t("philosophy.levels")}
              </h3>
              <p className="text-foreground/70 leading-relaxed">
                {t("philosophy.levelsText")}
              </p>
            </div>
            <div className="rounded-xl border border-border/30 bg-card/80 p-6 md:p-8">
              <FaHeart className="size-8 text-brand-pink mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {t("philosophy.technique")}
              </h3>
              <p className="text-foreground/70 leading-relaxed">
                {t("philosophy.techniqueText")}
              </p>
            </div>
            <div className="rounded-xl border border-border/30 bg-card/80 p-6 md:p-8">
              <FaUsers className="size-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {t("philosophy.community")}
              </h3>
              <p className="text-foreground/70 leading-relaxed">
                {t("philosophy.communityText")}
              </p>
            </div>
            <div className="rounded-xl border border-border/30 bg-card/80 p-6 md:p-8">
              <GiShurikenAperture className="size-8 text-brand-pink mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {t("philosophy.rotation")}
              </h3>
              <p className="text-foreground/70 leading-relaxed">
                {t("philosophy.rotationText")}
              </p>
            </div>
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
          <Button variant="gradient" size="lg" asChild>
            <Link href="/#contact-form">
              {t("cta.contact")}
              <FaArrowRight className="!size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
};
