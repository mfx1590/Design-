export interface FaqItem {
  q: string;
  a: string;
}

/** Native details/summary accordion, no JS. Cormorant questions, brass plus that turns into a cross. */
export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-rule border-y border-rule">
      {items.map((item) => (
        <details key={item.q} className="group py-6">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 [&::-webkit-details-marker]:hidden">
            <span className="type-display text-h3 text-ink">{item.q}</span>
            <span
              aria-hidden="true"
              className="mt-1 grid size-7 shrink-0 place-items-center border border-rule text-brass transition-transform duration-(--dur-ui) ease-soft group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-4 max-w-(--measure) text-ink-soft">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
