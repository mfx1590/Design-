import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Container } from "@/components/layout/Container";
import { Link } from "@/i18n/navigation";
import { navItems } from "@/lib/site";

/** Porcelain surface, four columns: NAP, pages, services, languages. Micro legal line below. */
export async function SiteFooter() {
  const t = await getTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="surface-alt border-t border-rule">
      <Container className="grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="type-display text-h3">{t("brand.name")}</p>
          <p className="mt-3 max-w-xs text-small text-ink-soft">{t("footer.nap")}</p>
        </div>

        <div>
          <p className="text-small font-medium">{t("footer.pages")}</p>
          <ul className="mt-3 space-y-1 text-small">
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
          <p className="text-small font-medium">{t("footer.services")}</p>
          <ul className="mt-3 space-y-1 text-small text-ink-soft">
            <li>{t("services.staging")}</li>
            <li>{t("services.rental")}</li>
            <li>{t("services.custom")}</li>
          </ul>
        </div>

        <div>
          <p className="text-small font-medium">{t("footer.languages")}</p>
          <LanguageSwitcher variant="list" className="mt-3" />
        </div>
      </Container>
      <Container className="flex flex-wrap justify-between gap-4 border-t border-rule py-5 text-micro text-ink-soft">
        <span>{t("footer.rights", { year })}</span>
        <span>{t("footer.legal")}</span>
      </Container>
    </footer>
  );
}
