import type { Metadata } from "next";
import "./globals.css";

import { getMessages } from "next-intl/server";
import { SUPPORTED_LOCALES } from "@/i18n/routing";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin", "greek", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

const APPLICATION_NAME = "Salsa Rayo Dance School";
const APPLICATION_DESCRIPTION =
  "Salsa Rayo is a dance school that offers Salsa and Bachata classes for all levels. We are based in Agios Dimitrios, Athens, Greece";

export const metadata: Metadata = {
  metadataBase: new URL("https://salsa-rayo.com"),
  title: APPLICATION_NAME,
  description: APPLICATION_DESCRIPTION,
  applicationName: APPLICATION_NAME,
  robots: "index, follow",
  openGraph: {
    title: APPLICATION_NAME,
    description: APPLICATION_DESCRIPTION,
    images: [
      {
        url: "https://salsa-rayo.com/images/gallery/our-space.jpg",
        width: 1200,
        height: 630,
        alt: "Salsa Rayo Dance Studio - Professional dance floor in Athens",
      },
    ],
    siteName: APPLICATION_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: APPLICATION_NAME,
    description: APPLICATION_DESCRIPTION,
    images: ["https://salsa-rayo.com/images/gallery/our-space.jpg"],
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}>) {
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
        {/* Preload critical images */}
        <link
          rel="preload"
          as="image"
          href="/images/gallery/our-space.jpg"
          media="(min-width: 768px)"
        />
        <link
          rel="preload"
          as="image"
          href="/images/gallery/our-space-vertical.jpg"
          media="(max-width: 767px)"
        />
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
      </body>
    </html>
  );
}
