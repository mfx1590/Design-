import { getTranslations } from "next-intl/server";
import { Section } from "@/components/layout/Section";
import { WhatsAppGlyph } from "@/components/ui/WhatsAppGlyph";
import { telHref, whatsappDisplay, whatsappHref } from "@/lib/site";

/** The handover: straight to WhatsApp. No form (owner decision, 2026-09-08). */
export async function ContactSection() {
  const t = await getTranslations();
  const wa = whatsappHref(t("whatsapp.prefill"));
  const cities = [t("areas.kyrenia"), t("areas.iskele"), t("areas.famagusta"), t("areas.nicosia")].join(", ");

  return (
    <Section id="contact" labelledBy="contact-title">
      <div className="grid items-end gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
        <div>
          <p className="eyebrow">{t("home.contactEyebrow")}</p>
          <h2 id="contact-title" className="type-display mt-4 text-h2 text-ink">
            {t("home.contactTitle")}
          </h2>
          <p className="mt-5 max-w-(--measure) text-lead text-ink-soft">{t("contact.whatsappLead")}</p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 border border-brass bg-brass px-7 py-4 text-body font-medium tracking-[0.04em] text-night transition-colors duration-(--dur-ui) ease-soft hover:border-brass-deep hover:bg-brass-deep"
            >
              <WhatsAppGlyph className="size-5" />
              {t("contact.openWhatsApp")}
            </a>
            <a href={telHref} className="text-small text-ink-soft">
              {t("contact.orCall")}{" "}
              <span className="type-display tabular text-h3 text-ink" dir="ltr">
                {whatsappDisplay}
              </span>
            </a>
          </div>

          <p className="mt-8 max-w-(--measure) text-small text-ink-soft">{t("contact.areasLine", { cities })}</p>
          <p className="mt-1 text-micro text-ink-soft/60">{t("home.areasNote")}</p>
        </div>

        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="card block p-7 sm:p-9"
          aria-label={t("contact.openWhatsApp")}
        >
          <p className="inline-flex items-center gap-2 text-micro font-medium uppercase tracking-[0.18em] text-ink-soft">
            <WhatsAppGlyph className="size-4 text-whatsapp" />
            WhatsApp
          </p>
          <p className="type-display tabular mt-4 text-display leading-none text-brass" dir="ltr">
            {whatsappDisplay}
          </p>
          <p className="mt-4 text-small text-ink-soft">{t("trust.languages")}</p>
          <p className="mt-1 text-micro text-ink-soft/60">{t("contact.hoursNote")}</p>
        </a>
      </div>
    </Section>
  );
}
