import type { Metadata } from "next";
import type { BasePageProps } from "@/types/pageprops";
import JsonLd from "@/components/JsonLd";
import { getBreadcrumbSchema, getFAQPageSchema } from "@/lib/schema";
import { SalsaContent } from "./SalsaContent";

const BASE_URL = "https://www.salsarayo.com";

const metadata: Record<string, { title: string; description: string }> = {
  en: {
    title:
      "Salsa Classes in Athens | Salsa Rayo Dance School — Agios Dimitrios",
    description:
      "Learn Cuban Salsa in Athens at Salsa Rayo. Beginner to intermediate classes Monday-Thursday in Agios Dimitrios. Expert instructors, welcoming community. From €50/month.",
  },
  el: {
    title:
      "Μαθήματα Salsa στην Αθήνα | Salsa Rayo — Σχολή Χορού Άγιος Δημήτριος",
    description:
      "Μάθετε Cuban Salsa στην Αθήνα στη Salsa Rayo. Μαθήματα για αρχάριους έως μεσαίους Δευτέρα-Πέμπτη στον Άγιο Δημήτριο. Έμπειροι δάσκαλοι, φιλόξενη κοινότητα. Από €50/μήνα.",
  },
  es: {
    title: "Clases de Salsa en Atenas | Salsa Rayo — Escuela de Baile",
    description:
      "Aprende Salsa Cubana en Atenas en Salsa Rayo. Clases de principiante a intermedio lunes a jueves en Agios Dimitrios. Instructores expertos, comunidad acogedora. Desde €50/mes.",
  },
};

const faqItems = [
  {
    question: "Do I need dance experience to start salsa?",
    answer:
      "No! Our Salsa Level 1 class is designed for complete beginners with no prior dance experience.",
  },
  {
    question: "Do I need to bring a dance partner?",
    answer:
      "No, you don't need a partner. In our classes, we rotate partners so everyone dances with everyone. Come alone or with friends!",
  },
  {
    question: "How much do salsa classes cost?",
    answer:
      "Monthly packages range from €50 (8 classes/month) to €99 (24 classes/month). Student discounts available.",
  },
  {
    question: "What should I wear to salsa class?",
    answer:
      "Wear comfortable clothes that allow movement. Dance shoes with suede soles are ideal, or just wear socks. Avoid sneakers.",
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
      canonical: `${BASE_URL}/${locale}/salsa-classes-athens`,
      languages: {
        en: `${BASE_URL}/en/salsa-classes-athens`,
        el: `${BASE_URL}/el/salsa-classes-athens`,
        es: `${BASE_URL}/es/salsa-classes-athens`,
        "x-default": `${BASE_URL}/en/salsa-classes-athens`,
      },
    },
    openGraph: {
      title: localeMetadata.title,
      description: localeMetadata.description,
      url: `${BASE_URL}/${locale}/salsa-classes-athens`,
      siteName: "Salsa Rayo",
      locale,
      type: "website",
    },
  };
};

const SalsaClassesAthensPage = async ({ params }: BasePageProps) => {
  const { locale } = await params;

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: `${BASE_URL}/${locale}` },
    {
      name: "Salsa Classes Athens",
      url: `${BASE_URL}/${locale}/salsa-classes-athens`,
    },
  ]);

  const faqSchema = getFAQPageSchema(faqItems);

  return (
    <>
      <JsonLd data={[breadcrumbSchema, faqSchema]} />
      <SalsaContent />
    </>
  );
};

export default SalsaClassesAthensPage;
