import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { PackageCards, type PackageState } from "@/components/home/PackagesScene";
import { PageIntro } from "@/components/layout/PageIntro";
import { Section, SectionHeader } from "@/components/layout/Section";
import { FaqList } from "@/components/ui/FaqList";
import { StepList } from "@/components/ui/StepList";
import { WhatsAppCta } from "@/components/ui/WhatsAppCta";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbsFor } from "@/lib/seo/crumbs";
import * as ld from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { areaBySlug, areas } from "@/lib/content/areas";
import { packages } from "@/lib/content/packages";
import { buildTypes } from "@/lib/content/rooms";
import { formatGBP } from "@/lib/format/price";

type Props = { params: Promise<{ locale: string; city: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => areas.map((a) => ({ locale, city: a.slug })));
}

async function priceVars(locale: (typeof routing.locales)[number]) {
  const [studio, one, two] = packages.map((p) => formatGBP(p.priceFromGBP, locale));
  return { studio, one, two };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, city } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const area = areaBySlug(city);
  if (!area) return {};
  const t = await getTranslations({ locale });
  const vars = { city: t(`areas.${area.key}`), ...(await priceVars(locale)) };
  return pageMetadata({ locale, href: { pathname: "/areas/[city]", params: { city: area.slug } }, title: t("pages.areas.metaTitle", vars), description: t("pages.areas.metaDescription", vars) });
}

/** City landing page (PLAN.md §6, §9): the packages, the remote process, questions, WhatsApp. No invented local facts. */
export default async function AreaPage({ params }: Props) {
  const { locale, city } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const area = areaBySlug(city);
  if (!area) notFound();
  setRequestLocale(locale);
  const t = await getTranslations();
  const cityName = t(`areas.${area.key}`);
  const vars = { city: cityName, ...(await priceVars(locale)) };

  const types = buildTypes(t);
  const inclusions = {
    studio: [t("packages.incLiving"), t("packages.incKitchen"), t("packages.incBath"), t("packages.incDelivery")],
    onePlusOne: [t("packages.incLivingRoom"), t("packages.incBed1"), t("packages.incKitchen"), t("packages.incBath"), t("packages.incDelivery")],
    twoPlusOne: [t("packages.incLivingRoom"), t("packages.incBed2"), t("packages.incKitchen"), t("packages.incBath"), t("packages.incDelivery")],
  };
  const states = types.map((x) => ({ ...x, inclusions: inclusions[x.key] })) as PackageState[];
  const slugs = Object.fromEntries(packages.map((p) => [p.key, p.slug])) as Record<PackageState["key"] & string, string>;
  const steps = ([1, 2, 3, 4, 5, 6] as const).map((n) => ({ title: t(`steps.s${n}Title`), body: t(`steps.s${n}Body`) }));
  const faqs = ([2, 4, 1] as const).map((n) => ({ q: t(`faq.q${n}`), a: t(`faq.a${n}`) }));
  const others = areas.filter((a) => a.slug !== area.slug);

  return (
    <>
      <JsonLd data={[breadcrumbsFor(locale, t("seo.home"), [{ name: cityName, href: { pathname: "/areas/[city]", params: { city: area.slug } } }]), ld.faqPage(faqs)]} />
      <PageIntro eyebrow={t("pages.areas.eyebrow")} title={t("pages.areas.title", vars)} lead={t("pages.areas.lead", vars)}>
        <p className="text-micro text-ink-soft/60">{t("pages.areas.note")}</p>
      </PageIntro>

      <Section className="pt-0" labelledBy="area-packages">
        <SectionHeader id="area-packages" eyebrow={t("pages.areas.packagesEyebrow")} title={t("pages.areas.packagesTitle")} />
        <div className="mt-12">
          <PackageCards packages={states} cta={t("cta.package")} slugs={slugs} />
        </div>
      </Section>

      <Section surface="espresso" labelledBy="area-steps">
        <SectionHeader id="area-steps" eyebrow={t("pages.process.remoteEyebrow")} title={t("pages.process.remoteTitle")} lead={t("pages.process.remoteBody")} />
        <div className="mt-12">
          <StepList steps={steps} variant="grid" />
        </div>
      </Section>

      <Section labelledBy="area-faq">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <SectionHeader id="area-faq" eyebrow={t("pages.areas.faqEyebrow")} title={t("pages.areas.faqTitle", vars)} />
          <FaqList items={faqs} />
        </div>
      </Section>

      <Section surface="espresso" labelledBy="area-others">
        <SectionHeader id="area-others" eyebrow={t("pages.areas.otherEyebrow")} title={t("pages.areas.otherTitle")} />
        <ul className="mt-8 flex flex-wrap gap-3">
          {others.map((other) => (
            <li key={other.slug}>
              <Link href={{ pathname: "/areas/[city]", params: { city: other.slug } }} className="inline-block border border-rule px-4 py-2 text-small text-ink-soft transition-colors hover:border-ink hover:text-ink">
                {t(`areas.${other.key}`)}
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <WhatsAppCta message={t("pages.areas.prefill", vars)} />
    </>
  );
}
