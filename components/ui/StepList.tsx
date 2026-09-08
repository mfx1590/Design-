import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

interface Step {
  title: string;
  body: ReactNode;
}

interface StepListProps {
  steps: Step[];
  /** "list": one step per row with rules. "grid": three per row, numerals large, no rules. */
  variant?: "list" | "grid";
}

/** The one place numbering is allowed: a real sequence. Cormorant numerals in brass. */
export function StepList({ steps, variant = "list" }: StepListProps) {
  if (variant === "grid") {
    return (
      <ol className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, i) => (
          <li key={step.title} className="border-t border-rule pt-6">
            <span aria-hidden="true" className="type-display tabular block text-display leading-none text-brass">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="type-display mt-5 text-h3 text-ivory">
              <span className="sr-only">{i + 1}. </span>
              {step.title}
            </h3>
            <p className="mt-3 max-w-(--measure) text-sand">{step.body}</p>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ol className="divide-y divide-rule border-y border-rule">
      {steps.map((step, i) => (
        <li key={step.title} className={cx("grid gap-x-8 gap-y-2 py-7 sm:grid-cols-[6rem_1fr]")}>
          <span aria-hidden="true" className="type-display tabular text-display leading-none text-brass">
            {i + 1}
          </span>
          <div>
            <h3 className="type-display text-h3 text-ivory">
              <span className="sr-only">{i + 1}. </span>
              {step.title}
            </h3>
            <p className="mt-2 max-w-(--measure) text-sand">{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
