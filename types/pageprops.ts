import { Locale } from "next-intl";
import { ReactNode } from "react";

export interface BasePageProps {
  params: Promise<{
    locale: Locale;
    chatId: string;
  }>;
}

export interface BaseLayoutProps extends BasePageProps {
  children?: ReactNode;
}
