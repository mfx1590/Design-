import Image from "next/image";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export type Ratio = "16/9" | "3/2" | "4/3" | "1/1" | "3/4" | "9/16" | "21/9";

const ratioClass: Record<Ratio, string> = {
  "16/9": "aspect-video",
  "3/2": "aspect-[3/2]",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
  "3/4": "aspect-[3/4]",
  "9/16": "aspect-[9/16]",
  "21/9": "aspect-[21/9]",
};

interface ApertureProps {
  src: string;
  alt: string;
  ratio?: Ratio;
  sizes?: string;
  priority?: boolean;
  caption?: ReactNode;
  className?: string;
  /** Overlays (labels, scrims, wipes) rendered inside the frame. */
  children?: ReactNode;
}

/**
 * Every photograph sits in a 1px umber frame that warms to brass on hover, with a soft
 * inner vignette so the picture glows against the dark page (docs/design-plan-v3.md §4).
 */
export function Aperture({
  src,
  alt,
  ratio = "3/2",
  sizes = "(min-width: 1024px) 33vw, 100vw",
  priority,
  caption,
  className,
  children,
}: ApertureProps) {
  return (
    <figure className={cx("m-0", className)}>
      <div className={cx("aperture overflow-hidden bg-surface-alt", ratioClass[ratio])}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
        {children}
      </div>
      {caption ? <figcaption className="mt-3 text-small text-ink-soft">{caption}</figcaption> : null}
    </figure>
  );
}
