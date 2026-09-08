"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState, useSyncExternalStore } from "react";
import { WhatsAppGlyph } from "@/components/ui/WhatsAppGlyph";
import { Link } from "@/i18n/navigation";
import { clearInquiry, readInquiry, subscribeInquiry, toggleInquiry } from "@/lib/inquiry";
import { whatsappHref } from "@/lib/site";

interface Piece {
  slug: string;
  name: string;
  materials: string;
  image: { src: string; alt: string };
}

interface InquiryListProps {
  pieces: Record<string, Piece>;
  labels: {
    empty: string;
    browse: string;
    remove: string;
    clear: string;
    send: string;
    noteLabel: string;
    notePlaceholder: string;
    stored: string;
    messageIntro: string;
    messageNote: string;
  };
}

const EMPTY: string[] = [];
let cache = EMPTY;
let cacheKey = "";
function snapshot() {
  const list = readInquiry();
  const key = list.join("|");
  if (key !== cacheKey) {
    cacheKey = key;
    cache = list;
  }
  return cache;
}

/** The saved pieces, a free note, and one WhatsApp message built from both. Nothing leaves the browser until the visitor taps send. */
export function InquiryList({ pieces, labels }: InquiryListProps) {
  const slugs = useSyncExternalStore(subscribeInquiry, snapshot, () => EMPTY);
  const tf = useTranslations("furniture");
  const [note, setNote] = useState("");
  const selected = slugs.map((s) => pieces[s]).filter((p): p is Piece => p !== undefined);

  if (!selected.length) {
    return (
      <div className="card max-w-2xl p-7">
        <p className="text-ink-soft">{labels.empty}</p>
        <Link href="/furniture" className="link mt-4 inline-block text-small">
          {labels.browse}
        </Link>
      </div>
    );
  }

  const lines = [labels.messageIntro, ...selected.map((p) => `- ${p.name} (${p.materials})`)];
  if (note.trim()) lines.push("", `${labels.messageNote} ${note.trim()}`);
  const href = whatsappHref(lines.join("\n"));

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
      <div>
        <p className="text-small text-ink-soft/70">{tf("count", { count: selected.length })}</p>
        <ul className="mt-4 divide-y divide-rule border-y border-rule">
          {selected.map((p) => (
            <li key={p.slug} className="flex items-center gap-4 py-4 sm:gap-6">
              <div className="aperture relative size-20 shrink-0 overflow-hidden bg-surface-alt sm:size-24">
                <Image src={p.image.src} alt={p.image.alt} fill sizes="96px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <Link href={{ pathname: "/furniture/[slug]", params: { slug: p.slug } }} className="type-display block text-h3 leading-tight text-ink transition-colors hover:text-brass">
                  {p.name}
                </Link>
                <p className="mt-1 text-small text-ink-soft">{p.materials}</p>
              </div>
              <button type="button" onClick={() => toggleInquiry(p.slug)} className="link shrink-0 text-small">
                {labels.remove}
              </button>
            </li>
          ))}
        </ul>
        <button type="button" onClick={clearInquiry} className="link mt-4 text-small">
          {labels.clear}
        </button>
      </div>

      <div className="card p-6 sm:p-7">
        <label htmlFor="inquiry-note" className="block text-small text-ink-soft">
          {labels.noteLabel}
        </label>
        <textarea
          id="inquiry-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={labels.notePlaceholder}
          rows={4}
          className="mt-2 w-full border border-rule bg-surface px-4 py-3 text-ink placeholder:text-ink-muted focus:border-brass focus:outline-none"
        />
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex w-full items-center justify-center gap-2 border border-brass bg-brass px-5 py-3 text-small font-medium tracking-[0.04em] text-night transition-colors duration-(--dur-ui) ease-soft hover:border-brass-deep hover:bg-brass-deep sm:px-7 sm:py-3.5 sm:text-body"
        >
          <WhatsAppGlyph className="size-5" />
          {labels.send}
        </a>
        <p className="mt-4 text-micro text-ink-soft/60">{labels.stored}</p>
      </div>
    </div>
  );
}
