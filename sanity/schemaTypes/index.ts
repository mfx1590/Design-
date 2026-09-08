import type { SchemaTypeDefinition } from "sanity";
import { category, city, faq, furnitureItem, guide, packageType, page, project, review, service, siteSettings } from "./documents";
import { faqItem, localeBlocks, localeString, localeText, photo, seo } from "./objects";

/** Content model per PLAN.md section 10. Objects first, then documents. */
export const schemaTypes: SchemaTypeDefinition[] = [
  localeString,
  localeText,
  localeBlocks,
  photo,
  faqItem,
  seo,
  siteSettings,
  packageType,
  service,
  project,
  review,
  furnitureItem,
  category,
  city,
  guide,
  faq,
  page,
];
