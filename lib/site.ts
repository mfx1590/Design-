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

/** Business WhatsApp number, digits only, international format. Supplied by the owner on 2026-09-08. */
export const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "905488618449";

/** The same number formatted for display. */
export const whatsappDisplay = "+90 548 861 84 49";

/** tel: link for the same number. */
export const telHref = `tel:+${whatsappNumber}`;

/** wa.me deep link with a prefilled, localised message. */
export function whatsappHref(message: string): string {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
