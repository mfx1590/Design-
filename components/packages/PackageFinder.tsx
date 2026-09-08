"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import type { ApartmentType, TypeKey } from "@/components/home/ApartmentWalk";
import { WhatsAppGlyph } from "@/components/ui/WhatsAppGlyph";
import { cx } from "@/lib/cx";
import { formatGBP } from "@/lib/format/price";
import { whatsappHref } from "@/lib/site";

type Use = "live" | "longTerm" | "holiday";
type When = "keys" | "soon" | "later";

interface PackageFinderProps {
  types: ApartmentType[];
}

/**
 * "Which package fits me?" (PLAN.md §6): three questions, one answer, then the answer goes
 * straight into a prefilled WhatsApp message so the conversation starts with the facts.
 */
export function PackageFinder({ types }: PackageFinderProps) {
  const t = useTranslations("finder");
  const tp = useTranslations("packages");
  const locale = useLocale();
  const [type, setType] = useState<TypeKey | null>(null);
  const [use, setUse] = useState<Use | null>(null);
  const [when, setWhen] = useState<When | null>(null);

  const chosen = types.find((x) => x.key === type) ?? null;
  const done = chosen && use && when;

  const useLabel: Record<Use, string> = { live: t("q2a"), longTerm: t("q2b"), holiday: t("q2c") };
  const whenLabel: Record<When, string> = { keys: t("q3a"), soon: t("q3b"), later: t("q3c") };

  const message = done ? t("prefill", { type: chosen.name, use: useLabel[use], when: whenLabel[when] }) : "";

  const option = (selected: boolean) =>
    cx(
      "border px-4 py-3 text-start text-small font-medium tracking-[0.02em] transition-colors duration-(--dur-ui) ease-soft",
      selected ? "border-brass bg-brass text-surface" : "border-rule text-ink-soft hover:border-ink hover:text-ink",
    );

  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
      <ol className="space-y-8">
        <li>
          <p className="type-display text-h3 text-ink">
            <span className="text-brass">1.</span> {t("q1")}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {types.map((x) => (
              <button key={x.key} type="button" aria-pressed={type === x.key} onClick={() => setType(x.key)} className={option(type === x.key)}>
                {x.name} <span className="font-normal opacity-70">· {x.note}</span>
              </button>
            ))}
          </div>
        </li>
        <li>
          <p className="type-display text-h3 text-ink">
            <span className="text-brass">2.</span> {t("q2")}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(["live", "longTerm", "holiday"] as Use[]).map((u) => (
              <button key={u} type="button" aria-pressed={use === u} onClick={() => setUse(u)} className={option(use === u)}>
                {useLabel[u]}
              </button>
            ))}
          </div>
        </li>
        <li>
          <p className="type-display text-h3 text-ink">
            <span className="text-brass">3.</span> {t("q3")}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(["keys", "soon", "later"] as When[]).map((w) => (
              <button key={w} type="button" aria-pressed={when === w} onClick={() => setWhen(w)} className={option(when === w)}>
                {whenLabel[w]}
              </button>
            ))}
          </div>
        </li>
      </ol>

      <aside className="card self-start p-7" aria-live="polite">
        <p className="eyebrow">{t("result")}</p>
        {done ? (
          <>
            <p className="type-display mt-4 text-h2 text-ink">{use === "live" ? chosen.name : t("resultRental", { name: chosen.name })}</p>
            <p className="mt-3 inline-flex flex-wrap items-baseline gap-x-2 text-small text-ink-soft">
              {tp.rich("from", {
                price: formatGBP(chosen.priceFromGBP, locale),
                b: () => <span className="type-display tabular text-h2 leading-none text-brass">{formatGBP(chosen.priceFromGBP, locale)}</span>,
              })}
            </p>
            <p className="mt-4 text-small text-ink-soft">{use === "holiday" ? t("noteHoliday") : use === "longTerm" ? t("noteLongTerm") : t("noteLive")}</p>
            <a
              href={whatsappHref(message)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex w-full items-center justify-center gap-3 border border-brass bg-brass px-6 py-3.5 text-body font-medium tracking-[0.04em] text-surface transition-colors hover:border-brass-deep hover:bg-brass-deep"
            >
              <WhatsAppGlyph className="size-5" />
              {t("send")}
            </a>
            <button
              type="button"
              onClick={() => {
                setType(null);
                setUse(null);
                setWhen(null);
              }}
              className="link mt-4 text-small"
            >
              {t("reset")}
            </button>
          </>
        ) : (
          <p className="mt-4 text-ink-soft">{t("empty")}</p>
        )}
      </aside>
    </div>
  );
}
