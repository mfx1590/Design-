import { defineArrayMember, defineField, defineType } from "sanity";
import { apartmentTypes } from "./objects";

const slug = (source: string) => defineField({ name: "slug", type: "slug", options: { source, maxLength: 80 }, validation: (r) => r.required() });

/** One document. NAP, socials, share image, the WhatsApp number. Localised where text is shown. */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({ name: "businessName", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "legalName", title: "Legal company name", type: "string" }),
    defineField({ name: "address", type: "localeText", description: "Street, city, postcode. Must match Google Business Profile exactly." }),
    defineField({ name: "phone", type: "string", description: "International format, e.g. +90 548 861 84 49" }),
    defineField({ name: "whatsapp", type: "string", description: "Digits only, e.g. 905488618449" }),
    defineField({ name: "email", type: "string" }),
    defineField({ name: "openingHours", type: "localeString" }),
    defineField({ name: "geo", type: "geopoint", title: "Showroom location" }),
    defineField({
      name: "socials",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "network", type: "string", options: { list: ["instagram", "facebook", "youtube", "tiktok", "linkedin"] } }),
            defineField({ name: "url", type: "url" }),
          ],
        }),
      ],
    }),
    defineField({ name: "defaultShareImage", type: "image", options: { hotspot: true } }),
    defineField({ name: "currencies", type: "array", of: [defineArrayMember({ type: "string" })], initialValue: ["GBP"], readOnly: true, description: "Prices are shown in GBP only." }),
  ],
  preview: { select: { title: "businessName.en" } },
});

/** Studio, 1+1, 2+1. Inclusions per room; prices in GBP. */
export const packageType = defineType({
  name: "package",
  title: "Package",
  type: "document",
  fields: [
    defineField({ name: "title", type: "localeString", validation: (r) => r.required() }),
    slug("title.en"),
    defineField({ name: "apartmentType", type: "string", options: { list: apartmentTypes }, validation: (r) => r.required() }),
    defineField({ name: "summary", type: "localeText" }),
    defineField({ name: "priceFromGBP", title: "Price from (GBP)", type: "number", validation: (r) => r.required().min(0) }),
    defineField({ name: "timeline", title: "Delivery timeline", type: "localeString", description: "Leave empty to show 'to be confirmed'." }),
    defineField({
      name: "rooms",
      title: "Inclusions by room",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "room", type: "localeString", validation: (r) => r.required() }),
            defineField({ name: "items", type: "array", of: [defineArrayMember({ type: "localeString" })] }),
          ],
          preview: { select: { title: "room.en" } },
        }),
      ],
    }),
    defineField({ name: "gallery", type: "array", of: [defineArrayMember({ type: "photo" })] }),
    defineField({ name: "faqs", type: "array", of: [defineArrayMember({ type: "faqItem" })] }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
    defineField({ name: "seo", type: "seo" }),
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title.en", subtitle: "apartmentType" } },
});

/** Home staging, rental furnishing, custom projects. */
export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({ name: "title", type: "localeString", validation: (r) => r.required() }),
    slug("title.en"),
    defineField({ name: "intro", type: "localeText" }),
    defineField({ name: "audience", title: "Who it is for", type: "localeString" }),
    defineField({
      name: "steps",
      title: "How it works",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [defineField({ name: "title", type: "localeString" }), defineField({ name: "body", type: "localeText" })],
          preview: { select: { title: "title.en" } },
        }),
      ],
    }),
    defineField({ name: "pricingModel", type: "localeText" }),
    defineField({ name: "gallery", type: "array", of: [defineArrayMember({ type: "photo" })] }),
    defineField({ name: "faqs", type: "array", of: [defineArrayMember({ type: "faqItem" })] }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
    defineField({ name: "seo", type: "seo" }),
  ],
  preview: { select: { title: "title.en" } },
});

/** A completed apartment. Before/after pairs, optional real video, the frame-sequence folder for the scene. */
export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({ name: "title", type: "localeString", validation: (r) => r.required() }),
    slug("title.en"),
    defineField({ name: "city", type: "reference", to: [{ type: "city" }] }),
    defineField({ name: "apartmentType", type: "string", options: { list: apartmentTypes } }),
    defineField({ name: "package", type: "reference", to: [{ type: "package" }] }),
    defineField({ name: "service", type: "reference", to: [{ type: "service" }] }),
    defineField({ name: "summary", type: "localeText" }),
    defineField({ name: "scope", title: "Scope", type: "array", of: [defineArrayMember({ type: "localeString" })] }),
    defineField({
      name: "pairs",
      title: "Before / after pairs",
      type: "array",
      validation: (r) => r.min(1),
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "before", type: "photo", validation: (r) => r.required() }),
            defineField({ name: "after", type: "photo", validation: (r) => r.required() }),
            defineField({ name: "room", type: "localeString" }),
          ],
          preview: { select: { title: "room.en", media: "after" } },
        }),
      ],
    }),
    defineField({ name: "gallery", type: "array", of: [defineArrayMember({ type: "photo" })] }),
    defineField({ name: "video", title: "Real video (file)", type: "file", options: { accept: "video/*" } }),
    defineField({ name: "videoUrl", title: "Real video (URL)", type: "url" }),
    defineField({ name: "sequenceFolder", title: "Frame sequence folder", type: "string", description: "Folder name under public/sequences produced by scripts/process-sequence.sh" }),
    defineField({ name: "sceneTier", type: "string", options: { list: ["sequence", "video", "wipe"] }, initialValue: "wipe" }),
    defineField({ name: "isVisualisation", title: "After image is a visualisation", type: "boolean", initialValue: false }),
    defineField({ name: "body", type: "localeBlocks" }),
    defineField({ name: "furniture", type: "array", of: [defineArrayMember({ type: "reference", to: [{ type: "furnitureItem" }] })] }),
    defineField({ name: "review", type: "reference", to: [{ type: "review" }] }),
    defineField({ name: "completedAt", type: "date" }),
    defineField({ name: "featured", type: "boolean", initialValue: false }),
    defineField({ name: "seo", type: "seo" }),
  ],
  preview: { select: { title: "title.en", subtitle: "apartmentType", media: "pairs.0.after" } },
});

