import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import BackgroundEffects from "@/components/BackgroundEffects";
import ServicesContent from "@/components/sections/services/ServicesContent";
import { BasePageProps } from "@/types/pageprops";
import JsonLd from "@/components/JsonLd";
import { getBreadcrumbSchema, getFAQPageSchema } from "@/lib/schema";
import { SUPPORTED_LOCALES } from "@/i18n/routing";
import { SITE_URL } from "@/data/config";
import { SERVICE_ITEMS, SERVICE_FAQ_KEYS, SERVICE_AREAS } from "@/data/services";

const BASE_URL = SITE_URL;

export const revalidate = 3600;

const TITLES: Record<string, string> = {
  en: "Dance Services in Athens | Salsa, Bachata & Wedding Dance - Salsa Rayo",
  el: "Υπηρεσίες Χορού Αθήνα | Salsa, Bachata & Χορός Γάμου - Salsa Rayo",
  es: "Servicios de Baile en Atenas | Salsa, Bachata y Baile de Boda - Salsa Rayo",
};

const DESCRIPTIONS: Record<string, string> = {
  en: "Group and private Salsa and Bachata classes, song and couple choreographies and wedding first dance lessons at Salsa Rayo in Agios Dimitrios, Athens. Free trial.",
  el: "Ομαδικά και ιδιαίτερα μαθήματα Salsa και Bachata, χορογραφίες τραγουδιών και ζευγαριών και χορός γάμου στη Salsa Rayo στον Άγιο Δημήτριο Αθηνών. Δωρεάν δοκιμαστικό.",
  es: "Clases de Salsa y Bachata en grupo y particulares, coreografías de canciones y de pareja y baile de boda en Salsa Rayo, Agios Dimitrios, Atenas. Clase de prueba gratis.",
};

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
      "dance services Athens",
      "salsa classes Athens",
      "bachata classes Athens",
      "private salsa lessons",
      "private bachata lessons",
      "wedding dance Athens",
      "χορός γάμου Αθήνα",
      "ιδιαίτερα μαθήματα salsa",
      "χορογραφίες ζευγαριών",
      "Salsa Rayo services",
    ],
    alternates: {
      canonical: `${BASE_URL}/${locale}/services`,
      languages: {
        en: `${BASE_URL}/en/services`,
        el: `${BASE_URL}/el/services`,
        es: `${BASE_URL}/es/services`,
        "x-default": `${BASE_URL}/en/services`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/services`,
      siteName: "Salsa Rayo",
      type: "website",
      images: [
        {
          url: `${BASE_URL}/images/gallery/our-space.jpg`,
          width: 1200,
          height: 630,
          alt: "Salsa Rayo dance services in Athens",
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

const ServicesPage = async ({ params }: BasePageProps) => {
  const locale = (await params).locale as (typeof SUPPORTED_LOCALES)[number];
  const t = await getTranslations({ locale, namespace: "Services" });

  const faqItems = SERVICE_FAQ_KEYS.map(([qKey, aKey]) => ({
    question: t(qKey),
    answer: t(aKey),
  }));

  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${BASE_URL}/${locale}/services#service`,
    name: TITLES[locale] || TITLES.en,
    description: DESCRIPTIONS[locale] || DESCRIPTIONS.en,
    serviceType: "Dance Instruction",
    url: `${BASE_URL}/${locale}/services`,
    provider: { "@id": `${BASE_URL}/#organization` },
    areaServed: SERVICE_AREAS.map((name) => ({ "@type": "City", name })),
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
      name: "Dance Services",
      itemListElement: SERVICE_ITEMS.map(({ schemaName }) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: schemaName },
      })),
    },
  };

  return (
    <>
      <JsonLd
        data={[
          getBreadcrumbSchema([
            { name: "Home", url: `${BASE_URL}/${locale}` },
            { name: t("title"), url: `${BASE_URL}/${locale}/services` },
          ]),
          servicesSchema,
          getFAQPageSchema(faqItems),
        ]}
      />
      <BackgroundEffects />
      <ServicesContent />
    </>
  );
};

export default ServicesPage;
