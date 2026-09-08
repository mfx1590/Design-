import { getTranslations } from "next-intl/server";
import { AddToInquiry } from "@/components/furniture/AddToInquiry";
import { Aperture } from "@/components/ui/Aperture";
import { Price } from "@/components/ui/Price";
import { Link } from "@/i18n/navigation";

interface ProductCardProps {
  slug?: string;
  name: string;
  materials: string;
  imageSrc: string;
  alt: string;
  /** GBP amount, or null for price on request. */
  priceGBP: number | null;
}

/** Square aperture, Cormorant name, materials line, brass price or "Price on request", and the inquiry toggle. */
export async function ProductCard({ slug, name, materials, imageSrc, alt, priceGBP }: ProductCardProps) {
  const t = await getTranslations("cta");
  const title = slug ? (
    <Link href={{ pathname: "/furniture/[slug]", params: { slug } }} className="transition-colors hover:text-brass">
      {name}
    </Link>
  ) : (
    name
  );

  return (
    <article>
      {slug ? (
        <Link href={{ pathname: "/furniture/[slug]", params: { slug } }} className="block">
          <Aperture src={imageSrc} alt={alt} ratio="1/1" sizes="(min-width: 1024px) 25vw, 50vw" />
        </Link>
      ) : (
        <Aperture src={imageSrc} alt={alt} ratio="1/1" sizes="(min-width: 1024px) 25vw, 50vw" />
      )}
      <h3 className="type-display mt-4 text-h3 text-ink">{title}</h3>
      <p className="mt-1.5 text-small text-ink-soft">{materials}</p>
      <p className="mt-3">
        {priceGBP === null ? <span className="text-small text-ink-soft">{t("priceOnRequest")}</span> : <Price amount={priceGBP} from={false} size="sm" />}
      </p>
      {slug ? (
        <p className="mt-4">
          <AddToInquiry slug={slug} labels={{ add: t("inquiry"), remove: t("inquiryRemove") }} />
        </p>
      ) : null}
    </article>
  );
}
