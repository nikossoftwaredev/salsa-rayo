import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import BackgroundEffects from "@/components/BackgroundEffects";
import WeddingChoreoContent from "@/components/sections/wedding/WeddingChoreoContent";
import { BasePageProps } from "@/types/pageprops";
import JsonLd from "@/components/JsonLd";
import { getBreadcrumbSchema, getFAQPageSchema } from "@/lib/schema";
import { SUPPORTED_LOCALES } from "@/i18n/routing";
import { SITE_URL } from "@/data/config";
import { SERVICE_AREAS } from "@/data/services";

const BASE_URL = SITE_URL;

export const revalidate = 3600;

const TITLES: Record<string, string> = {
  en: "Wedding Dance Choreography in Athens | Salsa & Bachata First Dance - Salsa Rayo",
  el: "Χορογραφία Γάμου Αθήνα | Πρώτος Χορός σε Salsa & Bachata - Salsa Rayo",
  es: "Coreografía de Boda en Atenas | Primer Baile en Salsa y Bachata - Salsa Rayo",
};

const DESCRIPTIONS: Record<string, string> = {
  en: "Personalised wedding dance choreography in Athens. We choreograph your first dance in salsa, bachata or a custom mix - tailored to your song, no experience needed. Salsa Rayo, Agios Dimitrios.",
  el: "Εξατομικευμένη χορογραφία γάμου στην Αθήνα. Σχεδιάζουμε τον πρώτο σας χορό σε salsa, bachata ή mix, πάνω στο τραγούδι σας, χωρίς καμία προηγούμενη εμπειρία. Salsa Rayo, Άγιος Δημήτριος.",
  es: "Coreografía de boda personalizada en Atenas. Diseñamos vuestro primer baile en salsa, bachata o un mix, sobre vuestra canción y sin experiencia previa. Salsa Rayo, Agios Dimitrios.",
};

const FAQ_KEY_PAIRS = [
  ["faq.q1", "faq.a1"],
  ["faq.q2", "faq.a2"],
  ["faq.q3", "faq.a3"],
  ["faq.q4", "faq.a4"],
  ["faq.q5", "faq.a5"],
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
      "χορογραφία γάμου",
      "χορογραφία γάμου salsa",
      "χορογραφία γάμου Αθήνα",
      "πρώτος χορός γάμου",
      "χορός γάμου salsa",
      "χορός γάμου bachata",
      "wedding dance choreography Athens",
      "wedding first dance Athens",
      "coreografía de boda Atenas",
      "Salsa Rayo wedding dance",
    ],
    alternates: {
      canonical: `${BASE_URL}/${locale}/xorografia-gamou`,
      languages: {
        en: `${BASE_URL}/en/xorografia-gamou`,
        el: `${BASE_URL}/el/xorografia-gamou`,
        es: `${BASE_URL}/es/xorografia-gamou`,
        "x-default": `${BASE_URL}/en/xorografia-gamou`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/xorografia-gamou`,
      siteName: "Salsa Rayo",
      type: "website",
      images: [
        {
          url: `${BASE_URL}/images/blog/wedding-first-dance.jpg`,
          width: 1200,
          height: 630,
          alt: "Wedding dance choreography in salsa and bachata at Salsa Rayo, Athens",
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

const WeddingChoreoPage = async ({ params }: BasePageProps) => {
  const locale = (await params).locale as (typeof SUPPORTED_LOCALES)[number];
  const t = await getTranslations({ locale, namespace: "WeddingChoreo" });

  const faqItems = FAQ_KEY_PAIRS.map(([qKey, aKey]) => ({
    question: t(qKey),
    answer: t(aKey),
  }));

  const weddingServiceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${BASE_URL}/${locale}/xorografia-gamou#service`,
    name: TITLES[locale] || TITLES.en,
    description: DESCRIPTIONS[locale] || DESCRIPTIONS.en,
    serviceType: "Wedding Dance Choreography",
    alternateName: [
      "Χορογραφία Γάμου",
      "Χορογραφία Γάμου Salsa",
      "Πρώτος Χορός Γάμου",
      "Wedding First Dance Choreography",
    ],
    url: `${BASE_URL}/${locale}/xorografia-gamou`,
    provider: { "@id": `${BASE_URL}/#organization` },
    areaServed: SERVICE_AREAS.map((name) => ({ "@type": "City", name })),
    audience: { "@type": "Audience", audienceType: "Engaged Couples" },
    inLanguage: locale,
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `${BASE_URL}/${locale}/pricing`,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Wedding Dance Choreography Styles",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Salsa Wedding Choreography" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Bachata Wedding Choreography" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Salsa & Bachata Mix First Dance" } },
      ],
    },
  };

  return (
    <>
      <JsonLd
        data={[
          getBreadcrumbSchema([
            { name: "Home", url: `${BASE_URL}/${locale}` },
            { name: t("title"), url: `${BASE_URL}/${locale}/xorografia-gamou` },
          ]),
          weddingServiceSchema,
          getFAQPageSchema(faqItems),
        ]}
      />
      <BackgroundEffects />
      <WeddingChoreoContent />
    </>
  );
};

export default WeddingChoreoPage;
