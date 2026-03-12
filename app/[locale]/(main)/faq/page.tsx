import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import FaqSection from "@/components/sections/faq/FaqSection";
import BackgroundEffects from "@/components/BackgroundEffects";
import { BasePageProps } from "@/types/pageprops";
import JsonLd from "@/components/JsonLd";
import { getBreadcrumbSchema, getFAQPageSchema } from "@/lib/schema";
import { FAQ_ITEMS } from "@/data/faq";

export const generateMetadata = async ({
  params,
}: BasePageProps): Promise<Metadata> => {
  const locale = (await params).locale;

  const titles = {
    en: "FAQ | Salsa Rayo Dance School",
    el: "Συχνές Ερωτήσεις | Salsa Rayo Dance School",
    es: "Preguntas Frecuentes | Salsa Rayo Dance School",
  };

  const descriptions = {
    en: "Find answers to frequently asked questions about Salsa Rayo dance classes, pricing, schedule, location, and more. Start your dance journey in Athens today.",
    el: "Βρείτε απαντήσεις στις συχνές ερωτήσεις σχετικά με τα μαθήματα χορού, τις τιμές, το πρόγραμμα, την τοποθεσία και περισσότερα στη Salsa Rayo. Ξεκινήστε το χορευτικό σας ταξίδι στην Αθήνα σήμερα.",
    es: "Encuentra respuestas a preguntas frecuentes sobre las clases de baile, precios, horarios, ubicación y más de Salsa Rayo. Comienza tu viaje de baile en Atenas hoy.",
  };

  const title = titles[locale as keyof typeof titles] || titles.en;
  const description =
    descriptions[locale as keyof typeof descriptions] || descriptions.en;

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.salsarayo.com/${locale}/faq`,
      languages: {
        en: "https://www.salsarayo.com/en/faq",
        el: "https://www.salsarayo.com/el/faq",
        es: "https://www.salsarayo.com/es/faq",
        "x-default": "https://www.salsarayo.com/en/faq",
      },
    },
    openGraph: {
      title,
      description,
      url: `https://www.salsarayo.com/${locale}/faq`,
      type: "website",
    },
  };
};

const FaqPage = async ({ params }: BasePageProps) => {
  const locale = (await params).locale;
  const t = await getTranslations("Faq");

  const faqSchemaItems = FAQ_ITEMS.map((item) => ({
    question: t(item.questionKey),
    answer: t(item.answerKey),
  }));

  return (
    <main className="min-h-screen bg-background">
      <JsonLd
        data={[
          getBreadcrumbSchema([
            { name: "Home", url: `https://www.salsarayo.com/${locale}` },
            { name: "FAQ", url: `https://www.salsarayo.com/${locale}/faq` },
          ]),
          getFAQPageSchema(faqSchemaItems),
        ]}
      />
      {/* Server-rendered FAQ content for AI crawlers (hidden visually, present in DOM) */}
      <div className="sr-only" aria-hidden="true">
        {FAQ_ITEMS.map((item) => (
          <div key={item.questionKey}>
            <h2>{t(item.questionKey)}</h2>
            <p>{t(item.answerKey)}</p>
          </div>
        ))}
      </div>
      <BackgroundEffects />
      <FaqSection />
    </main>
  );
};

export default FaqPage;
