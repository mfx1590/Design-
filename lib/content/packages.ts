/**
 * Confirmed package facts (PLAN.md §1). GBP "from" prices.
 * Moves into Sanity in Phase 3b; until then this file is the source of truth.
 */
export const packages = [
  { key: "studio", slug: "studio", apartmentType: "studio", priceFromGBP: 10_000, bedrooms: 0 },
  { key: "onePlusOne", slug: "1-plus-1", apartmentType: "1+1", priceFromGBP: 12_000, bedrooms: 1 },
  { key: "twoPlusOne", slug: "2-plus-1", apartmentType: "2+1", priceFromGBP: 14_000, bedrooms: 2 },
] as const;

export type PackageKey = (typeof packages)[number]["key"];
export type PackageSlug = (typeof packages)[number]["slug"];

export function packageBySlug(slug: string) {
  return packages.find((p) => p.slug === slug);
}
