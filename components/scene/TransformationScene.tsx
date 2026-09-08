"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cx } from "@/lib/cx";
import { getGsap, headerHeightPx } from "@/lib/motion/gsap";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";

export type SceneTier = "sequence" | "video" | "wipe";

export interface SequenceSet {
  /** e.g. /sequences/project-01-studio — frames live at basePath/<width>/frame-001.webp */
  basePath: string;
  width: number;
  height: number;
  frameCount: number;
  pad?: number;
}

export interface VideoSet {
  mp4: string;
  webm?: string;
}

export interface SceneImage {
  src: string;
  alt: string;
}

export interface TransformationSceneProps {
  tier: SceneTier;
  before: SceneImage;
  after: SceneImage;
  sequence?: { desktop: SequenceSet; mobile?: SequenceSet };
  video?: { desktop: VideoSet; mobile?: VideoSet };
  /** Small brass label above the headline. */
  eyebrow?: string;
  /** Headline that switches from the "before" line to the "after" line at switchAt (0-1, default 0.6). */
  headline?: { before: string; after: string; switchAt?: number };
  lead?: string;
  actions?: ReactNode;
  /** Small honesty label, e.g. "Visualisation based on a completed project". */
  note?: string;
  labels: { before: string; after: string };
  /** Scroll distance of the pinned scene in viewport heights (default 2). */
  pinHeights?: number;
  priority?: boolean;
  /** "hero" renders an h1; "section" renders an h2. */
  headingLevel?: "hero" | "section";
  /**
   * Drive the site-wide day-to-dusk blend (the --dusk token) from this scene's progress,
   * so the whole interface furnishes itself along with the room. One scene per page.
   */
  duskSync?: boolean;
  className?: string;
}

const MOBILE_QUERY = "(max-width: 767px)";

function frameUrl(set: SequenceSet, index: number) {
  return `${set.basePath}/${set.width}/frame-${String(index + 1).padStart(set.pad ?? 3, "0")}.webp`;
}

/** First, last, then midpoints breadth-first, so early scrubbing already has coarse coverage. */
function loadOrder(count: number): number[] {
  const order = [0, count - 1];
  const seen = new Set(order);
  const queue: Array<[number, number]> = [[0, count - 1]];
  while (queue.length) {
    const [a, b] = queue.shift() as [number, number];
    const m = (a + b) >> 1;
    if (m === a || m === b || seen.has(m)) continue;
    seen.add(m);
    order.push(m);
    queue.push([a, m], [m, b]);
  }
  for (let i = 0; i < count; i++) if (!seen.has(i)) order.push(i);
  return order;
}

/** Hero progress → dusk percentage. The blend runs from 10 % to 65 % of the scroll so text stays legible at both ends. */
function duskFor(progress: number) {
  const t = Math.min(1, Math.max(0, (progress - 0.12) / 0.5));
  const eased = t * t * (3 - 2 * t); // smoothstep: less time spent in the muddy middle
  return `${Math.round(eased * 100)}%`;
}

function setDusk(value: string | null) {
  const root = document.documentElement;
  if (value === null) root.style.removeProperty("--dusk");
  else root.style.setProperty("--dusk", value);
}

/**
 * The signature "empty → home" scene (PLAN.md §5). Scroll position drives the transformation;
 * nothing plays on its own. Three tiers share one API: frame sequence on a canvas (preferred),
 * scrubbed video, or a clip-path wipe between two photos. Reduced motion renders a static pair.
 * The section is tall (pinHeights × viewport); the visual frame is CSS-sticky under the header.
 */
