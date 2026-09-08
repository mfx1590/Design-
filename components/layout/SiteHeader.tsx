import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Container } from "@/components/layout/Container";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { WhatsAppGlyph } from "@/components/ui/WhatsAppGlyph";
import { Link } from "@/i18n/navigation";
import { navItems, whatsappHref } from "@/lib/site";

/** Wordmark at the start, links in the middle, language and WhatsApp at the end. 64px, Plaster, one rule below. */
export async function SiteHeader() {
  const t = await getTranslations();
  const wa = whatsappHref(t("whatsapp.prefill"));
  const items = navItems.map((item) => ({ href: item.href, label: t(`nav.${item.key}`) }));

  return (
    <header className="sticky top-0 z-40 h-(--header-height) border-b border-rule bg-plaster">
      <Container className="flex h-full items-center justify-between gap-6">
        <Link href="/" className="type-display text-h3 text-ink">
          {t("brand.name")}
        </Link>

        <nav aria-label={t("nav.menu")} className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-body text-ink transition-colors duration-(--dur-ui) ease-soft hover:text-kyrenia">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <LanguageSwitcher variant="menu" />
          {wa ? (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-small font-medium text-ink transition-colors duration-(--dur-ui) ease-soft hover:text-kyrenia"
            >
              <WhatsAppGlyph className="size-5 text-whatsapp" />
              {t("nav.whatsapp")}
            </a>
          ) : null}
        </div>

        <MobileMenu items={items} whatsappHref={wa} labels={{ menu: t("nav.menu"), close: t("nav.close"), whatsapp: t("nav.whatsapp") }} />
      </Container>
    </header>
  );
}
