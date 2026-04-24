import type { Metadata } from "next";
import "./globals.css";

import { getMessages } from "next-intl/server";
import { SUPPORTED_LOCALES } from "@/i18n/routing";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Providers } from "@/components/Providers";
import { Analytics } from "@vercel/analytics/next";
import { BasePageProps } from "@/types/pageprops";

const inter = Inter({
  subsets: ["latin", "greek", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

const BASE_URL = "https://www.salsarayo.com";
const APPLICATION_NAME = "Salsa Rayo Dance School";

const TITLES: Record<string, string> = {
  en: "Salsa & Bachata Classes in Athens | Salsa Rayo Dance School",
  el: "Μαθήματα Salsa & Bachata στην Αθήνα | Salsa Rayo",
  es: "Clases de Salsa y Bachata en Atenas | Salsa Rayo",
};

const DESCRIPTIONS: Record<string, string> = {
  en: "Learn Salsa and Bachata in Athens with Salsa Rayo. New York Style Salsa (On2) classes in Agios Dimitrios for all levels. Packages from €50/month.",
  el: "Μάθετε Salsa και Bachata στον Άγιο Δημήτριο Αθηνών με τη Salsa Rayo. New York Style Salsa (On2) για όλα τα επίπεδα. Πακέτα από €50/μήνα.",
  es: "Aprende Salsa y Bachata en Atenas con Salsa Rayo. Salsa Estilo Nueva York (On2) en Agios Dimitrios para todos los niveles. Paquetes desde €50/mes.",
};

const KEYWORDS: Record<string, string[]> = {
  en: [
    "salsa classes Athens",
    "bachata classes Athens",
    "salsa lessons Athens Greece",
    "New York Style Salsa On2",
    "dance school Agios Dimitrios",
    "Salsa Rayo",
    "Latin dance Athens",
    "beginner salsa Athens",
  ],
  el: [
    "μαθήματα salsa Αθήνα",
    "μαθήματα bachata Αθήνα",
    "σχολή χορού Άγιος Δημήτριος",
    "New York Style Salsa On2",
    "Salsa Rayo",
    "λατινικοί χοροί Αθήνα",
    "salsa για αρχάριους",
  ],
  es: [
    "clases de salsa Atenas",
    "clases de bachata Atenas",
    "escuela de baile Atenas",
    "Salsa Estilo Nueva York On2",
    "Salsa Rayo",
    "baile latino Atenas",
    "salsa principiantes Atenas",
  ],
};

const OG_LOCALES: Record<string, string> = {
  en: "en_US",
  el: "el_GR",
  es: "es_ES",
};

export const generateMetadata = async ({
  params,
}: BasePageProps): Promise<Metadata> => {
  const locale = (await params).locale;
  const title = TITLES[locale] || TITLES.en;
  const description = DESCRIPTIONS[locale] || DESCRIPTIONS.en;
  const keywords = KEYWORDS[locale] || KEYWORDS.en;
  const ogLocale = OG_LOCALES[locale] || OG_LOCALES.en;

  return {
    metadataBase: new URL(BASE_URL),
    title,
    description,
    keywords,
    applicationName: APPLICATION_NAME,
    authors: [{ name: APPLICATION_NAME, url: BASE_URL }],
    creator: APPLICATION_NAME,
    publisher: APPLICATION_NAME,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        en: `${BASE_URL}/en`,
        el: `${BASE_URL}/el`,
        es: `${BASE_URL}/es`,
        "x-default": `${BASE_URL}/en`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}`,
      images: [
        {
          url: `${BASE_URL}/images/gallery/our-space.jpg`,
          width: 1200,
          height: 630,
          alt: "Salsa Rayo Dance Studio - Professional dance floor in Athens",
        },
      ],
      siteName: APPLICATION_NAME,
      locale: ogLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${BASE_URL}/images/gallery/our-space.jpg`],
    },
  };
};

const RootLayout = async ({
  children,
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}>) => {
  const messages = await getMessages();
  const locale = (await params).locale;
  const session = await getServerSession(authOptions);

  return (
    <html
      lang={locale}
      data-theme="myTheme"
      className={`${inter.variable} scroll-smooth dark`}
    >
      <head>
        <meta
          name="facebook-domain-verification"
          content="p7lcpq9nkt4pup3w2e9piy3e2lsak2"
        />
        {/* Hero image preloads — only 2 (responsive: desktop + mobile) */}
        <script
          defer
          dangerouslySetInnerHTML={{
            __html: `
              // Load Facebook Pixel only after user interaction to prevent bfcache issues
              let fbPixelLoaded = false;
              function loadFbPixel() {
                if (fbPixelLoaded) return;
                fbPixelLoaded = true;
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '4196861283929685');
                fbq('track', 'PageView');
              }
              // Load on first interaction
              ['scroll', 'click', 'touchstart'].forEach(event => {
                window.addEventListener(event, loadFbPixel, { once: true, passive: true });
              });
              // Or after 3 seconds
              setTimeout(loadFbPixel, 3000);
            `,
          }}
        />
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=4196861283929685&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body
        className={`${inter.className} text-foreground text-lg w-full min-h-screen flex flex-col`}
      >
        <Providers
          locale={locale as (typeof SUPPORTED_LOCALES)[number]}
          messages={messages}
          session={session}
        >
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}

export default RootLayout
