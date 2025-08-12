import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const SUPPORTED_LOCALES = ["en", "el", "es"] as const;

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: SUPPORTED_LOCALES,

  // Used when no locale matches
  defaultLocale: "en",
  
  // Configure locale detection
  localeDetection: true,
  
  // Locale prefix configuration
  localePrefix: "as-needed",
  
  // Disable alternate links in the HTML head
  alternateLinks: false
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
