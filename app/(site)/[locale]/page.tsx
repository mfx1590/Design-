import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ApartmentSection } from "@/components/home/ApartmentSection";
import { ContactSection } from "@/components/home/ContactSection";
import { Faq } from "@/components/home/Faq";
import { HeroScene } from "@/components/home/HeroScene";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ServicesRows } from "@/components/home/ServicesRows";
import { routing } from "@/i18n/routing";
import { JsonLd } from "@/components/seo/JsonLd";
import * as ld from "@/lib/seo/jsonld";
import { PROJECT_IMAGES } from "@/lib/content/rooms";
import { areas } from "@/lib/content/areas";
import { pageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({ locale, href: "/", title: t("title"), description: t("description") });
}

/**
 * Homepage, v4 "the apartment furnishes itself": the hero blends the whole interface from day to dusk
 * while the room fills, then the visitor walks through the apartment room by room beside a floor plan
 * that draws the furniture in. Then the front door (process), three more doors (services), questions, handover.
 */
export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations();
  const cities = areas.map((a) => t(`areas.${a.key}`));
  return (
    <>
      <JsonLd data={[ld.organization({ name: t("brand.name"), description: t("meta.description"), areaServed: cities, locale, image: `${PROJECT_IMAGES}/after-landscape.jpg` }), ld.faqPage(([1, 2, 3, 4] as const).map((n) => ({ q: t(`faq.q${n}`), a: t(`faq.a${n}`) })))]} />
      <HeroScene />
      <ApartmentSection />
      <HowItWorks />
      <ServicesRows />
      <Faq />
      <ContactSection />
    </>
  );
}
