import { getTranslations } from "next-intl/server";
import { Aperture } from "@/components/ui/Aperture";
import { Button } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";

interface ProductCardProps {
  name: string;
  materials: string;
  imageSrc: string;
  alt: string;
  /** GBP amount, or null for price on request. */
  priceGBP: number | null;
}

/** Square aperture, Cormorant name, materials line, brass price or "Price on request", and the inquiry link. */
export async function ProductCard({ name, materials, imageSrc, alt, priceGBP }: ProductCardProps) {
  const t = await getTranslations("cta");

  return (
    <article>
      <Aperture src={imageSrc} alt={alt} ratio="1/1" sizes="(min-width: 1024px) 25vw, 50vw" />
      <h3 className="type-display mt-4 text-h3 text-ink">{name}</h3>
      <p className="mt-1.5 text-small text-ink-soft">{materials}</p>
      <p className="mt-3">
        {priceGBP === null ? <span className="text-small text-ink-soft">{t("priceOnRequest")}</span> : <Price amount={priceGBP} from={false} size="sm" />}
      </p>
      <p className="mt-4">
        <Button variant="tertiary">{t("inquiry")}</Button>
      </p>
    </article>
  );
}
