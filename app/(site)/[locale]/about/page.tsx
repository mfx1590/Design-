import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/layout/PageIntro";
import { Section } from "@/components/layout/Section";
import { Aperture } from "@/components/ui/Aperture";
import { WhatsAppCta } from "@/components/ui/WhatsAppCta";
import { routing } from "@/i18n/routing";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbsFor } from "@/lib/seo/crumbs";
import { pageMetadata } from "@/lib/seo/metadata";
import { PROJECT_IMAGES } from "@/lib/content/rooms";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "pages.about" });
  return pageMetadata({ locale, href: "/about", title: t("metaTitle"), description: t("metaDescription") });
}

/** About page (PLAN.md §6). Team, showroom, warranty and partners wait for the owner's facts. */
export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations();
  const blocks = [t("pages.about.teamTitle"), t("pages.about.showroomTitle"), t("pages.about.warrantyTitle"), t("pages.about.partnersTitle")];

  return (
    <>
      <JsonLd data={breadcrumbsFor(locale, t("seo.home"), [{ name: t("nav.about"), href: "/about" }])} />
      <PageIntro
        eyebrow={t("pages.about.eyebrow")}
        title={t("pages.about.title")}
        lead={t("pages.about.lead")}
        aside={<Aperture src={`${PROJECT_IMAGES}/after-terrace.jpg`} alt={t("apartment.rooms.terrace.name")} ratio="4/3" sizes="(min-width: 1024px) 40vw, 100vw" />}
      />

      <Section className="pt-0">
        <dl className="grid gap-8 sm:grid-cols-2">
          {blocks.map((title) => (
            <div key={title} className="card p-7">
              <dt className="type-display text-h3 text-ink">{title}</dt>
              <dd className="mt-3 text-small text-ink-soft/70">{t("pages.about.toConfirm")}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <WhatsAppCta />
    </>
  );
}
