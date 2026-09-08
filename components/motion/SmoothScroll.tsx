"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";
import { getGsap } from "@/lib/motion/gsap";

/**
 * Lenis smooth scrolling driven by the GSAP ticker so ScrollTrigger scrubs stay in sync.
 * Does nothing when the visitor prefers reduced motion or on touch devices (native scrolling there).
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Touch devices keep the native scroll entirely; smoothing only serves mouse wheels.
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;
    const { gsap, ScrollTrigger } = getGsap();
    const lenis = new Lenis({ autoRaf: false, lerp: 0.12 });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
  return null;
}
