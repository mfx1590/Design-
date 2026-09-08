import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Section } from "@/components/layout/Section";
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
  { name: "Plaster", hex: "#EFE9E1", cls: "bg-plaster", role: "page surface" },
  { name: "Porcelain", hex: "#E2DCD5", cls: "bg-porcelain", role: "alternate surface, inputs" },
  { name: "Frame", hex: "#15171B", cls: "bg-frame", role: "text, rules, frames, primary buttons" },
  { name: "Walnut", hex: "#5A4A40", cls: "bg-walnut", role: "secondary text" },
  { name: "Kyrenia", hex: "#1B5F80", cls: "bg-kyrenia", role: "links, focus, progress" },
];

const typeSteps = [
  ["display-xl", "text-display-xl", "You bought the walls."],
  ["display", "text-display", "Studio from £10,000"],
  ["h2", "text-h2", "Packages for every apartment type"],
  ["h3", "text-h3", "Rental furnishing for holiday lets"],
] as const;

type Props = { params: Promise<{ locale: string }> };

/** Dev-only styleguide (PLAN.md §11 Phase 1 checkpoint). Demo copy is English; components pull real strings. */
export default async function StyleguidePage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <Section labelledBy="sg-title">
        <p className="text-small text-ink-soft">Design system · Phase 1</p>
        <h1 id="sg-title" className="type-display mt-2 text-display">
          Styleguide
        </h1>
        <p className="mt-4 max-w-(--measure) text-lead text-ink-soft">
          Five colours, one type family in two cuts, square black frames, no shadows. Source: docs/design-plan.md §3.
        </p>
      </Section>

      <Section surface="porcelain" labelledBy="sg-palette">
        <h2 id="sg-palette" className="type-display text-h2">
          Palette
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {palette.map((c) => (
            <li key={c.name} className="aperture">
              <div className={`${c.cls} aspect-[4/3]`} />
              <div className="bg-plaster p-3">
                <p className="font-medium">{c.name}</p>
                <p className="text-small text-ink-soft tabular">{c.hex}</p>
                <p className="text-micro text-ink-soft">{c.role}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-small text-ink-soft">
          Contrast on Plaster: Frame 14.9:1, Walnut 7.0:1, Kyrenia 5.8:1. Terracotta and walnut appear only inside photographs.
        </p>
      </Section>

      <Section labelledBy="sg-type">
        <h2 id="sg-type" className="type-display text-h2">
          Type
        </h2>
        <p className="mt-2 max-w-(--measure) text-ink-soft">
          Commissioner, one variable file. Display cut = volume and flare axes at 100 (flared terminals). Text cut = both at 0. Vazirmatn on Farsi pages.
        </p>
        <div className="mt-8 divide-y divide-rule border-y border-rule">
          {typeSteps.map(([name, cls, sample]) => (
            <div key={name} className="grid gap-2 py-6 md:grid-cols-[8rem_1fr]">
              <span className="text-small text-ink-soft">{name}</span>
              <span className={`type-display ${cls}`}>{sample}</span>
            </div>
          ))}
          <div className="grid gap-2 py-6 md:grid-cols-[8rem_1fr]">
            <span className="text-small text-ink-soft">lead</span>
            <p className="max-w-(--measure) text-lead">
              Furniture packages for apartments in Northern Cyprus, delivered and installed within weeks of handover.
            </p>
          </div>
          <div className="grid gap-2 py-6 md:grid-cols-[8rem_1fr]">
            <span className="text-small text-ink-soft">body</span>
            <p className="max-w-(--measure)">
              The package covers every room: living, kitchen, bedrooms, bathroom and terrace. Delivery and installation are included, and
              the price is fixed before work starts. <a href="#sg-type" className="link">A text link looks like this.</a>
            </p>
          </div>
          <div className="grid gap-2 py-6 md:grid-cols-[8rem_1fr]">
            <span className="text-small text-ink-soft">small / micro</span>
            <p className="max-w-(--measure) text-small text-ink-soft">
              Kyrenia (Girne) · İskele (Trikomo) · Famagusta (Gazimağusa) · Nicosia (Lefkoşa)
              <span className="mt-1 block text-micro">{t("phase0.scriptCheck")}</span>
            </p>
          </div>
        </div>
      </Section>

      <Section surface="porcelain" labelledBy="sg-buttons">
        <h2 id="sg-buttons" className="type-display text-h2">
          Buttons and price
        </h2>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button>{t("cta.quote")}</Button>
          <Button variant="secondary">{t("cta.package")}</Button>
          <Button variant="tertiary">{t("cta.inquiry")}</Button>
          <Button size="lg">{t("cta.whatsapp")}</Button>
        </div>
        <div className="mt-8 flex flex-wrap items-baseline gap-10">
          <Price amount={10000} />
          <Price amount={12000} size="lg" />
          <Price amount={14000} size="xl" from={false} />
        </div>
        <div className="mt-8">
          <WhatsAppButton placement="inline" demoHref="https://wa.me/" />
        </div>
      </Section>

      <Section labelledBy="sg-apertures">
        <h2 id="sg-apertures" className="type-display text-h2">
          Apertures
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Aperture src={`${IMG}/after-landscape.jpg`} alt="Furnished studio" ratio="3/2" caption="3:2 · project photo" />
          <Aperture src={`${IMG}/after-kitchen.jpg`} alt="Kitchen" ratio="4/3" caption="4:3 · room" />
          <Aperture src={`${IMG}/after-terrace.jpg`} alt="Terrace" ratio="1/1" caption="1:1 · product" />
        </div>
      </Section>

      <Section surface="porcelain" labelledBy="sg-cards">
        <h2 id="sg-cards" className="type-display text-h2">
          Cards
        </h2>
        <p className="mt-2 text-ink-soft">Hover or tap the project card to wipe in the empty room.</p>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
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
        <h2 id="sg-table" className="type-display text-h2">
          Comparison table
        </h2>
        <p className="mt-2 text-ink-soft">Header sticks under the site header. Contents are placeholders until the owner confirms inclusions.</p>
        <div className="mt-8">
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

      <Section surface="porcelain" labelledBy="sg-form">
        <h2 id="sg-form" className="type-display text-h2">
          Form fields
        </h2>
        <form className="mt-8 grid max-w-3xl gap-6 md:grid-cols-2" action="#" onSubmit={undefined}>
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
        <h2 id="sg-steps" className="type-display text-h2">
          Step list
        </h2>
        <p className="mt-2 text-ink-soft">The only numbered list on the site, because this is a real sequence.</p>
        <div className="mt-8">
          <StepList
            steps={[
              { title: "Consultation", body: "A call or a visit. Floor plan, handover date, how you will use the apartment." },
              { title: "Concept", body: "Layout and a shortlist per room, priced." },
              { title: "Selection", body: "You approve the pieces, remotely if you are abroad." },
              { title: "Delivery", body: "Everything arrives together, timed to the handover." },
              { title: "Installation", body: "Assembled, placed, styled. Kitchenware and linen included where the package says so." },
              { title: "Handover", body: "Keys, photos, and a warranty document." },
            ]}
          />
        </div>
      </Section>
    </>
  );
}
