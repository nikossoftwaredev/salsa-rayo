import { ReactNode } from "react";

export interface BasePageProps {
  params: Promise<{
    locale: string;
    chatId: string;
  }>;
}

export interface BaseLayoutProps extends BasePageProps {
  children?: ReactNode;
}
