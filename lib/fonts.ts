import { Commissioner, Vazirmatn } from "next/font/google";

/**
 * PROVISIONAL Latin + Cyrillic family. The final choice is made in the Phase 1
 * design plan (PLAN.md §4). Commissioner is a humanist grotesk with real axes
 * (weight, slant, flare, volume) and covers Latin Extended + Cyrillic.
 * next/font self-hosts the files at build time (font-display: swap).
 */
export const latin = Commissioner({
  subsets: ["latin", "latin-ext", "cyrillic"],
  axes: ["FLAR", "VOLM", "slnt"],
  variable: "--font-latin",
  display: "swap",
});

/** Persian family for /fa. Vazirmatn covers Arabic script plus Latin digits and punctuation. */
export const persian = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-persian",
  display: "swap",
});
