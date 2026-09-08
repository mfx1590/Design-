import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { cx } from "@/lib/cx";

interface SectionProps {
  children: ReactNode;
  /** Sections alternate Night and Espresso instead of using divider lines. */
  surface?: "night" | "espresso";
  id?: string;
  labelledBy?: string;
  className?: string;
  /** Skip the inner container for full-bleed content (scenes). */
  bleed?: boolean;
}

const surfaceClass = { night: "surface", espresso: "surface-alt" };

export function Section({ children, surface = "night", id, labelledBy, className, bleed }: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cx(surfaceClass[surface], bleed ? "" : "py-(--section)", className)}>
      {bleed ? children : <Container>{children}</Container>}
    </section>
  );
}

interface SectionHeaderProps {
  id: string;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  /** Right-hand slot on wide screens (a button, a link). */
  aside?: ReactNode;
  className?: string;
}

/** Eyebrow, Cormorant title, optional lead. The only place an eyebrow is allowed. */
export function SectionHeader({ id, eyebrow, title, lead, aside, className }: SectionHeaderProps) {
  return (
    <div className={cx("flex flex-wrap items-end justify-between gap-x-12 gap-y-6", className)}>
      <div className="max-w-3xl">
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={id} className="type-display mt-4 text-h2 text-ivory">
          {title}
        </h2>
        {lead ? <p className="mt-5 max-w-(--measure) text-lead text-sand">{lead}</p> : null}
      </div>
      {aside ? <div className="shrink-0">{aside}</div> : null}
    </div>
  );
}
