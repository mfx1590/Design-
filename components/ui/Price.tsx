import { getLocale, getTranslations } from "next-intl/server";
import { cx } from "@/lib/cx";
import { formatGBP } from "@/lib/format/price";

interface PriceProps {
  amount: number;
  /** Show the localised "from" wording around the number. */
  from?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClass = {
  sm: "text-body",
  md: "text-lead sm:text-h3",
  lg: "text-h2",
  xl: "text-display",
};

/**
 * GBP price in the display cut with tabular figures; the "from" word stays in the text cut.
 * Word order per locale comes from messages (from <b>{price}</b>).
 */
export async function Price({ amount, from = true, size = "md", className }: PriceProps) {
  const locale = await getLocale();
  const t = await getTranslations("packages");
  const formatted = formatGBP(amount, locale);
  const number = <span className={cx("type-display tabular text-ink", sizeClass[size])}>{formatted}</span>;

  return (
    <span className={cx("inline-flex flex-wrap items-baseline gap-x-2 text-small text-ink-soft", className)}>
      {from ? t.rich("from", { price: formatted, b: () => number }) : number}
    </span>
  );
}
