import type { Metadata } from "next";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { SUPPORTED_LOCALES } from "@/i18n/routing";
import { Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/Footer";

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

  return (
    <html lang={locale} data-theme="myTheme" className={`${inter.variable} scroll-smooth`}>
      <body
        className={`${inter.className} text-base-content text-lg w-full min-h-screen flex flex-col`}
      >
        <NextIntlClientProvider
          locale={locale as (typeof SUPPORTED_LOCALES)[number]}
          messages={messages}
        >
          <Header />
          <main className="flex-1 overflow-y-auto">
            {children}
            <Footer />
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
