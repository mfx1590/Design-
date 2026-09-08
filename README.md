# Design Packages & Furniture, Northern Cyprus — website

The brief is `PLAN.md`. Read it before touching anything. Current status: **Phase 0 (foundations)**.

## Stack

Next.js 16 (App Router, TypeScript) · Tailwind CSS 4 · next-intl 4 · Sanity 6 (Studio at `/studio`) · GSAP + Lenis · Resend · Vercel

## Run locally

```bash
pnpm install
cp .env.example .env.local   # then fill in the values
pnpm dev                     # http://localhost:3000 redirects to /en
```

## Conventions

- Six locales: `en` (source) `pl` `ru` `tr` `fa` `de`. Every route is prefixed. Farsi is RTL.
- Logical CSS only: `ms-` `me-` `ps-` `pe-` `start-` `end-` `text-start` `text-end`. Never `ml-` `mr-` `left-` `right-` for layout.
- Navigate with `Link` / `useRouter` / `usePathname` from `@/i18n/navigation`, never `next/link` or `next/navigation` directly.
- UI strings live in `messages/<locale>.json`; English is the source of truth. All six files must have identical keys.
- Prices are GBP only, formatted by `lib/format/price.ts` per locale. Never convert currencies.
- Design tokens: `styles/tokens.css` (CSS variables) mapped into Tailwind in `app/globals.css`.
- Motion: nothing idle except one hero loop; every scroll scene has a static, reduced-motion fallback.

## Accounts the owner creates

Claude Code never enters credentials. Needed, in order: Sanity project (CMS), Vercel (hosting, previews), Resend (email, Phase 5), domain.

## Checkpoint screenshots

```bash
pnpm shots <out-dir> http://localhost:3000 en pl ru tr fa de   # FULL=1 for full-page; paths may omit the leading slash
```
