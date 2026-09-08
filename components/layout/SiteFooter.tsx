import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Container } from "@/components/layout/Container";
import { Link } from "@/i18n/navigation";
import { navItems } from "@/lib/site";

/** Espresso, four columns: NAP, pages, services, languages. Brass wordmark, sand text. */
export async function SiteFooter() {
  const t = await getTranslations();
  const year = new Date().getFullYear();
  const heading = "text-micro font-medium uppercase tracking-[0.18em] text-brass";

  return (
    <footer className="surface-alt border-t border-rule">
      <Container className="grid gap-12 py-20 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="type-display text-[1.75rem] text-ink">{t("brand.name")}</p>
          <p className="mt-4 max-w-xs text-small text-ink-soft">{t("footer.nap")}</p>
        </div>

        <div>
          <p className={heading}>{t("footer.pages")}</p>
          <ul className="mt-5 space-y-2 text-small">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-ink-soft transition-colors duration-(--dur-ui) ease-soft hover:text-ink">
                  {t(`nav.${item.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className={heading}>{t("footer.services")}</p>
          <ul className="mt-5 space-y-2 text-small text-ink-soft">
            <li>{t("services.staging")}</li>
            <li>{t("services.rental")}</li>
            <li>{t("services.custom")}</li>
          </ul>
        </div>

        <div>
          <p className={heading}>{t("footer.languages")}</p>
          <LanguageSwitcher variant="list" className="mt-5" />
        </div>
      </Container>
      <Container className="flex flex-wrap justify-between gap-4 border-t border-rule-soft py-6 text-micro text-ink-soft/70">
        <span>{t("footer.rights", { year })}</span>
        <span>{t("footer.legal")}</span>
      </Container>
    </footer>
  );
}
