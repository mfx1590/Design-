"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { forwardRef, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/Button";
import { cx } from "@/lib/cx";
import { formatGBP } from "@/lib/format/price";
import { getGsap, headerHeightPx } from "@/lib/motion/gsap";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";

export type TypeKey = "studio" | "onePlusOne" | "twoPlusOne";
export type RoomKey = "living" | "kitchen" | "bedroom" | "bathroom" | "terrace";
export const ROOM_ORDER: RoomKey[] = ["living", "kitchen", "bedroom", "bathroom", "terrace"];

export interface ApartmentType {
  key: TypeKey;
  name: string;
  note: string;
  priceFromGBP: number;
}

export interface Room {
  key: RoomKey;
  number: string;
  names: Record<TypeKey, string>;
  tagline: string;
  photo: { src: string; alt: string };
  scope: Record<TypeKey, string[]>;
  fact?: string;
}

export interface WalkLabels {
  choose: string;
  inPackage: string;
  fromProject: string;
  planAria: string;
  delivery: string;
  cta: Record<TypeKey, string>;
  plan: { living: string; livingRoom: string; kitchen: string; bath: string; bedroom: string; terrace: string };
}

interface ApartmentWalkProps {
  types: ApartmentType[];
  rooms: Room[];
  labels: WalkLabels;
}

/**
 * The apartment walk (v4 concept): a floor plan pinned beside the rooms. Pick the apartment type;
 * scroll the rooms; each room's furniture is drawn into the plan from above as it passes.
 * Scrubbed by ScrollTrigger, never timed. Reduced motion: everything drawn, no scrubbing.
 */
