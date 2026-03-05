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

export { languages };

export const LanguageSwitcherTabs = () => {
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
    <div className="flex items-center gap-1 px-2 py-1.5">
      {SUPPORTED_LOCALES.map((lang) => {
        const isActive = locale === lang;
        return (
          <button
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            disabled={isPending}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              isActive
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            } ${isPending ? "opacity-50" : ""}`}
          >
            <span>{languages[lang].shortCode}</span>
          </button>
        );
      })}
    </div>
  );
};

const LanguageSwitcher = ({ isMobile = false }: LanguageSwitcherProps) => {
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
          className="relative size-12 p-0 rounded-full text-foreground hover:text-primary hover:bg-transparent group"
          aria-label="Change language"
          disabled={isPending}
        >
          <MdLanguage size={24} className="transition-transform group-hover:scale-110" />
          <span className="absolute -top-1 -right-1 size-2 bg-primary rounded-full animate-pulse" />
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
                <MdCheck size={20} className="text-primary" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;