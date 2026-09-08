import { getTranslations } from "next-intl/server";
import { ApartmentWalk, type ApartmentType, type Room, type TypeKey } from "@/components/home/ApartmentWalk";
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/layout/Section";
import { packages } from "@/lib/content/packages";

const IMG = "/images/projects/project-01-studio";

const split = (s: string) => s.split(" · ").map((x) => x.trim()).filter(Boolean);

/** Server side of the apartment walk: translations, package facts and the studio photos. */
export async function ApartmentSection() {
  const t = await getTranslations();

  const names: Record<TypeKey, string> = { studio: t("packages.studio"), onePlusOne: t("packages.onePlusOne"), twoPlusOne: t("packages.twoPlusOne") };
  const notes: Record<TypeKey, string> = { studio: t("packages.studioNote"), onePlusOne: t("packages.onePlusOneNote"), twoPlusOne: t("packages.twoPlusOneNote") };
  const types: ApartmentType[] = packages.map((p) => ({ key: p.key, name: names[p.key], note: notes[p.key], priceFromGBP: p.priceFromGBP }));

  const same = (v: string): Record<TypeKey, string> => ({ studio: v, onePlusOne: v, twoPlusOne: v });
  const sameScope = (v: string): Record<TypeKey, string[]> => ({ studio: split(v), onePlusOne: split(v), twoPlusOne: split(v) });

  const rooms: Room[] = [
    {
      key: "living",
      number: t("apartment.rooms.living.number"),
      names: { studio: t("apartment.rooms.living.nameStudio"), onePlusOne: t("apartment.rooms.living.name"), twoPlusOne: t("apartment.rooms.living.name") },
      tagline: t("apartment.rooms.living.tagline"),
      photo: { src: `${IMG}/after-landscape-bar.jpg`, alt: t("hero.altAfter") },
      scope: { studio: split(t("apartment.rooms.living.scopeStudio")), onePlusOne: split(t("apartment.rooms.living.scope")), twoPlusOne: split(t("apartment.rooms.living.scope")) },
      fact: t("apartment.rooms.living.fact"),
    },
    {
      key: "kitchen",
      number: t("apartment.rooms.kitchen.number"),
      names: same(t("apartment.rooms.kitchen.name")),
      tagline: t("apartment.rooms.kitchen.tagline"),
      photo: { src: `${IMG}/after-kitchen.jpg`, alt: t("apartment.rooms.kitchen.name") },
      scope: sameScope(t("apartment.rooms.kitchen.scope")),
      fact: t("apartment.rooms.kitchen.fact"),
    },
    {
      key: "bedroom",
      number: t("apartment.rooms.bedroom.number"),
      names: { studio: t("apartment.rooms.bedroom.nameStudio"), onePlusOne: t("apartment.rooms.bedroom.name"), twoPlusOne: t("apartment.rooms.bedroom.nameTwo") },
      tagline: t("apartment.rooms.bedroom.tagline"),
      photo: { src: `${IMG}/after-portrait-bar-to-bed.jpg`, alt: t("apartment.rooms.bedroom.name") },
      scope: sameScope(t("apartment.rooms.bedroom.scope")),
      fact: t("apartment.rooms.bedroom.fact"),
    },
    {
      key: "bathroom",
      number: t("apartment.rooms.bathroom.number"),
      names: same(t("apartment.rooms.bathroom.name")),
      tagline: t("apartment.rooms.bathroom.tagline"),
      photo: { src: `${IMG}/after-bathroom.jpg`, alt: t("apartment.rooms.bathroom.name") },
      scope: sameScope(t("apartment.rooms.bathroom.scope")),
      fact: t("apartment.rooms.bathroom.fact"),
    },
    {
      key: "terrace",
      number: t("apartment.rooms.terrace.number"),
      names: same(t("apartment.rooms.terrace.name")),
      tagline: t("apartment.rooms.terrace.tagline"),
      photo: { src: `${IMG}/after-terrace.jpg`, alt: t("apartment.rooms.terrace.name") },
      scope: sameScope(t("apartment.rooms.terrace.scope")),
      fact: t("apartment.rooms.terrace.fact"),
    },
  ];

  const labels = {
    choose: t("apartment.choose"),
    inPackage: t("apartment.inPackage"),
    fromProject: t("apartment.fromProject"),
    planAria: t("apartment.planAria"),
    delivery: t("trust.delivery"),
    cta: {
      studio: t("apartment.cta", { name: names.studio }),
      onePlusOne: t("apartment.cta", { name: names.onePlusOne }),
      twoPlusOne: t("apartment.cta", { name: names.twoPlusOne }),
    },
    plan: {
      living: t("packages.planLiving"),
      livingRoom: t("packages.planLivingRoom"),
      kitchen: t("packages.planKitchen"),
      bath: t("packages.planBath"),
      bedroom: t("packages.planBedroom"),
      terrace: t("packages.planTerrace"),
    },
  };

  return (
    <section id="apartment" aria-labelledby="apartment-title" className="surface">
      <Container className="pt-(--section) pb-10 lg:pb-16">
        <SectionHeader id="apartment-title" eyebrow={t("apartment.eyebrow")} title={t("apartment.title")} lead={t("apartment.lead")} />
      </Container>
      <ApartmentWalk types={types} rooms={rooms} labels={labels} />
      <Container className="pb-10 pt-6">
        <p className="text-micro text-ink-soft/60">{t("apartment.scopeNote")}</p>
      </Container>
    </section>
  );
}
