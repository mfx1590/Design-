import { getTranslations } from "next-intl/server";
import { Section, SectionHeader } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";

/** Three services as numbered rows. No tiles, no icons: the photographs already live in the walk. */
export async function ServicesRows() {
  const t = await getTranslations();
  const rows = [
    { key: "staging", title: t("services.staging"), body: t("services.stagingBody") },
    { key: "rental", title: t("services.rental"), body: t("services.rentalBody") },
    { key: "custom", title: t("services.custom"), body: t("services.customBody") },
  ];

  return (
    <Section surface="espresso" labelledBy="services-title">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <SectionHeader
          id="services-title"
          eyebrow={t("home.servicesEyebrow")}
          title={t("home.servicesTitle")}
          aside={
            <Button href="/services" variant="secondary" size="sm">
              {t("cta.services")}
            </Button>
          }
          className="flex-col items-start"
        />
        <ol className="divide-y divide-rule border-y border-rule">
          {rows.map((row, i) => (
            <li key={row.key} className="grid gap-x-8 gap-y-2 py-7 sm:grid-cols-[4rem_1fr]">
              <span aria-hidden="true" className="type-display tabular text-h3 leading-none text-brass">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="type-display text-h3 text-ink">{row.title}</h3>
                <p className="mt-2 max-w-(--measure) text-ink-soft">{row.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
