import type { ReactNode } from "react";
import { Price } from "@/components/ui/Price";
import { cx } from "@/lib/cx";

export interface ComparisonColumn {
  key: string;
  name: string;
  priceFromGBP: number;
}

export interface ComparisonRow {
  label: string;
  /** One value per column: text, true (included), false or null (not included). */
  values: Array<ReactNode | boolean | null>;
}

interface ComparisonTableProps {
  columns: ComparisonColumn[];
  rows: ComparisonRow[];
  /** Column key to highlight with a Kyrenia rule (the "which package fits me" answer). */
  highlight?: string;
  /** Per-column footer cell, shown from the sm breakpoint up. */
  footer?: (column: ComparisonColumn) => ReactNode;
  /** Single footer shown below the table on small screens instead of one cell per column. */
  mobileFooter?: ReactNode;
  caption?: string;
}

function cell(value: ReactNode | boolean | null) {
  if (value === true) return <span aria-label="included">✓</span>;
  if (value === false || value === null) return <span className="text-ink-muted">—</span>;
  return value;
}

/**
 * Porcelain header row with Display prices, tabular figures, rules between rows.
 * Fixed layout so three columns always fit a 360px viewport without horizontal scrolling;
 * the header sticks below the site header on scroll (docs/design-plan.md §3.5).
 */
export function ComparisonTable({ columns, rows, highlight, footer, mobileFooter, caption }: ComparisonTableProps) {
  return (
    <div>
      <table className="w-full table-fixed border-collapse text-small tabular">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead className="sticky top-(--header-height) z-10 bg-porcelain">
          <tr>
            <th scope="col" className="w-[26%] px-1.5 py-4 text-start font-normal text-ink-soft sm:px-3" />
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={cx("px-1.5 py-4 text-start align-bottom sm:px-3", highlight === col.key && "border-t-[3px] border-kyrenia")}
              >
                <span className="type-display block text-lead sm:text-h3">{col.name}</span>
                <span className="mt-1 block">
                  <Price amount={col.priceFromGBP} size="md" />
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-rule">
              <th scope="row" className="px-1.5 py-3 text-start font-medium sm:px-3">
                {row.label}
              </th>
              {row.values.map((value, i) => (
                <td key={columns[i]?.key ?? i} className="px-1.5 py-3 align-top sm:px-3">
                  {cell(value)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {footer ? (
          <tfoot className="hidden sm:table-footer-group">
            <tr>
              <td />
              {columns.map((col) => (
                <td key={col.key} className="px-1.5 py-4 sm:px-3">
                  {footer(col)}
                </td>
              ))}
            </tr>
          </tfoot>
        ) : null}
      </table>
      {mobileFooter ? <div className="mt-6 sm:hidden">{mobileFooter}</div> : null}
    </div>
  );
}
