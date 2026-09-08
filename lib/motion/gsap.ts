"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/** Registers ScrollTrigger once and returns the gsap core. Client only. */
export function getGsap() {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    // Phones resize the viewport when the address bar hides; recalculating every trigger then causes jumps.
    ScrollTrigger.config({ ignoreMobileResize: true });
    registered = true;
  }
  return { gsap, ScrollTrigger };
}

/** Height of the sticky site header in px (from the --header-height token). */
export function headerHeightPx(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--header-height").trim();
  if (raw.endsWith("rem")) return parseFloat(raw) * parseFloat(getComputedStyle(document.documentElement).fontSize);
  return parseFloat(raw) || 64;
}
