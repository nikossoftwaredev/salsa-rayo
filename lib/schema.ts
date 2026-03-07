import {
  BUSINESS_NAME,
  PHONE,
  MAIL,
  INSTAGRAM_URL,
  YOUTUBE_URL,
  FACEBOOK_URL,
} from "@/data/config";

const BASE_URL = "https://www.salsarayo.com";

// ============================================================
// DanceSchool (LocalBusiness subtype) - Global / Homepage
// ============================================================
export const getDanceSchoolSchema = () => ({
  "@context": "https://schema.org",
  "@type": "DanceSchool",
  "@id": `${BASE_URL}/#organization`,
  name: BUSINESS_NAME,
  alternateName: "Salsa Rayo",
  url: BASE_URL,
  telephone: PHONE,
  email: MAIL,
  image: `${BASE_URL}/images/gallery/our-space.jpg`,
  logo: `${BASE_URL}/images/logo.png`,
  description:
    "Salsa Rayo is a dance school in Athens, Greece offering Salsa, Bachata, Mambo, and Styling classes for all levels. Located in Agios Dimitrios.",
  foundingDate: "2025-09-01",
  currenciesAccepted: "EUR",
  paymentAccepted: "Cash, Credit Card",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Thermopylon 19",
    addressLocality: "Agios Dimitrios",
    addressRegion: "Attica",
    postalCode: "17341",
    addressCountry: "GR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 37.9342555,
    longitude: 23.7430918,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday"],
      opens: "19:00",
      closes: "22:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Wednesday", "Thursday"],
      opens: "19:00",
      closes: "23:00",
    },
  ],
  sameAs: [INSTAGRAM_URL, YOUTUBE_URL, FACEBOOK_URL],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Dance Class Packages",
    itemListElement: [
      {
        "@type": "Offer",
        name: "Rayo 8",
        description: "8 dance classes per month (2 per week)",
        price: "50",
        priceCurrency: "EUR",
        url: `${BASE_URL}/en/pricing`,
      },
      {
        "@type": "Offer",
        name: "Rayo 16",
        description: "16 dance classes per month (4 per week)",
        price: "75",
        priceCurrency: "EUR",
        url: `${BASE_URL}/en/pricing`,
      },
      {
        "@type": "Offer",
        name: "Rayo 24",
        description: "24 dance classes per month (6 per week)",
        price: "99",
        priceCurrency: "EUR",
        url: `${BASE_URL}/en/pricing`,
      },
    ],
  },
});

// ============================================================
// WebSite - Global
// ============================================================
export const getWebSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  name: BUSINESS_NAME,
  url: BASE_URL,
  inLanguage: ["en", "el", "es"],
  publisher: {
    "@id": `${BASE_URL}/#organization`,
  },
});

