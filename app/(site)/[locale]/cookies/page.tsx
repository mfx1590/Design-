import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/layout/LegalPage";
import { routing } from "@/i18n/routing";
import { legalBySlug } from "@/lib/content/legal";

type Props = { params: Promise<{ locale: string }> };
const doc = legalBySlug("cookies");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "pages.legal" });
  return { title: t("metaTitle", { title: doc.title }), robots: { index: false } };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return <LegalPage doc={doc} />;
}
