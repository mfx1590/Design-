import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Section, SectionHeader } from "@/components/layout/Section";
import { Aperture } from "@/components/ui/Aperture";
import { Button } from "@/components/ui/Button";
import { ComparisonTable } from "@/components/ui/ComparisonTable";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/fields";
import { Price } from "@/components/ui/Price";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { StepList } from "@/components/ui/StepList";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { routing } from "@/i18n/routing";

export const metadata: Metadata = { title: "Styleguide", robots: { index: false, follow: false } };

const IMG = "/images/projects/project-01-studio";

const palette = [
  { name: "Night", hex: "#15110D", cls: "bg-surface", role: "page background" },
  { name: "Espresso", hex: "#211A14", cls: "bg-surface-alt", role: "cards, header, raised surfaces" },
  { name: "Umber", hex: "#3B2E24", cls: "bg-umber", role: "rules, borders" },
  { name: "Ivory", hex: "#F4EBDD", cls: "bg-ivory", role: "primary text" },
  { name: "Sand", hex: "#CDBBA4", cls: "bg-sand", role: "secondary text" },
  { name: "Brass", hex: "#C9A35F", cls: "bg-brass", role: "actions, numbers, eyebrows" },
  { name: "Terracotta", hex: "#C4562E", cls: "bg-terracotta", role: "chips, highlights" },
];

const typeSteps = [
  ["hero", "text-hero", "You bought the walls."],
  ["display", "text-display", "Studio from £10,000"],
  ["h2", "text-h2", "One price for the whole apartment."],
  ["h3", "text-h3", "Rental furnishing for holiday lets"],
] as const;

type Props = { params: Promise<{ locale: string }> };

