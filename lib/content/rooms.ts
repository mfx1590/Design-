import type { getTranslations } from "next-intl/server";
import type { ApartmentType, Room, TypeKey } from "@/components/home/ApartmentWalk";
import { packages } from "@/lib/content/packages";

/** The un-namespaced translator (full message keys). */
type T = Awaited<ReturnType<typeof getTranslations<never>>>;

export const PROJECT_IMAGES = "/images/projects/project-01-studio";

const split = (s: string) => s.split(" · ").map((x) => x.trim()).filter(Boolean);
const same = (v: string): Record<TypeKey, string> => ({ studio: v, onePlusOne: v, twoPlusOne: v });
const sameScope = (v: string): Record<TypeKey, string[]> => ({ studio: split(v), onePlusOne: split(v), twoPlusOne: split(v) });

/** Package names and notes from messages. */
export function buildTypes(t: T): ApartmentType[] {
  const names: Record<TypeKey, string> = { studio: t("packages.studio"), onePlusOne: t("packages.onePlusOne"), twoPlusOne: t("packages.twoPlusOne") };
  const notes: Record<TypeKey, string> = { studio: t("packages.studioNote"), onePlusOne: t("packages.onePlusOneNote"), twoPlusOne: t("packages.twoPlusOneNote") };
  return packages.map((p) => ({ key: p.key, name: names[p.key], note: notes[p.key], priceFromGBP: p.priceFromGBP }));
}

/** The five rooms with indicative scope per apartment type and the studio-project photos. */
export function buildRooms(t: T): Room[] {
  return [
    {
      key: "living",
      number: t("apartment.rooms.living.number"),
      names: { studio: t("apartment.rooms.living.nameStudio"), onePlusOne: t("apartment.rooms.living.name"), twoPlusOne: t("apartment.rooms.living.name") },
      tagline: t("apartment.rooms.living.tagline"),
      photo: { src: `${PROJECT_IMAGES}/after-landscape-bar.jpg`, alt: t("hero.altAfter") },
      scope: { studio: split(t("apartment.rooms.living.scopeStudio")), onePlusOne: split(t("apartment.rooms.living.scope")), twoPlusOne: split(t("apartment.rooms.living.scope")) },
      fact: t("apartment.rooms.living.fact"),
    },
    {
      key: "kitchen",
      number: t("apartment.rooms.kitchen.number"),
      names: same(t("apartment.rooms.kitchen.name")),
      tagline: t("apartment.rooms.kitchen.tagline"),
      photo: { src: `${PROJECT_IMAGES}/after-kitchen.jpg`, alt: t("apartment.rooms.kitchen.name") },
      scope: sameScope(t("apartment.rooms.kitchen.scope")),
      fact: t("apartment.rooms.kitchen.fact"),
    },
    {
      key: "bedroom",
      number: t("apartment.rooms.bedroom.number"),
      names: { studio: t("apartment.rooms.bedroom.nameStudio"), onePlusOne: t("apartment.rooms.bedroom.name"), twoPlusOne: t("apartment.rooms.bedroom.nameTwo") },
      tagline: t("apartment.rooms.bedroom.tagline"),
      photo: { src: `${PROJECT_IMAGES}/after-portrait-bar-to-bed.jpg`, alt: t("apartment.rooms.bedroom.name") },
      scope: sameScope(t("apartment.rooms.bedroom.scope")),
      fact: t("apartment.rooms.bedroom.fact"),
    },
    {
      key: "bathroom",
      number: t("apartment.rooms.bathroom.number"),
      names: same(t("apartment.rooms.bathroom.name")),
      tagline: t("apartment.rooms.bathroom.tagline"),
      photo: { src: `${PROJECT_IMAGES}/after-bathroom.jpg`, alt: t("apartment.rooms.bathroom.name") },
      scope: sameScope(t("apartment.rooms.bathroom.scope")),
      fact: t("apartment.rooms.bathroom.fact"),
    },
    {
      key: "terrace",
      number: t("apartment.rooms.terrace.number"),
      names: same(t("apartment.rooms.terrace.name")),
      tagline: t("apartment.rooms.terrace.tagline"),
      photo: { src: `${PROJECT_IMAGES}/after-terrace.jpg`, alt: t("apartment.rooms.terrace.name") },
      scope: sameScope(t("apartment.rooms.terrace.scope")),
      fact: t("apartment.rooms.terrace.fact"),
    },
  ];
}

/** Labels for the plan drawing. */
export function buildPlanLabels(t: T) {
  return {
    living: t("packages.planLiving"),
    livingRoom: t("packages.planLivingRoom"),
    kitchen: t("packages.planKitchen"),
    bath: t("packages.planBath"),
    bedroom: t("packages.planBedroom"),
    terrace: t("packages.planTerrace"),
  };
}
