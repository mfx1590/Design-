import { getTranslations } from "next-intl/server";
import { Section, SectionHeader } from "@/components/layout/Section";

/** Four questions answered from the brief only. Native details/summary, no JS. */
export async function Faq() {
  const t = await getTranslations();
  const items = ([1, 2, 3, 4] as const).map((n) => ({ q: t(`faq.q${n}`), a: t(`faq.a${n}`) }));

  return (
    <Section surface="espresso" labelledBy="faq-title">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <SectionHeader id="faq-title" eyebrow={t("home.faqEyebrow")} title={t("home.faqTitle")} />
        <div className="divide-y divide-rule border-y border-rule">
          {items.map((item) => (
            <details key={item.q} className="group py-6">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 [&::-webkit-details-marker]:hidden">
                <span className="type-display text-h3 text-ivory">{item.q}</span>
                <span
                  aria-hidden="true"
                  className="mt-1 grid size-7 shrink-0 place-items-center border border-umber text-brass transition-transform duration-(--dur-ui) ease-soft group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-(--measure) text-sand">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}
