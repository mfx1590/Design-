import { getTranslations } from "next-intl/server";
import { FloatingLink } from "@/components/ui/FloatingLink";
import { WhatsAppGlyph } from "@/components/ui/WhatsAppGlyph";
import { cx } from "@/lib/cx";
import { whatsappHref } from "@/lib/site";

interface WhatsAppButtonProps {
  /** Fixed to the inline-end bottom corner (site-wide) or rendered in flow (styleguide). */
  placement?: "fixed" | "inline";
}

const look =
  "group inline-flex h-12 items-center border border-rule bg-surface-alt text-ink transition-[padding,border-color] duration-(--dur-ui) ease-soft hover:border-brass hover:pe-5 lg:h-14";

/**
 * The WhatsApp entry point (PLAN.md §6, global). A square with the glyph in WhatsApp's own green so
 * visitors recognise it; the label slides out on hover. Steps aside while the contact section is on screen.
 */
export async function WhatsAppButton({ placement = "fixed" }: WhatsAppButtonProps) {
  const t = await getTranslations();
  const href = whatsappHref(t("whatsapp.prefill"));
  const inner = (
    <>
      <span className="grid size-12 shrink-0 place-items-center text-whatsapp lg:size-14">
        <WhatsAppGlyph className="size-6 lg:size-7" />
      </span>
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-small font-medium tracking-[0.04em] opacity-0 transition-[max-width,opacity] duration-(--dur-ui) ease-soft group-hover:max-w-56 group-hover:opacity-100 group-focus-visible:max-w-56 group-focus-visible:opacity-100">
        {t("cta.whatsapp")}
      </span>
      <span className="sr-only">{t("cta.whatsapp")}</span>
    </>
  );

  if (placement === "inline") {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={look}>
        {inner}
      </a>
    );
  }
  return (
    <FloatingLink href={href} hideNear="contact" ariaLabel={t("cta.whatsapp")} className={cx(look, "fixed bottom-4 end-4 z-30 lg:bottom-6 lg:end-6")}>
      {inner}
    </FloatingLink>
  );
}
