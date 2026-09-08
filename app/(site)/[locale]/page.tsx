import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ApartmentSection } from "@/components/home/ApartmentSection";
import { ContactSection } from "@/components/home/ContactSection";
import { Faq } from "@/components/home/Faq";
import { HeroScene } from "@/components/home/HeroScene";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ServicesRows } from "@/components/home/ServicesRows";
import { routing } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

/**
 * Homepage, v4 "the apartment furnishes itself": the hero blends the whole interface from day to dusk
 * while the room fills, then the visitor walks through the apartment room by room beside a floor plan
 * that draws the furniture in. Then the front door (process), three more doors (services), questions, handover.
 */
export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <>
      <HeroScene />
      <ApartmentSection />
      <HowItWorks />
      <ServicesRows />
      <Faq />
      <ContactSection />
    </>
  );
}
