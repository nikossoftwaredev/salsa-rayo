"use client";

import { useState } from "react";
import { headerLinks } from "@/data/config";
import Logo from "../Logo";
import SocialsSection from "@/components/sections/socials/SocialsSection";
import { MdMenu } from "react-icons/md";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Header = () => {
  const t = useTranslations('Common');
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      <nav className="h-[60px] w-full bg-black/30 backdrop-blur-md border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-full">
          {/* Logo */}
          <Logo size="md" />

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-8">
              {headerLinks.map((linkConfig) => (
                <li key={linkConfig.path}>
                  <Link
                    href={linkConfig.path}
                    className="font-bold text-lg text-white hover:text-primary relative group transition-colors duration-200 cursor-pointer"
                  >
                    {linkConfig.text[locale as 'en' | 'el' | 'es'] || linkConfig.text.en}
                    <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                className="flex items-center justify-center w-10 h-10 rounded-full md:hidden text-white hover:bg-white/20 transition-colors duration-200"
                aria-label={t('openMenu')}
              >
                <MdMenu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full bg-background border-l border-white/20">
              {/* Language Switcher */}
              <div className="flex justify-start items-center mb-12">
                <LanguageSwitcher isMobile />
              </div>

              {/* Links & socials */}
              <div className="flex flex-col items-center space-y-8">
                <nav className="flex flex-col items-center space-y-6">
                  {headerLinks.map((link) => (
                    <Link
                      key={link.path}
                      href={link.path}
                      onClick={() => setOpen(false)}
                      className="text-2xl font-bold text-primary hover:text-accent transition-colors duration-300"
                    >
                      {link.text[locale as 'en' | 'el' | 'es'] || link.text.en}
                    </Link>
                  ))}
                </nav>

                {/* Social icons */}
                <SocialsSection isMobile />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};

export default Header;
