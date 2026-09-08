import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/layout/PageIntro";
import { Section, SectionHeader } from "@/components/layout/Section";
import { Aperture } from "@/components/ui/Aperture";
import { FaqList } from "@/components/ui/FaqList";
import { StepList } from "@/components/ui/StepList";
import { WhatsAppCta } from "@/components/ui/WhatsAppCta";
import { WhatsAppGlyph } from "@/components/ui/WhatsAppGlyph";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbsFor } from "@/lib/seo/crumbs";
import * as ld from "@/lib/seo/jsonld";
import { areas } from "@/lib/content/areas";
import { localizedPath, pageMetadata } from "@/lib/seo/metadata";
import { buildServices, serviceSlugs } from "@/lib/content/services";
import { whatsappHref } from "@/lib/site";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => serviceSlugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const service = buildServices((await getMessages({ locale })).content).find((s) => s.slug === slug);
  if (!service) return {};
  const t = await getTranslations({ locale });
  return pageMetadata({ locale, href: { pathname: "/services/[slug]", params: { slug: service.slug } }, title: t("pages.service.metaTitle", { name: service.title }), description: service.lead, image: service.photos[0].src, imageAlt: service.photos[0].alt });
}

/** Service detail (PLAN.md §6): the answer, who it is for, how it works, pricing, questions. */
export default async function ServicePage({ params }: Props) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations();
  const services = buildServices((await getMessages()).content);
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();
  const wa = whatsappHref(service.prefill);
  const others = services.filter((s) => s.slug !== service.slug);

  const cities = areas.map((a) => t(`areas.${a.key}`));
  return (
    <>
      <JsonLd data={[breadcrumbsFor(locale, t("seo.home"), [{ name: t("nav.services"), href: "/services" }, { name: service.title, href: { pathname: "/services/[slug]", params: { slug: service.slug } } }]), ld.service({ name: service.title, description: service.lead, url: localizedPath(locale, { pathname: "/services/[slug]", params: { slug: service.slug } }), areaServed: cities, image: service.photos[0].src }), ld.faqPage(service.faqs)]} />
      <PageIntro
        eyebrow={t("pages.service.eyebrow")}
        title={service.title}
        lead={service.lead}
        aside={
          <div className="card p-7">
            <p className="text-micro uppercase tracking-[0.18em] text-ink-soft/70">{t("pages.service.forEyebrow")}</p>
            <p className="type-display mt-2 text-h3 text-ink">{service.audience}</p>
            <p className="mt-5 text-micro uppercase tracking-[0.18em] text-ink-soft/70">{t("pages.service.pricingEyebrow")}</p>
            <p className="mt-2 text-ink-soft">{service.pricing}</p>
            {service.pricingNote ? <p className="mt-1 text-micro text-ink-soft/60">{service.pricingNote}</p> : null}
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 border border-brass bg-brass px-5 py-3 text-small font-medium tracking-[0.04em] text-night transition-colors duration-(--dur-ui) ease-soft hover:border-brass-deep hover:bg-brass-deep sm:px-7 sm:py-3.5 sm:text-body"
            >
              <WhatsAppGlyph className="size-5" />
              {t("cta.quote")}
            </a>
          </div>
        }
      />

      <Section labelledBy="how-title" className="pt-0">
        <SectionHeader id="how-title" eyebrow={t("pages.service.howEyebrow")} title={t("pages.service.howTitle")} />
        <div className="mt-12">
          <StepList steps={service.steps} variant="grid" />
        </div>
      </Section>

      <Section surface="espresso" labelledBy="sphotos-title">
        <SectionHeader id="sphotos-title" eyebrow={t("pages.service.photosEyebrow")} title={t("pages.package.photosTitle")} />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {service.photos.map((photo) => (
            <Aperture key={photo.src} src={photo.src} alt={photo.alt} ratio="3/2" sizes="(min-width: 768px) 50vw, 100vw" caption={t("apartment.fromProject")} />
          ))}
        </div>
      </Section>

      <Section labelledBy="sfaq-title">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <SectionHeader id="sfaq-title" eyebrow={t("pages.service.faqEyebrow")} title={t("pages.service.faqTitle")} />
          <FaqList items={service.faqs} />
        </div>
      </Section>

      <Section surface="espresso" labelledBy="sothers-title">
        <SectionHeader id="sothers-title" eyebrow={t("pages.service.othersEyebrow")} title={t("pages.service.othersTitle")} />
        <ul className="mt-10 divide-y divide-rule border-y border-rule">
          {others.map((other) => (
            <li key={other.slug}>
              <Link
                href={{ pathname: "/services/[slug]", params: { slug: other.slug } }}
                className="group flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 py-6"
              >
                <span className="type-display text-h3 text-ink transition-colors group-hover:text-brass">{other.title}</span>
                <span className="text-small text-ink-soft">{other.audience}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <WhatsAppCta message={service.prefill} />
    </>
  );
}
