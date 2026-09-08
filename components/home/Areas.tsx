import { getTranslations } from "next-intl/server";
import { Section, SectionHeader } from "@/components/layout/Section";

/** City names from the brief, set large in Cormorant. Marked to confirm until the owner signs off. */
export async function Areas() {
  const t = await getTranslations();
  const cities = [t("areas.kyrenia"), t("areas.iskele"), t("areas.famagusta"), t("areas.nicosia")];

  return (
    <Section labelledBy="areas-title">
      <SectionHeader id="areas-title" eyebrow={t("home.areasEyebrow")} title={t("home.areasTitle")} lead={t("home.areasLead")} />
      <ul className="mt-14 grid border-t border-rule sm:grid-cols-2">
        {cities.map((city, i) => (
          <li key={city} className="flex items-baseline gap-5 border-b border-rule py-7 sm:odd:pe-10 sm:even:ps-10">
            <span aria-hidden="true" className="type-display tabular text-lead text-brass">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="type-display text-h2 text-ink">{city}</span>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-micro text-ink-soft/60">{t("home.areasNote")}</p>
    </Section>
  );
}
