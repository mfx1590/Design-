import { getTranslations } from "next-intl/server";
import { Section, SectionHeader } from "@/components/layout/Section";
import { StepList } from "@/components/ui/StepList";

/** The one numbered sequence on the site. Copy comes from the brief; no timelines are claimed. */
export async function HowItWorks() {
  const t = await getTranslations();
  const steps = ([1, 2, 3, 4, 5, 6] as const).map((n) => ({
    title: t(`steps.s${n}Title`),
    body: t(`steps.s${n}Body`),
  }));

  return (
    <Section labelledBy="steps-title">
      <SectionHeader id="steps-title" eyebrow={t("home.stepsEyebrow")} title={t("home.stepsTitle")} />
      <div className="mt-14">
        <StepList steps={steps} variant="grid" />
      </div>
    </Section>
  );
}
