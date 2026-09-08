import imageUrlBuilder from "@sanity/image-url";
import { dataset, projectId } from "@/sanity/env";
import { pick, type LocaleValue } from "./locale";

const builder = imageUrlBuilder({ projectId: projectId || "unconfigured", dataset });
type SanityImageSource = Parameters<typeof builder.image>[0];

/** A Sanity "photo" (image with localised alt) as the { src, alt } pair the components take. */
export function photoToImage(photo: (SanityImageSource & { alt?: LocaleValue }) | null | undefined, locale: string, width = 1600) {
  if (!photo) return null;
  const alt = pick(photo.alt, locale) ?? "";
  return { src: builder.image(photo).width(width).auto("format").url(), alt };
}
