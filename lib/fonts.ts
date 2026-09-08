import { Cormorant_Garamond, Jost, Vazirmatn } from "next/font/google";

/**
 * Type for the v3 "warm luxury" system (docs/design-plan-v3.md §3).
 * Cormorant Garamond carries headlines and prices, Jost carries body and UI,
 * Vazirmatn carries Farsi. All self-hosted by next/font with font-display: swap.
 */
export const display = Cormorant_Garamond({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500"],
  style: ["normal"],
  variable: "--font-display",
  display: "swap",
});

/** The one italic accent per section; loaded on demand rather than preloaded on every page. */
export const displayItalic = Cormorant_Garamond({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400"],
  style: ["italic"],
  variable: "--font-display-italic",
  display: "swap",
  preload: false,
});

export const body = Jost({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-jost",
  display: "swap",
});

export const persian = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-persian",
  display: "swap",
});

/** Class names to put on <html>. */
export const fontVariables = `${display.variable} ${displayItalic.variable} ${body.variable} ${persian.variable}`;
