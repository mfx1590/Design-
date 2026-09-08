/**
 * Service areas (PLAN.md §6, §9). Four cities from the brief; the owner confirms the final list.
 * Names come from messages under areas.* so they localise (Kyrenia / Girne, etc.).
 */
export const areas = [
  { slug: "kyrenia", key: "kyrenia" },
  { slug: "iskele", key: "iskele" },
  { slug: "famagusta", key: "famagusta" },
  { slug: "nicosia", key: "nicosia" },
] as const;

export type AreaKey = (typeof areas)[number]["key"];

export function areaBySlug(slug: string) {
  return areas.find((a) => a.slug === slug);
}
