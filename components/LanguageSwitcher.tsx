"use client";

import { useLocale, useTranslations } from "next-intl";
import { localeMeta } from "@/i18n/locales";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cx } from "@/lib/cx";

interface LanguageSwitcherProps {
  /** "list": all six names in a row (footer, mobile menu). "menu": compact code with a dropdown (header). */
  variant?: "list" | "menu";
  className?: string;
}

/**
 * Switches to the same page in another locale, never to the homepage.
 * The proxy stores the choice in the NEXT_LOCALE cookie, so it wins over Accept-Language next time.
 */
export function LanguageSwitcher({ variant = "list", className }: LanguageSwitcherProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("nav");

  const items = routing.locales.map((code) => {
    const current = code === locale;
    return (
      <li key={code}>
        <Link
          href={pathname}
          locale={code}
          lang={code}
          hrefLang={code}
          dir={localeMeta[code].dir}
          aria-current={current ? "page" : undefined}
          className={cx(
            "block py-1 transition-colors duration-(--dur-ui) ease-soft",
            current ? "text-ivory underline decoration-brass decoration-1 underline-offset-[6px]" : "text-sand hover:text-ivory",
          )}
        >
          {localeMeta[code].nativeName}
        </Link>
      </li>
    );
  });

  if (variant === "menu") {
    return (
      <details className={cx("relative", className)}>
        <summary
          className="flex cursor-pointer list-none items-center gap-1.5 py-2 text-small font-medium uppercase tracking-[0.12em] text-sand transition-colors hover:text-ivory [&::-webkit-details-marker]:hidden"
          aria-label={t("language")}
        >
          {locale}
          <span aria-hidden="true" className="text-micro">
            ▾
          </span>
        </summary>
        <ul className="absolute end-0 top-full z-50 mt-2 min-w-44 border border-umber bg-espresso px-4 py-3 text-body">{items}</ul>
      </details>
    );
  }

  return (
    <nav aria-label={t("language")} className={className}>
      <ul className="flex flex-wrap gap-x-5 gap-y-1 text-small">{items}</ul>
    </nav>
  );
}
