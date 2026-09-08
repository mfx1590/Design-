import { getMessages, getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Container } from "@/components/layout/Container";
import { Link } from "@/i18n/navigation";
import type { StaticPathname } from "@/i18n/routing";
import { areas } from "@/lib/content/areas";
import { buildServices } from "@/lib/content/services";
import { navItems, telHref, whatsappDisplay } from "@/lib/site";

/** Espresso, five columns: NAP, pages, services, more, languages. Legal links on the bottom rule. */
export async function SiteFooter() {
  const t = await getTranslations();
  const services = buildServices((await getMessages()).content);
  const year = new Date().getFullYear();
  const heading = "text-micro font-medium uppercase tracking-[0.18em] text-brass";
  const link = "text-ink-soft transition-colors duration-(--dur-ui) ease-soft hover:text-ink";
  const more: Array<{ href: StaticPathname; label: string }> = [
    { href: "/process", label: t("footer.process") },
    { href: "/guides", label: t("footer.guides") },
    { href: "/reviews", label: t("footer.reviews") },
    { href: "/inquiry", label: t("footer.inquiry") },
  ];
  const legal: Array<{ href: StaticPathname; label: string }> = [
    { href: "/privacy", label: t("footer.privacy") },
    { href: "/cookies", label: t("footer.cookies") },
    { href: "/terms", label: t("footer.terms") },
  ];

  return (
    <footer className="surface-alt border-t border-rule">
      <Container className="grid gap-12 py-20 sm:grid-cols-2 lg:grid-cols-5">
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="type-display text-[1.75rem] text-ink">{t("brand.name")}</p>
          <p className="mt-4 max-w-xs text-small text-ink-soft">{t("footer.nap")}</p>
          <a href={telHref} className={`${link} mt-4 inline-block text-small`} dir="ltr">
            {whatsappDisplay}
          </a>
        </div>

        <div>
          <p className={heading}>{t("footer.pages")}</p>
          <ul className="mt-5 space-y-2 text-small">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={link}>
                  {t(`nav.${item.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className={heading}>{t("footer.services")}</p>
          <ul className="mt-5 space-y-2 text-small">
            {services.map((service) => (
              <li key={service.slug}>
                <Link href={{ pathname: "/services/[slug]", params: { slug: service.slug } }} className={link}>
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
          <p className={`${heading} mt-8`}>{t("footer.areas")}</p>
          <ul className="mt-5 space-y-2 text-small">
            {areas.map((area) => (
              <li key={area.slug}>
                <Link href={{ pathname: "/areas/[city]", params: { city: area.slug } }} className={link}>
                  {t(`areas.${area.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className={heading}>{t("footer.more")}</p>
          <ul className="mt-5 space-y-2 text-small">
            {more.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={link}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className={heading}>{t("footer.languages")}</p>
          <LanguageSwitcher variant="list" className="mt-5" />
        </div>
      </Container>
      <Container className="flex flex-wrap justify-between gap-x-8 gap-y-3 border-t border-rule-soft py-6 text-micro text-ink-soft/70">
        <span>{t("footer.rights", { year })}</span>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {legal.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={link}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </footer>
  );
}
