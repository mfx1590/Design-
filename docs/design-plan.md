# Design plan — Design Package, Northern Cyprus

Written 2026-09-07 for PLAN.md §4. Two passes: a first draft, a critique of everything in it that any interior or furniture site would also do, and the revised plan that gets built. Only §3 (the revised plan) is binding.

Source material: the nine photos of the studio project (see PLAN.md §15) and the material samples taken from them:

| Sampled from | Median | Note |
|---|---|---|
| Window frame (before shot) | `#14161a` | cool blue-black aluminium |
| Wall plaster (before shot, in shadow) | `#cac0b7` | reads near-white in daylight |
| Floor porcelain (before, glossy) | `#a89e96` | cooler than the walls |
| Ceiling plaster (after) | `#bca698` | warmed by the cove light |
| Walnut slats / curtains | `#582d15` / `#66371e` | |
| Terracotta stools / bed throw | `#501708` / `#501607` | the only saturated warm colour |
| Sofa linen / jute rug | `#a27b63` / `#b18971` | |
| Pool (terrace, direct sun) | `#499dc3` | the one true blue |
| Stone-clad piers | `#5c6470` | |
| Black rattan | `#060c18` | |
| Kitchen anthracite / quartz | `#4c4642` / `#c8a98f` | |

Samples are darker than the eye sees them because the phone under-exposed the interiors. Screen tokens below are lifted to daylight values while keeping the sampled hue.

---

## 1. First pass (what I would do without thinking)

**Palette**
- Cream `#F4EFE7` (page)
- Terracotta `#A8452A` (accent, from the stools)
- Walnut `#4A2E1C` (headings)
- Charcoal `#1E1B18` (text)
- Linen `#D9CFC2` (cards, dividers)

**Type**
- Fraunces (display serif, headings and prices)
- Inter (body and UI)

**Layout**
- Full-bleed hero photo, centred headline, two centred buttons.
- Three package cards side by side, rounded corners, soft shadow, terracotta "Most popular" badge on 1+1.
- Uppercase tracked eyebrow labels above each section heading ("OUR SERVICES").
- Services as an icon row with four icons.
- Reviews as a carousel of rounded cards with quote marks.
- Every section fades and slides up on scroll.

**Principles**
- Warm, premium, Mediterranean.
- Clean and modern.
- Photography-led.

## 2. Critique

Everything above is what a template or an image model would produce for "premium interior design site". Item by item:

1. **Cream + terracotta + high-contrast serif** is the exact formula PLAN.md §4 forbids. Worse, the terracotta was sampled from the stools, so the UI accent would compete with the very upholstery the photos are selling. Colour in the interface must come from somewhere the furniture is not.
2. **Two families (serif display, grotesk body)** is the default "premium" pairing. §4 asks for one family with real range and a display cut of its own. It also has to cover Latin Extended, Cyrillic and pair with a Persian face, which Fraunces cannot.
3. **Rounded cards with grey shadows** are the default container. Nothing in the photos is rounded or soft-shadowed: the light is hard, the frames are square-edged black aluminium, the tiles are rectilinear.
4. **Uppercase eyebrows, "Most popular" badges, icon rows, quote-mark carousels** are decoration standing in for content. The content here is photographs and numbers.
5. **Centred hero with fade-up everything** wastes the one place the brief spends its boldness. The hero is a scroll-driven transformation, and the headline has to sit where it can change state without fighting the picture.
6. **"Warm, premium, clean"** are not principles, they are adjectives. A principle has to tell you what to do when two options both look nice.

## 3. Revised plan (binding)

### 3.1 Concept in one sentence

The site is the empty apartment: white plaster surfaces, square black frames, hard daylight. Every photograph is seen through a window frame, and the only colour in the interface is the blue you see through it.

### 3.2 Palette — five named tokens

| Token | Hex | Sampled from | Role |
|---|---|---|---|
| **Plaster** | `#EFE9E1` | wall plaster, lifted to daylight | page surface, primary button text |
| **Porcelain** | `#E2DCD5` | glossy floor tile | alternate section surface, table header rows, input backgrounds |
| **Frame** | `#15171B` | window-frame aluminium | text, rules, image frames, primary buttons |
| **Walnut** | `#5A4A40` | slats and curtains, desaturated | secondary text, captions, metadata |
| **Kyrenia** | `#1B5F80` | the pool in direct sun, darkened for contrast | links, focus ring, the scene's progress rail, active filter |

