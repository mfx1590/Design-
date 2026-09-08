"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
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
  const params = useParams();
  const t = useTranslations("nav");
  // On dynamic routes the same page in another locale needs the current params.
  const href = (pathname.includes("[") ? { pathname, params } : pathname) as Parameters<typeof Link>[0]["href"];

  const items = routing.locales.map((code) => {
    const current = code === locale;
    return (
      <li key={code}>
        <Link
          href={href}
          locale={code}
          lang={code}
          hrefLang={code}
          dir={localeMeta[code].dir}
          aria-current={current ? "page" : undefined}
          className={cx(
            "block py-1 transition-colors duration-(--dur-ui) ease-soft",
            current ? "text-ink underline decoration-brass decoration-1 underline-offset-[6px]" : "text-ink-soft hover:text-ink",
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
          className="flex cursor-pointer list-none items-center gap-1.5 py-2 text-small font-medium uppercase tracking-[0.12em] text-ink-soft transition-colors hover:text-ink [&::-webkit-details-marker]:hidden"
          aria-label={t("language")}
        >
          {locale}
          <span aria-hidden="true" className="text-micro">
            ▾
          </span>
        </summary>
        <ul className="absolute end-0 top-full z-50 mt-2 min-w-44 border border-rule bg-surface-alt px-4 py-3 text-body">{items}</ul>
      </details>
    );
  }

  return (
    <nav aria-label={t("language")} className={className}>
      <ul className="flex flex-wrap gap-x-5 gap-y-1 text-small">{items}</ul>
    </nav>
  );
}
