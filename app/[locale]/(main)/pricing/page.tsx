import { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { getBreadcrumbSchema, getPricingSchemas } from "@/lib/schema";
import PricingContent from "./PricingContent";
import { BasePageProps } from "@/types/pageprops";
import { getStripePackages } from "@/lib/stripe/products";

const BASE_URL = "https://www.salsarayo.com";

export const generateMetadata = async ({
  params,
}: BasePageProps): Promise<Metadata> => {
  const locale = (await params).locale;

  // Package names and the entry price come from Stripe so the search snippet
  // never advertises a price we no longer charge.
  const packages = await getStripePackages();
  const names = packages.map((p) => p.name).join(", ");
  const from = packages[0]?.priceAmount;

  const titles = {
    en: "Pricing | Salsa & Bachata Class Packages - Salsa Rayo Athens",
    el: "Τιμές | Πακέτα Μαθημάτων Salsa & Bachata - Salsa Rayo Αθήνα",
    es: "Precios | Paquetes de Clases de Salsa y Bachata - Salsa Rayo Atenas",
  };

  const packageBlurb = {
    en: names ? `Choose from our ${names} dance class packages` : "Choose from our monthly dance class packages",
    el: names ? `Επιλέξτε από τα πακέτα μαθημάτων ${names}` : "Επιλέξτε από τα μηνιαία πακέτα μαθημάτων μας",
    es: names ? `Elige entre nuestros paquetes de clases ${names}` : "Elige entre nuestros paquetes mensuales de clases",
  };

  const fromBlurb = {
    en: from ? ` starting at €${from}/month` : "",
    el: from ? ` από €${from}/μήνα` : "",
    es: from ? ` desde €${from}/mes` : "",
  };

  const descriptions = {
    en: `${packageBlurb.en}${fromBlurb.en}. Salsa, Bachata, Mambo & Styling classes in Agios Dimitrios, Athens.`,
    el: `${packageBlurb.el}${fromBlurb.el}. Μαθήματα Salsa, Bachata, Mambo & Styling στον Άγιο Δημήτριο, Αθήνα.`,
    es: `${packageBlurb.es}${fromBlurb.es}. Clases de Salsa, Bachata, Mambo y Styling en Agios Dimitrios, Atenas.`,
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

  const stripePackages = await getStripePackages();

  return (
    <>
      <JsonLd
        data={[
          getBreadcrumbSchema([
            { name: "Home", url: `${BASE_URL}/${locale}` },
            { name: "Pricing", url: `${BASE_URL}/${locale}/pricing` },
          ]),
          ...(stripePackages.length ? [getPricingSchemas(stripePackages)] : []),
        ]}
      />
      <PricingContent stripePackages={stripePackages} />
    </>
  );
}

export default PricingPage