export function ApartmentWalk({ types, rooms, labels }: ApartmentWalkProps) {
  const locale = useLocale();
  const t = useTranslations("packages");
  const reduced = useReducedMotion();
  const [type, setType] = useState<TypeKey>("onePlusOne");
  const [active, setActive] = useState<RoomKey>("living");
  const planRef = useRef<SVGSVGElement>(null);
  const roomRefs = useRef<Partial<Record<RoomKey, HTMLLIElement | null>>>({});

  useEffect(() => {
    const plan = planRef.current;
    if (!plan) return;
    if (reduced) {
      for (const key of ROOM_ORDER) plan.style.setProperty(`--fill-${key}`, "1");
      return;
    }
    const { ScrollTrigger } = getGsap();
    const triggers = ROOM_ORDER.flatMap((key) => {
      const el = roomRefs.current[key];
      if (!el) return [];
      return [
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          end: "top 30%",
          scrub: true,
          onUpdate: (self) => plan.style.setProperty(`--fill-${key}`, self.progress.toFixed(3)),
        }),
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) setActive(key);
          },
        }),
      ];
    });
    return () => triggers.forEach((trigger) => trigger.kill());
  }, [reduced]);

  const current = types.find((x) => x.key === type) ?? types[0];
  const formatted = formatGBP(current.priceFromGBP, locale);

  const goTo = (key: RoomKey) => {
    const el = roomRefs.current[key];
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - headerHeightPx() - 24;
    window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <div className="mx-auto grid w-full max-w-(--content-max) gap-x-14 px-(--gutter) lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      {/* The plan instrument: sticky bar on small screens, pinned column on large ones. */}
      <aside className="sticky top-(--header-height) z-20 -mx-(--gutter) border-b border-rule bg-surface/90 px-(--gutter) py-3 backdrop-blur-md lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
        <div className="lg:sticky lg:top-(--header-height) lg:flex lg:h-[calc(100dvh-var(--header-height))] lg:flex-col lg:justify-center lg:py-10">
          <div role="tablist" aria-label={labels.choose} className="flex gap-6 border-b border-rule">
            {types.map((x) => (
              <button
                key={x.key}
                type="button"
                role="tab"
                aria-selected={x.key === type}
                onClick={() => setType(x.key)}
                className={cx(
                  "-mb-px border-b pb-2.5 text-small font-medium tracking-[0.04em] transition-colors duration-(--dur-ui) ease-soft lg:pb-3",
                  x.key === type ? "border-brass text-ink" : "border-transparent text-ink-soft hover:text-ink",
                )}
              >
                {x.name}
              </button>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-5 lg:mt-10 lg:block">
            <FloorPlan ref={planRef} type={type} active={active} onRoom={goTo} labels={labels.plan} aria={labels.planAria} />
            <div className="text-end lg:mt-8 lg:text-start">
              <p className="hidden text-micro uppercase tracking-[0.18em] text-ink-muted lg:block">{current.note}</p>
              <p className="inline-flex flex-wrap items-baseline justify-end gap-x-2 text-small text-ink-soft lg:mt-1 lg:justify-start">
                {t.rich("from", {
                  price: formatted,
                  b: () => <span className="type-display tabular text-h2 leading-none text-brass lg:text-display">{formatted}</span>,
                })}
              </p>
              <p className="mt-2 hidden text-small text-ink-soft lg:block">{labels.delivery}</p>
              <div className="mt-5 hidden lg:block">
                <Button href="/packages">{labels.cta[type]}</Button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* The rooms, in walking order. */}
      <ol className="divide-y divide-rule">
        {rooms.map((room) => (
          <li
            key={room.key}
            ref={(el) => {
              roomRefs.current[room.key] = el;
            }}
            data-room={room.key}
            className={cx("py-14 transition-opacity duration-(--dur-text) ease-soft lg:py-24", active === room.key ? "opacity-100" : "lg:opacity-60")}
          >
            <div className="flex items-baseline gap-5">
              <span aria-hidden="true" className="type-display tabular text-h3 text-brass">
                {room.number}
              </span>
              <div>
                <h3 className="type-display text-h2 text-ink">{room.names[type]}</h3>
                <p className="type-italic mt-1 text-lead text-ink-soft">{room.tagline}</p>
              </div>
            </div>

            <figure className="mt-8">
              <div className="aperture aspect-[3/2] overflow-hidden bg-surface-alt">
                <Image src={room.photo.src} alt={room.photo.alt} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
              </div>
              <figcaption className="mt-2 text-micro text-ink-muted">{labels.fromProject}</figcaption>
            </figure>

            <p className="mt-8 text-micro font-medium uppercase tracking-[0.18em] text-brass">{labels.inPackage}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {room.scope[type].map((item) => (
                <li key={item} className="border border-rule px-3 py-1.5 text-small text-ink-soft">
                  {item}
                </li>
              ))}
            </ul>
            {room.fact ? <p className="mt-6 max-w-(--measure) text-ink-soft">{room.fact}</p> : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---------- the plan ---------- */

interface FloorPlanProps {
  type: TypeKey;
  active: RoomKey;
  onRoom: (key: RoomKey) => void;
  labels: WalkLabels["plan"];
  aria: string;
}

/** Stroke draw for one shape, driven by the room fill variable on the svg element. */
const furnitureStyle = (room: RoomKey): CSSProperties =>
  ({
    strokeDasharray: 1,
    strokeDashoffset: `calc(1 - var(--fill-${room}, 0))`,
  }) as CSSProperties;

/** Group opacity for a room, optionally gated by the apartment type. */
const groupStyle = (room: RoomKey, on = true): CSSProperties =>
  ({ opacity: on ? `var(--fill-${room}, 0)` : 0, transition: "opacity 400ms var(--ease)" }) as CSSProperties;

const drawStyle = (on: boolean): CSSProperties => ({
  strokeDasharray: 1,
  strokeDashoffset: on ? 0 : 1,
  transition: "stroke-dashoffset 700ms var(--ease)",
});

const fadeStyle = (on: boolean): CSSProperties => ({ opacity: on ? 1 : 0, transition: "opacity 400ms var(--ease)" });

/**
 * Brass-and-ink line drawing. Walls in ink (they blend with day and dusk), furniture in brass.
 * Each room's furniture draws itself with stroke-dashoffset from --fill-<room> on the svg element;
 * the bedrooms appear or disappear with the apartment type. Rooms are clickable.
 */
const FloorPlan = forwardRef<SVGSVGElement, FloorPlanProps>(function FloorPlan({ type, active, onRoom, labels, aria }, ref) {
  const hasBed1 = type !== "studio";
  const hasBed2 = type === "twoPlusOne";
  const wall = "var(--ink)";
  const brass = "var(--brass)";
  const label = "fill-[var(--ink-soft)] text-[12px] uppercase tracking-[0.1em]";

  const hit = (key: RoomKey, x: number, y: number, w: number, h: number, visible = true) => (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      role="button"
      tabIndex={visible ? 0 : -1}
      aria-label={labels[key === "living" ? (type === "studio" ? "living" : "livingRoom") : key === "bathroom" ? "bath" : key]}
      onClick={() => onRoom(key)}
      onKeyDown={(e: KeyboardEvent<SVGRectElement>) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onRoom(key);
        }
      }}
      fill={brass}
      className="cursor-pointer outline-none transition-opacity duration-(--dur-text) ease-soft focus-visible:[filter:drop-shadow(0_0_2px_var(--brass))]"
      style={{ opacity: !visible ? 0 : active === key ? 0.14 : 0.001, pointerEvents: visible ? "auto" : "none" }}
    />
  );

  return (
    <svg
      ref={ref}
      viewBox="0 0 600 420"
      className="w-full max-h-32 lg:max-h-none [direction:ltr]"
      role="img"
      aria-label={aria}
      style={{ "--fill-living": 0, "--fill-kitchen": 0, "--fill-bedroom": 0, "--fill-bathroom": 0, "--fill-terrace": 0 } as CSSProperties}
    >
      {/* clickable room areas */}
      {hit("living", 40, 130, 320, 210)}
      {hit("kitchen", 40, 40, 160, 90)}
      {hit("bathroom", 360, 40, 100, 120)}
      {hit("bedroom", 360, 160, 200, 180, hasBed1)}
      {hit("terrace", 40, 340, 320, 50)}

      {/* walls */}
      <g fill="none" stroke={wall} strokeWidth="1.5">
        <rect x="40" y="40" width="320" height="300" />
        <path d="M40 130 H200 V40" />
        <rect x="360" y="40" width="100" height="120" />
        <path d="M40 340 H360 V390 H40 Z" strokeDasharray="4 6" />
        <path d="M200 40 Q200 80 240 80" strokeWidth="1" />
        <rect x="360" y="160" width="200" height="180" pathLength={1} style={drawStyle(hasBed1)} />
        <path d="M360 250 Q400 250 400 210" strokeWidth="1" pathLength={1} style={drawStyle(hasBed1)} />
        <rect x="460" y="40" width="100" height="120" pathLength={1} style={drawStyle(hasBed2)} />
      </g>

      {/* labels */}
      <g className={label}>
        <text x="58" y="335">{type === "studio" ? labels.living : labels.livingRoom}</text>
        <text x="58" y="122">{labels.kitchen}</text>
        <text x="372" y="152">{labels.bath}</text>
        <text x="58" y="373">{labels.terrace}</text>
        <text x="372" y="332" style={fadeStyle(hasBed1)}>{labels.bedroom}</text>
        <text x="472" y="152" style={fadeStyle(hasBed2)}>{labels.bedroom}</text>
      </g>

      {/* furniture, drawn in from above as each room scrolls past */}
      <g fill="none" stroke={brass} strokeWidth="1.25" strokeLinejoin="round">
        {/* living */}
        <g style={groupStyle("living")}>
          <rect x="215" y="165" width="130" height="42" pathLength={1} style={furnitureStyle("living")} />
          <path d="M215 178 H345" pathLength={1} style={furnitureStyle("living")} />
          <circle cx="280" cy="248" r="18" pathLength={1} style={furnitureStyle("living")} />
          <rect x="195" y="222" width="170" height="95" strokeDasharray="3 5" pathLength={1} style={{ ...furnitureStyle("living"), strokeDasharray: 1 }} />
          <path d="M355 178 V258" strokeWidth="4" pathLength={1} style={furnitureStyle("living")} />
        </g>
        {/* kitchen */}
        <g style={groupStyle("kitchen")}>
          <rect x="45" y="45" width="150" height="24" pathLength={1} style={furnitureStyle("kitchen")} />
          <circle cx="95" cy="57" r="6" pathLength={1} style={furnitureStyle("kitchen")} />
          <rect x="150" y="50" width="16" height="14" pathLength={1} style={furnitureStyle("kitchen")} />
          <rect x="145" y="88" width="50" height="36" pathLength={1} style={furnitureStyle("kitchen")} />
          <circle cx="158" cy="140" r="6" pathLength={1} style={furnitureStyle("kitchen")} />
          <circle cx="182" cy="140" r="6" pathLength={1} style={furnitureStyle("kitchen")} />
        </g>
        {/* bedroom: in the living area for a studio, in the bedroom(s) otherwise */}
        <g style={groupStyle("bedroom", !hasBed1)}>
          <rect x="60" y="225" width="85" height="100" pathLength={1} style={furnitureStyle("bedroom")} />
          <rect x="66" y="231" width="34" height="18" pathLength={1} style={furnitureStyle("bedroom")} />
          <rect x="105" y="231" width="34" height="18" pathLength={1} style={furnitureStyle("bedroom")} />
          <rect x="150" y="225" width="16" height="16" pathLength={1} style={furnitureStyle("bedroom")} />
        </g>
        <g style={groupStyle("bedroom", hasBed1)}>
          <rect x="400" y="205" width="110" height="88" pathLength={1} style={furnitureStyle("bedroom")} />
          <rect x="407" y="212" width="44" height="20" pathLength={1} style={furnitureStyle("bedroom")} />
          <rect x="459" y="212" width="44" height="20" pathLength={1} style={furnitureStyle("bedroom")} />
          <rect x="380" y="205" width="16" height="16" pathLength={1} style={furnitureStyle("bedroom")} />
          <rect x="514" y="205" width="16" height="16" pathLength={1} style={furnitureStyle("bedroom")} />
        </g>
        <g style={groupStyle("bedroom", hasBed2)}>
          <rect x="472" y="62" width="76" height="66" pathLength={1} style={furnitureStyle("bedroom")} />
          <rect x="477" y="67" width="30" height="14" pathLength={1} style={furnitureStyle("bedroom")} />
          <rect x="513" y="67" width="30" height="14" pathLength={1} style={furnitureStyle("bedroom")} />
        </g>
        {/* bathroom */}
        <g style={groupStyle("bathroom")}>
          <rect x="368" y="48" width="42" height="42" pathLength={1} style={furnitureStyle("bathroom")} />
          <path d="M368 48 L410 90" pathLength={1} style={furnitureStyle("bathroom")} />
          <circle cx="437" cy="72" r="9" pathLength={1} style={furnitureStyle("bathroom")} />
          <rect x="425" y="84" width="24" height="6" pathLength={1} style={furnitureStyle("bathroom")} />
          <ellipse cx="437" cy="130" rx="8" ry="11" pathLength={1} style={furnitureStyle("bathroom")} />
        </g>
        {/* terrace */}
        <g style={groupStyle("terrace")}>
          <rect x="186" y="352" width="28" height="26" pathLength={1} style={furnitureStyle("terrace")} />
          <circle cx="200" cy="346" r="5" pathLength={1} style={furnitureStyle("terrace")} />
          <circle cx="200" cy="384" r="5" pathLength={1} style={furnitureStyle("terrace")} />
          <circle cx="177" cy="365" r="5" pathLength={1} style={furnitureStyle("terrace")} />
          <circle cx="223" cy="365" r="5" pathLength={1} style={furnitureStyle("terrace")} />
        </g>
      </g>
    </svg>
  );
});
