import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { cx } from "@/lib/cx";

interface SectionProps {
  children: ReactNode;
  /** Sections alternate surfaces instead of using divider lines. */
  surface?: "plaster" | "porcelain" | "frame";
  id?: string;
  labelledBy?: string;
  className?: string;
  /** Skip the inner container for full-bleed content (scenes). */
  bleed?: boolean;
}

const surfaceClass = { plaster: "surface", porcelain: "surface-alt", frame: "surface-frame" };

export function Section({ children, surface = "plaster", id, labelledBy, className, bleed }: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cx(surfaceClass[surface], bleed ? "" : "py-(--section)", className)}>
      {bleed ? children : <Container>{children}</Container>}
    </section>
  );
}
