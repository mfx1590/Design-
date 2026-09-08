import { getTranslations } from "next-intl/server";
import { PackageCards, PackagesScene, type PackageState } from "@/components/home/PackagesScene";
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/layout/Section";
import { packages } from "@/lib/content/packages";

/** Header, then the pinned floor-plan scene (md+) or static cards (small screens). */
export async function PackagesSection() {
  const t = await getTranslations();
  const inclusions = {
    studio: [t("packages.incLiving"), t("packages.incKitchen"), t("packages.incBath"), t("packages.incDelivery")],
    onePlusOne: [t("packages.incLivingRoom"), t("packages.incBed1"), t("packages.incKitchen"), t("packages.incBath"), t("packages.incDelivery")],
    twoPlusOne: [t("packages.incLivingRoom"), t("packages.incBed2"), t("packages.incKitchen"), t("packages.incBath"), t("packages.incDelivery")],
  };
  const names = { studio: t("packages.studio"), onePlusOne: t("packages.onePlusOne"), twoPlusOne: t("packages.twoPlusOne") };
  const notes = { studio: t("packages.studioNote"), onePlusOne: t("packages.onePlusOneNote"), twoPlusOne: t("packages.twoPlusOneNote") };

  const states = packages.map((p) => ({
    key: p.key,
    name: names[p.key],
    note: notes[p.key],
    priceFromGBP: p.priceFromGBP,
    inclusions: inclusions[p.key],
  })) as [PackageState, PackageState, PackageState];

  const labels = {
    living: t("packages.planLiving"),
    livingRoom: t("packages.planLivingRoom"),
    kitchen: t("packages.planKitchen"),
    bath: t("packages.planBath"),
    bedroom: t("packages.planBedroom"),
    terrace: t("packages.planTerrace"),
    scroll: t("home.packagesScroll"),
  };

  return (
    <section id="packages" aria-labelledby="packages-title" className="surface">
      <Container className="pt-(--section)">
        <SectionHeader id="packages-title" eyebrow={t("home.packagesEyebrow")} title={t("home.packagesTitle")} lead={t("home.packagesLead")} />
      </Container>
      <PackagesScene packages={states} labels={labels} cta={t("cta.package")} className="hidden md:block" />
      <Container className="pb-(--section) pt-12 md:hidden">
        <PackageCards packages={states} cta={t("cta.package")} />
      </Container>
    </section>
  );
}