// ============================================================
// BreadcrumbList - Per page
// ============================================================
export const getBreadcrumbSchema = (
  items: { name: string; url: string }[]
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

// ============================================================
// Course schemas for the classes offered
// ============================================================
export const getCourseSchemas = () => [
  {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Salsa Dance Classes",
    description:
      "Learn Cuban Salsa from beginner to intermediate level. Classes cover technique, timing, partner work, and musicality.",
    provider: {
      "@id": `${BASE_URL}/#organization`,
    },
    url: `${BASE_URL}/en`,
    inLanguage: ["en", "el", "es"],
    hasCourseInstance: [
      {
        "@type": "CourseInstance",
        courseMode: "onsite",
        courseSchedule: {
          "@type": "Schedule",
          repeatFrequency: "P1W",
          byDay: [
            "https://schema.org/Monday",
            "https://schema.org/Tuesday",
            "https://schema.org/Wednesday",
            "https://schema.org/Thursday",
          ],
          startTime: "19:00",
          endTime: "23:00",
        },
        location: {
          "@type": "Place",
          name: BUSINESS_NAME,
          address: {
            "@type": "PostalAddress",
            streetAddress: "Thermopylon 19",
            addressLocality: "Agios Dimitrios",
            addressRegion: "Attica",
            addressCountry: "GR",
          },
        },
        instructor: [
          {
            "@type": "Person",
            name: "Anna Lontou",
            jobTitle: "Lead Instructor",
          },
          {
            "@type": "Person",
            name: "Konstantinos Bitsis",
            jobTitle: "Senior Instructor",
          },
        ],
      },
    ],
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "50",
      highPrice: "99",
      priceCurrency: "EUR",
      offerCount: 3,
      url: `${BASE_URL}/en/pricing`,
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Bachata Dance Classes",
    description:
      "Learn Bachata from beginner to intermediate level. Classes cover technique, partner connection, and musicality.",
    provider: {
      "@id": `${BASE_URL}/#organization`,
    },
    url: `${BASE_URL}/en`,
    inLanguage: ["en", "el", "es"],
    hasCourseInstance: [
      {
        "@type": "CourseInstance",
        courseMode: "onsite",
        courseSchedule: {
          "@type": "Schedule",
          repeatFrequency: "P1W",
          byDay: [
            "https://schema.org/Monday",
            "https://schema.org/Thursday",
          ],
          startTime: "19:00",
          endTime: "21:00",
        },
        location: {
          "@type": "Place",
          name: BUSINESS_NAME,
          address: {
            "@type": "PostalAddress",
            streetAddress: "Thermopylon 19",
            addressLocality: "Agios Dimitrios",
            addressRegion: "Attica",
            addressCountry: "GR",
          },
        },
        instructor: [
          {
            "@type": "Person",
            name: "Anna Lontou",
            jobTitle: "Lead Instructor",
          },
          {
            "@type": "Person",
            name: "Konstantinos Bitsis",
            jobTitle: "Senior Instructor",
          },
        ],
      },
    ],
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "50",
      highPrice: "99",
      priceCurrency: "EUR",
      offerCount: 3,
      url: `${BASE_URL}/en/pricing`,
    },
  },
];

// ============================================================
// Pricing page - Product with Offers
// ============================================================
export const getPricingSchemas = () => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Salsa Rayo Dance Class Packages",
  description:
    "Monthly dance class subscription packages for Salsa, Bachata, Mambo, and Styling classes at Salsa Rayo Dance School in Athens.",
  brand: {
    "@type": "Brand",
    name: BUSINESS_NAME,
  },
  offers: [
    {
      "@type": "Offer",
      name: "Rayo 8",
      description: "8 dance classes per month (2 classes per week)",
      price: "50",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `${BASE_URL}/en/pricing`,
      validFrom: "2025-09-01",
      priceValidUntil: "2026-12-31",
      seller: {
        "@id": `${BASE_URL}/#organization`,
      },
    },
    {
      "@type": "Offer",
      name: "Rayo 16",
      description: "16 dance classes per month (4 classes per week)",
      price: "75",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `${BASE_URL}/en/pricing`,
      validFrom: "2025-09-01",
      priceValidUntil: "2026-12-31",
      seller: {
        "@id": `${BASE_URL}/#organization`,
      },
    },
    {
      "@type": "Offer",
      name: "Rayo 24",
      description: "24 dance classes per month (6 classes per week)",
      price: "99",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `${BASE_URL}/en/pricing`,
      validFrom: "2025-09-01",
      priceValidUntil: "2026-12-31",
      seller: {
        "@id": `${BASE_URL}/#organization`,
      },
    },
  ],
});

// ============================================================
// Article schema for Orishas educational page
// ============================================================
export const getOrishasArticleSchema = (locale: string) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Orishas in Salsa Dance - The Sacred Rhythms of Afro-Cuban Culture",
  description:
    "Explore the sacred Orisha rhythms in Afro-Cuban salsa. Learn about the movements, specialties, and dance characteristics of each deity.",
  url: `${BASE_URL}/${locale}/orishas`,
  inLanguage: locale,
  author: {
    "@id": `${BASE_URL}/#organization`,
  },
  publisher: {
    "@id": `${BASE_URL}/#organization`,
  },
  image: `${BASE_URL}/images/orishas/shango.jpg`,
  datePublished: "2025-09-01",
  dateModified: "2025-09-01",
  mainEntityOfPage: `${BASE_URL}/${locale}/orishas`,
});
