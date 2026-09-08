import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/layout/PageIntro";
import { Section } from "@/components/layout/Section";
import { WhatsAppGlyph } from "@/components/ui/WhatsAppGlyph";
import { routing } from "@/i18n/routing";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbsFor } from "@/lib/seo/crumbs";
import { pageMetadata } from "@/lib/seo/metadata";
import { telHref, whatsappDisplay, whatsappHref } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "pages.contact" });
  return pageMetadata({ locale, href: "/contact", title: t("metaTitle"), description: t("metaDescription") });
}

/** Contact page: WhatsApp first, phone second, the rest of the NAP once the owner confirms it. */
export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations();
  const wa = whatsappHref(t("whatsapp.prefill"));
  const cities = [t("areas.kyrenia"), t("areas.iskele"), t("areas.famagusta"), t("areas.nicosia")].join(", ");
  const nap = [
    { label: t("pages.contact.addressLabel"), value: t("pages.contact.toConfirm") },
    { label: t("pages.contact.emailLabel"), value: t("pages.contact.toConfirm") },
    { label: t("pages.contact.hoursLabel"), value: t("pages.contact.toConfirm") },
  ];

  return (
    <>
      <JsonLd data={breadcrumbsFor(locale, t("seo.home"), [{ name: t("nav.contact"), href: "/contact" }])} />
      <PageIntro
        eyebrow={t("pages.contact.eyebrow")}
        title={t("pages.contact.title")}
        lead={t("pages.contact.lead")}
        aside={
          <a href={wa} target="_blank" rel="noopener noreferrer" className="card block p-6 sm:p-9" aria-label={t("contact.openWhatsApp")}>
            <p className="inline-flex items-center gap-2 text-micro font-medium uppercase tracking-[0.18em] text-ink-soft">
              <WhatsAppGlyph className="size-4 text-whatsapp" />
              WhatsApp
            </p>
            <p className="type-display tabular mt-4 text-h2 leading-none whitespace-nowrap text-brass" dir="ltr">
              {whatsappDisplay}
            </p>
            <span className="mt-6 inline-flex w-full items-center justify-center gap-2 border border-brass bg-brass px-5 py-3 text-small font-medium tracking-[0.04em] text-night transition-colors duration-(--dur-ui) ease-soft hover:border-brass-deep hover:bg-brass-deep sm:px-7 sm:py-3.5 sm:text-body">
              <WhatsAppGlyph className="size-5" />
              {t("contact.openWhatsApp")}
            </span>
          </a>
        }
      >
        <a href={telHref} className="text-small text-ink-soft">
          {t("contact.orCall")}{" "}
          <span className="type-display tabular text-h3 text-ink" dir="ltr">
            {whatsappDisplay}
          </span>
        </a>
      </PageIntro>

      <Section surface="espresso" className="pt-0 sm:pt-0">
        <dl className="grid gap-6 pt-(--section) sm:grid-cols-3">
          {nap.map((row) => (
            <div key={row.label} className="border-t border-rule pt-4">
              <dt className="text-micro uppercase tracking-[0.18em] text-brass">{row.label}</dt>
              <dd className="mt-2 text-ink-soft">{row.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-10 max-w-(--measure) text-small text-ink-soft">{t("contact.areasLine", { cities })}</p>
        <p className="mt-1 text-micro text-ink-soft/60">{t("home.areasNote")}</p>
      </Section>
    </>
  );
}
