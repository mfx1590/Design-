import type { Metadata } from "next";
import Image from "next/image";
import { hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/layout/PageIntro";
import { Section } from "@/components/layout/Section";
import { WhatsAppCta } from "@/components/ui/WhatsAppCta";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbsFor } from "@/lib/seo/crumbs";
import * as ld from "@/lib/seo/jsonld";
import { areas } from "@/lib/content/areas";
import { localizedPath, pageMetadata } from "@/lib/seo/metadata";
import { buildServices } from "@/lib/content/services";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "pages.services" });
  return pageMetadata({ locale, href: "/services", title: t("metaTitle"), description: t("metaDescription") });
}

/** Services overview: three doors, each a photo, an audience line and a link. */
export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations();
  const services = buildServices((await getMessages()).content);

  const cities = areas.map((a) => t(`areas.${a.key}`));
  return (
    <>
      <JsonLd data={[breadcrumbsFor(locale, t("seo.home"), [{ name: t("nav.services"), href: "/services" }]), ...services.map((s) => ld.service({ name: s.title, description: s.lead, url: localizedPath(locale, { pathname: "/services/[slug]", params: { slug: s.slug } }), areaServed: cities, image: s.photos[0].src }))]} />
      <PageIntro eyebrow={t("pages.services.eyebrow")} title={t("pages.services.title")} lead={t("pages.services.lead")} />

      <Section className="pt-0">
        <ol className="grid gap-8 md:grid-cols-3">
          {services.map((service, i) => (
            <li key={service.slug}>
              <Link href={{ pathname: "/services/[slug]", params: { slug: service.slug } }} className="group block">
                <div className="aperture aspect-[4/5] overflow-hidden bg-surface-alt">
                  <Image
                    src={service.photos[0].src}
                    alt={service.photos[0].alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.03] motion-reduce:transition-none"
                  />
                </div>
                <div className="mt-5 flex items-baseline gap-4">
                  <span aria-hidden="true" className="type-display tabular text-h3 leading-none text-brass">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 className="type-display text-h3 text-ink transition-colors group-hover:text-brass">{service.title}</h2>
                    <p className="mt-1 text-small text-ink-soft">{service.audience}</p>
                  </div>
                </div>
                <p className="mt-3 max-w-(--measure) text-ink-soft">{service.lead.split(". ")[0]}.</p>
                <span className="link mt-4 inline-block text-small">{t("cta.seeService")}</span>
              </Link>
            </li>
          ))}
        </ol>
      </Section>

      <WhatsAppCta />
    </>
  );
}
