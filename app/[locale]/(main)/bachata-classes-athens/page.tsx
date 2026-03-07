import type { Metadata } from "next";
import type { BasePageProps } from "@/types/pageprops";
import JsonLd from "@/components/JsonLd";
import { getBreadcrumbSchema, getFAQPageSchema } from "@/lib/schema";
import { BachataContent } from "./BachataContent";

const BASE_URL = "https://www.salsarayo.com";

const metadata: Record<string, { title: string; description: string }> = {
  en: {
    title:
      "Bachata Classes in Athens | Salsa Rayo Dance School — Agios Dimitrios",
    description:
      "Learn Bachata in Athens at Salsa Rayo. Beginner to intermediate classes in Agios Dimitrios. Master partner connection, musicality, and technique. From €50/month.",
  },
  el: {
    title:
      "Μαθήματα Bachata στην Αθήνα | Salsa Rayo — Σχολή Χορού Άγιος Δημήτριος",
    description:
      "Μάθετε Bachata στην Αθήνα στη Salsa Rayo. Μαθήματα για αρχάριους έως μεσαίους στον Άγιο Δημήτριο. Κατακτήστε τη σύνδεση, τη μουσικότητα και την τεχνική. Από €50/μήνα.",
  },
  es: {
    title:
      "Clases de Bachata en Atenas | Salsa Rayo — Escuela de Baile",
    description:
      "Aprende Bachata en Atenas en Salsa Rayo. Clases de principiante a intermedio en Agios Dimitrios. Domina la conexión, musicalidad y técnica. Desde €50/mes.",
  },
};

const faqItems = [
  {
    question: "Is bachata hard to learn as a beginner?",
    answer:
      "Not at all! Bachata is actually one of the most beginner-friendly Latin dances. The basic step is simple, and our Level 1 class builds your confidence from day one.",
  },
  {
    question: "Do I need a dance partner for bachata?",
    answer:
      "No partner needed! We rotate partners in class so everyone practices with different people. Come alone or bring friends.",
  },
  {
    question: "What's the difference between bachata and salsa?",
    answer:
      "Bachata is slower and more romantic, danced in a closer embrace. Salsa is faster and more energetic. Many students learn both — they complement each other beautifully.",
  },
  {
    question: "How often should I take bachata classes?",
    answer:
      "We recommend at least 2 classes per week for steady progress. Our Rayo 16 package (€75/month) gives you 4 classes per week across all styles.",
  },
];

export const generateMetadata = async ({
  params,
}: BasePageProps): Promise<Metadata> => {
  const { locale } = await params;
  const { title, description } = metadata[locale] ?? metadata.en;

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/bachata-classes-athens`,
      languages: {
        en: `${BASE_URL}/en/bachata-classes-athens`,
        el: `${BASE_URL}/el/bachata-classes-athens`,
        es: `${BASE_URL}/es/bachata-classes-athens`,
        "x-default": `${BASE_URL}/en/bachata-classes-athens`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/bachata-classes-athens`,
      siteName: "Salsa Rayo",
      locale,
      type: "website",
    },
  };
};

const BachataClassesPage = async ({ params }: BasePageProps) => {
  const { locale } = await params;

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: `${BASE_URL}/${locale}` },
    {
      name: "Bachata Classes",
      url: `${BASE_URL}/${locale}/bachata-classes-athens`,
    },
  ]);

  const faqSchema = getFAQPageSchema(faqItems);

  return (
    <>
      <JsonLd data={[breadcrumbSchema, faqSchema]} />
      <BachataContent />
    </>
  );
};

export default BachataClassesPage;
