import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Section, SectionHeader } from "@/components/layout/Section";
import { Link } from "@/i18n/navigation";

const IMG = "/images/projects/project-01-studio";

/** Three photo tiles with a bottom scrim: home staging, rental furnishing, custom projects. */
export async function ServicesTiles() {
  const t = await getTranslations();
  const tiles = [
    { key: "staging", title: t("services.staging"), body: t("services.stagingBody"), src: `${IMG}/after-portrait-wide.jpg` },
    { key: "rental", title: t("services.rental"), body: t("services.rentalBody"), src: `${IMG}/after-kitchen.jpg` },
    { key: "custom", title: t("services.custom"), body: t("services.customBody"), src: `${IMG}/after-terrace.jpg` },
  ];

  return (
    <Section surface="espresso" labelledBy="services-title">
      <SectionHeader id="services-title" eyebrow={t("home.servicesEyebrow")} title={t("home.servicesTitle")} />
      <ul className="mt-14 grid gap-6 md:grid-cols-3">
        {tiles.map((tile) => (
          <li key={tile.key}>
            <Link href="/services" className="group block">
              <div className="aperture aspect-[3/4] overflow-hidden bg-night">
                <Image
                  src={tile.src}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.03] motion-reduce:transition-none"
                />
                <div className="scrim-bottom absolute inset-x-0 bottom-0 h-3/4" aria-hidden="true" />
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <h3 className="type-display text-h3 text-ivory">{tile.title}</h3>
                  <p className="mt-2 text-small text-sand">{tile.body}</p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
