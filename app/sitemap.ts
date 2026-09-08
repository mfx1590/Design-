import type { MetadataRoute } from "next";
import { localeMeta, locales, type Locale } from "@/i18n/locales";
import { getFurniture, getGuides, getProjects } from "@/lib/cms/loaders";
import { areas } from "@/lib/content/areas";
import { packages } from "@/lib/content/packages";
import { serviceSlugs } from "@/lib/content/services";
import { localizedPath } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/seo/site-url";

type Href = Parameters<typeof localizedPath>[1];

/** One sitemap per locale (PLAN.md §9), each URL carrying hreflang alternates for the other five. */
export async function generateSitemaps() {
  return locales.map((id) => ({ id }));
}

export default async function sitemap(props: { id: Promise<string> }): Promise<MetadataRoute.Sitemap> {
  const id = await props.id;
  const locale = (locales as readonly string[]).includes(id) ? (id as Locale) : "en";
  const [projects, furniture, guides] = await Promise.all([getProjects(locale), getFurniture(locale), getGuides(locale)]);

  const entries: Array<{ href: Href; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
    { href: "/", priority: 1, changeFrequency: "weekly" },
    { href: "/packages", priority: 0.9, changeFrequency: "monthly" },
    ...packages.map((p) => ({ href: { pathname: "/packages/[slug]", params: { slug: p.slug } } as Href, priority: 0.9, changeFrequency: "monthly" as const })),
    { href: "/services", priority: 0.8, changeFrequency: "monthly" },
    ...serviceSlugs.map((slug) => ({ href: { pathname: "/services/[slug]", params: { slug } } as Href, priority: 0.8, changeFrequency: "monthly" as const })),
    { href: "/portfolio", priority: 0.8, changeFrequency: "weekly" },
    ...projects.map((p) => ({ href: { pathname: "/portfolio/[slug]", params: { slug: p.slug } } as Href, priority: 0.7, changeFrequency: "monthly" as const })),
    { href: "/furniture", priority: 0.7, changeFrequency: "weekly" },
    ...furniture.map((f) => ({ href: { pathname: "/furniture/[slug]", params: { slug: f.slug } } as Href, priority: 0.5, changeFrequency: "monthly" as const })),
    { href: "/guides", priority: 0.6, changeFrequency: "monthly" },
    ...guides.map((g) => ({ href: { pathname: "/guides/[slug]", params: { slug: g.slug } } as Href, priority: 0.6, changeFrequency: "monthly" as const })),
    ...areas.map((a) => ({ href: { pathname: "/areas/[city]", params: { city: a.slug } } as Href, priority: 0.7, changeFrequency: "monthly" as const })),
    { href: "/process", priority: 0.6, changeFrequency: "yearly" },
    { href: "/about", priority: 0.5, changeFrequency: "yearly" },
    { href: "/contact", priority: 0.7, changeFrequency: "yearly" },
    { href: "/reviews", priority: 0.4, changeFrequency: "monthly" },
  ];

  const lastModified = new Date();
  return entries.map((entry) => ({
    url: absoluteUrl(localizedPath(locale, entry.href)),
    lastModified,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [localeMeta[l].hreflang, absoluteUrl(localizedPath(l, entry.href))])),
    },
  }));
}
