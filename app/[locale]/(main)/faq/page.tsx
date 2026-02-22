import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import FaqSection from "@/components/sections/faq/FaqSection";
import BackgroundEffects from "@/components/BackgroundEffects";
import { BasePageProps } from "@/types/pageprops";
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
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
};

const FaqPage = async () => {
  const t = await getTranslations("Faq");

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: t(item.questionKey),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(item.answerKey),
      },
    })),
  };

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <BackgroundEffects />
      <FaqSection />
    </main>
  );
};

export default FaqPage;
