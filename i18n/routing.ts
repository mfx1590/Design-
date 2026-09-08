import { defineRouting } from "next-intl/routing";
import { defaultLocale, locales } from "./locales";

/**
 * Locale routing. Every route carries a locale prefix (/en, /pl, ...).
 * Detection (PLAN.md §8): an explicit choice stored in the cookie wins,
 * then Accept-Language, never IP.
 *
 * Page slugs are translated per PLAN.md §6. Farsi keeps English slugs so links stay
 * shareable in address bars. Item slugs inside [slug] / [city] stay English everywhere.
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
    "/packages/[slug]": {
      en: "/packages/[slug]",
      pl: "/pakiety/[slug]",
      ru: "/pakety/[slug]",
      tr: "/paketler/[slug]",
      fa: "/packages/[slug]",
      de: "/pakete/[slug]",
    },
    "/services": { en: "/services", pl: "/uslugi", ru: "/uslugi", tr: "/hizmetler", fa: "/services", de: "/leistungen" },
    "/services/[slug]": {
      en: "/services/[slug]",
      pl: "/uslugi/[slug]",
      ru: "/uslugi/[slug]",
      tr: "/hizmetler/[slug]",
      fa: "/services/[slug]",
      de: "/leistungen/[slug]",
    },
    "/portfolio": { en: "/portfolio", pl: "/realizacje", ru: "/portfolio", tr: "/projeler", fa: "/portfolio", de: "/projekte" },
    "/portfolio/[slug]": {
      en: "/portfolio/[slug]",
      pl: "/realizacje/[slug]",
      ru: "/portfolio/[slug]",
      tr: "/projeler/[slug]",
      fa: "/portfolio/[slug]",
      de: "/projekte/[slug]",
    },
    "/furniture": { en: "/furniture", pl: "/meble", ru: "/mebel", tr: "/mobilya", fa: "/furniture", de: "/moebel" },
    "/furniture/[slug]": {
      en: "/furniture/[slug]",
      pl: "/meble/[slug]",
      ru: "/mebel/[slug]",
      tr: "/mobilya/[slug]",
      fa: "/furniture/[slug]",
      de: "/moebel/[slug]",
    },
    "/inquiry": { en: "/inquiry", pl: "/zapytanie", ru: "/zapros", tr: "/talep", fa: "/inquiry", de: "/anfrage" },
    "/process": { en: "/process", pl: "/proces", ru: "/process", tr: "/surec", fa: "/process", de: "/ablauf" },
    "/reviews": { en: "/reviews", pl: "/opinie", ru: "/otzyvy", tr: "/yorumlar", fa: "/reviews", de: "/bewertungen" },
    "/about": { en: "/about", pl: "/o-nas", ru: "/o-nas", tr: "/hakkimizda", fa: "/about", de: "/ueber-uns" },
    "/contact": { en: "/contact", pl: "/kontakt", ru: "/kontakty", tr: "/iletisim", fa: "/contact", de: "/kontakt" },
    "/guides": { en: "/guides", pl: "/poradniki", ru: "/gidy", tr: "/rehberler", fa: "/guides", de: "/ratgeber" },
    "/guides/[slug]": {
      en: "/guides/[slug]",
      pl: "/poradniki/[slug]",
      ru: "/gidy/[slug]",
      tr: "/rehberler/[slug]",
      fa: "/guides/[slug]",
      de: "/ratgeber/[slug]",
    },
    "/areas/[city]": {
      en: "/areas/[city]",
      pl: "/lokalizacje/[city]",
      ru: "/goroda/[city]",
      tr: "/bolgeler/[city]",
      fa: "/areas/[city]",
      de: "/orte/[city]",
    },
    "/privacy": { en: "/privacy", pl: "/prywatnosc", ru: "/konfidencialnost", tr: "/gizlilik", fa: "/privacy", de: "/datenschutz" },
    "/cookies": { en: "/cookies", pl: "/cookies", ru: "/cookies", tr: "/cerezler", fa: "/cookies", de: "/cookies" },
    "/terms": { en: "/terms", pl: "/regulamin", ru: "/usloviya", tr: "/kosullar", fa: "/terms", de: "/agb" },
    "/dev/styleguide": "/dev/styleguide",
  },
});

export type AppPathname = keyof typeof routing.pathnames;
/** Pathnames without dynamic segments, usable as plain string hrefs. */
export type StaticPathname = Exclude<AppPathname, `${string}[${string}`>;
