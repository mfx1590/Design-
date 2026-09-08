import type { Metadata } from "next";
import Image from "next/image";
import { hasLocale } from "next-intl";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/layout/PageIntro";
import { Section } from "@/components/layout/Section";
import { WhatsAppCta } from "@/components/ui/WhatsAppCta";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { guides } from "@/lib/content/guides";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "pages.guides" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

/** Guides index (PLAN.md §6, §9). */
export default async function GuidesPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations();
  const format = await getFormatter();

  return (
    <>
      <PageIntro eyebrow={t("pages.guides.eyebrow")} title={t("pages.guides.title")} lead={t("pages.guides.lead")} />

      <Section className="pt-0">
        <ul className="grid gap-10 md:grid-cols-2">
          {guides.map((guide, i) => (
            <li key={guide.slug}>
              <Link href={{ pathname: "/guides/[slug]", params: { slug: guide.slug } }} className="group block">
                <div className="aperture aspect-[3/2] overflow-hidden bg-surface-alt">
                  <Image
                    src={guide.cover.src}
                    alt={guide.cover.alt}
                    fill
                    priority={i === 0}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.03] motion-reduce:transition-none"
                  />
                </div>
                <p className="mt-5 text-micro text-ink-soft/70">{t("pages.guides.updated", { date: format.dateTime(new Date(guide.updated), { dateStyle: "long" }) })}</p>
                <h2 className="type-display mt-2 text-h3 text-ink transition-colors group-hover:text-brass">{guide.title}</h2>
                <p className="mt-3 max-w-(--measure) text-ink-soft">{guide.lead}</p>
                <span className="link mt-4 inline-block text-small">{t("pages.guides.read")}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <WhatsAppCta />
    </>
  );
}
