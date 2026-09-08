# Website Build Plan — Design Packages & Furniture, Northern Cyprus

This document is the brief for Claude Code. Read it fully before writing any code. Everything marked `[FILL IN]` will be supplied by the owner; do not invent it — ask.

---

## 1. Project brief

**What the business does:** Interior design packages (furnishing a home or apartment end-to-end: concept → furniture → delivery → installation) plus a furniture catalogue. Based in Northern Cyprus.

**Who visits the site:**
1. Foreign property buyers (English-, Polish-, Russian-, German- and Farsi-speaking) who bought an apartment or villa off-plan in Kyrenia, İskele, Famagusta or Nicosia and need it furnished, often remotely.
2. Local homeowners and landlords furnishing rental units.
3. Developers and agents who want a turnkey furnishing partner for their projects.

**The primary job of the site:** turn a visitor into a consultation request (form or WhatsApp) by proving, visually, that the company transforms empty rooms into finished homes. Not e-commerce checkout in phase 1 — furniture is priced and sold by inquiry (see §11 for the optional shop phase).

**Packages (confirmed — prices are shown publicly on the site):**

| Package | Starting price |
|---|---|
| Studio | from £10,000 |
| 1+1 (one bedroom) | from £12,000 |
| 2+1 (two bedrooms) | from £14,000 |

Prices are in **GBP (£)**. Show "from" prices everywhere the package is mentioned, formatted per locale (e.g. `£10,000` in en, `10 000 £` in pl/ru, `10.000 £` in tr/de). Do not convert to other currencies automatically; GBP only. Packages are defined by apartment type, not by quality tier.

**Services (confirmed):** furnishing packages · home staging · furnishing for rental properties (see below) · custom/individual projects · before/after portfolio with real videos · client reviews · contact form.

**Rental furnishing:** for owners and investors who will rent the property out. The furnishing is chosen for the rental purpose — long-term tenants (durable, neutral, easy to maintain) or holiday / short-term lets (guest-ready, photogenic, fully equipped down to kitchenware and linen). Pricing follows the same Studio / 1+1 / 2+1 structure with rental-specific inclusions `[FILL IN: differences from standard packages, if any]`.

