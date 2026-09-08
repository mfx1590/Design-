/**
 * Locale registry: single source of truth for everything locale-specific that
 * is not a translated string (direction, script, Intl tag, price layout).
 * English is the source language; every other locale is a translation of it.
 */
export const locales = ["en", "pl", "ru", "tr", "fa", "de"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export type Script = "latin" | "cyrillic" | "arabic";

export interface LocaleMeta {
  name: string; // English name, for admin UIs
  nativeName: string; // name in the language itself, for the switcher
  dir: "ltr" | "rtl";
  script: Script;
  intl: string; // BCP-47 tag for Intl.* formatting
  hreflang: string;
  currencyPosition: "prefix" | "suffix"; // where the pound sign goes, PLAN.md section 1
}

export const localeMeta: Record<Locale, LocaleMeta> = {
  en: { name: "English", nativeName: "English", dir: "ltr", script: "latin", intl: "en-GB", hreflang: "en", currencyPosition: "prefix" },
  pl: { name: "Polish", nativeName: "Polski", dir: "ltr", script: "latin", intl: "pl-PL", hreflang: "pl", currencyPosition: "suffix" },
  ru: { name: "Russian", nativeName: "Русский", dir: "ltr", script: "cyrillic", intl: "ru-RU", hreflang: "ru", currencyPosition: "suffix" },
  tr: { name: "Turkish", nativeName: "Türkçe", dir: "ltr", script: "latin", intl: "tr-TR", hreflang: "tr", currencyPosition: "suffix" },
  fa: { name: "Persian", nativeName: "فارسی", dir: "rtl", script: "arabic", intl: "fa-IR", hreflang: "fa", currencyPosition: "prefix" },
  de: { name: "German", nativeName: "Deutsch", dir: "ltr", script: "latin", intl: "de-DE", hreflang: "de", currencyPosition: "suffix" },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
