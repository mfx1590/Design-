import { getTranslations } from "next-intl/server";
import { TransformationScene } from "@/components/scene/TransformationScene";
import { Button } from "@/components/ui/Button";
import manifest from "@/public/sequences/project-01-studio/manifest.json";

const PROJECT_IMAGES = "/images/projects/project-01-studio";

/** Homepage hero: the studio project scrubbed from empty to furnished (PLAN.md §5). */
export async function HeroScene() {
  const t = await getTranslations();

  return (
    <TransformationScene
      tier="sequence"
      priority
      before={{ src: manifest.poster, alt: t("hero.altBefore") }}
      after={{ src: `${PROJECT_IMAGES}/after-landscape.jpg`, alt: t("hero.altAfter") }}
      sequence={{ desktop: manifest.sets.desktop, mobile: manifest.sets.mobile }}
      video={{ desktop: manifest.video }}
      headline={{ before: t("hero.before"), after: t("hero.after"), switchAt: 0.6 }}
      lead={t("hero.lead")}
      actions={
        <>
          <Button href="/contact">{t("cta.quote")}</Button>
          <Button href="/packages" variant="inverse">
            {t("cta.packages")}
          </Button>
        </>
      }
      note={t("hero.visualisation")}
      labels={{ before: t("card.before"), after: t("card.after") }}
    />
  );
}
