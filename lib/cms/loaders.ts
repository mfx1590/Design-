import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Locale } from "next-intl";
import { getMessages } from "next-intl/server";
import { buildFurniture, type FurnitureItem } from "@/lib/content/furniture";
import { buildGuides, type GuideContent } from "@/lib/content/guides";
import { buildProjects, type ProjectContent, type SequenceManifest } from "@/lib/content/projects";
import { reviews as staticReviews, type ReviewContent } from "@/lib/content/reviews";
import { isSanityConfigured } from "@/sanity/env";
import { sanityClient } from "@/sanity/lib/client";
import { photoToImage } from "./image";
import { blocksToSections, pick, type Block, type LocaleValue } from "./locale";

/**
 * Content layer (PLAN.md §11 Phase 3): every loader reads Sanity when the project is configured and
 * falls back to the static modules under lib/content otherwise, or when a query fails. Pages only
 * ever see the static shapes, so the owner can move content into the Studio type by type.
 */
const REVALIDATE = 60;

/** The "content" namespace of the locale's messages (English merged underneath), for the static fallbacks. */
async function content(locale: string) {
  return (await getMessages({ locale: locale as Locale })).content;
}

async function query<T>(groq: string, params: Record<string, unknown>, fallback: () => T): Promise<T> {
  if (!isSanityConfigured) return fallback();
  try {
    const result = await sanityClient.fetch<T>(groq, params, { next: { revalidate: REVALIDATE } });
    return result ?? fallback();
  } catch (error) {
    console.error("[cms] query failed, using static content:", error);
    return fallback();
  }
}

type Photo = Parameters<typeof photoToImage>[0];
const packageKeys: Record<string, ProjectContent["packageKey"]> = { studio: "studio", "1+1": "onePlusOne", "2+1": "twoPlusOne" };

/* Projects */

interface ProjectDoc {
  slug: string;
  title: LocaleValue;
  apartmentType: string | null;
  packageType: string | null;
  city: LocaleValue;
  summary: LocaleValue;
  scope: LocaleValue[] | null;
  before: Photo;
  after: Photo;
  gallery: Photo[] | null;
  hasVideo: boolean;
  sequenceFolder: string | null;
  isVisualisation: boolean | null;
  furnitureSlugs: string[] | null;
}

const projectFields = `
  "slug": slug.current, title, apartmentType, "packageType": package->apartmentType, "city": city->name, summary, scope,
  "before": pairs[0].before, "after": pairs[0].after, gallery,
  "hasVideo": defined(video) || defined(videoUrl), sequenceFolder, isVisualisation,
  "furnitureSlugs": furniture[]->slug.current
`;

async function readManifest(folder: string | null): Promise<SequenceManifest | undefined> {
  if (!folder || !/^[a-z0-9-]+$/.test(folder)) return undefined;
  try {
    const raw = await readFile(path.join(process.cwd(), "public", "sequences", folder, "manifest.json"), "utf8");
    return JSON.parse(raw) as SequenceManifest;
  } catch {
    return undefined;
  }
}

async function mapProject(doc: ProjectDoc, locale: string): Promise<ProjectContent | null> {
  const before = photoToImage(doc.before, locale);
  const after = photoToImage(doc.after, locale);
  if (!doc.slug || !before || !after) return null;
  const apartmentType = (doc.apartmentType === "studio" ? "Studio" : doc.apartmentType) as ProjectContent["apartmentType"];
  return {
    slug: doc.slug,
    title: pick(doc.title, locale) ?? doc.slug,
    apartmentType: apartmentType ?? "Studio",
    packageKey: packageKeys[doc.packageType ?? doc.apartmentType ?? "studio"] ?? "studio",
    city: pick(doc.city, locale) ?? null,
    summary: pick(doc.summary, locale) ?? "",
    scope: (doc.scope ?? []).map((s) => pick(s, locale)).filter((s): s is string => Boolean(s)),
    before,
    after,
    gallery: (doc.gallery ?? [])
      .map((p) => photoToImage(p, locale, 1200))
      .filter((p): p is { src: string; alt: string } => p !== null)
      .map((p, i) => ({ ...p, ratio: i === 0 ? ("3/2" as const) : ("3/4" as const) })),
    sequence: await readManifest(doc.sequenceFolder),
    hasVideo: Boolean(doc.hasVideo),
    furnitureSlugs: doc.furnitureSlugs ?? [],
    visualisationNote: doc.isVisualisation ? "The wide after photo is a visualisation based on the completed project." : undefined,
  };
}

export async function getProjects(locale: string): Promise<ProjectContent[]> {
  const docs = await query<ProjectDoc[] | null>(`*[_type == "project" && defined(slug.current)] | order(featured desc, completedAt desc) { ${projectFields} }`, {}, () => null);
  const staticProjects = buildProjects(await content(locale));
  if (!docs) return staticProjects;
  const mapped = await Promise.all(docs.map((d) => mapProject(d, locale)));
  const list = mapped.filter((p): p is ProjectContent => p !== null);
  return list.length ? list : staticProjects;
}

