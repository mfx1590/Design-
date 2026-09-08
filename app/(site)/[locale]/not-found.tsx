import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFoundPage() {
  const t = useTranslations("notFound");
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-(--gutter) py-(--section)">
      <h1 className="type-display text-display text-ink">{t("title")}</h1>
      <p className="mt-5 text-lead text-ink-soft">{t("body")}</p>
      <p className="mt-8">
        <Link href="/" className="link">
          {t("home")}
        </Link>
      </p>
    </main>
  );
}
