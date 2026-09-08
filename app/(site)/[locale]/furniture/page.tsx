import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { FurnitureGrid } from "@/components/furniture/FurnitureGrid";
import { PageIntro } from "@/components/layout/PageIntro";
import { Section } from "@/components/layout/Section";
import { ProductCard } from "@/components/ui/ProductCard";
import { WhatsAppCta } from "@/components/ui/WhatsAppCta";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbsFor } from "@/lib/seo/crumbs";
import { pageMetadata } from "@/lib/seo/metadata";
import { getFurniture } from "@/lib/cms/loaders";
import { categories, type CategoryKey } from "@/lib/content/furniture";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "pages.furniture" });
  return pageMetadata({ locale, href: "/furniture", title: t("metaTitle"), description: t("metaDescription") });
}

/** Furniture catalogue (PLAN.md §6): filter by category, save pieces to the inquiry list. */
export default async function FurniturePage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations();
  const tf = await getTranslations("furniture");
  const furniture = await getFurniture(locale);
  const cmsLabels = Object.fromEntries(furniture.filter((f) => f.categoryLabel).map((f) => [f.category, f.categoryLabel as string]));
  const categoryKeys = [...categories, ...furniture.map((f) => f.category).filter((c) => !categories.includes(c as CategoryKey))];

  const items = furniture.map((piece) => ({
    slug: piece.slug,
    category: piece.category,
    card: <ProductCard slug={piece.slug} name={piece.name} materials={piece.materials} imageSrc={piece.image.src} alt={piece.image.alt} priceGBP={piece.priceGBP} />,
  }));

  return (
    <>
      <JsonLd data={breadcrumbsFor(locale, t("seo.home"), [{ name: t("nav.furniture"), href: "/furniture" }])} />
      <PageIntro eyebrow={t("pages.furniture.eyebrow")} title={t("pages.furniture.title")} lead={t("pages.furniture.lead")}>
        <p className="text-small text-ink-soft">
          <Link href="/inquiry" className="link">
            {t("pages.furniture.inquiryLink")}
          </Link>
        </p>
      </PageIntro>

      <Section className="pt-0">
        <FurnitureGrid
          items={items}
          categories={categoryKeys.map((key) => ({ key, label: cmsLabels[key] ?? (categories.includes(key as CategoryKey) ? tf(`categories.${key as CategoryKey}`) : key) }))}
          labels={{ all: tf("all"), empty: tf("empty") }}
        />
        <p className="mt-10 text-small text-ink-soft/70">{t("pages.furniture.note")}</p>
      </Section>

      <WhatsAppCta />
    </>
  );
}
