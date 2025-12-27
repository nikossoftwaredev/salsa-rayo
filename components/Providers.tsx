"use client";

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";
import type { SUPPORTED_LOCALES } from "@/i18n/routing";
import Header from "@/components/layout/Header";
import Footer from "@/components/Footer";

interface ProvidersProps {
  children: React.ReactNode;
  session: Session | null;
  messages: any;
  locale: (typeof SUPPORTED_LOCALES)[number];
}

export function Providers({ children, session, messages, locale }: ProvidersProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <SessionProvider session={session}>
        <Header />
        <main className="flex-1 overflow-y-auto">
          {children}
          <Footer />
        </main>
      </SessionProvider>
    </NextIntlClientProvider>
  );
}