# Design Package — furniture packages in Northern Cyprus

The brief is `PLAN.md`; its §16 build log records every phase. Status: **Phases 0–5 built, awaiting launch** (six locales, WhatsApp-first, SEO layer, Sanity schema).

## Stack

Next.js 16 (App Router, TypeScript) · Tailwind CSS 4 · next-intl 4 · Sanity 6 (Studio at `/studio`) · GSAP + Lenis · Vercel

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                     # http://localhost:3000 redirects to /en
```

## Deploy (owner's steps; nobody else enters credentials)

The site is hosted on **Hostinger** (Node.js web app, imported from GitHub, deploys to `design.tiktecho.com`). The steps below are the same on Vercel.

1. **Import**: framework preset Next.js, branch `main`, Node 22, root `./`, default build settings. The repository installs with **npm** (`package-lock.json`); do not add a pnpm lockfile.
2. **Environment variables**:
   - `NEXT_PUBLIC_SITE_URL` = `https://<your-domain>` (no trailing slash). Drives canonical URLs, hreflang, sitemaps and share images.
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` = `905488618449` (already the default in code).
   - `NEXT_PUBLIC_ANALYTICS` = `plausible` plus `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` for cookieless analytics (`vercel` only works on Vercel hosting). Leave empty for no analytics.
   - Sanity, once the project exists: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` = `production`, `SANITY_API_READ_TOKEN` (read-only). Without a project id the site serves the built-in content.
3. **Domain**: on Hostinger the subdomain is attached in the web-app settings and HTTPS is automatic. (On Vercel: add the domain under Settings → Domains and create the DNS records it shows.)
4. **After the first deploy**: open `https://<domain>/robots.txt`, `/sitemap/en.xml` and `/llms.txt`; submit the six sitemaps in Google Search Console; run the Rich Results Test on the home page, a package page and a furniture page.
5. **Sanity Studio**: `https://<domain>/studio`. Create the project at sanity.io/manage, add the domain to the project's CORS origins, then add content; the site reads it within a minute (ISR, 60 s).

Redeploy after each push to `main` (Hostinger: the Deploy button, or enable auto-deploy in the web-app settings).

## Conventions

- Six locales: `en` (source) `pl` `ru` `tr` `fa` `de`. Every route is prefixed; slugs are translated in `i18n/routing.ts`. Farsi is RTL.
- Logical CSS only: `ms-` `me-` `ps-` `pe-` `start-` `end-` `text-start` `text-end`. Never `ml-` `mr-` `left-` `right-` for layout.
- Navigate with `Link` / `useRouter` / `usePathname` from `@/i18n/navigation`, never `next/link` or `next/navigation` directly.
- All copy, including long-form content, lives in `messages/<locale>.json` (`content.*` for services, projects, furniture, guides). English is the source of truth. `node scripts/check-messages.mjs` verifies the other five files.
- Prices are GBP only, formatted by `lib/format/price.ts` per locale. Never convert currencies.
- Design tokens: `styles/tokens.css` (day and dusk palettes) mapped into Tailwind in `app/globals.css`.
- Motion: nothing idle except the hero scene; every scroll scene has a static, reduced-motion fallback.
- No contact form: every call to action opens WhatsApp with a prefilled message (`lib/site.ts`).

## Checks

```bash
npm run typecheck && npm run lint
node scripts/check-messages.mjs                       # translation files vs English
node scripts/check-seo.mjs http://localhost:3000      # every sitemap URL: title, description, canonical, hreflang, og:image, h1, JSON-LD
npm run shots -- <out-dir> http://localhost:3000 en fa      # screenshots; SCROLL=0,900  EVAL_FILE=<js>  VIEWPORTS=360x780,1920x1080
```

## Accounts the owner creates

Sanity project (CMS), Vercel (hosting), the domain's DNS at Hostinger, optionally Plausible. Claude Code never enters credentials.
