"use client";

import { useSyncExternalStore } from "react";
import { cx } from "@/lib/cx";
import { readInquiry, subscribeInquiry, toggleInquiry } from "@/lib/inquiry";

interface AddToInquiryProps {
  slug: string;
  labels: { add: string; remove: string };
  variant?: "link" | "button";
}

const EMPTY: string[] = [];
let cache: string[] = EMPTY;
let cacheKey = "";
function snapshot() {
  const list = readInquiry();
  const key = list.join("|");
  if (key !== cacheKey) {
    cacheKey = key;
    cache = list;
  }
  return cache;
}

/** Toggles a piece in the inquiry list. Renders the same on the server and before hydration (not in list). */
export function AddToInquiry({ slug, labels, variant = "link" }: AddToInquiryProps) {
  const list = useSyncExternalStore(subscribeInquiry, snapshot, () => EMPTY);
  const inList = list.includes(slug);

  return (
    <button
      type="button"
      aria-pressed={inList}
      onClick={() => toggleInquiry(slug)}
      className={cx(
        variant === "button"
          ? "inline-flex items-center justify-center gap-2 border px-6 py-3.5 font-medium tracking-[0.04em] transition-colors duration-(--dur-ui) ease-soft"
          : "link text-small",
        variant === "button" && (inList ? "border-brass bg-brass text-night" : "border-ink/60 text-ink hover:bg-ink hover:text-surface"),
      )}
    >
      {inList ? labels.remove : labels.add}
    </button>
  );
}
