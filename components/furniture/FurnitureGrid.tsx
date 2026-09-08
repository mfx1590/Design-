"use client";

import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";
import { cx } from "@/lib/cx";

interface FurnitureGridProps {
  /** Cards are rendered on the server (they read translations); the grid only filters them. */
  items: Array<{ slug: string; category: string; card: ReactNode }>;
  categories: Array<{ key: string; label: string }>;
  labels: { all: string; empty: string };
}

/** Category chips (horizontally scrollable on phones) above a 2/3/4-column grid. */
export function FurnitureGrid({ items, categories, labels }: FurnitureGridProps) {
  const tf = useTranslations("furniture");
  const [active, setActive] = useState<string>("all");
  const present = categories.filter((c) => items.some((i) => i.category === c.key));
  const visible = active === "all" ? items : items.filter((i) => i.category === active);
  const chip = (selected: boolean) =>
    cx(
      "shrink-0 border px-4 py-2 text-small tracking-[0.04em] transition-colors duration-(--dur-ui) ease-soft",
      selected ? "border-brass bg-brass text-surface" : "border-rule text-ink-soft hover:border-ink hover:text-ink",
    );

  return (
    <div>
      <div role="group" className="-mx-(--gutter) flex gap-2 overflow-x-auto px-(--gutter) pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
        <button type="button" aria-pressed={active === "all"} onClick={() => setActive("all")} className={chip(active === "all")}>
          {labels.all}
        </button>
        {present.map((c) => (
          <button key={c.key} type="button" aria-pressed={active === c.key} onClick={() => setActive(c.key)} className={chip(active === c.key)}>
            {c.label}
          </button>
        ))}
      </div>
      <p className="mt-5 text-small text-ink-muted" aria-live="polite">
        {tf("count", { count: visible.length })}
      </p>
      {visible.length ? (
        <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
          {visible.map((item) => (
            <li key={item.slug}>{item.card}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 text-ink-soft">{labels.empty}</p>
      )}
    </div>
  );
}