Derived values (never new colours): rules are Frame at 18% over the surface; disabled states are Frame at 40%; the hero headline over photography uses Plaster with a Frame text-shadow-free scrim of Frame at 35% behind the text block only.

Terracotta, jute, linen and walnut appear on the site only inside photographs. Contrast (WCAG, computed): Frame on Plaster 14.9:1, Walnut on Plaster 7.0:1, Kyrenia on Plaster 5.8:1 and on Porcelain 5.2:1, Plaster on Frame 14.9:1. Everything passes AA for normal text; Frame and Walnut pass AAA. WhatsApp's own green is used only on the WhatsApp icon, because visitors recognise it; it is not a palette colour.

### 3.3 Type — one family, two cuts, plus Persian

**Commissioner** (Google Fonts, self-hosted via next/font). Humanist grotesk, Latin Extended + Cyrillic, variable axes: weight, slant, flare, volume. Two cuts from the same file:

| Cut | Settings | Used for |
|---|---|---|
| **Text** | wght 400 / 500, VOLM 0, FLAR 0 | body, UI, tables, forms, navigation |
| **Display** | wght 420, VOLM 100, FLAR 100, tracking -0.02em, line-height 1.02 | h1, hero lines, prices at 32px and above, section headings from h2 |

At VOLM 100 the terminals flare into a semi-serif. That is the "display cut" the brief asks for, from the same family, so the Cyrillic and Polish pages get the same voice without a second font.

**Vazirmatn** for Farsi (Arabic script + Latin digits). Text 400 / 500, display 300, line-height 1.7 for running text. Latin digits and the brand name fall back to Commissioner inside Farsi pages.

Numerals: `font-variant-numeric: tabular-nums` on every price and table.

Fluid scale (rem, `clamp(min, preferred, max)`):

| Step | Size | Role |
|---|---|---|
| display-xl | clamp(2.75, 1.5 + 5vw, 6.5) | hero lines |
| display | clamp(2.125, 1.3 + 3vw, 3.75) | page h1 |
| h2 | clamp(1.5, 1.15 + 1.6vw, 2.25) | section headings |
| h3 | clamp(1.25, 1.1 + 0.7vw, 1.5) | card and row titles |
| lead | clamp(1.125, 1.05 + 0.5vw, 1.375) | intro paragraphs |
| body | 1.0625 | running text (17px) |
| small | 0.9375 | captions, table cells |
| micro | 0.8125 | metadata, legal |

### 3.4 Space, grid, edges

- Base unit 4px. Steps: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128.
- Section padding `clamp(64px, 9vw, 128px)`; page gutter `clamp(16px, 4vw, 48px)`; content max width 1360px; 12 columns, 24px gutters.
- **Border radius 0 everywhere.** Buttons, inputs, images, tables.
- **No shadows.** Depth comes from surface changes (Plaster → Porcelain) and from the frame.
- **Rules are 1px Frame at 18%**, used inside sections like a spec sheet. Sections are separated by surface change, never by a line.
- **Aperture**: every photograph sits in a 1.5px Frame border with no radius. Captions sit below in Walnut small text. On hover or tap a project aperture reveals its "before" state with a wipe from the inline-start edge.

### 3.5 Components (the library built in Phase 1)

| Component | Spec |
|---|---|
| Button, primary | Frame fill, Plaster text, 1.5px Frame border, 12px 20px padding, Text 500. Hover: Walnut fill. Focus: 2px Kyrenia ring, 3px offset. |
| Button, secondary | Transparent, Frame text and border. Hover: Porcelain fill. |
| Button, tertiary (text link) | Frame text, 2px Kyrenia underline at 4px offset. Hover: text becomes Kyrenia. No arrows. |
| Nav | Wordmark start, links centre-start, language switcher and WhatsApp end. 64px tall, Plaster, 1px rule below. Mobile: wordmark + WhatsApp + menu button; menu is a full-height Plaster panel with the switcher at the bottom. |
| Footer | Porcelain. Four columns: NAP block, pages, services, languages. Micro text for legal. |
| Aperture | Image frame described above. Variants: 4:3, 3:2, 1:1, 9:16. `object-fit: cover`. |
| Project card | Aperture (after photo) + title (h3) + one line: city · apartment type · package. Before/after wipe on hover or tap. "Real video" mark as a small Frame square with a play glyph, only where footage exists. |
| Product card | Aperture (1:1) + name + materials line + price or "Price on request". No add-to-cart; "Add to inquiry list" as tertiary link. |
| Comparison table | Porcelain header row, tabular numbers, rows separated by rules. On mobile the header row is sticky and the table scrolls horizontally inside its own container. |
| Price | Display cut, tabular, formatted by `formatGBP`. "from" in Walnut Text cut before or after per locale. |
| Form field | 1.5px Frame border, Porcelain background, 12px 14px padding, label above in Text 500, error in Walnut with the field border turning Frame 2px. No placeholder-only labels. |
| WhatsApp button | Sticky, inline-end bottom, 56px square, Frame fill with the WhatsApp glyph in its own green. Label appears on hover. |
| Step list | The one place numbering is allowed (how it works): large Display numerals in Walnut, 1px rules between steps. |

