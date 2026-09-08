import { getTranslations } from "next-intl/server";
import { Section } from "@/components/layout/Section";
import { WhatsAppGlyph } from "@/components/ui/WhatsAppGlyph";
import { telHref, whatsappDisplay, whatsappHref } from "@/lib/site";

interface WhatsAppCtaProps {
  /** Optional prefilled message override (e.g. mentioning the package the visitor is reading). */
  message?: string;
  title?: string;
  lead?: string;
}

/** Bottom-of-page call to action: straight to WhatsApp, with the number beside it. */
export async function WhatsAppCta({ message, title, lead }: WhatsAppCtaProps) {
  const t = await getTranslations();
  const wa = whatsappHref(message ?? t("whatsapp.prefill"));

  return (
    <Section surface="espresso" labelledBy="cta-title">
      <div className="grid items-center gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
        <div>
          <p className="eyebrow">{t("home.contactEyebrow")}</p>
          <h2 id="cta-title" className="type-display mt-4 text-h2 text-ink">
            {title ?? t("home.contactTitle")}
          </h2>
          <p className="mt-5 max-w-(--measure) text-lead text-ink-soft">{lead ?? t("contact.whatsappLead")}</p>
        </div>
        <div className="flex flex-col gap-4">
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 border border-brass bg-brass px-7 py-4 text-body font-medium tracking-[0.04em] text-night transition-colors duration-(--dur-ui) ease-soft hover:border-brass-deep hover:bg-brass-deep"
          >
            <WhatsAppGlyph className="size-5" />
            {t("contact.openWhatsApp")}
          </a>
          <a href={telHref} className="text-center text-small text-ink-soft lg:text-start">
            {t("contact.orCall")}{" "}
            <span className="type-display tabular text-h3 text-ink" dir="ltr">
              {whatsappDisplay}
            </span>
          </a>
        </div>
      </div>
    </Section>
  );
}
