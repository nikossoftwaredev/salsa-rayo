"use client";

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { SUPPORTED_LOCALES } from "@/i18n/routing";

interface ProvidersProps {
  children: React.ReactNode;
  session: Session | null;
  messages: Record<string, unknown>;
  locale: (typeof SUPPORTED_LOCALES)[number];
}

export const Providers = ({ children, session, messages, locale }: ProvidersProps) => {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <SessionProvider session={session}>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </SessionProvider>
    </NextIntlClientProvider>
  );
};