/** Dev-only styleguide, v3 system. Demo copy is English; components pull real strings. */
export default async function StyleguidePage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <Section labelledBy="sg-title">
        <p className="eyebrow">Design system · v3</p>
        <h1 id="sg-title" className="type-display mt-4 text-display text-ink">
          Styleguide
        </h1>
        <p className="mt-5 max-w-(--measure) text-lead text-ink-soft">
          Seven colours, Cormorant Garamond and Jost, square frames that glow, no drop shadows. Source: docs/design-plan-v3.md.
        </p>
      </Section>

      <Section surface="espresso" labelledBy="sg-palette">
        <SectionHeader id="sg-palette" eyebrow="Colour" title="Palette" />
        <ul className="mt-12 grid gap-4 sm:grid-cols-3 lg:grid-cols-7">
          {palette.map((c) => (
            <li key={c.name} className="border border-rule">
              <div className={`${c.cls} aspect-[4/3]`} />
              <div className="bg-surface p-3">
                <p className="font-medium text-ink">{c.name}</p>
                <p className="text-small text-ink-soft tabular">{c.hex}</p>
                <p className="text-micro text-ink-soft/70">{c.role}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-small text-ink-soft">
          Contrast on Night: Ivory 15.9:1, Sand 10.1:1, Brass 8.0:1. Terracotta is never used for small text.
        </p>
      </Section>

      <Section labelledBy="sg-type">
        <SectionHeader id="sg-type" eyebrow="Type" title="Cormorant Garamond and Jost" lead="Headlines and prices in Cormorant; body, UI and eyebrows in Jost. Vazirmatn on Farsi pages." />
        <div className="mt-12 divide-y divide-rule border-y border-rule">
          {typeSteps.map(([name, cls, sample]) => (
            <div key={name} className="grid gap-2 py-7 md:grid-cols-[8rem_1fr]">
              <span className="text-small text-ink-soft">{name}</span>
              <span className={`type-display text-ink ${cls}`}>{sample}</span>
            </div>
          ))}
          <div className="grid gap-2 py-7 md:grid-cols-[8rem_1fr]">
            <span className="text-small text-ink-soft">eyebrow</span>
            <p className="eyebrow">Furniture packages · Northern Cyprus</p>
          </div>
          <div className="grid gap-2 py-7 md:grid-cols-[8rem_1fr]">
            <span className="text-small text-ink-soft">lead</span>
            <p className="max-w-(--measure) text-lead text-ink-soft">Complete furniture packages for apartments in Northern Cyprus, delivered and installed.</p>
          </div>
          <div className="grid gap-2 py-7 md:grid-cols-[8rem_1fr]">
            <span className="text-small text-ink-soft">body</span>
            <p className="max-w-(--measure) text-ink-soft">
              The package covers every room: living, kitchen, bedrooms and bathroom. Delivery and installation are included, and the price
              is fixed before work starts. <a href="#sg-type" className="link">A text link looks like this.</a>
            </p>
          </div>
          <div className="grid gap-2 py-7 md:grid-cols-[8rem_1fr]">
            <span className="text-small text-ink-soft">small / micro</span>
            <p className="max-w-(--measure) text-small text-ink-soft">
              Kyrenia (Girne) · İskele (Trikomo) · Famagusta (Gazimağusa) · Nicosia (Lefkoşa)
              <span className="mt-1 block text-micro">{t("phase0.scriptCheck")}</span>
            </p>
          </div>
        </div>
      </Section>

      <Section surface="espresso" labelledBy="sg-buttons">
        <SectionHeader id="sg-buttons" eyebrow="Actions" title="Buttons and price" />
        <div className="mt-12 flex flex-wrap items-center gap-4">
          <Button>{t("cta.quote")}</Button>
          <Button variant="secondary">{t("cta.package")}</Button>
          <Button variant="tertiary">{t("cta.inquiry")}</Button>
          <Button size="lg">{t("cta.whatsapp")}</Button>
          <Button size="sm" variant="secondary">
            {t("cta.project")}
          </Button>
        </div>
        <div className="mt-10 flex flex-wrap items-baseline gap-10">
          <Price amount={10000} />
          <Price amount={12000} size="lg" />
          <Price amount={14000} size="xl" from={false} />
        </div>
        <div className="mt-10">
          <WhatsAppButton placement="inline" demoHref="https://wa.me/" />
        </div>
      </Section>

      <Section labelledBy="sg-apertures">
        <SectionHeader id="sg-apertures" eyebrow="Photography" title="Apertures" lead="One-pixel umber frame that warms to brass on hover, with an inner vignette so the picture glows." />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Aperture src={`${IMG}/after-landscape.jpg`} alt="Furnished studio" ratio="3/2" caption="3:2 · project photo" />
          <Aperture src={`${IMG}/after-kitchen.jpg`} alt="Kitchen" ratio="4/3" caption="4:3 · room" />
          <Aperture src={`${IMG}/after-terrace.jpg`} alt="Terrace" ratio="1/1" caption="1:1 · product" />
        </div>
      </Section>

      <Section surface="espresso" labelledBy="sg-cards">
        <SectionHeader id="sg-cards" eyebrow="Cards" title="Project and product" lead="Hover or tap the project card to wipe in the empty room." />
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <ProjectCard
            title="Studio, pool-side complex"
            meta="City to be confirmed · Studio · Studio package"
            afterSrc={`${IMG}/after-landscape.jpg`}
            beforeSrc={`${IMG}/before-landscape.jpg`}
            alt="Furnished studio with breakfast bar, bed and sofa"
            hasVideo
          />
          <ProductCard
            name="Bar stool, terracotta"
            materials="Upholstered seat, black steel legs"
            imageSrc={`${IMG}/after-kitchen.jpg`}
            alt="Terracotta bar stools at a white quartz bar"
            priceGBP={null}
          />
          <ProductCard
            name="Outdoor dining set"
            materials="Black rattan, tempered glass"
            imageSrc={`${IMG}/after-terrace.jpg`}
            alt="Black rattan dining set on a terrace by the pool"
            priceGBP={850}
          />
        </div>
      </Section>

      <Section labelledBy="sg-table">
        <SectionHeader id="sg-table" eyebrow="Tables" title="Comparison table" lead="Header sticks under the site header. Contents are placeholders until the owner confirms inclusions." />
        <div className="mt-12">
          <ComparisonTable
            caption="Package comparison"
            columns={[
              { key: "studio", name: t("packages.studio"), priceFromGBP: 10000 },
              { key: "onePlusOne", name: t("packages.onePlusOne"), priceFromGBP: 12000 },
              { key: "twoPlusOne", name: t("packages.twoPlusOne"), priceFromGBP: 14000 },
            ]}
            highlight="onePlusOne"
            rows={[
              { label: "Living / sleeping", values: [true, true, true] },
              { label: "Kitchen", values: [true, true, true] },
              { label: "Bedroom 1", values: [null, true, true] },
              { label: "Bedroom 2", values: [null, null, true] },
              { label: "Bathroom", values: [true, true, true] },
              { label: "Terrace", values: ["to confirm", "to confirm", "to confirm"] },
              { label: "Delivery + installation", values: [true, true, true] },
              { label: "Timeline", values: ["to confirm", "to confirm", "to confirm"] },
            ]}
            footer={() => <Button size="sm">{t("cta.quote")}</Button>}
            mobileFooter={<Button className="w-full">{t("cta.quote")}</Button>}
          />
        </div>
      </Section>

      <Section surface="espresso" labelledBy="sg-form">
        <SectionHeader id="sg-form" eyebrow="Forms" title="Form fields" />
        <form className="mt-12 grid max-w-3xl gap-6 md:grid-cols-2" action="#">
          <Field label="Name" htmlFor="sg-name">
            <Input id="sg-name" name="name" autoComplete="name" />
          </Field>
          <Field label="Phone or WhatsApp" htmlFor="sg-phone" hint="With country code">
            <Input id="sg-phone" name="phone" type="tel" autoComplete="tel" />
          </Field>
          <Field label="Email" htmlFor="sg-email" error="Please enter a valid email address">
            <Input id="sg-email" name="email" type="email" aria-invalid="true" aria-describedby="sg-email-error" defaultValue="mehdi@" />
          </Field>
          <Field label="Apartment type" htmlFor="sg-type">
            <Select id="sg-type" name="type" defaultValue="1+1">
              <option value="studio">Studio</option>
              <option value="1+1">1+1</option>
              <option value="2+1">2+1</option>
            </Select>
          </Field>
          <Field label="Message" htmlFor="sg-message" className="md:col-span-2">
            <Textarea id="sg-message" name="message" />
          </Field>
          <Checkbox id="sg-consent" name="consent" label="I agree to be contacted about my request." className="md:col-span-2" />
          <div className="md:col-span-2">
            <Button type="submit">{t("cta.quote")}</Button>
          </div>
        </form>
      </Section>

      <Section labelledBy="sg-steps">
        <SectionHeader id="sg-steps" eyebrow="Sequence" title="Step list" lead="The only numbered list on the site, because this is a real sequence." />
        <div className="mt-12">
          <StepList
            variant="grid"
            steps={[
              { title: "Consultation", body: "A call or a visit. Floor plan, handover date, how you will use the apartment." },
              { title: "Concept", body: "Layout and a shortlist per room, priced." },
              { title: "Selection", body: "You approve the pieces, remotely if you are abroad." },
              { title: "Delivery", body: "Everything arrives together, timed to the handover." },
              { title: "Installation", body: "Assembled, placed, styled." },
              { title: "Handover", body: "You walk into a finished home." },
            ]}
          />
        </div>
      </Section>
    </>
  );
}
