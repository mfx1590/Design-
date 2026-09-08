"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { cx } from "@/lib/cx";

interface ProjectCardProps {
  title: string;
  /** One line: city · apartment type · package */
  meta: string;
  afterSrc: string;
  beforeSrc: string;
  alt: string;
  hasVideo?: boolean;
  /** Rendered around the title (a Link in real pages). */
  titleWrap?: (title: string) => React.ReactNode;
}

/**
 * Aperture with the finished room; hover or tap wipes the empty room in from the inline-start edge
 * (mirrored in RTL). Reduced motion: no transition, the toggle still works.
 */
export function ProjectCard({ title, meta, afterSrc, beforeSrc, alt, hasVideo, titleWrap }: ProjectCardProps) {
  const [showBefore, setShowBefore] = useState(false);
  const t = useTranslations("card");

  return (
    <article className="group">
      <div className="aperture relative aspect-[3/2] overflow-hidden bg-porcelain">
        <Image src={afterSrc} alt={alt} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
        <div
          aria-hidden="true"
          className={cx(
            "absolute inset-0 transition-[clip-path] duration-500 ease-soft motion-reduce:transition-none",
            showBefore
              ? "[clip-path:inset(0)]"
              : "[clip-path:inset(0_100%_0_0)] group-hover:[clip-path:inset(0)] rtl:[clip-path:inset(0_0_0_100%)] rtl:group-hover:[clip-path:inset(0)]",
          )}
        >
          <Image src={beforeSrc} alt="" fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
        </div>

        <button
          type="button"
          aria-pressed={showBefore}
          onClick={() => setShowBefore((v) => !v)}
          className="absolute inset-0 cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-kyrenia"
        >
          <span className="sr-only">{showBefore ? t("showAfter") : t("showBefore")}</span>
        </button>

        <span className="pointer-events-none absolute bottom-3 start-3 bg-frame px-2 py-1 text-micro font-medium text-plaster">
          <span className="group-hover:hidden">{showBefore ? t("before") : t("after")}</span>
          <span className="hidden group-hover:inline">{showBefore ? t("after") : t("before")}</span>
        </span>

        {hasVideo ? (
          <span className="pointer-events-none absolute end-3 top-3 inline-flex items-center gap-1.5 bg-frame px-2 py-1 text-micro font-medium text-plaster">
            <span aria-hidden="true" className="inline-block size-0 border-y-[5px] border-s-[8px] border-y-transparent border-s-plaster" />
            {t("realVideo")}
          </span>
        ) : null}
      </div>

      <h3 className="type-display mt-3 text-h3">{titleWrap ? titleWrap(title) : title}</h3>
      <p className="mt-1 text-small text-ink-soft">{meta}</p>
    </article>
  );
}
