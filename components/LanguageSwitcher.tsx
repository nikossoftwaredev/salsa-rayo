"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { SUPPORTED_LOCALES } from "@/i18n/routing";
import { useTransition } from "react";
import { MdLanguage, MdCheck } from "react-icons/md";

const languages: Record<typeof SUPPORTED_LOCALES[number], {
  name: string;
  flag: string;
  nativeName: string;
}> = {
  en: {
    name: "English",
    flag: "🇺🇸",
    nativeName: "English"
  },
  el: {
    name: "Ελληνικά",
    flag: "🇬🇷",
    nativeName: "Greek"
  },
  es: {
    name: "Español",
    flag: "🇪🇸",
    nativeName: "Spanish"
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
    <details className={`dropdown ${isMobile ? 'dropdown-right' : 'dropdown-end'}`}>
      <summary 
        tabIndex={0} 
        role="button" 
        className="btn btn-ghost btn-circle text-white hover:bg-white/20 relative group"
        aria-label="Change language"
      >
        <MdLanguage className="h-6 w-6 transition-transform group-hover:scale-110" />
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse"></span>
      </summary>
      <ul 
        tabIndex={0} 
        className="dropdown-content menu bg-base-100/95 backdrop-blur-md rounded-2xl z-[1] w-56 p-1 shadow-2xl border border-primary/20 mt-3"
      >
        <li className="px-3 py-2">
          <span className="text-xs font-medium text-base-content/60 uppercase tracking-wider">Select Language</span>
        </li>
        <div className="divider my-0"></div>
        {SUPPORTED_LOCALES.map((lang) => {
          const isActive = locale === lang;
          return (
            <li key={lang} className="px-1 py-1">
              <button
                onClick={() => handleLanguageChange(lang)}
                className={`flex items-center gap-3 rounded-xl transition-all duration-200 py-3 ${
                  isActive 
                    ? 'bg-primary/20 text-primary hover:bg-primary/30' 
                    : 'hover:bg-base-200'
                } ${isPending ? 'opacity-50 cursor-wait' : ''}`}
                disabled={isPending}
              >
                <span className="text-2xl">{languages[lang].flag}</span>
                <div className="flex-1 text-left">
                  <p className="font-semibold">{languages[lang].name}</p>
                  <p className="text-xs opacity-70">{languages[lang].nativeName}</p>
                </div>
                {isActive && (
                  <MdCheck className="h-5 w-5 text-primary animate-bounce-in" />
                )}
              </button>
            </li>
          );
        })}
      </ul>
      <style jsx>{`
        @keyframes bounce-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-bounce-in {
          animation: bounce-in 0.3s ease-out;
        }
      `}</style>
    </details>
  );
}