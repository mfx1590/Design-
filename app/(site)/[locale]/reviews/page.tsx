import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/layout/PageIntro";
import { Section } from "@/components/layout/Section";
import { WhatsAppCta } from "@/components/ui/WhatsAppCta";
import { routing } from "@/i18n/routing";
import { getReviews } from "@/lib/cms/loaders";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "pages.reviews" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

/** Reviews page (PLAN.md §6). Real reviews from the Studio, with permission; an honest empty state until then. */
export default async function ReviewsPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations();
  const format = await getFormatter();
  const reviews = await getReviews(locale);

  return (
    <>
      <PageIntro eyebrow={t("pages.reviews.eyebrow")} title={t("pages.reviews.title")} lead={t("pages.reviews.lead")} />
      <Section className="pt-0">
        {reviews.length ? (
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <li key={`${review.clientName}-${review.date}`} className="card flex flex-col p-7">
                <p className="text-brass" aria-label={t("pages.reviews.rating", { rating: review.rating })}>
                  {"★".repeat(review.rating)}
                  <span className="text-rule">{"★".repeat(5 - review.rating)}</span>
                </p>
                <blockquote className="type-display mt-4 flex-1 text-h3 leading-snug text-ink">{review.text}</blockquote>
                <p className="mt-6 text-small text-ink-soft">
                  {[review.clientName, review.city, review.date ? format.dateTime(new Date(review.date), { year: "numeric", month: "long" }) : null].filter(Boolean).join(" · ")}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="card max-w-2xl p-7">
            <p className="text-ink-soft">{t("pages.reviews.empty")}</p>
          </div>
        )}
      </Section>
      <WhatsAppCta />
    </>
  );
}
