import type { MetadataRoute } from "next";
import { locales } from "@/i18n/locales";
import { absoluteUrl } from "@/lib/seo/site-url";

/** Allow everything public; keep the Studio, the styleguide and the private inquiry list out of search. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/studio", "/*/dev/", "/api/"] }],
    sitemap: locales.map((locale) => absoluteUrl(`/sitemap/${locale}.xml`)),
  };
}
