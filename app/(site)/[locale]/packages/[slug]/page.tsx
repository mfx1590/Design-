import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { PackageCards, type PackageState } from "@/components/home/PackagesScene";
import { PageIntro } from "@/components/layout/PageIntro";
import { Section, SectionHeader } from "@/components/layout/Section";
import { Aperture } from "@/components/ui/Aperture";
import { FaqList } from "@/components/ui/FaqList";
import { Price } from "@/components/ui/Price";
import { WhatsAppCta } from "@/components/ui/WhatsAppCta";
import { WhatsAppGlyph } from "@/components/ui/WhatsAppGlyph";
import { routing } from "@/i18n/routing";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbsFor } from "@/lib/seo/crumbs";
import * as ld from "@/lib/seo/jsonld";
import { areas } from "@/lib/content/areas";
import { localizedPath, pageMetadata } from "@/lib/seo/metadata";
import { formatGBP } from "@/lib/format/price";
import { packageBySlug, packages } from "@/lib/content/packages";
import { buildRooms, buildTypes, PROJECT_IMAGES } from "@/lib/content/rooms";
import { whatsappHref } from "@/lib/site";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => packages.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const pkg = packageBySlug(slug);
  if (!pkg) return {};
  const t = await getTranslations({ locale, namespace: "pages.package" });
  const tp = await getTranslations({ locale, namespace: "packages" });
  const name = tp(pkg.key);
  const price = formatGBP(pkg.priceFromGBP, locale);
  return pageMetadata({ locale, href: { pathname: "/packages/[slug]", params: { slug } }, title: t("metaTitle", { name, price }), description: t("metaDescription", { name, price }) });
}

/** Package detail (PLAN.md §6): room by room, sample photos, price, FAQs. */
export default async function PackagePage({ params }: Props) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const pkg = packageBySlug(slug);
  if (!pkg) notFound();
  setRequestLocale(locale);
  const t = await getTranslations();
  const types = buildTypes(t);
  const current = types.find((x) => x.key === pkg.key) ?? types[0];
  const rooms = buildRooms(t);
  const price = formatGBP(pkg.priceFromGBP, locale);
  const prefill = t("pages.package.prefill", { name: current.name });
  const wa = whatsappHref(prefill);

  const others = types
    .filter((x) => x.key !== pkg.key)
    .map((x) => ({
      ...x,
      inclusions: [
        x.key === "studio" ? t("packages.incLiving") : t("packages.incLivingRoom"),
        x.key === "onePlusOne" ? t("packages.incBed1") : x.key === "twoPlusOne" ? t("packages.incBed2") : t("packages.incKitchen"),
        t("packages.incBath"),
        t("packages.incDelivery"),
      ],
    })) as PackageState[];
  const slugs = Object.fromEntries(packages.map((p) => [p.key, p.slug])) as Record<string, string>;

  const tf = await getTranslations("faqPackages");
  const faqs = ([1, 2, 3] as const).map((n) => ({ q: tf(`q${n}`), a: tf(`a${n}`) }));
  const photos = [
    { src: `${PROJECT_IMAGES}/after-landscape.jpg`, alt: t("hero.altAfter"), ratio: "3/4" as const },
    { src: `${PROJECT_IMAGES}/after-kitchen.jpg`, alt: t("apartment.rooms.kitchen.name"), ratio: "3/4" as const },
    { src: `${PROJECT_IMAGES}/after-terrace.jpg`, alt: t("apartment.rooms.terrace.name"), ratio: "3/4" as const },
  ];

  const cities = areas.map((a) => t(`areas.${a.key}`));
  return (
    <>
      <JsonLd data={[breadcrumbsFor(locale, t("seo.home"), [{ name: t("nav.packages"), href: "/packages" }, { name: current.name, href: { pathname: "/packages/[slug]", params: { slug } } }]), ld.service({ name: current.name, description: t("pages.package.metaDescription", { name: current.name, price }), url: localizedPath(locale, { pathname: "/packages/[slug]", params: { slug } }), priceFromGBP: pkg.priceFromGBP, areaServed: cities, image: photos[0].src }), ld.faqPage(faqs)]} />
      <PageIntro
        eyebrow={t("pages.package.eyebrow")}
        title={current.name}
        lead={t("pages.package.lead", { name: current.name, price })}
        aside={
          <div className="card p-7">
            <p className="text-micro uppercase tracking-[0.18em] text-ink-muted">{current.note}</p>
            <p className="mt-3">
              <Price amount={pkg.priceFromGBP} size="xl" />
            </p>
            <p className="mt-3 text-small text-ink-soft">{t("trust.delivery")}</p>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 border border-brass bg-brass px-5 py-3 text-small font-medium tracking-[0.04em] text-surface transition-colors duration-(--dur-ui) ease-soft hover:border-brass-deep hover:bg-brass-deep sm:px-7 sm:py-3.5 sm:text-body"
            >
              <WhatsAppGlyph className="size-5" />
              {t("cta.quote")}
            </a>
          </div>
        }
      />

      <Section labelledBy="rooms-title" className="pt-0">
        <SectionHeader id="rooms-title" eyebrow={t("pages.package.roomsEyebrow")} title={t("pages.package.roomsTitle")} />
        <ol className="mt-12 divide-y divide-rule border-y border-rule">
          {rooms.map((room) => (
            <li key={room.key} className="grid gap-4 py-7 sm:grid-cols-[4rem_1fr] sm:gap-8">
              <span aria-hidden="true" className="type-display tabular text-h3 leading-none text-brass">
                {room.number}
              </span>
              <div>
                <h3 className="type-display text-h3 text-ink">{room.names[pkg.key]}</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {room.scope[pkg.key].map((item) => (
                    <li key={item} className="border border-rule px-3 py-1.5 text-small text-ink-soft">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-micro text-ink-muted">{t("pages.package.roomsNote")}</p>
      </Section>

      <Section surface="espresso" labelledBy="photos-title">
        <SectionHeader id="photos-title" eyebrow={t("pages.package.photosEyebrow")} title={t("pages.package.photosTitle")} />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {photos.map((photo) => (
            <Aperture key={photo.src} src={photo.src} alt={photo.alt} ratio={photo.ratio} sizes="(min-width: 768px) 40vw, 100vw" caption={t("apartment.fromProject")} />
          ))}
        </div>
      </Section>

      <Section labelledBy="pkfaq-title">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <SectionHeader id="pkfaq-title" eyebrow={t("pages.packages.faqEyebrow")} title={t("pages.packages.faqTitle")} />
          <FaqList items={faqs} />
        </div>
      </Section>

      <Section surface="espresso" labelledBy="others-title">
        <SectionHeader id="others-title" eyebrow={t("pages.package.othersEyebrow")} title={t("pages.package.othersTitle")} />
        <div className="mt-12">
          <PackageCards packages={others} cta={t("cta.package")} slugs={slugs} className="md:grid-cols-2" />
        </div>
      </Section>

      <WhatsAppCta message={prefill} />
    </>
  );
}
