import type { ReactNode } from "react";

interface Step {
  title: string;
  body: ReactNode;
}

/** The one place numbering is allowed: a real sequence (how it works). Display numerals in Walnut, rules between steps. */
export function StepList({ steps }: { steps: Step[] }) {
  return (
    <ol className="divide-y divide-rule border-y border-rule">
      {steps.map((step, i) => (
        <li key={step.title} className="grid gap-x-8 gap-y-2 py-6 sm:grid-cols-[6rem_1fr]">
          <span aria-hidden="true" className="type-display tabular text-display text-walnut">
            {i + 1}
          </span>
          <div>
            <h3 className="type-display text-h3">
              <span className="sr-only">{i + 1}. </span>
              {step.title}
            </h3>
            <p className="mt-2 max-w-(--measure) text-ink-soft">{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
