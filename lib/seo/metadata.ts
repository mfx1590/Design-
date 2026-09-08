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
/** Search snippets are cut around 155-160 characters; clip at a word boundary so the visible text is a full phrase. */
function clip(text: string | undefined, max: number) {
  if (!text || text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), max - 40)).replace(/[,;:.\s]+$/, "")}…`;
}

export function pageMetadata({ locale, href, title: rawTitle, description: rawDescription, image, imageAlt, noindex, type = "website" }: PageMetadataInput): Metadata {
  // Long titles lose the brand suffix rather than the page name.
  const title = rawTitle.length > 70 ? rawTitle.replace(/\s+—\s+\u2066?Design Package\u2069?$/, "") : rawTitle;
  const description = clip(rawDescription, 160);
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
