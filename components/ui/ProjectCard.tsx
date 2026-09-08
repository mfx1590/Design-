"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cx } from "@/lib/cx";

interface ProjectCardProps {
  title: string;
  /** One line: city · apartment type · package */
  meta: string;
  afterSrc: string;
  beforeSrc: string;
  alt: string;
  hasVideo?: boolean;
  /** Image ratio. Cards use 3:2, the featured project uses 16:9 or 21:9. */
  ratio?: "3/2" | "16/9" | "21/9" | "4/3";
  sizes?: string;
  /** Project slug; when given, the title links to the project page. */
  slug?: string;
  /** Hide title and meta (the featured block renders its own). */
  imageOnly?: boolean;
  priority?: boolean;
  className?: string;
}

const ratioClass = { "3/2": "aspect-[3/2]", "16/9": "aspect-video", "21/9": "aspect-[21/9]", "4/3": "aspect-[4/3]" };

const chip = "pointer-events-none absolute bg-surface/75 px-2.5 py-1 text-micro font-medium uppercase tracking-[0.12em] text-ink backdrop-blur-sm";

/**
 * Aperture with the finished room; hover or tap wipes the empty room in from the inline-start edge
 * (mirrored in RTL). Reduced motion: no transition, the toggle still works.
 */
export function ProjectCard({ title, meta, afterSrc, beforeSrc, alt, hasVideo, ratio = "3/2", sizes, slug, imageOnly, priority, className }: ProjectCardProps) {
  const [showBefore, setShowBefore] = useState(false);
  const t = useTranslations("card");
  const imgSizes = sizes ?? "(min-width: 1024px) 33vw, 100vw";

  return (
    <article className={cx("group", className)}>
      <div className={cx("aperture overflow-hidden bg-surface-alt", ratioClass[ratio])}>
        <Image src={afterSrc} alt={alt} fill sizes={imgSizes} priority={priority} className="object-cover" />
        <div
          aria-hidden="true"
          className={cx(
            "absolute inset-0 transition-[clip-path] duration-700 ease-soft motion-reduce:transition-none",
            showBefore
              ? "[clip-path:inset(0)]"
              : "[clip-path:inset(0_100%_0_0)] group-hover:[clip-path:inset(0)] rtl:[clip-path:inset(0_0_0_100%)] rtl:group-hover:[clip-path:inset(0)]",
          )}
        >
          <Image src={beforeSrc} alt="" fill sizes={imgSizes} className="object-cover" />
        </div>

        <button
          type="button"
          aria-pressed={showBefore}
          onClick={() => setShowBefore((v) => !v)}
          className="absolute inset-0 z-10 cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-brass"
        >
          <span className="sr-only">{showBefore ? t("showAfter") : t("showBefore")}</span>
        </button>

        <span className={cx(chip, "bottom-4 start-4 border border-terracotta/80")}>
          <span className="group-hover:hidden">{showBefore ? t("before") : t("after")}</span>
          <span className="hidden group-hover:inline">{showBefore ? t("after") : t("before")}</span>
        </span>

        {hasVideo ? (
          <span className={cx(chip, "end-4 top-4 inline-flex items-center gap-1.5 border border-brass/60")}>
            <span aria-hidden="true" className="inline-block size-0 border-y-[4px] border-s-[7px] border-y-transparent border-s-brass" />
            {t("realVideo")}
          </span>
        ) : null}
      </div>

      {imageOnly ? null : (
        <>
          <h3 className="type-display mt-4 text-h3 text-ink">
            {slug ? (
              <Link href={{ pathname: "/portfolio/[slug]", params: { slug } }} className="transition-colors hover:text-brass">
                {title}
              </Link>
            ) : (
              title
            )}
          </h3>
          <p className="mt-1.5 text-small text-ink-soft">{meta}</p>
        </>
      )}
    </article>
  );
}
