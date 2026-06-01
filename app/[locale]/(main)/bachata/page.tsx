import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import BackgroundEffects from "@/components/BackgroundEffects";
import BachataContent from "@/components/sections/bachata/BachataContent";
import { BasePageProps } from "@/types/pageprops";
import JsonLd from "@/components/JsonLd";
import {
  getBreadcrumbSchema,
  getFAQPageSchema,
} from "@/lib/schema";
import { SUPPORTED_LOCALES } from "@/i18n/routing";

const BASE_URL = "https://www.salsarayo.com";

export const revalidate = 3600;

const TITLES: Record<string, string> = {
  en: "Bachata Classes in Athens | Traditional, Modern & Sensual - Salsa Rayo",
  el: "Μαθήματα Bachata Αθήνα | Σχολή Bachata - Salsa Rayo Άγιος Δημήτριος",
  es: "Clases de Bachata en Atenas | Escuela de Bachata - Salsa Rayo",
};

const DESCRIPTIONS: Record<string, string> = {
  en: "Bachata classes in Athens, Greece. Traditional, Modern and Sensual Bachata for all levels at Salsa Rayo in Agios Dimitrios. Packages from €50/month. Free trial.",
  el: "Μαθήματα Bachata στην Αθήνα. Bachata Tradicional, Moderna και Sensual για όλα τα επίπεδα στη Salsa Rayo στον Άγιο Δημήτριο. Πακέτα από €50/μήνα. Δωρεάν δοκιμαστικό.",
  es: "Clases de Bachata en Atenas, Grecia. Bachata Tradicional, Moderna y Sensual para todos los niveles en Salsa Rayo, Agios Dimitrios. Paquetes desde €50/mes.",
};

const FAQ_KEY_PAIRS = [
  ["faq.q1", "faq.a1"],
  ["faq.q2", "faq.a2"],
  ["faq.q3", "faq.a3"],
  ["faq.q4", "faq.a4"],
  ["faq.q5", "faq.a5"],
  ["faq.q6", "faq.a6"],
] as const;

export const generateMetadata = async ({
  params,
}: BasePageProps): Promise<Metadata> => {
  const { locale } = await params;
  const title = TITLES[locale] || TITLES.en;
  const description = DESCRIPTIONS[locale] || DESCRIPTIONS.en;

  return {
    title,
    description,
    keywords: [
      "Bachata classes Athens",
      "Bachata Αθήνα",
      "μαθήματα bachata",
      "clases de bachata Atenas",
      "Bachata sensual",
      "Bachata moderna",
      "Bachata tradicional",
      "Bachata dance school Athens",
      "Salsa Rayo Bachata",
    ],
    alternates: {
      canonical: `${BASE_URL}/${locale}/bachata`,
      languages: {
        en: `${BASE_URL}/en/bachata`,
        el: `${BASE_URL}/el/bachata`,
        es: `${BASE_URL}/es/bachata`,
        "x-default": `${BASE_URL}/en/bachata`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/bachata`,
      siteName: "Salsa Rayo",
      type: "website",
      images: [
        {
          url: `${BASE_URL}/images/gallery/our-space.jpg`,
          width: 1200,
          height: 630,
          alt: "Salsa Rayo Bachata classes in Athens",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
};

const BachataPage = async ({ params }: BasePageProps) => {
  const locale = (await params).locale as (typeof SUPPORTED_LOCALES)[number];
  const t = await getTranslations({ locale, namespace: "Bachata" });

  const faqItems = FAQ_KEY_PAIRS.map(([qKey, aKey]) => ({
    question: t(qKey),
    answer: t(aKey),
  }));

  const bachataServiceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${BASE_URL}/${locale}/bachata#service`,
    name: TITLES[locale] || TITLES.en,
    description: DESCRIPTIONS[locale] || DESCRIPTIONS.en,
    serviceType: "Bachata Dance Instruction",
    url: `${BASE_URL}/${locale}/bachata`,
    provider: { "@id": `${BASE_URL}/#organization` },
    areaServed: { "@type": "City", name: "Athens" },
    inLanguage: locale,
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "50",
      highPrice: "99",
      priceCurrency: "EUR",
      offerCount: 3,
      url: `${BASE_URL}/${locale}/pricing`,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Bachata Styles",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Bachata Tradicional",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Bachata Moderna",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Bachata Sensual",
          },
        },
      ],
    },
  };

  return (
    <>
      <JsonLd
        data={[
          getBreadcrumbSchema([
            { name: "Home", url: `${BASE_URL}/${locale}` },
            { name: "Bachata", url: `${BASE_URL}/${locale}/bachata` },
          ]),
          bachataServiceSchema,
          getFAQPageSchema(faqItems),
        ]}
      />
      <BackgroundEffects />
      <BachataContent />
    </>
  );
};

export default BachataPage;
