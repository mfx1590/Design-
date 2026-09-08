/**
 * Localised values from Sanity are objects keyed by locale ({ en, pl, ru, tr, fa, de }).
 * pick() returns the requested locale, falling back to English, then to any filled locale.
 */
export type LocaleValue<T = string> = Partial<Record<string, T | null>> | null | undefined;

export function pick<T = string>(value: LocaleValue<T>, locale: string): T | undefined {
  if (!value || typeof value !== "object") return undefined;
  return value[locale] ?? value.en ?? Object.values(value).find((v): v is T => v !== null && v !== undefined);
}

/** Minimal Portable Text shape: enough to flatten a body into headings and paragraphs. */
export interface Block {
  _type: string;
  style?: string;
  children?: Array<{ text?: string }>;
}

/** Flattens rich text into the { heading, body[] } sections the guide and legal pages render. */
export function blocksToSections(blocks: Block[] | null | undefined): Array<{ heading: string; body: string[] }> {
  const sections: Array<{ heading: string; body: string[] }> = [];
  let current: { heading: string; body: string[] } | null = null;
  for (const block of blocks ?? []) {
    if (block._type !== "block") continue;
    const text = (block.children ?? []).map((c) => c.text ?? "").join("").trim();
    if (!text) continue;
    if (block.style === "h2") {
      current = { heading: text, body: [] };
      sections.push(current);
    } else {
      if (!current) {
        current = { heading: "", body: [] };
        sections.push(current);
      }
      current.body.push(text);
    }
  }
  return sections;
}
