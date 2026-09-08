"use client";

import { useSyncExternalStore } from "react";
import { Link } from "@/i18n/navigation";

const KEY = "dp-cookie-note";
const EVENT = "dp-cookie-note-change";

function readDismissed() {
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

interface CookieNoteProps {
  text: string;
  more: string;
  dismiss: string;
}

/**
 * One-line notice (PLAN.md §11 Phase 5). The site sets a single strictly necessary cookie (the
 * language) and no trackers, so there is nothing to consent to; the note informs and goes away.
 * The server snapshot counts as dismissed, so the HTML is identical for every visitor and the
 * note appears only after hydration for visitors who have not closed it.
 */
export function CookieNote({ text, more, dismiss }: CookieNoteProps) {
  const dismissed = useSyncExternalStore(subscribe, readDismissed, () => true);
  if (dismissed) return null;

  const close = () => {
    try {
      window.localStorage.setItem(KEY, "1");
    } catch {
      /* storage unavailable: the note simply returns next visit */
    }
    window.dispatchEvent(new Event(EVENT));
  };

  return (
    <aside
      role="status"
      className="fixed bottom-4 start-4 z-30 max-w-[calc(100%-6.5rem)] border border-rule bg-surface-alt p-4 text-small text-ink-soft sm:max-w-sm lg:bottom-6 lg:start-6"
    >
      <p>
        {text}{" "}
        <Link href="/cookies" className="link">
          {more}
        </Link>
      </p>
      <button type="button" onClick={close} className="mt-3 border border-ink/60 px-3 py-1.5 text-micro font-medium tracking-[0.04em] text-ink transition-colors hover:bg-ink hover:text-surface">
        {dismiss}
      </button>
    </aside>
  );
}
