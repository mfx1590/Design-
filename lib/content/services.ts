import type { ContentMessages } from "./types";

/**
 * Service pages (PLAN.md §6). Copy comes from messages under content.services.<key>; nothing about
 * pricing, timelines or team is claimed beyond what the owner confirmed. Moves into Sanity later.
 */
export type ServiceKey = "staging" | "rental" | "custom";

export interface ServiceContent {
  key: ServiceKey;
  slug: string;
  title: string;
  /** Two or three sentences that answer the question the page exists for. */
  lead: string;
  audience: string;
  steps: Array<{ title: string; body: string }>;
  pricing: string;
  pricingNote?: string;
  faqs: Array<{ q: string; a: string }>;
  photos: Array<{ src: string; alt: string }>;
  prefill: string;
}

const IMG = "/images/projects/project-01-studio";

export const serviceMeta: ReadonlyArray<{ key: ServiceKey; slug: string; photos: [string, string] }> = [
  { key: "staging", slug: "home-staging", photos: [`${IMG}/after-landscape.jpg`, `${IMG}/after-portrait-wide.jpg`] },
  { key: "rental", slug: "rental-furnishing", photos: [`${IMG}/after-kitchen.jpg`, `${IMG}/after-bathroom.jpg`] },
  { key: "custom", slug: "custom-projects", photos: [`${IMG}/after-terrace.jpg`, `${IMG}/after-landscape-bar.jpg`] },
];

export const serviceSlugs = serviceMeta.map((m) => m.slug);

export function buildServices(content: ContentMessages): ServiceContent[] {
  return serviceMeta.map((m) => {
    const c = content.services[m.key];
    return {
      key: m.key,
      slug: m.slug,
      title: c.title,
      lead: c.lead,
      audience: c.audience,
      steps: ([1, 2, 3, 4] as const).map((n) => ({ title: c.steps[`s${n}Title`], body: c.steps[`s${n}Body`] })),
      pricing: c.pricing,
      pricingNote: "pricingNote" in c ? c.pricingNote : undefined,
      faqs: ([1, 2] as const).map((n) => ({ q: c.faqs[`q${n}`], a: c.faqs[`a${n}`] })),
      photos: [
        { src: m.photos[0], alt: c.photos.p1Alt },
        { src: m.photos[1], alt: c.photos.p2Alt },
      ],
      prefill: c.prefill,
    };
  });
}
