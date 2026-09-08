import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/layout/PageIntro";
import { Section, SectionHeader } from "@/components/layout/Section";
import { StepList } from "@/components/ui/StepList";
import { WhatsAppCta } from "@/components/ui/WhatsAppCta";
import { routing } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "pages.process" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

/** Process page (PLAN.md §6): the six steps and the remote-buyer flow. */
export default async function ProcessPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations();
  const steps = ([1, 2, 3, 4, 5, 6] as const).map((n) => ({ title: t(`steps.s${n}Title`), body: t(`steps.s${n}Body`) }));

  return (
    <>
      <PageIntro eyebrow={t("pages.process.eyebrow")} title={t("pages.process.title")} lead={t("pages.process.lead")} />

      <Section className="pt-0">
        <StepList steps={steps} variant="list" />
      </Section>

      <Section surface="espresso" labelledBy="remote-title">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <SectionHeader id="remote-title" eyebrow={t("pages.process.remoteEyebrow")} title={t("pages.process.remoteTitle")} />
          <p className="max-w-(--measure) text-lead text-ink-soft">{t("pages.process.remoteBody")}</p>
        </div>
      </Section>

      <WhatsAppCta />
    </>
  );
}
