import { getTranslations } from "next-intl/server";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/fields";
import { WhatsAppGlyph } from "@/components/ui/WhatsAppGlyph";
import { whatsappHref } from "@/lib/site";

/** Form UI beside the WhatsApp route. Submission and email arrive in Phase 5. */
export async function ContactSection() {
  const t = await getTranslations();
  const wa = whatsappHref(t("whatsapp.prefill"));

  return (
    <Section id="contact" labelledBy="contact-title">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
        <div>
          <p className="eyebrow">{t("home.contactEyebrow")}</p>
          <h2 id="contact-title" className="type-display mt-4 text-h2 text-ivory">
            {t("home.contactTitle")}
          </h2>
          <p className="mt-5 max-w-(--measure) text-lead text-sand">{t("home.contactLead")}</p>
          {wa ? (
            <div className="mt-10 border-t border-rule pt-8">
              <p className="text-small text-sand">{t("home.contactOr")}</p>
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-3 border border-ivory/60 px-6 py-3.5 font-medium tracking-[0.04em] text-ivory transition-colors hover:border-ivory hover:bg-ivory hover:text-night"
              >
                <WhatsAppGlyph className="size-5 text-whatsapp" />
                {t("cta.whatsapp")}
              </a>
            </div>
          ) : null}
        </div>

        <form className="grid gap-6 sm:grid-cols-2" action="#">
          <Field label={t("contact.name")} htmlFor="c-name">
            <Input id="c-name" name="name" autoComplete="name" required />
          </Field>
          <Field label={t("contact.phone")} htmlFor="c-phone" hint={t("contact.phoneHint")}>
            <Input id="c-phone" name="phone" type="tel" autoComplete="tel" required />
          </Field>
          <Field label={t("contact.email")} htmlFor="c-email">
            <Input id="c-email" name="email" type="email" autoComplete="email" />
          </Field>
          <Field label={t("contact.location")} htmlFor="c-location" hint={t("contact.locationHint")}>
            <Input id="c-location" name="location" />
          </Field>
          <Field label={t("contact.type")} htmlFor="c-type">
            <Select id="c-type" name="type" defaultValue="1+1">
              <option value="studio">{t("packages.studio")}</option>
              <option value="1+1">{t("packages.onePlusOne")}</option>
              <option value="2+1">{t("packages.twoPlusOne")}</option>
            </Select>
          </Field>
          <Field label={t("contact.service")} htmlFor="c-service">
            <Select id="c-service" name="service" defaultValue="standard">
              <option value="standard">{t("contact.serviceStandard")}</option>
              <option value="rental">{t("contact.serviceRental")}</option>
              <option value="staging">{t("contact.serviceStaging")}</option>
              <option value="custom">{t("contact.serviceCustom")}</option>
            </Select>
          </Field>
          <Field label={t("contact.message")} htmlFor="c-message" className="sm:col-span-2">
            <Textarea id="c-message" name="message" />
          </Field>
          <Checkbox id="c-consent" name="consent" label={t("contact.consent")} className="sm:col-span-2" required />
          <div className="sm:col-span-2">
            <Button type="submit" size="lg">
              {t("cta.send")}
            </Button>
          </div>
        </form>
      </div>
    </Section>
  );
}
