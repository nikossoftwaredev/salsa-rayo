"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { SUPPORTED_LOCALES } from "@/i18n/routing";
import { useTransition } from "react";
import { MdLanguage, MdCheck } from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const languages: Record<typeof SUPPORTED_LOCALES[number], {
  name: string;
  flag: string;
  nativeName: string;
  shortCode: string;
}> = {
  en: {
    name: "English",
    flag: "🇺🇸",
    nativeName: "English",
    shortCode: "EN"
  },
  el: {
    name: "Ελληνικά",
    flag: "🇬🇷",
    nativeName: "Greek",
    shortCode: "EL"
  },
  es: {
    name: "Español",
    flag: "🇪🇸",
    nativeName: "Spanish",
    shortCode: "ES"
  },
};

interface LanguageSwitcherProps {
  isMobile?: boolean;
}

export default function LanguageSwitcher({ isMobile = false }: LanguageSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (newLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale as typeof SUPPORTED_LOCALES[number] });
    });
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative w-10 h-10 rounded-full text-foreground hover:bg-foreground/20"
          aria-label="Change language"
          disabled={isPending}
        >
          <MdLanguage className="h-6 w-6 transition-transform group-hover:scale-110" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={isMobile ? "start" : "end"}
        className="w-56 bg-background/95 backdrop-blur-md border-primary/20"
      >
        <DropdownMenuLabel className="text-xs font-medium text-foreground/60 uppercase tracking-wider">
          Select Language
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-border to-transparent" />
        {SUPPORTED_LOCALES.map((lang) => {
          const isActive = locale === lang;
          return (
            <DropdownMenuItem
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={`flex items-center gap-3 cursor-pointer ${
                isActive ? 'bg-primary/20 text-primary' : ''
              } ${isPending ? 'opacity-50' : ''}`}
              disabled={isPending}
            >
              <span className="text-2xl">{languages[lang].flag}</span>
              <div className="flex-1">
                <p className="font-semibold">{languages[lang].shortCode}</p>
                <p className="text-xs opacity-70">{languages[lang].name}</p>
              </div>
              {isActive && (
                <MdCheck className="h-5 w-5 text-primary" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}