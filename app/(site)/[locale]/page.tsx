import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Areas } from "@/components/home/Areas";
import { ContactSection } from "@/components/home/ContactSection";
import { Faq } from "@/components/home/Faq";
import { FeaturedProject } from "@/components/home/FeaturedProject";
import { HeroScene } from "@/components/home/HeroScene";
import { HowItWorks } from "@/components/home/HowItWorks";
import { PackagesSection } from "@/components/home/PackagesSection";
import { ServicesTiles } from "@/components/home/ServicesTiles";
import { TrustStrip } from "@/components/home/TrustStrip";
import { routing } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

/** Homepage per PLAN.md §6, in the v3 warm-luxury system. Reviews return once real ones arrive. */
export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <>
      <HeroScene />
      <TrustStrip />
      <PackagesSection />
      <FeaturedProject />
      <HowItWorks />
      <ServicesTiles />
      <Areas />
      <Faq />
      <ContactSection />
    </>
  );
}
