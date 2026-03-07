import { Metadata } from "next";
import { BasePageProps } from "@/types/pageprops";
import GalleryClient from "./GalleryClient";
import JsonLd from "@/components/JsonLd";
import { getBreadcrumbSchema, getVideoObjectSchemas } from "@/lib/schema";
import { GALLERY_VIDEOS } from "@/data/gallery";

const BASE_URL = "https://www.salsarayo.com";

export const generateMetadata = async ({
  params,
}: BasePageProps): Promise<Metadata> => {
  const locale = (await params).locale;

  const titles = {
    en: "Gallery | Dance Photos & Videos - Salsa Rayo Athens",
    el: "Γκαλερί | Φωτογραφίες & Βίντεο Χορού - Salsa Rayo Αθήνα",
    es: "Galeria | Fotos y Videos de Baile - Salsa Rayo Atenas",
  };

  const descriptions = {
    en: "Explore photos and videos from Salsa Rayo dance school in Athens. See our performances, social dancing nights, workshops, and studio space.",
    el: "Εξερευνήστε φωτογραφίες και βίντεο από τη σχολή χορού Salsa Rayo στην Αθήνα. Δείτε τις παραστάσεις, τις βραδιές social, τα workshops και τον χώρο μας.",
    es: "Explora fotos y videos de la escuela de baile Salsa Rayo en Atenas. Mira nuestras presentaciones, noches de baile social, talleres y nuestro estudio.",
  };

  const title = titles[locale as keyof typeof titles] || titles.en;
  const description = descriptions[locale as keyof typeof descriptions] || descriptions.en;

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/gallery`,
      languages: {
        en: `${BASE_URL}/en/gallery`,
        el: `${BASE_URL}/el/gallery`,
        es: `${BASE_URL}/es/gallery`,
        "x-default": `${BASE_URL}/en/gallery`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/gallery`,
      type: "website",
    },
  };
};

const GalleryPage = async ({ params }: BasePageProps) => {
  const locale = (await params).locale;

  return (
    <>
      <JsonLd
        data={[
          getBreadcrumbSchema([
            { name: "Home", url: `${BASE_URL}/${locale}` },
            { name: "Gallery", url: `${BASE_URL}/${locale}/gallery` },
          ]),
          ...getVideoObjectSchemas(GALLERY_VIDEOS),
        ]}
      />
      <GalleryClient />
    </>
  );
}

export default GalleryPage
