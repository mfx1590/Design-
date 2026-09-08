import { getTranslations } from "next-intl/server";
import { ApartmentWalk, type TypeKey } from "@/components/home/ApartmentWalk";
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/layout/Section";
import { buildPlanLabels, buildRooms, buildTypes } from "@/lib/content/rooms";

/** Server side of the apartment walk: translations, package facts and the studio photos. */
export async function ApartmentSection() {
  const t = await getTranslations();
  const types = buildTypes(t);
  const rooms = buildRooms(t);
  const names = Object.fromEntries(types.map((x) => [x.key, x.name])) as Record<TypeKey, string>;

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
    plan: buildPlanLabels(t),
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
