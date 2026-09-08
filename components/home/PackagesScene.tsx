"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Button } from "@/components/ui/Button";
import { cx } from "@/lib/cx";
import { formatGBP } from "@/lib/format/price";
import { getGsap, headerHeightPx } from "@/lib/motion/gsap";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";

export interface PackageState {
  key: string;
  name: string;
  note: string;
  priceFromGBP: number;
  inclusions: string[];
}

interface PlanLabels {
  living: string;
  livingRoom: string;
  kitchen: string;
  bath: string;
  bedroom: string;
  terrace: string;
  scroll: string;
}

interface PackagesSceneProps {
  packages: [PackageState, PackageState, PackageState];
  labels: PlanLabels;
  cta: string;
  className?: string;
}

/** Scroll windows in which each plan stage draws itself: base plan, first bedroom, second bedroom. */
const STAGES: Array<[number, number]> = [
  [-1, -0.5],
  [0.26, 0.46],
  [0.6, 0.8],
];

function stageProgress(p: number, i: number) {
  const [a, b] = STAGES[i];
  return Math.min(1, Math.max(0, (p - a) / (b - a)));
}

function stateIndex(p: number) {
  return p < 0.26 ? 0 : p < 0.6 ? 1 : 2;
}

function priceAt(p: number, prices: number[]) {
  const s1 = stageProgress(p, 1);
  const s2 = stageProgress(p, 2);
  let value = prices[0] + (prices[1] - prices[0]) * s1;
  if (s1 >= 1) value = prices[1] + (prices[2] - prices[1]) * s2;
  return Math.round(value / 100) * 100;
}

/**
 * The packages scene (PLAN.md §5): a brass line drawing of the apartment grows from Studio to 1+1
 * to 2+1 while the price counts up. Pinned for three viewport heights; scrubbed, never timed.
 * Rendered from the md breakpoint up; the section shows static cards below that and for reduced motion.
 */
