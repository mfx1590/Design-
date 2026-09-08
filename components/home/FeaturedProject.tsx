import { getTranslations } from "next-intl/server";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { ProjectCard } from "@/components/ui/ProjectCard";

const IMG = "/images/projects/project-01-studio";

/** The studio, large, with the before/after wipe. Facts are placeholders until the owner confirms them. */
export async function FeaturedProject() {
  const t = await getTranslations();

  return (
    <Section surface="espresso" labelledBy="project-title">
      <div className="grid items-center gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
        <ProjectCard
          imageOnly
          ratio="4/3"
          sizes="(min-width: 1024px) 58vw, 100vw"
          title={t("home.projectTitle")}
          meta={t("home.projectMeta")}
          afterSrc={`${IMG}/after-landscape.jpg`}
          beforeSrc={`${IMG}/before-landscape.jpg`}
          alt={t("hero.altAfter")}
          hasVideo
        />
        <div>
          <p className="eyebrow">{t("home.projectEyebrow")}</p>
          <h2 id="project-title" className="type-display mt-4 text-h2 text-ink">
            {t("home.projectTitle")}
          </h2>
          <p className="mt-3 text-small text-ink-soft/80">{t("home.projectMeta")}</p>
          <p className="mt-6 max-w-(--measure) text-lead text-ink-soft">{t("home.projectBody")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/portfolio" variant="secondary">
              {t("cta.allProjects")}
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
