import { getTranslations } from "next-intl/server";
import { TransformationScene } from "@/components/scene/TransformationScene";
import { Button } from "@/components/ui/Button";
import manifest from "@/public/sequences/project-01-studio/manifest.json";

const PROJECT_IMAGES = "/images/projects/project-01-studio";

/**
 * Homepage hero: the studio scrubbed from empty to furnished (PLAN.md §5). It also drives the
 * site-wide day-to-dusk blend, so the interface furnishes itself along with the room.
 */
export async function HeroScene() {
  const t = await getTranslations();

  return (
    <TransformationScene
      tier="sequence"
      priority
      duskSync
      before={{ src: manifest.poster, alt: t("hero.altBefore") }}
      after={{ src: `${PROJECT_IMAGES}/after-landscape.jpg`, alt: t("hero.altAfter") }}
      sequence={{ desktop: manifest.sets.desktop, mobile: manifest.sets.mobile }}
      video={{ desktop: manifest.video }}
      eyebrow={t("hero.eyebrow")}
      headline={{ before: t("hero.before"), after: t("hero.after"), switchAt: 0.6 }}
      lead={t("hero.lead")}
      actions={
        <>
          <Button href="/contact">{t("cta.quote")}</Button>
          <Button href="/packages" variant="secondary">
            {t("cta.packages")}
          </Button>
        </>
      }
      note={t("hero.visualisation")}
      labels={{ before: t("card.before"), after: t("card.after") }}
    />
  );
}