### 3.6 Layout wireframes

Home, desktop (each block is a full-width section; surfaces alternate P = Plaster, Q = Porcelain):

```
P ┌──────────────────────────────────────────────────────────────┐
  │ Design Package    Packages Portfolio Services About  EN▾  ☏ │  nav 64px
  ├──────────────────────────────────────────────────────────────┤
  │                                                              │
  │   ┌──────────────────────────────────────────────────────┐   │
  │   │            HERO SCENE  (pinned, 200vh scroll)         │   │  full-bleed aperture,
  │   │            empty room ──scroll──▶ furnished room      │   │  16:9 desktop, 9:16 mobile
  │   │                                                      │   │
  │   │  You bought the walls.      ← changes at 60% to      │   │  headline bottom-start,
  │   │  [Request a quote] [See packages]  We bring the home. │   │  Plaster on scrim
  │   │  ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂ progress rail    │   │
  │   └──────────────────────────────────────────────────────┘   │
  │                                                              │
Q ├──────────────────────────────────────────────────────────────┤
  │  Packages                                                    │
  │  ┌──────────────┐  Studio        from £10,000   one room     │  pinned scene: floor plan
  │  │  floor plan  │  ─────────────────────────────────────     │  grows Studio → 1+1 → 2+1,
  │  │  grows here  │  1+1           from £12,000   one bedroom  │  the furnished photo of that
  │  │              │  ─────────────────────────────────────     │  type wipes in beside it,
  │  └──────────────┘  2+1           from £14,000   two bedrooms │  price counts up
  │                    [See the full package]                    │
P ├──────────────────────────────────────────────────────────────┤
  │  Recent projects                                             │
  │  ┌────────┐ ┌────────┐ ┌────────┐                            │  3 apertures 3:2,
  │  │  after │ │  after │ │  after │   hover/tap: before wipes  │  title + city · type
  │  └────────┘ └────────┘ └────────┘                            │
Q ├──────────────────────────────────────────────────────────────┤
  │  How it works                                                │
  │  1 Consultation ── 2 Concept ── 3 Selection ── 4 Delivery ── │  the only numbered list
  │  5 Installation ── 6 Handover                                 │
P ├──────────────────────────────────────────────────────────────┤
  │  Home staging  ·  Rental furnishing  ·  Custom projects      │  3 columns, each: h3,
  │  (short paragraph + tertiary link each, no icons)            │  2 sentences, link
Q ├──────────────────────────────────────────────────────────────┤
  │  Where we work    [map of N. Cyprus, Frame lines on Q]       │  Kyrenia · İskele ·
  │  Kyrenia (Girne) · İskele (Trikomo) · Famagusta · Nicosia    │  Famagusta · Nicosia
P ├──────────────────────────────────────────────────────────────┤
  │  Reviews   ┌ quote ─────────┐ ┌ quote ─────────┐  ★ 4.9 Google│  two written, one video
  │  FAQ       ▸ What is included?  ▸ How long?  ▸ Remote buyer? │  accordion, rules only
Q ├──────────────────────────────────────────────────────────────┤
  │  Tell us about your apartment          Chat on WhatsApp  →   │  form 2 cols, WA beside
  │  [name] [phone/WhatsApp] [email] [location] [type▾] [message]│
  ├──────────────────────────────────────────────────────────────┤
  │  footer: NAP · pages · services · languages · legal          │  Porcelain
  └──────────────────────────────────────────────────────────────┘
```

Home, mobile (390px):

