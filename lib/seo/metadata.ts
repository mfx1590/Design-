import type { Metadata } from "next";
import { localeMeta, locales, type Locale } from "@/i18n/locales";
import { getPathname } from "@/i18n/navigation";
import { absoluteUrl } from "./site-url";

type Href = Parameters<typeof getPathname>[0]["href"];

interface PageMetadataInput {
  locale: Locale;
  /** Internal href (pathname key with params for dynamic routes); used for canonical and hreflang. */
  href: Href;
  title: string;
  description?: string;
  /** Site-relative or absolute image for OpenGraph and Twitter; falls back to the locale's generated image. */
  image?: string;
  imageAlt?: string;
  noindex?: boolean;
  type?: "website" | "article";
}

/** Localised path for a locale, always with the locale prefix (routing uses localePrefix "always"). */
export function localizedPath(locale: Locale, href: Href): string {
  return getPathname({ locale, href, forcePrefix: true });
}

/**
 * Metadata builder (PLAN.md §9): canonical, hreflang for the six locales plus x-default (English),
 * OpenGraph and Twitter cards with a real image, and noindex where a page should stay out of search.
 */
export function pageMetadata({ locale, href, title, description, image, imageAlt, noindex, type = "website" }: PageMetadataInput): Metadata {
  const canonical = absoluteUrl(localizedPath(locale, href));
  const languages = Object.fromEntries(locales.map((l) => [localeMeta[l].hreflang, absoluteUrl(localizedPath(l, href))]));
  languages["x-default"] = absoluteUrl(localizedPath("en", href));
  const images = [{ url: absoluteUrl(image ?? `/api/og?locale=${locale}`), alt: imageAlt ?? title }];

  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Design Package",
      locale: localeMeta[locale].intl.replace("-", "_"),
      type,
      images,
    },
    twitter: { card: "summary_large_image", title, description, images: images.map((i) => i.url) },
    robots: noindex ? { index: false, follow: false } : undefined,
  };
}