export function PackagesScene({ packages, labels, cta, className }: PackagesSceneProps) {
  const locale = useLocale();
  const t = useTranslations("packages");
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const planRef = useRef<SVGSVGElement>(null);
  const [state, setState] = useState(0);
  const [price, setPrice] = useState(packages[0].priceFromGBP);
  const prices = packages.map((p) => p.priceFromGBP);

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const plan = planRef.current;
    if (!section || !plan) return;
    const { ScrollTrigger } = getGsap();

    let raf = 0;
    let pending = 0;
    let lastState = -1;
    let lastPrice = -1;
    const apply = () => {
      raf = 0;
      const p = pending;
      plan.style.setProperty("--draw-1", stageProgress(p, 1).toFixed(3));
      plan.style.setProperty("--draw-2", stageProgress(p, 2).toFixed(3));
      const s = stateIndex(p);
      if (s !== lastState) {
        lastState = s;
        setState(s);
      }
      const v = priceAt(p, prices);
      if (v !== lastPrice) {
        lastPrice = v;
        setPrice(v);
      }
    };
    const update = (p: number) => {
      pending = p;
      if (!raf) raf = requestAnimationFrame(apply);
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
      cancelAnimationFrame(raf);
      trigger.kill();
    };
    // prices is derived from props and stable for the life of the scene
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  if (reduced) {
    return <PackageCards packages={packages} cta={cta} className={className} />;
  }

  const priceNode = <span className="type-display tabular text-display leading-none text-brass">{formatGBP(price, locale)}</span>;

  return (
    <section ref={sectionRef} className={cx("relative", className)} style={{ height: "300dvh" }}>
      <div className="sticky top-(--header-height) flex h-[calc(100dvh-var(--header-height))] items-center">
        <div className="mx-auto grid w-full max-w-(--content-max) grid-cols-[1.15fr_1fr] items-center gap-16 px-(--gutter)">
          <FloorPlan ref={planRef} labels={labels} />

          <div className="relative">
            {packages.map((pkg, i) => (
              <div
                key={pkg.key}
                aria-hidden={state !== i}
                className={cx(
                  "transition-opacity duration-(--dur-text) ease-soft",
                  i === state ? "relative opacity-100" : "pointer-events-none absolute inset-0 opacity-0",
                )}
              >
                <p className="eyebrow">{pkg.note}</p>
                <h3 className="type-display mt-4 text-display text-ivory">{pkg.name}</h3>
                <ul className="mt-8 divide-y divide-rule-soft border-y border-rule-soft text-sand">
                  {pkg.inclusions.map((item) => (
                    <li key={item} className="py-3">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <p className="mt-8 inline-flex flex-wrap items-baseline gap-x-3 text-small text-sand">
              {t.rich("from", { price: formatGBP(price, locale), b: () => priceNode })}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Button href="/packages">{cta}</Button>
              <span className="flex items-center gap-2" aria-hidden="true">
                {packages.map((pkg, i) => (
                  <span key={pkg.key} className={cx("h-px w-8 transition-colors duration-(--dur-ui)", i <= state ? "bg-brass" : "bg-umber")} />
                ))}
              </span>
            </div>
            <p className="mt-6 text-micro uppercase tracking-[0.18em] text-sand/60">{labels.scroll}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Static cards for small screens and reduced motion. */
export function PackageCards({ packages, cta, className }: { packages: PackageState[]; cta: string; className?: string }) {
  const locale = useLocale();
  const t = useTranslations("packages");
  return (
    <div className={cx("grid gap-6 md:grid-cols-3", className)}>
      {packages.map((pkg) => (
        <article key={pkg.key} className="card flex flex-col p-7">
          <p className="eyebrow">{pkg.note}</p>
          <h3 className="type-display mt-4 text-h2 text-ivory">{pkg.name}</h3>
          <p className="mt-4 inline-flex flex-wrap items-baseline gap-x-2 text-small text-sand">
            {t.rich("from", {
              price: formatGBP(pkg.priceFromGBP, locale),
              b: () => <span className="type-display tabular text-h2 leading-none text-brass">{formatGBP(pkg.priceFromGBP, locale)}</span>,
            })}
          </p>
          <ul className="mt-6 flex-1 divide-y divide-rule-soft border-y border-rule-soft text-small text-sand">
            {pkg.inclusions.map((item) => (
              <li key={item} className="py-2.5">
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <Button href="/packages" variant="secondary" size="sm">
              {cta}
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}

const draw = (i: 0 | 1 | 2): CSSProperties =>
  ({ strokeDasharray: 1, strokeDashoffset: `calc(1 - var(--draw-${i}, 0))` }) as CSSProperties;
const fade = (i: 0 | 1 | 2): CSSProperties => ({ opacity: `var(--draw-${i}, 0)` });

import { forwardRef } from "react";

/** Brass line drawing. Each stage draws with stroke-dashoffset driven by --draw-N on the svg element. */
const FloorPlan = forwardRef<SVGSVGElement, { labels: PlanLabels }>(function FloorPlan({ labels }, ref) {
  const stroke = "var(--brass)";
  const text = "fill-sand text-[13px] tracking-[0.08em] uppercase";
  return (
    <svg
      ref={ref}
      viewBox="0 0 600 420"
      className="w-full [direction:ltr]"
      role="img"
      aria-label="Floor plan growing from studio to two bedrooms"
      style={{ "--draw-0": 1, "--draw-1": 0, "--draw-2": 0 } as CSSProperties}
    >
      {/* Stage 0: studio */}
      <g fill="none" stroke={stroke} strokeWidth="1.5" strokeLinejoin="miter">
        <rect x="40" y="40" width="320" height="300" pathLength={1} style={draw(0)} />
        <path d="M40 130 H200 V40" pathLength={1} style={draw(0)} />
        <rect x="360" y="40" width="100" height="120" pathLength={1} style={draw(0)} />
        <path d="M40 340 H360 V390 H40 Z" pathLength={1} strokeDasharray="4 6" style={{ ...draw(0), strokeDasharray: 1 }} />
        <path d="M200 40 Q 200 80 240 80" pathLength={1} style={draw(0)} strokeWidth="1" />
      </g>
      <g className={text} style={fade(0)}>
        <text x="60" y="230">{labels.living}</text>
        <text x="60" y="95">{labels.kitchen}</text>
        <text x="380" y="105">{labels.bath}</text>
        <text x="60" y="372">{labels.terrace}</text>
      </g>

      {/* Stage 1: first bedroom */}
      <g fill="none" stroke={stroke} strokeWidth="1.5">
        <rect x="360" y="160" width="200" height="180" pathLength={1} style={draw(1)} />
        <path d="M360 250 Q 400 250 400 210" pathLength={1} style={draw(1)} strokeWidth="1" />
      </g>
      <g className={text} style={fade(1)}>
        <text x="380" y="260">{labels.bedroom}</text>
      </g>

      {/* Stage 2: second bedroom */}
      <g fill="none" stroke={stroke} strokeWidth="1.5">
        <rect x="460" y="40" width="100" height="120" pathLength={1} style={draw(2)} />
      </g>
      <g className={text} style={fade(2)}>
        <text x="478" y="105">{labels.bedroom}</text>
      </g>
    </svg>
  );
});
