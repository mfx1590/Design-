import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFoundPage() {
  const t = useTranslations("notFound");
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-(--gutter) py-24">
      <h1 className="text-4xl font-semibold">{t("title")}</h1>
      <p className="mt-4 text-ink-soft">{t("body")}</p>
      <p className="mt-8">
        <Link href="/" className="border-b border-ink pb-0.5">
          {t("home")}
        </Link>
      </p>
    </main>
  );
}
