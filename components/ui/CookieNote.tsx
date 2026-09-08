"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Link } from "@/i18n/navigation";

const KEY = "dp-cookie-note";
const EVENT = "dp-cookie-note-change";
/** Shown once the visitor has scrolled past the hero, or after this delay, so it never covers the first call to action. */
const SHOW_AFTER_MS = 6000;
const SHOW_AFTER_SCROLL = 240;

let visible = false;

function readState() {
  try {
    return window.localStorage.getItem(KEY) === "1" ? "dismissed" : visible ? "visible" : "waiting";
  } catch {
    return visible ? "visible" : "waiting";
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

function reveal() {
  if (visible) return;
  visible = true;
  window.dispatchEvent(new Event(EVENT));
}

interface CookieNoteProps {
  text: string;
  more: string;
  dismiss: string;
}

/**
 * One-line notice (PLAN.md §11 Phase 5). The site sets a single strictly necessary cookie (the
 * language) and no trackers, so there is nothing to consent to; the note informs and goes away.
 * The server snapshot counts as dismissed, so the HTML is identical for every visitor.
 */
export function CookieNote({ text, more, dismiss }: CookieNoteProps) {
  const state = useSyncExternalStore(subscribe, readState, () => "dismissed" as const);

  useEffect(() => {
    if (state !== "waiting") return;
    const timer = window.setTimeout(reveal, SHOW_AFTER_MS);
    const onScroll = () => {
      if (window.scrollY > SHOW_AFTER_SCROLL) reveal();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [state]);

  if (state !== "visible") return null;

  const close = () => {
    try {
      window.localStorage.setItem(KEY, "1");
    } catch {
      /* storage unavailable: the note simply returns next visit */
    }
    window.dispatchEvent(new Event(EVENT));
  };

  return (
    <div
      role="status"
      className="fixed bottom-4 start-4 z-30 flex max-w-[calc(100%-6.5rem)] flex-wrap items-center gap-x-4 gap-y-2 border border-rule bg-surface-alt px-4 py-3 text-micro text-ink-soft sm:max-w-md lg:bottom-6 lg:start-6"
    >
      <p className="min-w-0 flex-1">
        {text}{" "}
        <Link href="/cookies" className="link whitespace-nowrap">
          {more}
        </Link>
      </p>
      <button type="button" onClick={close} className="border border-ink/60 px-3 py-1 font-medium tracking-[0.04em] text-ink transition-colors hover:bg-ink hover:text-surface">
        {dismiss}
      </button>
    </div>
  );
}
