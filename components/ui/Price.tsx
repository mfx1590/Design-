import { getLocale, getTranslations } from "next-intl/server";
import { cx } from "@/lib/cx";
import { formatGBP } from "@/lib/format/price";

interface PriceProps {
  amount: number;
  /** Show the localised "from" wording around the number. */
  from?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  /** Brass by default ("brass is for numbers"); ivory where brass would clash. */
  tone?: "brass" | "ivory";
  className?: string;
}

const sizeClass = {
  sm: "text-lead",
  md: "text-h3 sm:text-[1.75rem]",
  lg: "text-h2",
  xl: "text-display",
};

/**
 * GBP price in Cormorant with tabular figures; the "from" word stays in Jost.
 * Word order per locale comes from messages (from <b>{price}</b>).
 */
export async function Price({ amount, from = true, size = "md", tone = "brass", className }: PriceProps) {
  const locale = await getLocale();
  const t = await getTranslations("packages");
  const formatted = formatGBP(amount, locale);
  const number = (
    <span className={cx("type-display tabular", tone === "brass" ? "text-brass" : "text-ink", sizeClass[size])}>{formatted}</span>
  );

  return (
    <span className={cx("inline-flex flex-wrap items-baseline gap-x-2 text-small text-ink-soft", className)}>
      {from ? t.rich("from", { price: formatted, b: () => number }) : number}
    </span>
  );
}
