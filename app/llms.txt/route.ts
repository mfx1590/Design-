import en from "@/messages/en.json";
import { areas } from "@/lib/content/areas";
import { packages } from "@/lib/content/packages";
import { serviceMeta } from "@/lib/content/services";
import { formatGBP } from "@/lib/format/price";
import { localizedPath } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/seo/site-url";
import { whatsappDisplay } from "@/lib/site";

export const dynamic = "force-static";

/** /llms.txt (PLAN.md §9, GEO): the business in plain sentences with canonical English links. */
export function GET() {
  const url = (href: Parameters<typeof localizedPath>[1]) => absoluteUrl(localizedPath("en", href));
  const cities = areas.map((a) => en.areas[a.key]).join(", ");
  const lines = [
    "# Design Package",
    "",
    `> ${en.meta.description}`,
    "",
    "Design Package is an interior design and furniture company in Northern Cyprus. It furnishes apartments as complete packages (every room, delivered and installed) for buyers who live in Cyprus or abroad, and also offers home staging, rental furnishing and custom projects.",
    `Contact: WhatsApp ${whatsappDisplay}. Service in six languages: English, Polish, Russian, Turkish, Persian, German.`,
    `Service areas: ${cities}.`,
    "",
    "## Packages (prices in GBP, starting prices)",
    ...packages.map((p) => `- ${en.packages[p.key]}: from ${formatGBP(p.priceFromGBP, "en")}. ${url({ pathname: "/packages/[slug]", params: { slug: p.slug } })}`),
    `- Compare packages: ${url("/packages")}`,
    "",
    "## Services",
    ...serviceMeta.map((s) => `- ${en.content.services[s.key].title}: ${en.content.services[s.key].lead} ${url({ pathname: "/services/[slug]", params: { slug: s.slug } })}`),
    "",
    "## How it works",
    ...([1, 2, 3, 4, 5, 6] as const).map((n) => `${n}. ${en.steps[`s${n}Title`]}: ${en.steps[`s${n}Body`]}`),
    `More: ${url("/process")}`,
    "",
    "## Pages",
    `- Portfolio (before and after): ${url("/portfolio")}`,
    `- Furniture catalogue: ${url("/furniture")}`,
    `- Guides: ${url("/guides")}`,
    ...areas.map((a) => `- ${en.areas[a.key]}: ${url({ pathname: "/areas/[city]", params: { city: a.slug } })}`),
    `- Contact: ${url("/contact")}`,
    "",
    "## Questions",
    ...([1, 2, 3, 4] as const).map((n) => `- ${en.faq[`q${n}`]} ${en.faq[`a${n}`]}`),
    "",
    `Other languages: ${["pl", "ru", "tr", "fa", "de"].map((l) => absoluteUrl(`/${l}`)).join(", ")}`,
  ];
  return new Response(lines.join("\n") + "\n", { headers: { "content-type": "text/plain; charset=utf-8" } });
}
