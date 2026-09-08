"use client";

import { useEffect, useRef, useState } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { WhatsAppGlyph } from "@/components/ui/WhatsAppGlyph";
import type { StaticPathname } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";

interface MobileMenuProps {
  items: Array<{ href: StaticPathname; label: string }>;
  whatsappHref: string | null;
  labels: { menu: string; close: string; whatsapp: string };
}

/** Full-height Night panel; Cormorant links, brass WhatsApp, language list at the bottom. */
export function MobileMenu({ items, whatsappHref, labels }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const buttonClass = "border border-ink/60 px-3.5 py-1.5 text-small font-medium tracking-[0.04em] text-ink";

  return (
    <div className="lg:hidden">
      <button type="button" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(true)} className={buttonClass}>
        {labels.menu}
      </button>

      {open ? (
        <div id="mobile-menu" role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex flex-col bg-surface">
          <div className="flex h-(--header-height) items-center justify-end border-b border-rule-soft px-(--gutter)">
            <button ref={closeRef} type="button" onClick={() => setOpen(false)} className={buttonClass}>
              {labels.close}
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-(--gutter) py-8">
            <ul className="divide-y divide-rule-soft">
              {items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} onClick={() => setOpen(false)} className="type-display block py-5 text-h2 text-ink">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            {whatsappHref ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 inline-flex items-center gap-3 border border-brass bg-brass px-6 py-3.5 font-medium tracking-[0.04em] text-night"
              >
                <WhatsAppGlyph className="size-5" />
                {labels.whatsapp}
              </a>
            ) : null}
          </nav>
          <div className="border-t border-rule-soft px-(--gutter) py-6">
            <LanguageSwitcher variant="list" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
