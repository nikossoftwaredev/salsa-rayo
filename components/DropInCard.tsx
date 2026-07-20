"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Ticket, Clock, Sparkles, CalendarCheck, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DROP_IN } from "@/data/packages";

const FEATURE_ICONS = [Clock, Sparkles, CalendarCheck];

interface DropInCardProps {
  isStudentDiscount?: boolean;
  onContactUs: () => void;
}

const DropInCard = ({ isStudentDiscount = false, onContactUs }: DropInCardProps) => {
  const t = useTranslations("DropIn");

  const features = [
    t("featureDuration", { minutes: DROP_IN.durationMinutes }),
    t("featureAnyStyle"),
    t("featureNoCommitment"),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto"
    >
      <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/60 backdrop-blur-md transition-all duration-500 hover:border-primary/40 hover:shadow-[0_20px_50px_rgba(139,92,246,0.15)]">
        <div className="flex flex-col md:flex-row">
          {/* Left: identity + features */}
          <div className="flex-1 p-6 md:p-8 space-y-5">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 size-12 rounded-xl bg-gradient-to-br from-primary/20 to-brand-pink/20 flex items-center justify-center">
                <Ticket className="size-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">{t("title")}</h3>
                <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
              </div>
            </div>

            <ul className="space-y-2.5">
              {features.map((feature, index) => {
                const Icon = FEATURE_ICONS[index];
                return (
                  <li key={feature} className="flex items-start gap-3 text-sm text-foreground/80">
                    <Icon className="size-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                );
              })}
            </ul>

            {/* Drop-in is excluded from the student discount - called out clearly,
                and emphasised while the discount toggle is on so the unchanged price
                does not read as a bug. */}
            <div
              className={`flex items-start gap-2.5 rounded-lg border px-3 py-2.5 text-xs transition-colors duration-300 ${
                isStudentDiscount
                  ? "border-brand-pink/40 bg-brand-pink/10 text-foreground/90"
                  : "border-border/40 bg-muted/30 text-muted-foreground"
              }`}
            >
              <Info
                className={`size-4 flex-shrink-0 mt-px ${
                  isStudentDiscount ? "text-brand-pink" : "text-muted-foreground"
                }`}
              />
              <span>{t("noStudentDiscount")}</span>
            </div>
          </div>

          {/* Right: price + CTA */}
          <div className="flex flex-col items-center justify-center gap-4 p-6 md:p-8 md:w-64 border-t border-dashed border-border/50 md:border-t-0 md:border-l">
            <div className="text-center">
              <div className="flex items-start justify-center gap-1">
                <span className="text-5xl font-bold text-foreground leading-none">
                  {DROP_IN.price}
                </span>
                <span className="text-2xl font-bold text-foreground/70 mt-1">€</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">
                {t("perClass")}
              </p>
            </div>

            <Button variant="gradient" size="lg" className="w-full" onClick={onContactUs}>
              {t("cta")}
            </Button>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default DropInCard;
