import type { AppPathname } from "@/i18n/routing";

export type NavKey = "packages" | "portfolio" | "services" | "about" | "contact";

/** Main navigation, in order. Labels come from messages under nav.* */
export const navItems: Array<{ href: AppPathname; key: NavKey }> = [
  { href: "/packages", key: "packages" },
  { href: "/portfolio", key: "portfolio" },
  { href: "/services", key: "services" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
];

/** Digits only, international format. Empty until the owner provides it. */
export const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

/** wa.me deep link with a prefilled, localised message, or null when the number is not configured. */
export function whatsappHref(message: string): string | null {
  if (!whatsappNumber) return null;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
