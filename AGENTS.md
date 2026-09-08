<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project rules (Design Packages, Northern Cyprus)

- `PLAN.md` is the brief. Read it fully before any work. Work phase by phase and stop at every checkpoint for owner approval.
- Never invent business facts. Anything unknown stays a visible placeholder and is listed for the owner.
- Six locales, English is the source. Farsi is RTL: use logical CSS properties only, mirror scroll scenes and icons.
- Prices are GBP only, shown publicly: Studio from 10,000, 1+1 from 12,000, 2+1 from 14,000. Format via `lib/format/price.ts`.
- One signature scroll experience (the before/after scene). Everything else stays calm: no idle animation, no fade-up on every section.
- Never enter credentials, API keys or payment details. Tell the owner what to create.
