import type { ContentMessages } from "./types";

/**
 * Guides (PLAN.md §6, §9). Two grounded articles written only from what the site already states
 * (package contents, the six steps, the rental versions). Copy comes from messages under
 * content.guides.<key>; sections are s1, s2… with a heading and paragraphs p1, p2…
 */
export interface GuideContent {
  slug: string;
  title: string;
  lead: string;
  /** ISO date of the last edit. */
  updated: string;
  cover: { src: string; alt: string };
  sections: Array<{ heading: string; body: string[] }>;
}

const IMG = "/images/projects/project-01-studio";

type GuideKey = keyof ContentMessages["guides"];

export const guideMeta: ReadonlyArray<{ key: GuideKey; slug: string; updated: string; cover: string }> = [
  { key: "furnishingFromAbroad", slug: "furnishing-from-abroad", updated: "2026-09-08", cover: `${IMG}/after-landscape.jpg` },
  { key: "studio1Plus12Plus1WhatIsIncluded", slug: "studio-1-plus-1-2-plus-1-what-is-included", updated: "2026-09-08", cover: `${IMG}/after-landscape-bar.jpg` },
];

export const guideSlugs = guideMeta.map((m) => m.slug);

function sectionsOf(sections: Record<string, Record<string, string>>) {
  return Object.values(sections).map((section) => ({
    heading: section.heading,
    body: Object.entries(section)
      .filter(([k]) => /^p\d+$/.test(k))
      .sort(([a], [b]) => Number(a.slice(1)) - Number(b.slice(1)))
      .map(([, v]) => v),
  }));
}

export function buildGuides(content: ContentMessages): GuideContent[] {
  return guideMeta.map((m) => {
    const c = content.guides[m.key];
    return {
      slug: m.slug,
      title: c.title,
      lead: c.lead,
      updated: m.updated,
      cover: { src: m.cover, alt: c.coverAlt },
      sections: sectionsOf(c.sections),
    };
  });
}
