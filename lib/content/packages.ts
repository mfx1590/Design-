/**
 * Confirmed package facts (PLAN.md section 1). GBP "from" prices.
 * Moves into Sanity in Phase 3; until then this file is the source of truth.
 */
export const packages = [
  { key: "studio", apartmentType: "studio", priceFromGBP: 10_000 },
  { key: "onePlusOne", apartmentType: "1+1", priceFromGBP: 12_000 },
  { key: "twoPlusOne", apartmentType: "2+1", priceFromGBP: 14_000 },
] as const;

export type PackageKey = (typeof packages)[number]["key"];
