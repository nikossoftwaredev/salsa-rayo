/* eslint-disable @next/next/no-sync-scripts */
import type { Metadata } from "next";
import "../globals.css";
// import Header from "@/components/layout/Header";
// import Footer from "@/components/Footer";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { SUPPORTED_LOCALES } from "@/i18n/routing";
import { Inter } from "next/font/google";
import Lightning from "@/components/react-bits/Backgrounds/Lightning/Lightning";
import Logo from "@/components/Logo";

const inter = Inter({
  subsets: ["latin", "greek", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

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
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const messages = await getMessages();
  const locale = (await params).locale;

  return (
    <html lang={locale} data-theme="myTheme" className={inter.variable}>
      <head>
        <script data-preload src="https://terminal.jup.ag/main-v1.js"></script>
      </head>
      <body
        className={`${inter.className} text-base-content text-lg w-full min-h-screen flex flex-col`}
      >
        <NextIntlClientProvider
          locale={locale as (typeof SUPPORTED_LOCALES)[number]}
          messages={messages}
        >
          {/* Temporary Coming Soon Page */}
          <div className="fixed inset-0 w-full h-full bg-black overflow-hidden">
            <div className="absolute inset-0 w-full h-full">
              <Lightning hue={280} speed={0.5} intensity={0.8} />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <div className="relative">
                <div className="hidden md:block">
                  <Logo size="xxxl" />
                </div>
                <div className="block md:hidden">
                  <Logo size="xxl" />
                </div>
                <h2 className="absolute bottom-4 md:bottom-6 right-0 text-xs md:text-base font-semibold text-white tracking-widest">
                  Dance School
                </h2>
              </div>
            </div>
            <div className="absolute bottom-12 left-0 right-0 flex justify-center z-10">
              <div className="flex items-end gap-2">
                <h1 className="text-2xl md:text-5xl font-bold tracking-wider bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x">
                  COMING SOON
                </h1>
                <div className="flex gap-1 mb-1 md:mb-2">
                  <span className="w-1.5 md:w-2 h-1.5 md:h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 md:w-2 h-1.5 md:h-2 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 md:w-2 h-1.5 md:h-2 bg-gradient-to-r from-orange-500 to-purple-500 rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
