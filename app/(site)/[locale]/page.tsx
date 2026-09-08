import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { HeroScene } from "@/components/home/HeroScene";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";
import { routing } from "@/i18n/routing";
import { packages, type PackageKey } from "@/lib/content/packages";

const labelKeys = {
  studio: { name: "packages.studio", note: "packages.studioNote" },
  onePlusOne: { name: "packages.onePlusOne", note: "packages.onePlusOneNote" },
  twoPlusOne: { name: "packages.twoPlusOne", note: "packages.twoPlusOneNote" },
} as const satisfies Record<PackageKey, { name: string; note: string }>;

type Props = { params: Promise<{ locale: string }> };

/** Homepage, Phase 2 scope: the hero scene plus the packages with prices. The rest arrives in Phase 3. */
export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <HeroScene />

      <Section surface="porcelain" labelledBy="packages-heading">
        <h2 id="packages-heading" className="type-display text-h2">
          {t("packages.heading")}
        </h2>
        <dl className="mt-8 divide-y divide-rule border-y border-rule">
          {packages.map((p) => (
            <div key={p.key} className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 py-5 sm:grid-cols-[9rem_1fr_auto]">
              <dt className="type-display text-h3">{t(labelKeys[p.key].name)}</dt>
              <dd className="order-3 text-small text-ink-soft sm:order-none">{t(labelKeys[p.key].note)}</dd>
              <dd className="text-end">
                <Price amount={p.priceFromGBP} />
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/packages" variant="secondary">
            {t("cta.packages")}
          </Button>
          <Button href="/contact">{t("cta.quote")}</Button>
        </div>
      </Section>
    </>
  );
}
