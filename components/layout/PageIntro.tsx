import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { cx } from "@/lib/cx";

interface PageIntroProps {
  eyebrow: string;
  title: ReactNode;
  /** The two-to-three sentence plain-language answer the page exists for (PLAN.md §9 GEO). */
  lead?: ReactNode;
  /** Right-hand block on wide screens: a price, a fact list, an image. */
  aside?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/** Top of every inner page: eyebrow, Cormorant h1, the direct answer, optional aside. Mobile stacks. */
export function PageIntro({ eyebrow, title, lead, aside, children, className }: PageIntroProps) {
  return (
    <div className={cx("surface pt-12 pb-(--section) sm:pt-16 lg:pt-20", className)}>
      <Container className={cx("grid gap-10", aside ? "lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-20" : "")}>
        <div className="max-w-3xl">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="type-display mt-4 text-display text-ink">{title}</h1>
          {lead ? <p className="mt-6 max-w-(--measure) text-lead text-ink-soft">{lead}</p> : null}
          {children ? <div className="mt-8">{children}</div> : null}
        </div>
        {aside ? <div>{aside}</div> : null}
      </Container>
    </div>
  );
}
