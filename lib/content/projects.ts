import manifest from "@/public/sequences/project-01-studio/manifest.json";

export type SequenceManifest = typeof manifest;

/**
 * Portfolio projects (PLAN.md §6). One real project so far. Facts the owner has not confirmed
 * (city, date, client) are shown as "to be confirmed", never invented. Moves into Sanity later.
 */
export interface ProjectContent {
  slug: string;
  title: string;
  apartmentType: "Studio" | "1+1" | "2+1";
  packageKey: "studio" | "onePlusOne" | "twoPlusOne";
  city: string | null;
  summary: string;
  scope: string[];
  before: { src: string; alt: string };
  after: { src: string; alt: string };
  gallery: Array<{ src: string; alt: string; ratio: "3/2" | "4/3" | "3/4" }>;
  sequence?: SequenceManifest;
  hasVideo: boolean;
  furnitureSlugs: string[];
  visualisationNote?: string;
}

const IMG = "/images/projects/project-01-studio";

export const projects: ProjectContent[] = [
  {
    slug: "studio-poolside",
    title: "Studio, pool-side complex",
    apartmentType: "Studio",
    packageKey: "studio",
    city: null,
    summary:
      "A studio apartment in a pool-side complex, furnished as a complete package: living and sleeping area, breakfast bar, kitchen, bathroom and terrace, delivered and installed in one go.",
    scope: ["Living and sleeping area", "Breakfast bar and kitchen", "Bathroom", "Terrace", "Curtains and textiles", "Delivery and installation"],
    before: { src: `${IMG}/before-landscape.jpg`, alt: "Empty studio with a sliding door to the pool, before furnishing" },
    after: { src: `${IMG}/after-landscape.jpg`, alt: "The same studio furnished: breakfast bar, bed, sofa and curtains" },
    gallery: [
      { src: `${IMG}/after-landscape-bar.jpg`, alt: "Breakfast bar with terracotta stools, bed and sofa", ratio: "3/2" },
      { src: `${IMG}/after-portrait-bar-to-bed.jpg`, alt: "From the breakfast bar toward the bed", ratio: "3/4" },
      { src: `${IMG}/after-portrait-wide.jpg`, alt: "Sofa, dressing mirror and fridge", ratio: "3/4" },
      { src: `${IMG}/after-kitchen.jpg`, alt: "Kitchen with white gloss units and black track lights", ratio: "3/4" },
      { src: `${IMG}/after-bathroom.jpg`, alt: "Bathroom with glass shower and fluted vanity", ratio: "3/4" },
      { src: `${IMG}/after-terrace.jpg`, alt: "Black rattan dining set on the terrace by the pool", ratio: "3/4" },
      { src: `${IMG}/before-portrait.jpg`, alt: "The empty studio before furnishing", ratio: "3/4" },
    ],
    sequence: manifest,
    hasVideo: false,
    furnitureSlugs: ["terracotta-bar-stool", "linen-sofa", "round-coffee-table", "upholstered-bed", "walnut-slat-tv-panel", "rattan-dining-set"],
    visualisationNote: "The wide after photo is a visualisation based on the completed project; the other photos are phone shots from the finished apartment.",
  },
];

export function projectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}
