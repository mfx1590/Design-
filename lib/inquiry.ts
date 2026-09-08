"use client";

/**
 * The inquiry list (PLAN.md §6): a lightweight cart with no payment. Lives in localStorage,
 * private to the visitor, and is sent as one WhatsApp message. Components subscribe via the event.
 */
const KEY = "dp-inquiry";
const EVENT = "dp-inquiry-change";

export function readInquiry(): string[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function write(slugs: string[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(slugs));
  } catch {
    /* storage unavailable: the list just does not persist */
  }
  window.dispatchEvent(new Event(EVENT));
}

export function toggleInquiry(slug: string): string[] {
  const current = readInquiry();
  const next = current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug];
  write(next);
  return next;
}

export function clearInquiry() {
  write([]);
}

export function subscribeInquiry(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}
