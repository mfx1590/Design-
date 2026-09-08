import { defineRouting } from "next-intl/routing";
import { defaultLocale, locales } from "./locales";

/**
 * Locale routing. Every route carries a locale prefix (/en, /pl, ...).
 * Detection (PLAN.md §8): an explicit choice stored in the cookie wins,
 * then Accept-Language, never IP.
 *
 * Slugs are translated per PLAN.md §6. Farsi keeps English slugs so links
 * stay shareable and readable in address bars (an owner decision to revisit).
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
  localeDetection: true,
  localeCookie: { name: "NEXT_LOCALE", maxAge: 60 * 60 * 24 * 365 },
  pathnames: {
    "/": "/",
    "/packages": { en: "/packages", pl: "/pakiety", ru: "/pakety", tr: "/paketler", fa: "/packages", de: "/pakete" },
    "/portfolio": { en: "/portfolio", pl: "/realizacje", ru: "/portfolio", tr: "/projeler", fa: "/portfolio", de: "/projekte" },
    "/services": { en: "/services", pl: "/uslugi", ru: "/uslugi", tr: "/hizmetler", fa: "/services", de: "/leistungen" },
    "/about": { en: "/about", pl: "/o-nas", ru: "/o-nas", tr: "/hakkimizda", fa: "/about", de: "/ueber-uns" },
    "/contact": { en: "/contact", pl: "/kontakt", ru: "/kontakty", tr: "/iletisim", fa: "/contact", de: "/kontakt" },
    "/dev/styleguide": "/dev/styleguide",
  },
});

export type AppPathname = keyof typeof routing.pathnames;
