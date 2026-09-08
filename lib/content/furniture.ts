/**
 * Furniture catalogue (PLAN.md §6). Pieces are the ones visible in the studio project photos,
 * described only by what can be seen. Prices are on request until the owner supplies them.
 */
export type CategoryKey = "living" | "dining" | "bedroom" | "bathroom" | "outdoor" | "lighting" | "decor";

export interface FurnitureItem {
  slug: string;
  name: string;
  category: CategoryKey;
  materials: string;
  description: string;
  image: { src: string; alt: string };
  /** GBP, or null for price on request. */
  priceGBP: number | null;
  usedIn: string[];
}

const IMG = "/images/projects/project-01-studio";

export const categories: CategoryKey[] = ["living", "dining", "bedroom", "bathroom", "outdoor", "lighting", "decor"];

export const furniture: FurnitureItem[] = [
  {
    slug: "terracotta-bar-stool",
    name: "Bar stool, terracotta",
    category: "dining",
    materials: "Velvet-look upholstery, black steel frame",
    description: "Curved back, low profile, set against the white quartz bar in the studio project.",
    image: { src: `${IMG}/after-kitchen.jpg`, alt: "Terracotta bar stools at a white quartz breakfast bar" },
    priceGBP: null,
    usedIn: ["studio-poolside"],
  },
  {
    slug: "linen-sofa",
    name: "Three-seat sofa, linen",
    category: "living",
    materials: "Linen-look fabric, black metal legs",
    description: "Loose cushions in the same fabric, with terracotta accent cushions in the studio project.",
    image: { src: `${IMG}/after-portrait-wide.jpg`, alt: "Beige linen sofa with terracotta cushions" },
    priceGBP: null,
    usedIn: ["studio-poolside"],
  },
  {
    slug: "round-coffee-table",
    name: "Round coffee table, wood",
    category: "living",
    materials: "Light wood top and base",
    description: "Small footprint for studios, placed on a jute rug in the studio project.",
    image: { src: `${IMG}/after-landscape.jpg`, alt: "Round wooden coffee table on a jute rug" },
    priceGBP: null,
    usedIn: ["studio-poolside"],
  },
  {
    slug: "jute-rug",
    name: "Jute rug",
    category: "decor",
    materials: "Woven natural fibre",
    description: "Anchors the seating area and hides the glossy floor's reflections.",
    image: { src: `${IMG}/after-landscape-bar.jpg`, alt: "Jute rug under the sofa and coffee table" },
    priceGBP: null,
    usedIn: ["studio-poolside"],
  },
  {
    slug: "upholstered-bed",
    name: "Upholstered bed",
    category: "bedroom",
    materials: "Fabric headboard, black metal legs",
    description: "Dressed with a rust throw and folded towels in the studio project.",
    image: { src: `${IMG}/after-portrait-bar-to-bed.jpg`, alt: "Upholstered bed with a rust throw" },
    priceGBP: null,
    usedIn: ["studio-poolside"],
  },
  {
    slug: "round-led-mirror",
    name: "Round LED mirror with dressing table",
    category: "bedroom",
    materials: "Backlit mirror, wall-mounted desk, terracotta chair",
    description: "A dressing corner that doubles as a desk.",
    image: { src: `${IMG}/after-portrait-wide.jpg`, alt: "Round backlit mirror above a dressing table" },
    priceGBP: null,
    usedIn: ["studio-poolside"],
  },
  {
    slug: "walnut-slat-tv-panel",
    name: "Walnut slat TV panel",
    category: "living",
    materials: "Wood slats on a dark backing",
    description: "Runs floor to ceiling behind the TV in the studio project.",
    image: { src: `${IMG}/after-landscape-bar.jpg`, alt: "Walnut slat panel with a wall-mounted TV" },
    priceGBP: null,
    usedIn: ["studio-poolside"],
  },
  {
    slug: "black-track-lights",
    name: "Black track lighting",
    category: "lighting",
    materials: "Powder-coated metal, adjustable heads",
    description: "Three heads over the kitchen in the studio project.",
    image: { src: `${IMG}/after-kitchen.jpg`, alt: "Black track lights above the kitchen" },
    priceGBP: null,
    usedIn: ["studio-poolside"],
  },
  {
    slug: "fluted-vanity",
    name: "Fluted bathroom vanity",
    category: "bathroom",
    materials: "Fluted front, integrated basin",
    description: "Wall-hung, with the mirror above and towels beside it.",
    image: { src: `${IMG}/after-bathroom.jpg`, alt: "White fluted vanity with a basin" },
    priceGBP: null,
    usedIn: ["studio-poolside"],
  },
  {
    slug: "rattan-dining-set",
    name: "Outdoor dining set, black rattan",
    category: "outdoor",
    materials: "Black rattan weave, tempered glass top",
    description: "Table and four chairs on the terrace by the pool.",
    image: { src: `${IMG}/after-terrace.jpg`, alt: "Black rattan dining set on a terrace by the pool" },
    priceGBP: null,
    usedIn: ["studio-poolside"],
  },
];

export function furnitureBySlug(slug: string) {
  return furniture.find((f) => f.slug === slug);
}
