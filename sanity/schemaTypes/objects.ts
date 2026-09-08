import { defineArrayMember, defineField, defineType } from "sanity";

/** The six site locales, English first. Mirrors i18n/routing.ts. */
export const locales = [
  { id: "en", title: "English" },
  { id: "pl", title: "Polish" },
  { id: "ru", title: "Russian" },
  { id: "tr", title: "Turkish" },
  { id: "fa", title: "Persian" },
  { id: "de", title: "German" },
] as const;

/** One short string per locale. English is required; the site falls back to it. */
export const localeString = defineType({
  name: "localeString",
  title: "Localised text",
  type: "object",
  fieldsets: [{ name: "translations", title: "Translations", options: { collapsible: true, collapsed: true } }],
  fields: locales.map((l) =>
    defineField({
      name: l.id,
      title: l.title,
      type: "string",
      fieldset: l.id === "en" ? undefined : "translations",
      validation: l.id === "en" ? (r) => r.required() : undefined,
    }),
  ),
});

/** One paragraph-length text per locale. */
export const localeText = defineType({
  name: "localeText",
  title: "Localised paragraph",
  type: "object",
  fieldsets: [{ name: "translations", title: "Translations", options: { collapsible: true, collapsed: true } }],
  fields: locales.map((l) =>
    defineField({
      name: l.id,
      title: l.title,
      type: "text",
      rows: 4,
      fieldset: l.id === "en" ? undefined : "translations",
      validation: l.id === "en" ? (r) => r.required() : undefined,
    }),
  ),
});

/** Rich text per locale (guides, about, legal). */
export const localeBlocks = defineType({
  name: "localeBlocks",
  title: "Localised rich text",
  type: "object",
  fieldsets: [{ name: "translations", title: "Translations", options: { collapsible: true, collapsed: true } }],
  fields: locales.map((l) =>
    defineField({
      name: l.id,
      title: l.title,
      type: "array",
      of: [defineArrayMember({ type: "block", styles: [{ title: "Normal", value: "normal" }, { title: "Heading", value: "h2" }] })],
      fieldset: l.id === "en" ? undefined : "translations",
    }),
  ),
});

/** A photo with localised alt text. Alt is required: every image on the site is described. */
export const photo = defineType({
  name: "photo",
  title: "Photo",
  type: "image",
  options: { hotspot: true },
  fields: [defineField({ name: "alt", title: "Alt text", type: "localeString", validation: (r) => r.required() })],
});

/** Question and answer, localised. Used inline on packages, services and projects. */
export const faqItem = defineType({
  name: "faqItem",
  title: "Question",
  type: "object",
  fields: [
    defineField({ name: "question", type: "localeString", validation: (r) => r.required() }),
    defineField({ name: "answer", type: "localeText", validation: (r) => r.required() }),
  ],
  preview: { select: { title: "question.en" } },
});

/** SEO overrides. Empty fields fall back to the document title and summary. */
export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: "title", title: "Meta title", type: "localeString" }),
    defineField({ name: "description", title: "Meta description", type: "localeText" }),
    defineField({ name: "image", title: "Share image", type: "image", options: { hotspot: true } }),
    defineField({ name: "noindex", title: "Hide from search engines", type: "boolean", initialValue: false }),
  ],
});

export const apartmentTypes = [
  { title: "Studio", value: "studio" },
  { title: "1+1", value: "1+1" },
  { title: "2+1", value: "2+1" },
];
