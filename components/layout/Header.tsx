"use client";

import { headerLinks } from "@/data/config";
import Logo from "../Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AuthButton } from "@/components/AuthButton";

const Header = () => {
  const locale = useLocale();

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      <nav className="h-[60px] w-full bg-background/40 backdrop-blur-xl border-b border-border/10 shadow-lg shadow-background/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-full">
          {/* Logo */}
          <Logo size="sm" />

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-8">
              {headerLinks.map((linkConfig) => (
                <li key={linkConfig.path}>
                  <Link
                    href={linkConfig.path}
                    className="font-bold text-lg text-foreground hover:text-primary relative group transition-colors duration-200 cursor-pointer"
                  >
                    {linkConfig.text[locale as "en" | "el" | "es"] ||
                      linkConfig.text.en}
                    <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
            <LanguageSwitcher />
            <AuthButton />
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <AuthButton showNavRoutes />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
