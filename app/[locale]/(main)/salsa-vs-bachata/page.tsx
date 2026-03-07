import type { Metadata } from "next";
import type { BasePageProps } from "@/types/pageprops";
import JsonLd from "@/components/JsonLd";
import { getBreadcrumbSchema, getFAQPageSchema } from "@/lib/schema";
import { ComparisonContent } from "./ComparisonContent";

const BASE_URL = "https://www.salsarayo.com";

const metadata: Record<string, { title: string; description: string }> = {
  en: {
    title:
      "Salsa vs Bachata: Which Dance Should You Learn First? | Salsa Rayo",
    description:
      "Salsa or Bachata? Compare music, difficulty, social scene, and find which Latin dance suits you best. Learn both at Salsa Rayo in Athens, Greece.",
  },
  el: {
    title:
      "Salsa ή Bachata: Ποιον Χορό να Μάθω Πρώτα; | Salsa Rayo",
    description:
      "Salsa ή Bachata; Συγκρίνετε μουσική, δυσκολία, κοινωνική σκηνή και βρείτε ποιος Latin χορός σας ταιριάζει. Μάθετε και τα δύο στη Salsa Rayo στην Αθήνα.",
  },
  es: {
    title:
      "Salsa vs Bachata: ¿Qué Baile Aprender Primero? | Salsa Rayo",
    description:
      "¿Salsa o Bachata? Compara música, dificultad, escena social y descubre qué baile latino te conviene más. Aprende ambos en Salsa Rayo en Atenas.",
  },
};

const faqItems = [
  {
    question: "Do I need a partner to learn salsa or bachata?",
    answer:
      "No! At Salsa Rayo we rotate partners in class. You can come alone, with a friend, or with a partner — everyone is welcome.",
  },
  {
    question: "Can I learn both salsa and bachata at the same time?",
    answer:
      "Absolutely! Many of our students take both salsa and bachata classes. The dances complement each other and learning both improves your overall musicality and body movement.",
  },
  {
    question: "Which is easier for beginners — salsa or bachata?",
    answer:
      "Most beginners find bachata slightly easier to start with because the basic step is simpler and the tempo is slower. However, both dances are very accessible for complete beginners at Salsa Rayo.",
  },
];

export const generateMetadata = async ({
  params,
}: BasePageProps): Promise<Metadata> => {
  const { locale } = await params;
  const localeMetadata = metadata[locale] || metadata.en;

  return {
    title: localeMetadata.title,
    description: localeMetadata.description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/salsa-vs-bachata`,
      languages: {
        en: `${BASE_URL}/en/salsa-vs-bachata`,
        el: `${BASE_URL}/el/salsa-vs-bachata`,
        es: `${BASE_URL}/es/salsa-vs-bachata`,
        "x-default": `${BASE_URL}/en/salsa-vs-bachata`,
      },
    },
    openGraph: {
      title: localeMetadata.title,
      description: localeMetadata.description,
      url: `${BASE_URL}/${locale}/salsa-vs-bachata`,
      siteName: "Salsa Rayo",
      locale,
      type: "website",
    },
  };
};

const SalsaVsBachataPage = async ({ params }: BasePageProps) => {
  const { locale } = await params;

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: `${BASE_URL}/${locale}` },
    {
      name: "Salsa vs Bachata",
      url: `${BASE_URL}/${locale}/salsa-vs-bachata`,
    },
  ]);

  const faqSchema = getFAQPageSchema(faqItems);

  return (
    <>
      <JsonLd data={[breadcrumbSchema, faqSchema]} />
      <ComparisonContent />
    </>
  );
};

export default SalsaVsBachataPage;
