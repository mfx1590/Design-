import manifest from "@/public/sequences/project-01-studio/manifest.json";
import type { ContentMessages } from "./types";

export type SequenceManifest = typeof manifest;

/**
 * Portfolio projects (PLAN.md §6). One real project so far. Copy comes from messages under
 * content.projects.<key>. Facts the owner has not confirmed (city, date, client) are shown as
 * "to be confirmed", never invented. Moves into Sanity later.
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

export const projectMeta = [
  {
    key: "studioPoolside",
    slug: "studio-poolside",
    apartmentType: "Studio",
    packageKey: "studio",
    city: null,
    before: `${IMG}/before-landscape.jpg`,
    after: `${IMG}/after-landscape.jpg`,
    gallery: [
      { src: `${IMG}/after-landscape-bar.jpg`, ratio: "3/2" },
      { src: `${IMG}/after-portrait-bar-to-bed.jpg`, ratio: "3/4" },
      { src: `${IMG}/after-portrait-wide.jpg`, ratio: "3/4" },
      { src: `${IMG}/after-kitchen.jpg`, ratio: "3/4" },
      { src: `${IMG}/after-bathroom.jpg`, ratio: "3/4" },
      { src: `${IMG}/after-terrace.jpg`, ratio: "3/4" },
      { src: `${IMG}/before-portrait.jpg`, ratio: "3/4" },
    ],
    sequence: manifest,
    hasVideo: false,
    furnitureSlugs: ["terracotta-bar-stool", "linen-sofa", "round-coffee-table", "upholstered-bed", "walnut-slat-tv-panel", "rattan-dining-set"],
  },
] as const;

export const projectSlugs = projectMeta.map((m) => m.slug);

export function buildProjects(content: ContentMessages): ProjectContent[] {
  return projectMeta.map((m) => {
    const c = content.projects[m.key];
    return {
      slug: m.slug,
      title: c.title,
      apartmentType: m.apartmentType,
      packageKey: m.packageKey,
      city: m.city,
      summary: c.summary,
      scope: ([1, 2, 3, 4, 5, 6] as const).map((n) => c.scope[`s${n}`]),
      before: { src: m.before, alt: c.beforeAlt },
      after: { src: m.after, alt: c.afterAlt },
      gallery: m.gallery.map((g, i) => ({ src: g.src, ratio: g.ratio, alt: c.gallery[`g${(i + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7}`] })),
      sequence: m.sequence,
      hasVideo: m.hasVideo,
      furnitureSlugs: [...m.furnitureSlugs],
      visualisationNote: c.visualisationNote,
    };
  });
}