```
┌──────────────────────┐
│ Design Package  ☏  ≡ │
├──────────────────────┤
│ ┌──────────────────┐ │
│ │   HERO 9:16      │ │  pinned, scene inert until
│ │   scene          │ │  frames loaded; poster first
│ │                  │ │
│ │ You bought       │ │
│ │ the walls.       │ │
│ │ [Request a quote]│ │
│ │ ▂▂▂▂▂▂▂▂▂▂▂▂     │ │
│ └──────────────────┘ │
├──────────────────────┤
│ Packages             │
│ Studio   from £10,000│  no pinned floor plan on
│ ──────────────────── │  mobile: static plan icon
│ 1+1      from £12,000│  per row, photo below
│ ──────────────────── │
│ 2+1      from £14,000│
│ [See the full package]│
├──────────────────────┤
│ ┌──────────────────┐ │
│ │ project after    │ │  tap toggles before
│ └──────────────────┘ │
│ … stacked            │
└──────────────────────┘
```

Packages comparison (desktop; on mobile the header row is sticky and the table scrolls inside its container):

```
┌────────────────────────┬──────────────┬──────────────┬──────────────┐
│                        │ Studio       │ 1+1          │ 2+1          │  Porcelain header
│                        │ from £10,000 │ from £12,000 │ from £14,000 │  Display prices
├────────────────────────┼──────────────┼──────────────┼──────────────┤
│ Living / sleeping      │ …            │ …            │ …            │
│ Kitchen                │ …            │ …            │ …            │
│ Bedroom 1              │ —            │ …            │ …            │
│ Bedroom 2              │ —            │ —            │ …            │
│ Bathroom               │ …            │ …            │ …            │
│ Terrace                │ …            │ …            │ …            │
│ Delivery + installation│ …            │ …            │ …            │
│ Timeline               │ … weeks      │ … weeks      │ … weeks      │
├────────────────────────┼──────────────┼──────────────┼──────────────┤
│                        │[Request quote]│[Request quote]│[Request quote]│
└────────────────────────┴──────────────┴──────────────┴──────────────┘
Which package fits me?  ▸ 3 questions → recommends a column (highlights it with a Kyrenia rule)
```

Project detail:

```
┌──────────────────────────────────────────┐
│ SCENE: this project's before → after     │  pinned, 200vh
├──────────────────────────────────────────┤
│ Studio in İskele            ┌──────────┐ │  brief: city, type, package,
│ Package: Studio             │ real     │ │  timeline, scope (rules between)
│ Timeline: 3 weeks           │ video    │ │  video plays muted on scroll-in
│ Scope: living, kitchen, …   └──────────┘ │
├──────────────────────────────────────────┤
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐  gallery     │  apertures, 2 per row on mobile
│ Furniture used → product cards           │
│ "Client quote"  — name, city              │
│ Next project →                            │
└──────────────────────────────────────────┘
```

RTL (Farsi): every "start" above becomes the right edge. The hero headline sits bottom-right, the wipe reveals from the right, the progress rail fills right to left, the arrow glyph is mirrored, tables keep their column order but align text to the end.

### 3.7 Motion

- UI transitions 180ms, `cubic-bezier(0.2, 0.7, 0.2, 1)`. Headline crossfade in the scene 320ms.
- Scroll scenes are scrubbed, never timed. One pinned scene per viewport, never two stacked.
- Nothing plays idle. The single exception allowed by the brief, a hero loop, is not needed because the hero is the scrubbed scene; the slow push-in clip goes to one section background on the homepage only if it earns its place.
- `prefers-reduced-motion`: scenes render as a static before/after pair, hover wipes become a tap toggle with no transition, the headline shows its "after" line.

### 3.8 Principles

1. **The photographs are the only colour.** The interface is Plaster, Porcelain and Frame. Kyrenia appears only where the visitor can act. If a screen looks colourless without a photo, the photo is missing, not the colour.
2. **Frames, not cards.** Images sit in square black apertures. There are no rounded containers, no shadows, no tinted panels. Grouping is done with surface changes and 1px rules.
3. **Motion answers scroll or click.** The transformation scene is the one spectacle. Everything else moves only when the visitor does something, and a static version always exists.
4. **Say the number.** "from £10,000", "three weeks", "two bedrooms", "Kyrenia". No sentence gets an adjective where a fact would fit.

### 3.9 What "generic" would look like from here, so we can catch it

If a future page shows uppercase eyebrows, a "Most popular" badge, an icon row, a quote-mark carousel, a rounded card with a shadow, a centred hero with two centred buttons, or a section that fades up for no reason, it is off-plan.
