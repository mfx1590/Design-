import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/layout/PageIntro";
import { Section, SectionHeader } from "@/components/layout/Section";
import { TransformationScene } from "@/components/scene/TransformationScene";
import { Aperture } from "@/components/ui/Aperture";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";
import { WhatsAppCta } from "@/components/ui/WhatsAppCta";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { furnitureBySlug } from "@/lib/content/furniture";
import { projectBySlug, projects } from "@/lib/content/projects";
import { whatsappHref } from "@/lib/site";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => projects.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const project = projectBySlug(slug);
  if (!project) return {};
  return { title: `${project.title} — Design Package`, description: project.summary };
}

/** Project detail (PLAN.md §6): its own scene, then the case study. */
export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const project = projectBySlug(slug);
  if (!project) notFound();
  setRequestLocale(locale);
  const t = await getTranslations();
  const tp = await getTranslations("packages");
  const prefill = t("pages.project.prefill", { title: project.title });
  const wa = whatsappHref(prefill);
  const pieces = project.furnitureSlugs.map(furnitureBySlug).filter((x) => x !== undefined);

  const facts = [
    { label: t("pages.project.typeLabel"), value: project.apartmentType },
    { label: t("pages.project.packageLabel"), value: tp(project.packageKey) },
    { label: t("pages.project.cityLabel"), value: project.city ?? t("pages.project.cityToConfirm") },
  ];

  return (
    <>
      {project.sequence ? (
        <TransformationScene
          tier="sequence"
          priority
          before={{ src: project.sequence.poster, alt: project.before.alt }}
          after={project.after}
          sequence={{ desktop: project.sequence.sets.desktop, mobile: project.sequence.sets.mobile }}
          video={{ desktop: project.sequence.video }}
          eyebrow={t("pages.project.eyebrow")}
          headline={{ before: t("hero.before"), after: project.title, switchAt: 0.6 }}
          actions={
            <Button href={wa} external>
              {t("cta.quote")}
            </Button>
          }
          note={project.visualisationNote ? t("hero.visualisation") : undefined}
          labels={{ before: t("card.before"), after: t("card.after") }}
        />
      ) : (
        <TransformationScene
          tier="wipe"
          priority
          before={project.before}
          after={project.after}
          eyebrow={t("pages.project.eyebrow")}
          headline={{ before: t("hero.before"), after: project.title, switchAt: 0.6 }}
          labels={{ before: t("card.before"), after: t("card.after") }}
        />
      )}

      <PageIntro
        eyebrow={t("pages.project.summaryEyebrow")}
        title={project.title}
        lead={project.summary}
        aside={
          <dl className="card grid gap-4 p-7">
            {facts.map((fact) => (
              <div key={fact.label} className="flex items-baseline justify-between gap-6 border-b border-rule-soft pb-3 last:border-b-0 last:pb-0">
                <dt className="text-small text-ink-soft">{fact.label}</dt>
                <dd className="type-display text-h3 text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>
        }
      >
        <p className="text-micro uppercase tracking-[0.18em] text-brass">{t("pages.project.scopeEyebrow")}</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {project.scope.map((item) => (
            <li key={item} className="border border-rule px-3 py-1.5 text-small text-ink-soft">
              {item}
            </li>
          ))}
        </ul>
        {project.visualisationNote ? <p className="mt-6 max-w-(--measure) text-micro text-ink-soft/60">{project.visualisationNote}</p> : null}
      </PageIntro>

      <Section surface="espresso" labelledBy="gallery-title" className="pt-0 sm:pt-0 lg:pt-0">
        <div className="pt-(--section)">
          <SectionHeader id="gallery-title" eyebrow={t("pages.project.galleryEyebrow")} title={t("pages.project.galleryTitle")} />
          <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
            {project.gallery.map((photo) => (
              <Aperture
                key={photo.src}
                src={photo.src}
                alt={photo.alt}
                ratio={photo.ratio}
                sizes={photo.ratio === "3/2" ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, 50vw"}
                caption={photo.alt}
                className={photo.ratio === "3/2" ? "col-span-2" : undefined}
              />
            ))}
          </div>
          <p className="mt-8 text-small text-ink-soft/70">{t("pages.project.videoNote")}</p>
        </div>
      </Section>

      {pieces.length ? (
        <Section labelledBy="pieces-title">
          <SectionHeader id="pieces-title" eyebrow={t("pages.project.furnitureEyebrow")} title={t("pages.project.furnitureTitle")} />
          <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
            {pieces.map((piece) => (
              <ProductCard key={piece.slug} slug={piece.slug} name={piece.name} materials={piece.materials} imageSrc={piece.image.src} alt={piece.image.alt} priceGBP={piece.priceGBP} />
            ))}
          </div>
          <p className="mt-10">
            <Link href="/portfolio" className="link text-small">
              {t("pages.project.backToPortfolio")}
            </Link>
          </p>
        </Section>
      ) : null}

      <WhatsAppCta message={prefill} />
    </>
  );
}
