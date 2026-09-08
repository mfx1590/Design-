import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { InquiryList } from "@/components/furniture/InquiryList";
import { PageIntro } from "@/components/layout/PageIntro";
import { Section } from "@/components/layout/Section";
import { routing } from "@/i18n/routing";
import { furniture } from "@/lib/content/furniture";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "pages.inquiry" });
  return { title: t("metaTitle"), description: t("metaDescription"), robots: { index: false } };
}

/** Inquiry list (PLAN.md §6): the saved pieces become one WhatsApp message. No payment, no account. */
export default async function InquiryPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const ti = await getTranslations("pages.inquiry");
  const pieces = Object.fromEntries(furniture.map((f) => [f.slug, { slug: f.slug, name: f.name, materials: f.materials, image: f.image }]));

  return (
    <>
      <PageIntro eyebrow={ti("eyebrow")} title={ti("title")} lead={ti("lead")} />
      <Section className="pt-0">
        <InquiryList
          pieces={pieces}
          labels={{
            empty: ti("empty"),
            browse: ti("browse"),
            remove: ti("remove"),
            clear: ti("clear"),
            send: ti("send"),
            noteLabel: ti("noteLabel"),
            notePlaceholder: ti("notePlaceholder"),
            stored: ti("stored"),
            messageIntro: ti("messageIntro"),
            messageNote: ti("messageNote"),
          }}
        />
      </Section>
    </>
  );
}
