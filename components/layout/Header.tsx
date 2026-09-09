"use client";

import { useEffect, useState } from "react";
import { headerLinks } from "@/data/config";
import Logo from "../Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { Link, usePathname } from "@/i18n/navigation";
import { AuthButton } from "@/components/AuthButton";
import { cn } from "@/lib/utils";

// Past this scroll offset the bar tightens and the glass turns more opaque, so
// it stays readable once it sits over page content instead of the hero.
const CONDENSE_AFTER_PX = 24;

const Header = () => {
  const locale = useLocale();
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isCondensed, setIsCondensed] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsCondensed(window.scrollY > CONDENSE_AFTER_PX);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-4 sm:pt-4">
      <nav
        className={cn(
          "relative mx-auto max-w-7xl rounded-2xl px-3 sm:px-4",
          "border border-white/10 backdrop-blur-xl",
          // Without backdrop-filter the bar would be near-transparent, so fall
          // back to a solid-enough background to keep the links legible.
          "bg-background/85 supports-[backdrop-filter]:bg-background/50",
          "transition-[background-color,box-shadow,height] duration-300 ease-out motion-reduce:transition-none",
          isCondensed
            ? "h-14 shadow-lg shadow-background/50 supports-[backdrop-filter]:bg-background/70"
            : "h-16 shadow-md shadow-background/20"
        )}
      >
        {/* Light catching the top edge - the detail that reads as glass
            rather than as a flat translucent panel. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
        />

        {/* Equal 1fr side columns keep the nav optically centred on the page
            no matter how wide the logo or the auth controls get. */}
        <div className="grid h-full grid-cols-[1fr_auto_1fr] items-center gap-2">
          <div className="justify-self-start">
            <Logo size="sm" />
          </div>

          {/* Desktop nav - 8 links need real room, so it waits for lg */}
          <ul className="hidden items-center gap-0.5 justify-self-center lg:flex">
            {headerLinks.map((linkConfig) => {
              const isHash = linkConfig.path.startsWith("/#");
              const isActive =
                !isHash &&
                (pathname === linkConfig.path ||
                  pathname.startsWith(linkConfig.path + "/"));

              return (
                <li key={linkConfig.path}>
                  <Link
                    href={linkConfig.path}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "group relative flex items-center rounded-full px-3 py-2",
                      "text-sm font-medium tracking-wide cursor-pointer",
                      "transition-colors duration-200 motion-reduce:transition-none",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
                      isActive
                        ? "text-foreground"
                        : "text-foreground/70 hover:text-foreground"
                    )}
                  >
                    {/* Hover capsule fades in behind the label. Absolutely
                        positioned so it can never shift the row's layout. */}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute inset-0 rounded-full opacity-0 transition-opacity duration-200",
                        "bg-gradient-to-b from-white/10 to-white/[0.03]",
                        "ring-1 ring-inset ring-white/10",
                        "group-hover:opacity-100 motion-reduce:transition-none",
                        isActive && "hidden"
                      )}
                    />

                    {/* Active pill: brand gradient plus a ring, so the current
                        page reads as a different shape, not just a colour. */}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute inset-0 rounded-full transition-opacity duration-300",
                        "bg-gradient-to-r from-primary/25 to-brand-pink/25",
                        "ring-1 ring-inset ring-primary/40",
                        isActive ? "opacity-100" : "opacity-0"
                      )}
                    />

                    <span className="relative">
                      {linkConfig.text[locale as "en" | "el" | "es"] ||
                        linkConfig.text.en}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="col-start-3 flex items-center gap-1 justify-self-end">
            <div className="hidden items-center gap-1 lg:flex">
              {!session && <LanguageSwitcher />}
              <AuthButton />
            </div>
            <div className="lg:hidden">
              <AuthButton showNavRoutes />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
