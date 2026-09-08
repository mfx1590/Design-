import type { Locale } from "@/i18n/locales";
import { whatsappNumber } from "@/lib/site";
import { absoluteUrl } from "./site-url";

/**
 * JSON-LD builders (PLAN.md §9). Only facts the site already states: no address, hours or
 * social profiles until the owner confirms them (those fields are simply omitted).
 */
const ORG_ID = () => `${absoluteUrl("/")}#organization`;

export function organization(opts: { name: string; description: string; areaServed: string[]; locale: Locale; image?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "FurnitureStore"],
    "@id": ORG_ID(),
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(`/${opts.locale}`),
    telephone: `+${whatsappNumber}`,
    contactPoint: [{ "@type": "ContactPoint", contactType: "sales", telephone: `+${whatsappNumber}`, availableLanguage: ["en", "pl", "ru", "tr", "fa", "de"] }],
    areaServed: opts.areaServed.map((name) => ({ "@type": "City", name })),
    currenciesAccepted: "GBP",
    ...(opts.image ? { image: absoluteUrl(opts.image), logo: absoluteUrl(opts.image) } : {}),
  };
}

export function breadcrumbs(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: absoluteUrl(item.url) })),
  };
}

export function faqPage(items: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })),
  };
}

/** A package or a service as a Service with an offer (price from, GBP) when a price is public. */
export function service(opts: { name: string; description: string; url: string; priceFromGBP?: number; areaServed: string[]; image?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.url),
    provider: { "@id": ORG_ID() },
    areaServed: opts.areaServed.map((name) => ({ "@type": "City", name })),
    ...(opts.image ? { image: absoluteUrl(opts.image) } : {}),
    ...(opts.priceFromGBP !== undefined
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "GBP",
            price: opts.priceFromGBP,
            priceSpecification: { "@type": "PriceSpecification", priceCurrency: "GBP", minPrice: opts.priceFromGBP },
            availability: "https://schema.org/PreOrder",
            url: absoluteUrl(opts.url),
          },
        }
      : {}),
  };
}

export function product(opts: { name: string; description: string; url: string; image: string; material?: string; priceGBP: number | null; category?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.url),
    image: absoluteUrl(opts.image),
    ...(opts.material ? { material: opts.material } : {}),
    ...(opts.category ? { category: opts.category } : {}),
    brand: { "@id": ORG_ID() },
    ...(opts.priceGBP !== null
      ? { offers: { "@type": "Offer", priceCurrency: "GBP", price: opts.priceGBP, availability: "https://schema.org/PreOrder", url: absoluteUrl(opts.url) } }
      : {}),
  };
}

export function imageGallery(opts: { name: string; url: string; images: Array<{ src: string; alt: string }> }) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: opts.name,
    url: absoluteUrl(opts.url),
    image: opts.images.map((img) => ({ "@type": "ImageObject", contentUrl: absoluteUrl(img.src), name: img.alt })),
  };
}

export function article(opts: { headline: string; description: string; url: string; image: string; datePublished: string; dateModified: string; inLanguage: Locale }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.headline,
    description: opts.description,
    url: absoluteUrl(opts.url),
    image: absoluteUrl(opts.image),
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    inLanguage: opts.inLanguage,
    author: { "@id": ORG_ID() },
    publisher: { "@id": ORG_ID() },
  };
}
