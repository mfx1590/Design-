import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/Container";

/** Four facts from the brief on one ruled row. No icons. */
export async function TrustStrip() {
  const t = await getTranslations("trust");
  const facts = [t("prices"), t("delivery"), t("remote"), t("languages")];

  return (
    <div className="surface-alt border-y border-rule">
      <Container>
        <ul className="grid divide-y divide-rule-soft text-small text-sand sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
          {facts.map((fact, i) => (
            <li key={fact} className="flex items-center gap-4 py-5 sm:pe-8 lg:border-e lg:border-rule-soft lg:last:border-e-0 lg:ps-8 lg:first:ps-0">
              <span aria-hidden="true" className="type-display tabular text-h3 leading-none text-brass">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{fact}</span>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