/** Only real reviews, with the client's permission. */
export const review = defineType({
  name: "review",
  title: "Review",
  type: "document",
  fields: [
    defineField({ name: "clientName", type: "string", validation: (r) => r.required() }),
    defineField({ name: "city", type: "reference", to: [{ type: "city" }] }),
    defineField({ name: "rating", type: "number", validation: (r) => r.required().min(1).max(5).integer() }),
    defineField({ name: "text", type: "localeText", validation: (r) => r.required() }),
    defineField({ name: "video", type: "file", options: { accept: "video/*" } }),
    defineField({ name: "project", type: "reference", to: [{ type: "project" }] }),
    defineField({ name: "date", type: "date" }),
    defineField({ name: "permission", title: "Client agreed to publication", type: "boolean", validation: (r) => r.custom((v) => v === true || "The client must have agreed to publication") }),
  ],
  preview: { select: { title: "clientName", subtitle: "text.en" } },
});

/** A piece of furniture. Price or price on request. */
export const furnitureItem = defineType({
  name: "furnitureItem",
  title: "Furniture",
  type: "document",
  fields: [
    defineField({ name: "title", type: "localeString", validation: (r) => r.required() }),
    slug("title.en"),
    defineField({ name: "category", type: "reference", to: [{ type: "category" }], validation: (r) => r.required() }),
    defineField({ name: "images", type: "array", of: [defineArrayMember({ type: "photo" })], validation: (r) => r.min(1) }),
    defineField({ name: "materials", type: "localeString" }),
    defineField({ name: "description", type: "localeText" }),
    defineField({
      name: "dimensions",
      type: "object",
      fields: [
        defineField({ name: "width", type: "number", description: "cm" }),
        defineField({ name: "depth", type: "number", description: "cm" }),
        defineField({ name: "height", type: "number", description: "cm" }),
      ],
    }),
    defineField({ name: "priceGBP", title: "Price (GBP)", type: "number", description: "Leave empty for price on request." }),
    defineField({ name: "availability", type: "string", options: { list: ["in-stock", "made-to-order", "discontinued"] }, initialValue: "made-to-order" }),
    defineField({ name: "usedIn", type: "array", of: [defineArrayMember({ type: "reference", to: [{ type: "project" }] })] }),
    defineField({ name: "seo", type: "seo" }),
  ],
  preview: { select: { title: "title.en", subtitle: "materials.en", media: "images.0" } },
});

export const category = defineType({
  name: "category",
  title: "Furniture category",
  type: "document",
  fields: [
    defineField({ name: "title", type: "localeString", validation: (r) => r.required() }),
    slug("title.en"),
    defineField({ name: "order", type: "number", initialValue: 0 }),
  ],
  preview: { select: { title: "title.en" } },
});

/** A service area. Both naming conventions, coordinates, intro copy. */
export const city = defineType({
  name: "city",
  title: "City",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name (English convention)", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "nameTurkish", title: "Name (Turkish convention)", type: "string", description: "e.g. Girne" }),
    slug("name.en"),
    defineField({ name: "geo", type: "geopoint" }),
    defineField({ name: "intro", type: "localeText" }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
  ],
  preview: { select: { title: "name.en", subtitle: "nameTurkish" } },
});

export const guide = defineType({
  name: "guide",
  title: "Guide",
  type: "document",
  fields: [
    defineField({ name: "title", type: "localeString", validation: (r) => r.required() }),
    slug("title.en"),
    defineField({ name: "lead", type: "localeText" }),
    defineField({ name: "cover", type: "photo" }),
    defineField({ name: "body", type: "localeBlocks", validation: (r) => r.required() }),
    defineField({ name: "publishedAt", type: "date" }),
    defineField({ name: "updatedAt", type: "date" }),
    defineField({ name: "faqs", type: "array", of: [defineArrayMember({ type: "faqItem" })] }),
    defineField({ name: "seo", type: "seo" }),
  ],
  preview: { select: { title: "title.en", media: "cover" } },
});

/** Standalone FAQ entries for the homepage and city pages. */
export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({ name: "question", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "answer", type: "localeText", validation: (r) => r.required() }),
    defineField({ name: "placement", type: "array", of: [defineArrayMember({ type: "string" })], options: { list: ["home", "packages", "areas", "furniture"] } }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
  ],
  preview: { select: { title: "question.en" } },
});

/** About, process and legal pages. */
export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({ name: "title", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "key", type: "string", options: { list: ["about", "process", "privacy", "cookies", "terms"] }, validation: (r) => r.required() }),
    defineField({ name: "lead", type: "localeText" }),
    defineField({ name: "body", type: "localeBlocks" }),
    defineField({ name: "updatedAt", type: "date" }),
    defineField({ name: "seo", type: "seo" }),
  ],
  preview: { select: { title: "title.en", subtitle: "key" } },
});
