/* eslint-disable @next/next/no-sync-scripts */
import type { Metadata } from "next";
import "../globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/Footer";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { SUPPORTED_LOCALES } from "@/i18n/routing";

const APPLICATION_NAME = "Salsa Rayo Dance School";
const APPLICATION_DESCRIPTION =
  "Salsa Rayo Dance School is a dance school that offers dance classes in Salsa, Bachata, Kizomba, and more. We are based in the Netherlands and offer classes in Amsterdam, Utrecht, and Rotterdam.";

export const metadata: Metadata = {
  metadataBase: new URL("https://salsa-rayo.com"),
  title: APPLICATION_NAME,
  description: APPLICATION_DESCRIPTION,
  applicationName: APPLICATION_NAME,
  robots: "index, follow",
  openGraph: {
    title: APPLICATION_NAME,
    description: APPLICATION_DESCRIPTION,
    images: "https:/salsa-rayo/images/logo.png",
  },
  twitter: {
    title: APPLICATION_NAME,
    description: APPLICATION_DESCRIPTION,
    images: "https:/salsa-rayo/images/logo.png",
  },
};

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = await getMessages();

  return (
    <html lang={locale} data-theme="myTheme">
      <head>
        <script data-preload src="https://terminal.jup.ag/main-v1.js"></script>
      </head>
      <body className="text-base-content text-lg font-custom w-full min-h-screen flex flex-col">
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
