import type { Metadata } from "next";
import type { BasePageProps } from "@/types/pageprops";
import JsonLd from "@/components/JsonLd";
import { getBreadcrumbSchema, getPersonSchema } from "@/lib/schema";
import { AboutContent } from "./AboutContent";

const BASE_URL = "https://www.salsarayo.com";

const metadata: Record<string, { title: string; description: string }> = {
  en: {
    title: "About Salsa Rayo | Salsa & Bachata Dance School in Athens",
    description:
      "Meet the founders of Salsa Rayo — Konstantinos Bitsis and Anna Lontou. Award-winning dancers bringing world-class salsa and bachata instruction to Athens, Greece.",
  },
  el: {
    title: "Σχετικά με τη Salsa Rayo | Σχολή Χορού στην Αθήνα",
    description:
      "Γνωρίστε τους ιδρυτές της Salsa Rayo — Κωνσταντίνο Μπίτση και Άννα Λόντου. Βραβευμένοι χορευτές που φέρνουν κορυφαία μαθήματα salsa και bachata στην Αθήνα.",
  },
  es: {
    title: "Sobre Salsa Rayo | Escuela de Baile en Atenas",
    description:
      "Conoce a los fundadores de Salsa Rayo — Konstantinos Bitsis y Anna Lontou. Bailarines premiados que traen instrucción de salsa y bachata de clase mundial a Atenas.",
  },
};

export const generateMetadata = async ({
  params,
}: BasePageProps): Promise<Metadata> => {
  const { locale } = await params;
  const localeMetadata = metadata[locale] || metadata.en;

  return {
    title: localeMetadata.title,
    description: localeMetadata.description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/about`,
      languages: {
        en: `${BASE_URL}/en/about`,
        el: `${BASE_URL}/el/about`,
        es: `${BASE_URL}/es/about`,
        "x-default": `${BASE_URL}/en/about`,
      },
    },
    openGraph: {
      title: localeMetadata.title,
      description: localeMetadata.description,
      url: `${BASE_URL}/${locale}/about`,
      siteName: "Salsa Rayo",
      locale,
      type: "website",
    },
  };
};

const AboutPage = async ({ params }: BasePageProps) => {
  const { locale } = await params;

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: `${BASE_URL}/${locale}` },
    { name: "About", url: `${BASE_URL}/${locale}/about` },
  ]);

  const konstantinosSchema = getPersonSchema({
    name: "Konstantinos Bitsis",
    jobTitle: "Co-Founder & Senior Instructor",
    description:
      "Award-winning salsa dancer and instructor specializing in Cuban Salsa. Trained with top instructors worldwide.",
    image: "/images/instructor-konstantinos.jpg",
  });

  const annaSchema = getPersonSchema({
    name: "Anna Lontou",
    jobTitle: "Co-Founder & Lead Instructor",
    description:
      "Professional dancer since age 6, specializing in Salsa, Bachata, and Ladies Styling. International competition experience.",
    image: "/images/instructor-anna.jpg",
  });

  return (
    <>
      <JsonLd data={[breadcrumbSchema, konstantinosSchema, annaSchema]} />
      <AboutContent />
    </>
  );
};

export default AboutPage;
