"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { SUPPORTED_LOCALES } from "@/i18n/routing";
import { useTransition } from "react";
import { Languages, Check } from "lucide-react";
import Image from "next/image";
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
    flag: "/flags/us.svg",
    nativeName: "English",
    shortCode: "EN"
  },
  el: {
    name: "Ελληνικά",
    flag: "/flags/gr.svg",
    nativeName: "Greek",
    shortCode: "EL"
  },
  es: {
    name: "Español",
    flag: "/flags/es.svg",
    nativeName: "Spanish",
    shortCode: "ES"
  },
};

export { languages };

const useLanguageSwitch = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (newLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale as typeof SUPPORTED_LOCALES[number] });
    });
  };

  return { locale, isPending, handleLanguageChange };
};

export const LanguageSwitcherTabs = () => {
  const { locale, isPending, handleLanguageChange } = useLanguageSwitch();

  return (
    <div className="flex items-center px-2 py-1.5">
      {SUPPORTED_LOCALES.map((lang) => {
        const isActive = locale === lang;
        return (
          <button
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            disabled={isPending}
            className={`flex-1 flex items-center justify-center py-2 cursor-pointer transition-opacity ${
              isActive ? "opacity-100" : "opacity-40 hover:opacity-70"
            } ${isPending ? "pointer-events-none" : ""}`}
          >
            <Image src={languages[lang].flag} alt={languages[lang].name} width={24} height={16} className="rounded-sm" />
          </button>
        );
      })}
    </div>
  );
};

const LanguageSwitcher = () => {
  const { locale, isPending, handleLanguageChange } = useLanguageSwitch();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-primary hover:bg-transparent transition-all duration-300"
          aria-label="Change language"
          disabled={isPending}
        >
          <Languages className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
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
              <Image src={languages[lang].flag} alt={languages[lang].name} width={28} height={19} className="rounded-[3px]" />
              <div className="flex-1">
                <p className="font-semibold">{languages[lang].shortCode}</p>
                <p className="text-xs opacity-70">{languages[lang].name}</p>
              </div>
              {isActive && (
                <Check className="size-5 text-primary" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;