import { getTranslations } from "next-intl/server";
import { WhatsAppGlyph } from "@/components/ui/WhatsAppGlyph";
import { cx } from "@/lib/cx";
import { whatsappHref } from "@/lib/site";

interface WhatsAppButtonProps {
  /** Fixed to the inline-end bottom corner (site-wide) or rendered in flow (styleguide). */
  placement?: "fixed" | "inline";
  /** Force a link for demos when the number is not configured yet. */
  demoHref?: string;
}

/**
 * The sticky WhatsApp entry point (PLAN.md §6, global). 56px square, Frame fill, the glyph in
 * WhatsApp's own green so visitors recognise it. The label appears on hover and for screen readers.
 * Renders nothing until NEXT_PUBLIC_WHATSAPP_NUMBER is set, unless a demo href is given.
 */
export async function WhatsAppButton({ placement = "fixed", demoHref }: WhatsAppButtonProps) {
  const t = await getTranslations();
  const href = whatsappHref(t("whatsapp.prefill")) ?? demoHref;
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cx(
        "group inline-flex h-14 items-center gap-0 bg-frame text-plaster transition-[padding] duration-(--dur-ui) ease-soft hover:pe-4",
        placement === "fixed" ? "fixed bottom-6 end-6 z-30" : "",
      )}
    >
      <span className="grid size-14 shrink-0 place-items-center text-whatsapp">
        <WhatsAppGlyph className="size-7" />
      </span>
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-small font-medium opacity-0 transition-[max-width,opacity] duration-(--dur-ui) ease-soft group-hover:max-w-56 group-hover:opacity-100 group-focus-visible:max-w-56 group-focus-visible:opacity-100">
        {t("cta.whatsapp")}
      </span>
      <span className="sr-only">{t("cta.whatsapp")}</span>
    </a>
  );
}
