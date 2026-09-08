import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/layout/PageIntro";
import { Section } from "@/components/layout/Section";
import { WhatsAppCta } from "@/components/ui/WhatsAppCta";
import { routing } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "pages.reviews" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

/** Reviews page (PLAN.md §6). Honest empty state until real reviews arrive with permission. */
export default async function ReviewsPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <PageIntro eyebrow={t("pages.reviews.eyebrow")} title={t("pages.reviews.title")} lead={t("pages.reviews.lead")} />
      <Section className="pt-0">
        <div className="card max-w-2xl p-7">
          <p className="text-ink-soft">{t("pages.reviews.empty")}</p>
        </div>
      </Section>
      <WhatsAppCta />
    </>
  );
}