**Business facts** `[FILL IN]`
- Legal/brand name, logo files, tagline
- Address, phone, WhatsApp number, email, opening hours
- Cities served
- What each package includes, room by room; timeline; warranty
- Years in business, number of completed projects, warranty / delivery times
- Before/after project photos (see §7 for how they're used) — **partially received:** 9 photos of one studio project, incl. one matched before/after pair; see §15 for the inventory and what is still needed
- Social links, Google Business Profile link

---

## 2. Non-negotiables

- Distinctive design: not a template, not a generic "AI-generated" look (see §4).
- One signature scroll-driven experience (see §5), everything else quiet.
- Six languages from day one: **English (default), Polish, Russian, Turkish, Farsi, German**. Farsi is right-to-left, so every layout must work mirrored.
- Prices visible on the site, not hidden behind a form.
- Technical SEO + Generative Engine Optimization (GEO) + local SEO for Northern Cyprus (see §9).
- Fast: Lighthouse ≥ 90 on mobile for Performance, Accessibility, Best Practices, SEO.
- Owner can edit content (packages, projects, furniture, prices, FAQs) without touching code.

---

## 3. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js (App Router, TypeScript) | SSR/SSG for SEO, image optimisation, i18n routing |
| Styling | Tailwind CSS + CSS variables for design tokens | Fast to iterate, tokens keep it consistent |
| Motion | GSAP + ScrollTrigger, Lenis for smooth scroll | Best-in-class scroll scrubbing, pinning, frame sequences |
| i18n | `next-intl` | Locale routing (`/en`, `/pl`, `/ru`, `/tr`, `/fa`, `/de`), typed messages, hreflang helpers, `dir="rtl"` for Farsi |
| CMS | Sanity (hosted, free tier) | Localised documents, image pipeline, owner-friendly Studio |
| Forms | Server actions + Resend (email) + WhatsApp deep link | No third-party form widget |
| Hosting | Vercel | Edge, image CDN, preview deploys |
| Analytics | Plausible or GA4 `[FILL IN]` | |
| Visual assets | Higgsfield (image-to-video, cinematic camera moves) | See §7 |

Repo layout:
```
/app/[locale]/...          pages
/components/               ui + sections
/lib/motion/               GSAP setup, reduced-motion guard, scroll utils
/lib/seo/                  metadata builders, JSON-LD builders
/messages/{en,pl,ru,tr,fa,de}.json  UI strings
/sanity/                   schemas + Studio
/public/sequences/         scroll-scrub frame sequences (webp)
/public/video/             hero loops (mp4 + webm, poster jpgs)
```

---

## 4. Design direction

Follow a two-pass process: first write a short design plan (palette as 4–6 named hex values, two typefaces max and their roles, layout concept with ASCII wireframes, 3–4 principles). Then review it: if any part of it is what you'd produce for *any* interior/furniture site, change it and say why. Only then build.

**Grounding — take the visual language from the subject, not from web design trends.** Northern Cyprus interiors: limestone, plaster, olive and carob wood, terrazzo, linen, brass, strong Mediterranean light with hard shadows, the blue of the Kyrenia coast. Furniture photography is the content — the UI must recede behind it.

**Explicitly avoid** (these are the generic defaults):
- cream background + terracotta accent + high-contrast serif as the "premium" formula
- near-black with one neon accent
- everything in identical rounded cards with the same grey shadow
- ALL-CAPS eyebrow labels above every heading, "01 / 02 / 03" numbering where nothing is a sequence, arrows appended to every link
- fade-and-slide-up on every section

**Do instead:**
- One typeface family with real width/weight range (candidates: a humanist grotesk or a modern serif with display cut), set on a proper scale. Type is part of the design, not a container for it.
- Palette derived from the actual project photos — sample them once photos arrive and propose tokens from them.
- Spend the boldness in one place: the before/after scroll experience (§5). Product and package pages are calm, grid-based, editorial.
- Motion only where it answers a scroll or a click. No idle animation except one hero loop.
- Copy in plain, specific language. Package CTAs say what happens: "Request a quote", "See the full package", "Chat on WhatsApp".

Quality floor (build it in, don't announce it): responsive to 360px, visible keyboard focus, `prefers-reduced-motion` respected everywhere (scroll scenes degrade to static before/after pairs), WCAG AA contrast, full RTL layout for Farsi (use Tailwind logical properties `ms-`/`me-`/`start`/`end`, never `ml-`/`mr-`; scroll scenes and wipes mirror direction in RTL).

---

## 5. Signature experience: "Empty → Home" scroll scenes

This is the one memorable thing on the site. Everything else supports it.

**Concept:** as the visitor scrolls, an empty apartment turns into the finished, furnished home — the exact transformation the company sells. The scroll position drives the transformation; nothing plays on its own.

**Implementation (three tiers, use the best one the assets allow):**

1. **Frame-sequence scrub (preferred, for hero + 2–3 flagship projects).** Higgsfield generates a video from the "before" photo to the "after" photo (see §7). Extract 120–180 frames as WebP (≤ 120 KB each, 1600px wide; also a 900px mobile set). Preload into an offscreen canvas; GSAP ScrollTrigger with `scrub: true` maps scroll progress → frame index. Pin the section for ~200vh. Show a poster frame until loaded.
2. **Scrubbed video** (fallback if sequence is too heavy): `<video>` with `currentTime` driven by scroll. Works, but less smooth on iOS — use only where tier 1 isn't possible.
3. **Photo wipe** (for all other projects and reduced-motion): before and after photos stacked; scroll drives a `clip-path` wipe or crossfade. Cheap, reliable, still on-message.

**Where it appears:**
- **Homepage hero:** full-viewport scene. Headline sits on top and changes at ~60% progress from a "before" line to an "after" line (e.g. "You bought the walls." → "We bring the home."). Both strings localised.
- **Project pages:** each project opens with its own scene, then the case study.
- **Packages section:** a pinned scene with three states — Studio, 1+1, 2+1. As the user scrolls, the floor plan grows (one room → one bedroom added → second bedroom added) and the furnished photo of that apartment type wipes in beside it, with the "from" price counting up to £10,000 → £12,000 → £14,000. One pinned scene, three states, one wipe per package.
- **Real videos:** the owner has real walkthrough videos of finished projects. Use them as the "after" state on project pages (muted, play on scroll into view, pause when out of view) and on the reviews page. Higgsfield is for the transformation between before and after; real footage is the proof.

**Rules:** one scene per viewport, never two pinned sections stacked, always a static fallback, always respect `prefers-reduced-motion`, and everything must be inert on mobile until the sequence has loaded.

---

## 6. Site map & page specs

All routes exist per locale: `/en/...` (default), `/pl/...`, `/ru/...`, `/tr/...`, `/fa/...`, `/de/...`. Slugs are translated (`/en/packages`, `/pl/pakiety`, `/tr/paketler`, `/ru/pakety`, `/de/pakete`, `/fa/...`).

| Page | Purpose | Key modules |
|---|---|---|
| Home | Convert + orient | Hero scene (§5) · Packages with prices and pinned room (Studio / 1+1 / 2+1) · 3 featured before/after projects · How it works (this *is* a sequence, numbering allowed) · Services row (home staging, rental, custom projects) · Areas we serve (map of N. Cyprus) · Reviews · FAQ (schema) · Form + WhatsApp |
| Packages | Compare & pick | Comparison table Studio / 1+1 / 2+1 with prices (sticky header on mobile) · what's included, timeline · "Which package fits me?" 3-question helper · CTA |
| Package detail (×3: Studio, 1+1, 2+1) | Deep dive | Room-by-room inclusions · sample furniture · gallery · from-price · FAQs specific to the package |
| Home staging | Service | For sellers and agents: what staging is, how fast, pricing model `[FILL IN]`, before/after of staged units, CTA |
| Rental furnishing | Service | For owners renting out: choose purpose (long-term vs holiday let) → what changes in the package for each · durability and guest-ready inclusions · turnaround before the season · ROI angle (furnished units rent faster/higher) · examples · CTA |
| Custom projects | Service | Individual design projects: process, examples, how pricing works, CTA |
| Portfolio | Proof | Filterable grid (city, apartment type, package, service) · each card shows before/after on hover/tap · real video badge where footage exists |
| Project detail | Proof, deep | Scroll scene (before→after) · real video · brief · scope · timeline · furniture used (links to catalogue) · client quote · next project |
| Reviews | Trust | Written + video reviews, Google review link, aggregate rating (schema) |
| Furniture | Catalogue | Category nav (living, dining, bedroom, outdoor, lighting, decor) · filters · product cards |
| Product detail | Inquiry | Gallery · dimensions/materials · "used in" projects · request price / add to inquiry list |
| Inquiry list | Lightweight cart | Visitor collects products, sends one inquiry (no payment) |
| Process | Trust | Step-by-step: consultation → concept → selection → delivery → installation → handover; remote-buyer flow explained |
| About | Trust | Team, showroom, warranty, partners |
| Contact | Convert | Form (name, phone/WhatsApp, email, property location, apartment type, service interest, message) · WhatsApp button · map · hours |
| Blog / Guides | SEO + GEO | "Furnishing an apartment in İskele: real costs", "What's included in a turnkey furniture package", etc. |
| Legal | Privacy, cookies, terms | |

Global: language switcher (persists choice, maps to the translated slug of the same page), sticky WhatsApp button, footer with full NAP (name, address, phone) in every locale.

---

## 7. Higgsfield asset pipeline

The owner has a Higgsfield account. Use it for motion assets, not for replacing real photography. Every scene starts from a real photo of a real project.

**Assets to produce per flagship project:**
1. Before→after transformation video, 5–8 s, camera locked (no camera move — the transformation *is* the motion). Prompt pattern: start frame = empty room photo, end frame = furnished photo of the same room from the same angle; "furniture appears and settles, natural daylight, no camera movement". Export highest resolution, 16:9 and 9:16.
2. Slow cinematic push-in on the finished room, 6–10 s loop, for section backgrounds and social. One only for the homepage.
3. Product turntables for 6–10 hero furniture pieces (image-to-video, orbit 30–45°), used on product pages.

**Post-processing (Claude Code writes the script):** `ffmpeg` → extract frames at 24 fps → resize to 1600w and 900w → WebP q80 → drop into `/public/sequences/<project>/`. Also produce `mp4` (H.264) + `webm` (VP9) + poster JPG for any looping video. Add a `scripts/process-sequence.sh`.

**Photo requirement for the owner:** before and after shots should be taken from the same spot and lens if at all possible. Where they aren't, Higgsfield can still bridge them but the result is less convincing — use the photo-wipe tier (§5.3) for those.

If the Higgsfield MCP is connected in Claude Code, generation can be triggered from the terminal; otherwise the owner generates in the Higgsfield app and drops files into `/assets/raw/`.

---

## 8. Multilingual (i18n)

- Locales: `en` (default, full content, fully SEO-optimised), then `pl`, `ru`, `tr`, `fa`, `de`. English is the source language; every other locale is a translation of it.
- Locale prefix on every route; default locale redirect based on `Accept-Language`, never on IP alone; user's explicit choice is stored in a cookie and wins.
- Farsi: `<html dir="rtl" lang="fa">`, mirrored layout via logical CSS properties, a proper Persian typeface (e.g. Vazirmatn) paired with the Latin family, Persian numerals optional `[FILL IN]`. Test the scroll scenes in RTL specifically.
- Polish and German need correct diacritics in the chosen typeface; check the font covers Cyrillic, Latin Extended and Arabic script, or load a script-specific fallback per locale.
- All CMS content is localised at the field level (Sanity localized string/portable text). Missing translations fall back to English, and the page is then **excluded** from that locale's sitemap so no half-translated pages are indexed.
- UI strings in `/messages/*.json`; translations reviewed by a native speaker per language `[FILL IN: who for each]`. Copy must be written, not machine-translated word-for-word — tone matters on a premium site.
- GBP price formatting per locale for the "from" prices; no automatic conversion.
- `hreflang` for every page including `x-default`; canonical per locale.
- Language switcher swaps to the *same page* in the other language, never to the homepage.

---

## 9. SEO, local SEO and GEO

### Technical SEO
- SSG/ISR for all public pages; no client-only rendering of content.
- Metadata builder per page: localised title/description, OpenGraph and Twitter cards with a real image (generated via `next/og` from the project photo).
- `sitemap.xml` split per locale, `robots.txt`, clean URLs, 301s for slug changes handled in CMS.
- Image alt text is a required CMS field, localised.
- Core Web Vitals: LCP image preloaded, sequences lazy-loaded below the fold, fonts self-hosted with `font-display: swap`, no layout shift from pinned sections (reserve height).

### Structured data (JSON-LD, generated from CMS)
- `Organization` + `LocalBusiness` (`HomeAndConstructionBusiness` or `FurnitureStore` — pick based on the primary offer) with address, geo, hours, `areaServed` listing the cities, `sameAs` social links.
- `Service` for each package with `offers` and price range.
- `Product` for furniture items (`offers` with `priceCurrency`, availability "InStoreOnly"/"PreOrder" as appropriate).
- `FAQPage` on Home, Packages, and each Guide.
- `BreadcrumbList` everywhere.
- `ImageObject`/`VideoObject` for project galleries and hero videos.

### Local SEO — Northern Cyprus
- Location pages per city: Kyrenia (Girne), Nicosia (Lefkoşa), Famagusta (Gazimağusa), İskele (Trikomo), Güzelyurt/Lefke as needed. Each has real local content (typical property types, delivery times, projects done there), not swapped city names.
- Use both naming conventions in copy and metadata where natural: "Kyrenia / Girne". Russian pages use the Russian transliterations buyers actually search (`[FILL IN]` confirm with a Russian speaker).
- Identical NAP on site, Google Business Profile, Facebook, Instagram, and local directories.
- Target queries (per language): "furniture packages North Cyprus", "furnish apartment İskele", "home staging Kyrenia", "furnish rental apartment North Cyprus", "pakiety meblowe Cypr Północny", "мебельный пакет Северный Кипр", "Kuzey Kıbrıs mobilya paketi", "Möbelpaket Nordzypern", Farsi equivalents `[FILL IN: from a native speaker]`, plus developer-name + "furniture" long-tails `[FILL IN: main developments buyers come from]`.
- Service pages (home staging, rental, custom projects) each target their own query cluster and get their own `Service` schema.

### GEO — Generative Engine Optimization (being cited by ChatGPT, Perplexity, Google AI Overviews)
- Every key page opens with a 2–3 sentence plain-language answer to the question the page exists for ("A turnkey furniture package in Northern Cyprus includes… and starts from …").
- Facts stated as citable, specific sentences with numbers, dates, and places; not marketing adjectives.
- Guides written as question-led sections with direct answers, then detail.
- `/llms.txt` at the root summarising the business, services, areas, prices, and linking to the canonical pages.
- Consistent entity description (same 1-sentence "who we are") across site, schema, social bios, and Google Business Profile.
- Keep an "Updated on" date on guides and price pages and actually update them.

---

## 10. CMS schema (Sanity)

`siteSettings` (localised NAP, socials, default OG image, currencies)
`package` (title, slug, apartmentType: studio/1+1/2+1, summary, price from, timeline, inclusions by room, gallery, FAQs, order)
`service` (home staging, rental, custom projects: title, slug, intro, how it works, pricing model, gallery, FAQs)
`project` (title, slug, city, apartmentType, package or service, before/after photo pairs, real video file/URL, sequence folder name, scene tier, body, furniture refs, review, SEO fields)
`review` (client name, city, rating, text, video, project ref, date)
`furnitureItem` (title, slug, category, images, dimensions, materials, price/price-on-request, availability, used-in projects)
`category`, `city` (localised names, both naming conventions, geo coords, intro copy), `guide`, `faq`, `page` (about, process, legal)

All text fields localised (en/pl/ru/tr/fa/de). Studio deployed at `/studio`, owner-only.

---

## 11. Phased build

Work phase by phase. Stop at each checkpoint, show screenshots (desktop + mobile), and wait for approval before continuing.

**Phase 0 — Foundations (½ day)**
Scaffold Next.js + Tailwind + next-intl + Sanity. Design tokens file. Font setup including Cyrillic and Persian coverage. Locale routing with a dummy page in all six locales, RTL wired for `fa`. Deploy preview to Vercel.
Checkpoint: `/en`, `/pl`, `/ru`, `/tr`, `/fa`, `/de` render with the switcher working and `/fa` correctly mirrored.

**Phase 1 — Design plan + system (1 day)**
Write the design plan (§4), review it against the brief, revise. Build the component library from the plan: type scale, buttons, nav, footer, grid, product card, project card, comparison table, form fields, WhatsApp button.
Checkpoint: a styleguide page at `/dev/styleguide` and owner sign-off on palette/type.

**Phase 2 — Signature scroll scenes (1–2 days)**
Build the frame-sequence engine, the video-scrub fallback, and the photo-wipe fallback with a single `<TransformationScene>` component that picks a tier from props. Reduced-motion path. Write `scripts/process-sequence.sh`. Test on real iOS Safari.
Checkpoint: homepage hero runs on the first Higgsfield sequence, 60 fps on desktop, no jank on a mid-range phone.

**Phase 3 — Pages (2–3 days)**
Home, Packages (+Studio, 1+1, 2+1 details), Home staging, Rental, Custom projects, Portfolio (+detail with real video), Reviews, Furniture (+product), Inquiry list, Process, About, Contact, Guides, Legal, City pages. All wired to Sanity with real content where available, clearly marked placeholders elsewhere. Build in English first; other locales follow once English is approved.
Checkpoint: full click-through in English, then in all six languages.

**Phase 4 — SEO/GEO layer (1 day)**
Metadata builders, JSON-LD builders, sitemaps, robots, hreflang, OG image generation, `llms.txt`, redirects. Validate with Rich Results Test and Schema validator.
Checkpoint: zero errors in validators; Lighthouse ≥ 90 on mobile for every page type.

**Phase 5 — Content, forms, launch (1 day)**
Contact + inquiry forms with server-side validation, spam protection (honeypot + rate limit, no CAPTCHA that blocks Russian/Turkish users), email via Resend, WhatsApp handoff with prefilled message. Analytics. Cookie banner (privacy-preserving default). Final QA checklist below.
Checkpoint: launch.

**Phase 6 (optional, later) — Shop**
Turn inquiry list into checkout (Stripe or local PSP `[FILL IN]`), stock, shipping zones. Only after the inquiry flow has proven demand.

---

## 12. QA checklist before launch

- [ ] Every page in every locale: title, description, hreflang, canonical, OG image
- [ ] No untranslated strings visible; fallback pages excluded from sitemaps
- [ ] Farsi pages fully mirrored: nav, forms, tables, scroll scenes, icons with direction
- [ ] All scenes have posters and reduced-motion fallbacks; nothing autoplays with sound
- [ ] Keyboard-only navigation works; focus visible; skip link present
- [ ] Forms: validation messages localised, success state, email actually arrives, WhatsApp link opens with prefilled text on iOS and Android
- [ ] 360px, 768px, 1280px, 1920px layouts checked
- [ ] Lighthouse mobile ≥ 90 ×4 on Home, a Project, a Product, a Guide
- [ ] Schema validates; Google Business Profile NAP matches site exactly
- [ ] 404 page localised and useful
- [ ] Owner can add a project and a product in Studio and see it live within a minute

---

## 13. What the owner provides (in order of urgency)

1. Business facts from §1 `[FILL IN]`
2. What each package includes, and how rental-furnishing inclusions differ from standard
3. Photos: for each project, before + after from the same angle, highest resolution; real walkthrough videos of finished projects; 6–10 hero furniture items on a clean background
4. Client reviews (text, and video where available) with permission to publish
5. Higgsfield outputs (or access for Claude Code to trigger them)
6. Native-speaker review contacts for PL, RU, TR, FA and DE copy
7. Domain, Vercel and Sanity accounts (owner creates them; Claude Code never enters credentials)

---

## 14. First prompt to give Claude Code

> Read PLAN.md completely. Confirm the stack and list every `[FILL IN]` item you need before Phase 1. Then start Phase 0. At every checkpoint, stop, take desktop and mobile screenshots, and wait for my approval. Follow §4 strictly: before building the UI, write the design plan, critique it for genericness, and show me the revised version.

---

## 15. Asset inventory (added 2026-09-07 by Claude Code)

Found in `./assest/` (folder is spelled `assest`; §7 expects raw files in `/assets/raw/`). Contents: **9 JPEG photos**, all WhatsApp-compressed, all of **one studio apartment** in a pool-side complex (white render, dark stone-clad piers, glass balustrades). No videos, no logo, no pricing document, no business details were in the folder.

| # | File | What it shows | Pixels | Planned use |
|---|---|---|---|---|
| 1 | `…20.27.37.jpeg` | **BEFORE** — empty studio, landscape, camera facing the sliding door to the pool | 1448×1086 | "Before" frame of the hero scene (matched pair with #2) |
| 2 | `…20.27.50.jpeg` | **AFTER** — same studio furnished, same camera position | 1448×1086 | "After" frame of the hero scene |
| 3 | `…20.24.08.jpeg` | AFTER — same studio, camera closer to the breakfast bar | 1446×1087 | Project gallery, OG image |
| 4 | `…20.11.22.jpeg` | BEFORE — empty studio, portrait phone shot | 1200×1600 | Portrait (9:16) "before" for the mobile scene |
| 5 | `…20.11.22 (1).jpeg` | AFTER — from the breakfast bar toward the bed | 1200×1600 | Portrait "after", gallery |
| 6 | `…20.11.22 (2).jpeg` | AFTER — wide, dining → bed, sofa, dressing mirror, fridge | 1200×1600 | Gallery |
| 7 | `…20.11.23 (1).jpeg` | AFTER — kitchen (white/anthracite units, quartz bar, track lights) | 1200×1600 | Gallery, package inclusions |
| 8 | `…20.11.23.jpeg` | AFTER — bathroom (beige marble tile, glass shower, fluted vanity) | 1200×1600 | Gallery |
| 9 | `…20.11.24.jpeg` | AFTER — terrace with black rattan dining set, pool view | 1200×1600 | Gallery, outdoor category |

Observations:
- #1 → #2 is a true same-spot pair and qualifies for the §5 tier-1 frame sequence (Higgsfield). #4 (portrait before) has no same-angle "after"; #5/#6 are close but not identical → tier-3 photo wipe.
- #2 and #3 are visibly more polished than the phone shots (warm cove lighting, potted olive trees that do not appear in #5/#6). Owner to confirm whether these are real photos, retouched photos, or renders — renders must be labelled honestly on the site. `[FILL IN]`
- WhatsApp compression caps the files at ~1200–1450 px. The scroll sequence needs 1600 px frames; please send the **original camera-roll files** (or a cloud link) for at least #1, #2, #3. `[FILL IN]`
- Project facts unknown: development/complex name, city, apartment type confirmed as Studio?, completion date, package delivered, timeline, client quote. `[FILL IN]`

Dominant colours (median-cut sample, for §4 palette work in Phase 1; precise material sampling follows):
- Furnished rooms: warm greige floor and walls `#c7b5a6`–`#dcd8d4`, walnut slats and curtains `#775c48`–`#442215`, rust/terracotta upholstery and placemats, black metal chair legs and light fittings.
- Empty rooms: cool neutral greys `#a7a2a0`–`#dcd8d4` (glossy marble-effect porcelain, white plaster).
- Outside: pool blue `#83a5c3`, black rattan `#040813`, white render, dark stone piers.

### Status of every `[FILL IN]` in this document

| § | Item | Status |
|---|---|---|
| 1 | Rental package inclusions vs standard | **open** |
| 1 | Legal/brand name, logo files, tagline | **open** |
| 1 | Address, phone, WhatsApp number, email, opening hours | **partial** — WhatsApp +90 548 861 84 49 received 2026-09-08 (owner wants WhatsApp instead of a contact form); address, email, hours still open |
| 1 | Cities served | **open** |
| 1 | What each package includes room by room; timeline; warranty | **open** |
| 1 | Years in business, completed projects, warranty / delivery times | **open** |
| 1 | Before/after project photos | **partial** — 1 studio project, see above |
| 1 | Social links, Google Business Profile link | **open** |
| 3 | Analytics: Plausible or GA4 | **open** (recommendation: Plausible — no cookie banner needed for it, privacy-preserving by default) |
| 6 | Home staging pricing model | **open** |
| 8 | Persian numerals on/off | **open** (recommendation: Western digits for prices, Persian digits allowed in body copy) |
| 8 | Native-speaker reviewers for pl/ru/tr/fa/de | **open** |
| 9 | Russian transliterations of city names | **open** |
| 9 | Farsi target queries | **open** |
| 9 | Main developments buyers come from | **open** |
| 11 | Payment provider for the optional shop | **open** (Phase 6, not needed now) |
| 13 | Real walkthrough videos | **open** — none received |
| 13 | 6–10 hero furniture items on clean background | **open** — none received |
| 13 | Client reviews with permission | **open** — none received |
| 13 | Higgsfield outputs | **open** — none received |
| 13 | Domain, Vercel, Sanity, Resend accounts | **open** — owner creates; Claude Code never enters credentials |

## 16. Build log (kept by Claude Code)

**2026-09-07 — Phase 0 done, Phase 1 and Phase 2 built, awaiting owner approval at the end-of-Phase-2 checkpoint.**

- Stack as §3 (Next.js 16.3.4, Tailwind 4.3, next-intl 4.14, Sanity 6.12 stub, GSAP 3.15, Lenis 1.3). Production build green, six locales prerendered, `/fa` mirrored.
- Design plan: `docs/design-plan.md` (first pass, critique, binding revision). Palette Plaster / Porcelain / Frame / Walnut / Kyrenia, sampled from the project photos; Commissioner in a text cut and a flared display cut plus Vazirmatn for Farsi; square black "apertures" instead of cards; no shadows, no radius; colour only inside photographs.
- Component library and styleguide at `/en/dev/styleguide` (noindex): buttons, price, apertures, project card with before/after wipe, product card, comparison table with sticky header, form fields, step list, header with mobile menu, footer, language switcher, WhatsApp button.
- Signature scene: `components/scene/TransformationScene.tsx` with three tiers (frame sequence on canvas, scrubbed video, photo wipe), CSS-sticky pin under the header, GSAP ScrollTrigger scrub, bisection preloading, inert until frames are in, headline switch at 60 percent, progress rail, reduced-motion static pair, RTL mirroring. `scripts/process-sequence.sh` builds the frame sets (1600w and 900w WebP, poster, mp4 and webm fallbacks, manifest).
- Higgsfield via MCP: three models compared on the matched studio pair; MiniMax H3 (2K) chosen for end-frame fidelity. Credits used: 99 of the 300 allowed.
- Not done: real iOS Safari test (no device available), Vercel deploy (needs the owner account), git repository (owner has not asked for commits).
- Still `[FILL IN]`: everything in the §15 status table except the photos; the working wordmark "Design Package" is a placeholder.

**2026-09-08 — Phase 2 approved; UI rejected and redesigned (v3); homepage built as the mockup.**

- Owner approved Phase 0–2 functionally but disliked the v2 look. Git initialised on `main`; first commit covers Phase 0–2, second commit the v3 redesign. GitHub push deferred until the owner asks.
- New direction "warm luxury, dark" in `docs/design-plan-v3.md`: Night / Espresso / Umber / Ivory / Sand / Brass / Terracotta, Cormorant Garamond headlines with lining numerals, Jost body, Vazirmatn for Farsi, 1 px frames that warm to brass, gradient scrims instead of boxes.
- Homepage built in full (English; other locales fall back to English until English is approved): hero scene, trust strip, pinned floor-plan packages scene with price count-up, featured project, how it works, service tiles, areas, FAQ, contact form UI. Reviews omitted until real ones arrive. No facts invented; placeholders say so.
- Awaiting owner approval of the look before the remaining Phase 3 pages and Sanity schemas.

**2026-09-08 (later) — v3 rejected as "usual"; v4 built: the apartment furnishes itself.**

- Concept: the site loads as the empty apartment in daylight (plaster). As the hero fills the room with furniture, one token (`--dusk`) blends the whole interface to dusk. Below, a floor plan is pinned beside the rooms; the visitor picks Studio / 1+1 / 2+1 and walks living → kitchen → bedroom → bathroom → terrace while furniture is drawn into the plan. Room lists are indicative and say so.
- Files: `styles/tokens.css` (day and dusk palettes, blended semantics), `components/scene/TransformationScene.tsx` (`duskSync`), `components/home/ApartmentWalk.tsx` + `ApartmentSection.tsx`, `ServicesRows.tsx`. Homepage: hero, walk, front door, three more doors, questions, handover.
- Commit "Redesign v4". Awaiting owner reaction before the remaining Phase 3 pages.

**2026-09-08 (evening) — v4 approved; Phase 3 pages built, mobile first, WhatsApp first; Sanity schema and content layer in place.**

- Owner approved v4 and gave two rules: most clients use phones, so every page is checked at 390 px first; no contact form, the WhatsApp number +90 548 861 84 49 is the route everywhere (sticky button, header link, hero CTA, page-end handover, prefilled messages per package, service, project, piece and city).
- Pages (English): packages + Studio / 1+1 / 2+1 details with room lists, comparison table and a three-question package finder; services + three details; portfolio + project page with its own scroll scene, gallery and the furniture used; furniture catalogue with category filter + piece pages; inquiry list (saved in the browser, sent as one WhatsApp message); process; about; contact; reviews (honest empty state); guides + two grounded guides; city pages for Kyrenia, Iskele, Famagusta, Nicosia; privacy, cookies and terms as bracketed templates for the owner's lawyer. Furniture added to the main nav; footer links services, areas, guides, legal.
- Routing table with translated slugs for every page in `i18n/routing.ts`; other locales fall back to English until English is approved.
- Sanity: schema per §10 in `sanity/schemaTypes/` (localised string / text / rich-text objects, photo with required alt, package, service, project, review with permission flag, furnitureItem, category, city, guide, faq, page, siteSettings). Content layer `lib/cms/loaders.ts` reads Sanity when `NEXT_PUBLIC_SANITY_PROJECT_ID` is set and falls back to the static modules in `lib/content/` otherwise; portfolio, furniture, inquiry, guides and reviews already go through it. Owner still has to create the Sanity project.
- Verified: typecheck, lint, production build, zero horizontal overflow on every page at 390 px and 1440 px (en and fa), inquiry flow tested in the browser.
- Not done: translations of the new copy (after English approval), Phase 4 SEO layer, real iOS test, Vercel deploy, GitHub push (owner will ask).

**2026-09-08 (night) — Translations in all six locales; Phase 4 SEO/GEO layer built.**

- Owner said "go ahead" after the Phase 3 report. Long-form copy (services, project, furniture, guides) moved out of the code into `messages/en.json` under `content.*`, so every locale is translated in one file; `lib/content` modules keep only slugs, photos and prices.
- Polish, Russian, Turkish, Persian and German message files are complete (550 strings each) and validated by `scripts/check-messages.mjs` (same keys, same ICU placeholders and tags). Conventions: prices follow `formatGBP` per locale (10 000 £ / 10.000 £ / £10,000), Persian uses bidi isolates around Latin fragments, polite register throughout, city names in both conventions. Legal pages stay English templates until the owner's lawyer reviews them.
- SEO (§9): `lib/seo/metadata.ts` gives every page canonical, hreflang for six locales plus x-default, OpenGraph and Twitter cards; `/api/og?locale=xx` renders the share image from the studio photo; per-locale sitemaps at `/sitemap/<locale>.xml` with alternates; `robots.txt`; `/llms.txt`; JSON-LD builders (Organization + FurnitureStore with areaServed, Service with GBP offers, Product, FAQPage, BreadcrumbList, ImageGallery, Article) wired into the pages. NAP, geo and social links are omitted from the schema until the owner confirms them.
- Still open: owner review of the translations by native speakers (Russian city transliterations flagged in §9), Vercel deploy and the production `NEXT_PUBLIC_SITE_URL`, Rich Results validation on the live domain, Lighthouse on the deployed site, real iOS test, GitHub push when asked.
