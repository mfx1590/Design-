import { getFormatter, getTranslations } from "next-intl/server";
import { PageIntro } from "@/components/layout/PageIntro";
import { Section } from "@/components/layout/Section";
import type { LegalContent } from "@/lib/content/legal";

/** Shared layout for privacy, cookies and terms: intro, template notice, measured sections. */
export async function LegalPage({ doc }: { doc: LegalContent }) {
  const t = await getTranslations("pages.legal");
  const format = await getFormatter();

  return (
    <>
      <PageIntro eyebrow={t("eyebrow")} title={doc.title} lead={t("updated", { date: format.dateTime(new Date(doc.updated), { dateStyle: "long" }) })}>
        <p className="max-w-(--measure) border-s-2 border-brass ps-4 text-small text-ink-soft">{t("template")}</p>
      </PageIntro>
      <Section className="pt-0">
        <article className="max-w-(--measure)">
          {doc.sections.map((section) => (
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
    </>
  );
}
