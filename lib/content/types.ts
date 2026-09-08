import type en from "@/messages/en.json";

/**
 * Long-form copy lives in messages/<locale>.json under "content" so every locale is translated in
 * one place; the modules in lib/content only add the non-text facts (slugs, photos, prices).
 * Locale files are deep-merged over English (i18n/request.ts), so the shape is always this one.
 */
export type ContentMessages = (typeof en)["content"];
