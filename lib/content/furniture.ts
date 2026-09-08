import type { ContentMessages } from "./types";

/**
 * Furniture catalogue (PLAN.md §6). Pieces are the ones visible in the studio project photos,
 * described only by what can be seen. Copy comes from messages under content.furniture.<key>.
 * Prices are on request until the owner supplies them.
 */
export type CategoryKey = "living" | "dining" | "bedroom" | "bathroom" | "outdoor" | "lighting" | "decor";

export interface FurnitureItem {
  slug: string;
  name: string;
  /** One of CategoryKey for static content; any category slug once it comes from Sanity. */
  category: CategoryKey | (string & {});
  materials: string;
  description: string;
  image: { src: string; alt: string };
  /** GBP, or null for price on request. */
  priceGBP: number | null;
  usedIn: string[];
}

const IMG = "/images/projects/project-01-studio";

export const categories: CategoryKey[] = ["living", "dining", "bedroom", "bathroom", "outdoor", "lighting", "decor"];

type FurnitureKey = keyof ContentMessages["furniture"];

export const furnitureMeta: ReadonlyArray<{ key: FurnitureKey; slug: string; category: CategoryKey; image: string; priceGBP: number | null; usedIn: string[] }> = [
  { key: "terracottaBarStool", slug: "terracotta-bar-stool", category: "dining", image: `${IMG}/after-kitchen.jpg`, priceGBP: null, usedIn: ["studio-poolside"] },
  { key: "linenSofa", slug: "linen-sofa", category: "living", image: `${IMG}/after-portrait-wide.jpg`, priceGBP: null, usedIn: ["studio-poolside"] },
  { key: "roundCoffeeTable", slug: "round-coffee-table", category: "living", image: `${IMG}/after-landscape.jpg`, priceGBP: null, usedIn: ["studio-poolside"] },
  { key: "juteRug", slug: "jute-rug", category: "decor", image: `${IMG}/after-landscape-bar.jpg`, priceGBP: null, usedIn: ["studio-poolside"] },
  { key: "upholsteredBed", slug: "upholstered-bed", category: "bedroom", image: `${IMG}/after-portrait-bar-to-bed.jpg`, priceGBP: null, usedIn: ["studio-poolside"] },
  { key: "roundLedMirror", slug: "round-led-mirror", category: "bedroom", image: `${IMG}/after-portrait-wide.jpg`, priceGBP: null, usedIn: ["studio-poolside"] },
  { key: "walnutSlatTvPanel", slug: "walnut-slat-tv-panel", category: "living", image: `${IMG}/after-landscape-bar.jpg`, priceGBP: null, usedIn: ["studio-poolside"] },
  { key: "blackTrackLights", slug: "black-track-lights", category: "lighting", image: `${IMG}/after-kitchen.jpg`, priceGBP: null, usedIn: ["studio-poolside"] },
  { key: "flutedVanity", slug: "fluted-vanity", category: "bathroom", image: `${IMG}/after-bathroom.jpg`, priceGBP: null, usedIn: ["studio-poolside"] },
  { key: "rattanDiningSet", slug: "rattan-dining-set", category: "outdoor", image: `${IMG}/after-terrace.jpg`, priceGBP: null, usedIn: ["studio-poolside"] },
];

export const furnitureSlugs = furnitureMeta.map((m) => m.slug);

export function buildFurniture(content: ContentMessages): FurnitureItem[] {
  return furnitureMeta.map((m) => {
    const c = content.furniture[m.key];
    return {
      slug: m.slug,
      name: c.name,
      category: m.category,
      materials: c.materials,
      description: c.description,
      image: { src: m.image, alt: c.alt },
      priceGBP: m.priceGBP,
      usedIn: [...m.usedIn],
    };
  });
}
