import { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { getBreadcrumbSchema, getPricingSchemas } from "@/lib/schema";
import PricingContent from "./PricingContent";
import { BasePageProps } from "@/types/pageprops";
import { listActiveProducts } from "@/lib/stripe/products";

const BASE_URL = "https://www.salsarayo.com";

export const generateMetadata = async ({
  params,
}: BasePageProps): Promise<Metadata> => {
  const locale = (await params).locale;

  const titles = {
    en: "Pricing | Salsa & Bachata Class Packages - Salsa Rayo Athens",
    el: "Τιμές | Πακέτα Μαθημάτων Salsa & Bachata - Salsa Rayo Αθήνα",
    es: "Precios | Paquetes de Clases de Salsa y Bachata - Salsa Rayo Atenas",
  };

  const descriptions = {
    en: "Choose from our Rayo 8, 16, or 24 dance class packages starting at €50/month. Salsa, Bachata, Mambo & Styling classes in Agios Dimitrios, Athens.",
    el: "Επιλέξτε από τα πακέτα μαθημάτων Rayo 8, 16 ή 24 από €50/μήνα. Μαθήματα Salsa, Bachata, Mambo & Styling στον Άγιο Δημήτριο, Αθήνα.",
    es: "Elige entre nuestros paquetes de clases Rayo 8, 16 o 24 desde €50/mes. Clases de Salsa, Bachata, Mambo y Styling en Agios Dimitrios, Atenas.",
  };

  const title = titles[locale as keyof typeof titles] || titles.en;
  const description = descriptions[locale as keyof typeof descriptions] || descriptions.en;

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/pricing`,
      languages: {
        en: `${BASE_URL}/en/pricing`,
        el: `${BASE_URL}/el/pricing`,
        es: `${BASE_URL}/es/pricing`,
        "x-default": `${BASE_URL}/en/pricing`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/pricing`,
      type: "website",
    },
  };
};

const PricingPage = async ({ params }: BasePageProps) => {
  const locale = (await params).locale;

  let stripePackages;
  try {
    stripePackages = await listActiveProducts();
  } catch {
    // Fallback to hardcoded packages if Stripe is unavailable
  }

  return (
    <>
      <JsonLd
        data={[
          getBreadcrumbSchema([
            { name: "Home", url: `${BASE_URL}/${locale}` },
            { name: "Pricing", url: `${BASE_URL}/${locale}/pricing` },
          ]),
          getPricingSchemas(),
        ]}
      />
      <PricingContent stripePackages={stripePackages} />
    </>
  );
}

export default PricingPage
