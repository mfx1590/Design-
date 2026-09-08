import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/layout/PageIntro";
import { Section, SectionHeader } from "@/components/layout/Section";
import { Aperture } from "@/components/ui/Aperture";
import { WhatsAppCta } from "@/components/ui/WhatsAppCta";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getGuide, getGuides } from "@/lib/cms/loaders";
import { guideSlugs } from "@/lib/content/guides";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => guideSlugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const guide = await getGuide(locale, slug);
  if (!guide) return {};
  return { title: `${guide.title} — Design Package`, description: guide.lead };
}

/** One guide: intro with the cover, a single measured column of sections, the other guides. */
export default async function GuidePage({ params }: Props) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const guide = await getGuide(locale, slug);
  if (!guide) notFound();
  setRequestLocale(locale);
  const t = await getTranslations();
  const format = await getFormatter();
  const others = (await getGuides(locale)).filter((g) => g.slug !== guide.slug);

  return (
    <>
      <PageIntro
        eyebrow={t("pages.guide.eyebrow")}
        title={guide.title}
        lead={guide.lead}
        aside={<Aperture src={guide.cover.src} alt={guide.cover.alt} ratio="4/3" sizes="(min-width: 1024px) 40vw, 100vw" priority />}
      >
        <p className="text-micro text-ink-soft/70">{t("pages.guides.updated", { date: format.dateTime(new Date(guide.updated), { dateStyle: "long" }) })}</p>
      </PageIntro>

      <Section className="pt-0">
        <article className="max-w-(--measure)">
          {guide.sections.map((section) => (
            <section key={section.heading} className="border-t border-rule py-8 first:border-t-0 first:pt-0">
              <h2 className="type-display text-h3 text-ink">{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="mt-4 text-ink-soft">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </article>
      </Section>

      {others.length ? (
        <Section surface="espresso" labelledBy="more-title">
          <SectionHeader id="more-title" eyebrow={t("pages.guide.moreEyebrow")} title={t("pages.guide.moreTitle")} />
          <ul className="mt-10 divide-y divide-rule border-y border-rule">
            {others.map((other) => (
              <li key={other.slug}>
                <Link href={{ pathname: "/guides/[slug]", params: { slug: other.slug } }} className="group block py-6">
                  <span className="type-display block text-h3 text-ink transition-colors group-hover:text-brass">{other.title}</span>
                  <span className="mt-2 block max-w-(--measure) text-small text-ink-soft">{other.lead}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-8">
            <Link href="/guides" className="link text-small">
              {t("pages.guide.back")}
            </Link>
          </p>
        </Section>
      ) : null}

      <WhatsAppCta />
    </>
  );
}
