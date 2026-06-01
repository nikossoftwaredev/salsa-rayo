"use client";

import { useTranslations } from "next-intl";
import { orishas } from "@/data/orishas";
import OrishaCard from "./OrishaCard";

const FAQ_PAIRS = [
  ["faq.q1", "faq.a1"],
  ["faq.q2", "faq.a2"],
  ["faq.q3", "faq.a3"],
  ["faq.q4", "faq.a4"],
  ["faq.q5", "faq.a5"],
] as const;

const OrishasGrid = () => {
  const t = useTranslations("Orishas");

  return (
    <section className="py-20 px-4 bg-gray-900 min-h-screen">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-brand-pink bg-clip-text text-transparent">
              {t("title")}
            </span>
          </h1>
          <p className="text-xl text-gray-200 mb-2">{t("subtitle")}</p>
          <p className="max-w-3xl mx-auto text-base text-gray-300 mt-6">
            {t("intro")}
          </p>
          <time
            dateTime="2025-09-01"
            className="block text-sm text-gray-500 mt-4"
          >
            Published: September 2025
          </time>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orishas.map((orisha) => (
            <OrishaCard key={orisha.id} orisha={orisha} />
          ))}
        </div>

        <article className="max-w-3xl mx-auto mt-20 space-y-12 text-gray-300">
          <section>
            <h2 className="text-3xl font-bold text-white mb-4">
              {t("historyTitle")}
            </h2>
            <p className="leading-relaxed">{t("historyText")}</p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-white mb-4">
              {t("musicTitle")}
            </h2>
            <p className="leading-relaxed">{t("musicText")}</p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-white mb-4">
              {t("learningTitle")}
            </h2>
            <p className="leading-relaxed">{t("learningText")}</p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-white mb-6">
              {t("faqTitle")}
            </h2>
            <div className="space-y-6">
              {FAQ_PAIRS.map(([qKey, aKey]) => (
                <div key={qKey}>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {t(qKey)}
                  </h3>
                  <p className="leading-relaxed">{t(aKey)}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="text-center pt-8 border-t border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-3">
              {t("bottomTitle")}
            </h2>
            <p className="leading-relaxed max-w-2xl mx-auto">
              {t("bottomText")}
            </p>
          </section>
        </article>
      </div>
    </section>
  );
};

export default OrishasGrid;
