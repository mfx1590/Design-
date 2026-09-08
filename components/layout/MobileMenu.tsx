"use client";

import { useEffect, useRef, useState } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { WhatsAppGlyph } from "@/components/ui/WhatsAppGlyph";
import type { AppPathname } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";

interface MobileMenuProps {
  items: Array<{ href: AppPathname; label: string }>;
  whatsappHref: string | null;
  labels: { menu: string; close: string; whatsapp: string };
}

/** Full-height Plaster panel below the header; the language list sits at the bottom (docs/design-plan.md §3.5). */
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

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(true)}
        className="border-[1.5px] border-frame px-3 py-1.5 text-small font-medium"
      >
        {labels.menu}
      </button>

      {open ? (
        <div id="mobile-menu" role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex flex-col bg-plaster">
          <div className="flex h-(--header-height) items-center justify-end border-b border-rule px-(--gutter)">
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpen(false)}
              className="border-[1.5px] border-frame px-3 py-1.5 text-small font-medium"
            >
              {labels.close}
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-(--gutter) py-8">
            <ul className="divide-y divide-rule">
              {items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} onClick={() => setOpen(false)} className="type-display block py-4 text-h2">
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
                className="mt-8 inline-flex items-center gap-3 border-[1.5px] border-frame bg-frame px-5 py-3 font-medium text-plaster"
              >
                <WhatsAppGlyph className="size-5 text-whatsapp" />
                {labels.whatsapp}
              </a>
            ) : null}
          </nav>
          <div className="border-t border-rule px-(--gutter) py-6">
            <LanguageSwitcher variant="list" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