export function TransformationScene(props: TransformationSceneProps) {
  const {
    tier,
    before,
    after,
    sequence,
    video,
    eyebrow,
    headline,
    lead,
    actions,
    note,
    labels,
    pinHeights = 2,
    priority,
    headingLevel = "hero",
    duskSync,
    className,
  } = props;
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const afterLayerRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"before" | "after">("before");
  const [ready, setReady] = useState(tier === "wipe");
  const switchAt = headline?.switchAt ?? 0.6;

  // Reduced motion: the page rests furnished.
  useEffect(() => {
    if (!duskSync || !reduced) return;
    setDusk("100%");
    return () => setDusk(null);
  }, [duskSync, reduced]);

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    if (!section) return;
    const { ScrollTrigger } = getGsap();
    const isRtl = getComputedStyle(section).direction === "rtl";
    const isMobile = window.matchMedia(MOBILE_QUERY).matches;
    const abort = new AbortController();
    let render: (progress: number) => void = () => {};
    let cleanupTier = () => {};

    if (tier === "sequence" && sequence) {
      const set = isMobile && sequence.mobile ? sequence.mobile : sequence.desktop;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx) {
        canvas.width = set.width;
        canvas.height = set.height;
        const frames: Array<HTMLImageElement | undefined> = new Array(set.frameCount);
        let loaded = 0;
        let lastDrawn = -1;
        let isReady = false;
        let latest = 0;

        const draw = (progress: number) => {
          if (!isReady) return;
          const target = Math.round(progress * (set.frameCount - 1));
          let index = -1;
          for (let d = 0; d < set.frameCount; d++) {
            if (frames[target - d]) { index = target - d; break; }
            if (frames[target + d]) { index = target + d; break; }
          }
          if (index < 0 || index === lastDrawn) return;
          ctx.drawImage(frames[index] as HTMLImageElement, 0, 0, canvas.width, canvas.height);
          lastDrawn = index;
        };
        render = (p) => { latest = p; draw(p); };

        const order = loadOrder(set.frameCount);
        let cursor = 0;
        const worker = async () => {
          while (cursor < order.length && !abort.signal.aborted) {
            const i = order[cursor++];
            const img = new window.Image();
            img.decoding = "async";
            img.src = frameUrl(set, i);
            try {
              await img.decode();
            } catch {
              continue;
            }
            if (abort.signal.aborted) return;
            frames[i] = img;
            loaded++;
            // Inert until the ends and a fifth of the frames are in (PLAN.md §5 rules).
            if (!isReady && frames[0] && frames[set.frameCount - 1] && loaded >= Math.ceil(set.frameCount / 5)) {
              isReady = true;
              setReady(true);
              draw(latest);
            } else if (isReady) {
              draw(latest);
            }
          }
        };
        Promise.all(Array.from({ length: 6 }, worker)).catch(() => {});
      }
    } else if (tier === "video" && video) {
      const el = videoRef.current;
      if (el) {
        const onMeta = () => setReady(true);
        el.addEventListener("loadedmetadata", onMeta);
        if (el.readyState >= 1) setReady(true);
        render = (p) => {
          if (el.readyState < 1 || !Number.isFinite(el.duration)) return;
          const t = p * el.duration;
          if (Math.abs(el.currentTime - t) > 1 / 30) el.currentTime = t;
        };
        cleanupTier = () => el.removeEventListener("loadedmetadata", onMeta);
      }
    } else {
      const layer = afterLayerRef.current;
      if (layer) {
        render = (p) => {
          const hidden = ((1 - p) * 100).toFixed(2);
          layer.style.clipPath = isRtl ? `inset(0 0 0 ${hidden}%)` : `inset(0 ${hidden}% 0 0)`;
        };
        render(0);
      }
    }

    let raf = 0;
    let pending = 0;
    let currentPhase: "before" | "after" = "before";
    let lastDusk = "";
    const update = (progress: number) => {
      pending = progress;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        render(pending);
        if (railRef.current) railRef.current.style.transform = `scaleX(${pending})`;
        if (duskSync) {
          const d = duskFor(pending);
          if (d !== lastDusk) {
            lastDusk = d;
            setDusk(d);
          }
        }
        const next = pending >= switchAt ? "after" : "before";
        if (next !== currentPhase) {
          currentPhase = next;
          setPhase(next);
        }
      });
    };

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: () => `top ${headerHeightPx()}px`,
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => update(self.progress),
    });
    update(trigger.progress);

    return () => {
      abort.abort();
      cancelAnimationFrame(raf);
      trigger.kill();
      cleanupTier();
      if (duskSync) setDusk(null);
    };
  }, [tier, sequence, video, reduced, switchAt, duskSync]);

  const Heading = headingLevel === "hero" ? "h1" : "h2";
  const headingSize = headingLevel === "hero" ? "text-hero" : "text-display";

  const textBlock = (
    <div className="max-w-3xl">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      {headline ? (
        <Heading className={cx("type-display mt-5 text-ink", headingSize)}>
          <span className="sr-only">{headline.after}</span>
          <span aria-hidden="true" className="relative block">
            <span className={cx("block transition-opacity duration-(--dur-text) ease-soft", phase === "after" && "opacity-0")}>
              {headline.before}
            </span>
            <span className={cx("absolute inset-0 block transition-opacity duration-(--dur-text) ease-soft", phase === "before" && "opacity-0")}>
              {headline.after}
            </span>
          </span>
        </Heading>
      ) : null}
      {lead ? <p className="mt-6 max-w-(--measure) text-lead text-ink-soft">{lead}</p> : null}
      {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
      <div className="mt-8 h-px w-full max-w-md bg-ink/20" aria-hidden="true">
        <div ref={railRef} className="h-full origin-left bg-brass rtl:origin-right" style={{ transform: "scaleX(0)" }} />
      </div>
    </div>
  );

  if (reduced) {
    return (
      <section ref={sectionRef} className={cx("surface py-(--section)", className)} data-dusk-scene={duskSync ? "" : undefined}>
        <div className="mx-auto w-full max-w-(--content-max) px-(--gutter)">
          <div className="grid gap-4 md:grid-cols-2">
            <figure className="m-0">
              <div className="aperture aspect-[4/3] overflow-hidden bg-surface-alt">
                <Image src={before.src} alt={before.alt} fill sizes="(min-width: 768px) 50vw, 100vw" priority={priority} className="object-cover" />
              </div>
              <figcaption className="mt-3 text-small text-ink-soft">{labels.before}</figcaption>
            </figure>
            <figure className="m-0">
              <div className="aperture aspect-[4/3] overflow-hidden bg-surface-alt">
                <Image src={after.src} alt={after.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
              </div>
              <figcaption className="mt-3 text-small text-ink-soft">{labels.after}</figcaption>
            </figure>
          </div>
          <div className="mt-10">
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            {headline ? <Heading className="type-display mt-5 text-display text-ink">{headline.after}</Heading> : null}
            {lead ? <p className="mt-6 max-w-(--measure) text-lead text-ink-soft">{lead}</p> : null}
            {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
            {note ? <p className="mt-4 text-micro text-ink-soft/80">{note}</p> : null}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className={cx("relative bg-surface", className)}
      style={{ height: `${pinHeights * 100}dvh` }}
      data-dusk-scene={duskSync ? "" : undefined}
    >
      <div className="sticky top-(--header-height) h-[calc(100dvh-var(--header-height))] w-full overflow-hidden" data-ready={ready}>
        {/* Poster: the empty room, shown until the tier is ready. Also the LCP image. */}
        <div className={cx("absolute inset-0 transition-opacity duration-500 ease-soft", ready && tier !== "wipe" && "opacity-0")}>
          <Image src={before.src} alt={before.alt} fill sizes="100vw" priority={priority} className="object-cover" />
        </div>

        {tier === "sequence" ? (
          <canvas ref={canvasRef} role="img" aria-label={after.alt} className="absolute inset-0 h-full w-full object-cover" />
        ) : null}

        {tier === "video" && video ? (
          <video ref={videoRef} muted playsInline preload="auto" aria-label={after.alt} className="absolute inset-0 h-full w-full object-cover">
            {video.desktop.webm ? <source src={video.desktop.webm} type="video/webm" /> : null}
            <source src={video.desktop.mp4} type="video/mp4" />
          </video>
        ) : null}

        {tier === "wipe" ? (
          <div ref={afterLayerRef} className="absolute inset-0" style={{ clipPath: "inset(0 100% 0 0)" }}>
            <Image src={after.src} alt={after.alt} fill sizes="100vw" className="object-cover" />
          </div>
        ) : null}

        {/* Legibility: a gradient from the bottom in the current surface colour, never a box. */}
        <div className="scrim-bottom pointer-events-none absolute inset-x-0 bottom-0 h-[88%]" aria-hidden="true" />

        <div className="absolute inset-x-0 bottom-0 px-(--gutter) pb-10 md:pb-14">
          <div className="mx-auto w-full max-w-(--content-max)">{textBlock}</div>
        </div>
        {note ? (
          <p className="absolute end-(--gutter) top-5 bg-surface/60 px-2.5 py-1 text-micro text-ink-soft backdrop-blur-sm">{note}</p>
        ) : null}
      </div>
    </section>
  );
}