export async function getProject(locale: string, slug: string): Promise<ProjectContent | undefined> {
  const doc = await query<ProjectDoc | null>(`*[_type == "project" && slug.current == $slug][0] { ${projectFields} }`, { slug }, () => null);
  if (doc) return (await mapProject(doc, locale)) ?? undefined;
  return buildProjects(await content(locale)).find((p) => p.slug === slug);
}

/* Furniture */

interface FurnitureDoc {
  slug: string;
  title: LocaleValue;
  category: string | null;
  categoryTitle: LocaleValue;
  materials: LocaleValue;
  description: LocaleValue;
  image: Photo;
  priceGBP: number | null;
  usedIn: string[] | null;
}

const furnitureFields = `
  "slug": slug.current, title, "category": category->slug.current, "categoryTitle": category->title, materials, description,
  "image": images[0], priceGBP, "usedIn": usedIn[]->slug.current
`;

function mapFurniture(doc: FurnitureDoc, locale: string): (FurnitureItem & { categoryLabel?: string }) | null {
  const image = photoToImage(doc.image, locale, 1200);
  if (!doc.slug || !image) return null;
  return {
    slug: doc.slug,
    name: pick(doc.title, locale) ?? doc.slug,
    category: doc.category ?? "decor",
    categoryLabel: pick(doc.categoryTitle, locale),
    materials: pick(doc.materials, locale) ?? "",
    description: pick(doc.description, locale) ?? "",
    image,
    priceGBP: typeof doc.priceGBP === "number" ? doc.priceGBP : null,
    usedIn: doc.usedIn ?? [],
  };
}

export async function getFurniture(locale: string): Promise<Array<FurnitureItem & { categoryLabel?: string }>> {
  const docs = await query<FurnitureDoc[] | null>(`*[_type == "furnitureItem" && defined(slug.current)] | order(category->order asc, title.en asc) { ${furnitureFields} }`, {}, () => null);
  const staticFurniture = buildFurniture(await content(locale));
  if (!docs) return staticFurniture;
  const list = docs.map((d) => mapFurniture(d, locale)).filter((f): f is FurnitureItem & { categoryLabel?: string } => f !== null);
  return list.length ? list : staticFurniture;
}

export async function getFurnitureItem(locale: string, slug: string): Promise<(FurnitureItem & { categoryLabel?: string }) | undefined> {
  const doc = await query<FurnitureDoc | null>(`*[_type == "furnitureItem" && slug.current == $slug][0] { ${furnitureFields} }`, { slug }, () => null);
  if (doc) return mapFurniture(doc, locale) ?? undefined;
  return buildFurniture(await content(locale)).find((f) => f.slug === slug);
}

/* Guides */

interface GuideDoc {
  slug: string;
  title: LocaleValue;
  lead: LocaleValue;
  cover: Photo;
  updated: string | null;
  body: LocaleValue<Block[]>;
}

const guideFields = `"slug": slug.current, title, lead, cover, "updated": coalesce(updatedAt, publishedAt, _updatedAt), body`;

function mapGuide(doc: GuideDoc, locale: string, fallbackCover: GuideContent["cover"]): GuideContent | null {
  if (!doc.slug) return null;
  const cover = photoToImage(doc.cover, locale, 1200) ?? fallbackCover;
  return {
    slug: doc.slug,
    title: pick(doc.title, locale) ?? doc.slug,
    lead: pick(doc.lead, locale) ?? "",
    updated: (doc.updated ?? new Date().toISOString()).slice(0, 10),
    cover,
    sections: blocksToSections(pick(doc.body, locale)),
  };
}

export async function getGuides(locale: string): Promise<GuideContent[]> {
  const docs = await query<GuideDoc[] | null>(`*[_type == "guide" && defined(slug.current)] | order(coalesce(updatedAt, publishedAt) desc) { ${guideFields} }`, {}, () => null);
  const staticGuides = buildGuides(await content(locale));
  if (!docs) return staticGuides;
  const list = docs.map((d) => mapGuide(d, locale, staticGuides[0].cover)).filter((g): g is GuideContent => g !== null);
  return list.length ? list : staticGuides;
}

export async function getGuide(locale: string, slug: string): Promise<GuideContent | undefined> {
  const doc = await query<GuideDoc | null>(`*[_type == "guide" && slug.current == $slug][0] { ${guideFields} }`, { slug }, () => null);
  const staticGuides = buildGuides(await content(locale));
  if (doc) return mapGuide(doc, locale, staticGuides[0].cover) ?? undefined;
  return staticGuides.find((g) => g.slug === slug);
}

/* Reviews */

interface ReviewDoc {
  clientName: string;
  city: LocaleValue;
  rating: number;
  text: LocaleValue;
  date: string | null;
}

export async function getReviews(locale: string): Promise<ReviewContent[]> {
  const docs = await query<ReviewDoc[] | null>(`*[_type == "review" && permission == true] | order(date desc) { clientName, "city": city->name, rating, text, date }`, {}, () => null);
  if (!docs) return staticReviews;
  return docs
    .map((d) => ({ clientName: d.clientName, city: pick(d.city, locale) ?? null, rating: d.rating, text: pick(d.text, locale) ?? "", date: d.date }))
    .filter((r) => r.clientName && r.text);
}
