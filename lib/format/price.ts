import { localeMeta, type Locale } from "@/i18n/locales";

const LRI = "\u2066"; // LEFT-TO-RIGHT ISOLATE
const PDI = "\u2069"; // POP DIRECTIONAL ISOLATE
const NBSP = "\u00A0";

export interface PriceOptions {
  /** Farsi only: Persian-Arabic digits instead of Western digits. Open decision, PLAN.md section 8. */
  persianDigits?: boolean;
}

/**
 * Formats a GBP amount exactly as PLAN.md section 1 specifies, per locale:
 * en "£10,000" | pl, ru "10 000 £" | tr, de "10.000 £" | fa "£10,000" (Western digits by default).
 * GBP only, never converts.
 */
export function formatGBP(amount: number, locale: Locale, options: PriceOptions = {}): string {
  const meta = localeMeta[locale];
  const numberingSystem = locale === "fa" && options.persianDigits ? "arabext" : "latn";
  const number = new Intl.NumberFormat(meta.intl, { maximumFractionDigits: 0, numberingSystem }).format(amount);
  const price = meta.currencyPosition === "prefix" ? `£${number}` : `${number}${NBSP}£`;
  // In RTL text the bidi algorithm would detach the £ from the digits; isolate the price as one LTR unit.
  return meta.dir === "rtl" ? `${LRI}${price}${PDI}` : price;
}
