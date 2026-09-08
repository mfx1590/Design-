import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { PackageCards, type PackageState } from "@/components/home/PackagesScene";
import { PageIntro } from "@/components/layout/PageIntro";
import { Section, SectionHeader } from "@/components/layout/Section";
import { PackageFinder } from "@/components/packages/PackageFinder";
import { ComparisonTable } from "@/components/ui/ComparisonTable";
import { FaqList } from "@/components/ui/FaqList";
import { WhatsAppCta } from "@/components/ui/WhatsAppCta";
import { WhatsAppGlyph } from "@/components/ui/WhatsAppGlyph";
import { routing } from "@/i18n/routing";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbsFor } from "@/lib/seo/crumbs";
import * as ld from "@/lib/seo/jsonld";
import { formatGBP } from "@/lib/format/price";
import { areas } from "@/lib/content/areas";
import { localizedPath, pageMetadata } from "@/lib/seo/metadata";
import { packages } from "@/lib/content/packages";
import { buildTypes } from "@/lib/content/rooms";
import { whatsappHref } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "pages.packages" });
  return pageMetadata({ locale, href: "/packages", title: t("metaTitle"), description: t("metaDescription") });
}

/** Packages overview (PLAN.md §6): compare, pick, ask. */
export default async function PackagesPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations();
  const types = buildTypes(t);

  const inclusions = {
    studio: [t("packages.incLiving"), t("packages.incKitchen"), t("packages.incBath"), t("packages.incDelivery")],
    onePlusOne: [t("packages.incLivingRoom"), t("packages.incBed1"), t("packages.incKitchen"), t("packages.incBath"), t("packages.incDelivery")],
    twoPlusOne: [t("packages.incLivingRoom"), t("packages.incBed2"), t("packages.incKitchen"), t("packages.incBath"), t("packages.incDelivery")],
  };
  const states = types.map((x) => ({ ...x, inclusions: inclusions[x.key] })) as PackageState[];
  const slugs = Object.fromEntries(packages.map((p) => [p.key, p.slug])) as Record<PackageState["key"] & string, string>;

  const tc = await getTranslations("comparison");
  const rows = [
    { label: tc("rowLiving"), values: [true, true, true] },
    { label: tc("rowKitchen"), values: [true, true, true] },
    { label: tc("rowBedrooms"), values: [null, tc("one"), tc("two")] },
    { label: tc("rowBathroom"), values: [true, true, true] },
    { label: tc("rowTerrace"), values: [tc("toConfirm"), tc("toConfirm"), tc("toConfirm")] },
    { label: tc("rowDelivery"), values: [true, true, true] },
    { label: tc("rowTimeline"), values: [tc("toConfirm"), tc("toConfirm"), tc("toConfirm")] },
  ];

  const tf = await getTranslations("faqPackages");
  const faqs = ([1, 2, 3] as const).map((n) => ({ q: tf(`q${n}`), a: tf(`a${n}`) }));
  const wa = whatsappHref(t("whatsapp.prefill"));

  const cities = areas.map((a) => t(`areas.${a.key}`));
  return (
    <>
      <JsonLd data={[breadcrumbsFor(locale, t("seo.home"), [{ name: t("nav.packages"), href: "/packages" }]), ...types.map((x) => ld.service({ name: x.name, description: t("pages.package.metaDescription", { name: x.name, price: formatGBP(x.priceFromGBP, locale) }), url: localizedPath(locale, { pathname: "/packages/[slug]", params: { slug: slugs[x.key] } }), priceFromGBP: x.priceFromGBP, areaServed: cities })), ld.faqPage(faqs)]} />
      <PageIntro eyebrow={t("pages.packages.eyebrow")} title={t("pages.packages.title")} lead={t("pages.packages.lead")} />

      <Section className="pt-0">
        <PackageCards packages={states} cta={t("cta.package")} slugs={slugs} />
      </Section>

      <Section surface="espresso" labelledBy="compare-title">
        <SectionHeader id="compare-title" eyebrow={t("pages.packages.compareEyebrow")} title={t("pages.packages.compareTitle")} lead={t("pages.packages.compareLead")} />
        <div className="mt-12">
          <ComparisonTable
            caption={tc("caption")}
            columns={types.map((x) => ({ key: x.key, name: x.name, priceFromGBP: x.priceFromGBP }))}
            rows={rows}
            mobileFooter={
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 border border-brass bg-brass px-5 py-3 text-small font-medium tracking-[0.04em] text-surface transition-colors duration-(--dur-ui) ease-soft hover:border-brass-deep hover:bg-brass-deep sm:px-7 sm:py-3.5 sm:text-body"
              >
                <WhatsAppGlyph className="size-5" />
                {t("cta.quote")}
              </a>
            }
          />
        </div>
      </Section>

      <Section labelledBy="finder-title">
        <SectionHeader id="finder-title" eyebrow={t("pages.packages.finderEyebrow")} title={t("pages.packages.finderTitle")} />
        <div className="mt-12">
          <PackageFinder types={types} />
        </div>
      </Section>

      <Section surface="espresso" labelledBy="pfaq-title">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <SectionHeader id="pfaq-title" eyebrow={t("pages.packages.faqEyebrow")} title={t("pages.packages.faqTitle")} />
          <FaqList items={faqs} />
        </div>
      </Section>

      <WhatsAppCta />
    </>
  );
}
