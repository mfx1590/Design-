import type { Locale } from "@/i18n/locales";
import { breadcrumbs } from "./jsonld";
import { localizedPath } from "./metadata";

type Href = Parameters<typeof localizedPath>[1];

/** BreadcrumbList for a page: Home, then the given trail, with localised URLs. */
export function breadcrumbsFor(locale: Locale, home: string, trail: Array<{ name: string; href: Href }>) {
  return breadcrumbs([{ name: home, url: localizedPath(locale, "/") }, ...trail.map((item) => ({ name: item.name, url: localizedPath(locale, item.href) }))]);
}
