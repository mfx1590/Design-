import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { AddToInquiry } from "@/components/furniture/AddToInquiry";
import { PageIntro } from "@/components/layout/PageIntro";
import { Section, SectionHeader } from "@/components/layout/Section";
import { Aperture } from "@/components/ui/Aperture";
import { Price } from "@/components/ui/Price";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { WhatsAppCta } from "@/components/ui/WhatsAppCta";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getFurniture, getFurnitureItem, getProject } from "@/lib/cms/loaders";
import { categories, furniture, type CategoryKey } from "@/lib/content/furniture";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => furniture.map((f) => ({ locale, slug: f.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const piece = await getFurnitureItem(locale, slug);
  if (!piece) return {};
  const t = await getTranslations({ locale, namespace: "pages.furnitureItem" });
  return { title: t("metaTitle", { name: piece.name }), description: piece.description };
}

/** One piece: photo, materials, price or "on request", inquiry toggle, the project it was seen in, related pieces. */
export default async function FurnitureItemPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const piece = await getFurnitureItem(locale, slug);
  if (!piece) notFound();
  setRequestLocale(locale);
  const t = await getTranslations();
  const tf = await getTranslations("furniture");
  const tp = await getTranslations("packages");
  const prefill = t("pages.furnitureItem.prefill", { name: piece.name });
  const usedIn = (await Promise.all(piece.usedIn.map((s) => getProject(locale, s)))).filter((p) => p !== undefined);
  const related = (await getFurniture(locale)).filter((f) => f.category === piece.category && f.slug !== piece.slug).slice(0, 4);
  const categoryLabel = piece.categoryLabel ?? (categories.includes(piece.category as CategoryKey) ? tf(`categories.${piece.category as CategoryKey}`) : piece.category);

  const facts = [
    { label: t("pages.furnitureItem.categoryLabel"), value: categoryLabel },
    { label: t("pages.furnitureItem.materialsLabel"), value: piece.materials },
  ];

  return (
    <>
      <PageIntro
        eyebrow={t("pages.furnitureItem.eyebrow")}
        title={piece.name}
        lead={piece.description}
        aside={<Aperture src={piece.image.src} alt={piece.image.alt} ratio="1/1" sizes="(min-width: 1024px) 40vw, 100vw" priority />}
      >
        <dl className="grid gap-3 border-t border-rule pt-5 sm:grid-cols-2">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="text-micro uppercase tracking-[0.18em] text-brass">{fact.label}</dt>
              <dd className="mt-1 text-ink-soft">{fact.value}</dd>
            </div>
          ))}
          <div>
            <dt className="text-micro uppercase tracking-[0.18em] text-brass">{t("pages.furnitureItem.priceLabel")}</dt>
            <dd className="mt-1">{piece.priceGBP === null ? <span className="text-ink-soft">{t("cta.priceOnRequest")}</span> : <Price amount={piece.priceGBP} from={false} size="md" />}</dd>
          </div>
        </dl>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <AddToInquiry slug={piece.slug} labels={{ add: t("cta.inquiry"), remove: t("cta.inquiryRemove") }} variant="button" />
          <Link href="/inquiry" className="link text-small">
            {t("pages.furniture.inquiryLink")}
          </Link>
        </div>
      </PageIntro>

      {usedIn.length ? (
        <Section surface="espresso" labelledBy="usedin-title">
          <SectionHeader id="usedin-title" eyebrow={t("pages.furnitureItem.usedInEyebrow")} title={t("pages.furnitureItem.usedInTitle")} />
          <div className="mt-12 grid gap-10 md:grid-cols-2">
            {usedIn.map((project) => (
              <ProjectCard
                key={project.slug}
                slug={project.slug}
                title={project.title}
                meta={[project.city, project.apartmentType, tp(project.packageKey)].filter(Boolean).join(" · ")}
                afterSrc={project.after.src}
                beforeSrc={project.before.src}
                alt={project.after.alt}
                hasVideo={project.hasVideo}
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            ))}
          </div>
        </Section>
      ) : null}

      {related.length ? (
        <Section labelledBy="related-title">
          <SectionHeader id="related-title" eyebrow={t("pages.furnitureItem.relatedEyebrow")} title={t("pages.furnitureItem.relatedTitle")} />
          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
            {related.map((f) => (
              <ProductCard key={f.slug} slug={f.slug} name={f.name} materials={f.materials} imageSrc={f.image.src} alt={f.image.alt} priceGBP={f.priceGBP} />
            ))}
          </div>
        </Section>
      ) : null}

      <Section surface="espresso" className="py-8 sm:py-8">
        <Link href="/furniture" className="link text-small">
          {t("pages.furnitureItem.back")}
        </Link>
      </Section>

      <WhatsAppCta message={prefill} />
    </>
  );
}
