import { Cormorant_Garamond, Jost, Vazirmatn } from "next/font/google";

/**
 * Type for the v3 "warm luxury" system (docs/design-plan-v3.md §3).
 * Cormorant Garamond carries headlines and prices, Jost carries body and UI,
 * Vazirmatn carries Farsi. All self-hosted by next/font with font-display: swap.
 */
export const display = Cormorant_Garamond({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

export const body = Jost({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-jost",
  display: "swap",
});

export const persian = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-persian",
  display: "swap",
});

/** Class names to put on <html>. */
export const fontVariables = `${display.variable} ${body.variable} ${persian.variable}`;
