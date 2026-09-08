import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/layout/PageIntro";
import { Section } from "@/components/layout/Section";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { WhatsAppCta } from "@/components/ui/WhatsAppCta";
import { routing } from "@/i18n/routing";
import { projects } from "@/lib/content/projects";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "pages.portfolio" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

/** Portfolio grid (PLAN.md §6). Filters arrive once there is more than one project to filter. */
export default async function PortfolioPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations();
  const tp = await getTranslations("packages");

  return (
    <>
      <PageIntro eyebrow={t("pages.portfolio.eyebrow")} title={t("pages.portfolio.title")} lead={t("pages.portfolio.lead")}>
        <p className="text-small text-ink-soft">{t("pages.portfolio.count", { count: projects.length })}</p>
      </PageIntro>

      <Section className="pt-0">
        <div className="grid gap-10 md:grid-cols-2">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.slug}
              slug={project.slug}
              title={project.title}
              meta={[project.city, project.apartmentType, tp(project.packageKey)].filter(Boolean).join(" · ")}
              ratio={i === 0 ? "16/9" : "3/2"}
              className={i === 0 ? "md:col-span-2" : undefined}
              sizes={i === 0 ? "(min-width: 1280px) 1200px, 100vw" : "(min-width: 768px) 50vw, 100vw"}
              afterSrc={project.after.src}
              beforeSrc={project.before.src}
              alt={project.after.alt}
              hasVideo={project.hasVideo}
              priority={i === 0}
            />
          ))}
        </div>
        <p className="mt-10 text-small text-ink-soft/70">{t("pages.portfolio.more")}</p>
      </Section>

      <WhatsAppCta />
    </>
  );
}
