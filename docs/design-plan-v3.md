# Design plan v3 — "Warm luxury, dark"

Written 2026-09-08 after the owner reviewed the Phase 2 build and rejected the v2 look ("too simple, not cool and professional"). The owner chose the dark, warm-luxury direction. This document supersedes §3 of `docs/design-plan.md` wherever they conflict. Where it departs from PLAN.md §4 (serif headlines, tracked uppercase eyebrows), that is a deliberate owner decision, recorded here.

## 1. Concept in one sentence

The evening version of the finished apartment: cove light on walnut, terracotta velvet, brass, and the pool glowing outside. The interface is that room at dusk, and the photographs are lit windows in it.

## 2. Palette — seven tokens

| Token | Hex | Sampled from | Role |
|---|---|---|---|
| **Night** | `#15110D` | black rattan `#060c18` warmed toward walnut | page background |
| **Espresso** | `#211A14` | walnut shadow `#2b1611` | cards, header, raised surfaces |
| **Umber** | `#3B2E24` | curtain brown `#66371e` darkened | rules, borders, dividers |
| **Ivory** | `#F4EBDD` | plaster in daylight | primary text, secondary buttons |
| **Sand** | `#CDBBA4` | jute rug `#b18971` lifted | secondary text, captions |
| **Brass** | `#C9A35F` | the cove light glow | primary accent: CTAs, numerals, rails, eyebrows |
| **Terracotta** | `#C4562E` | stools and bed throw | secondary accent: chips, highlights, hover states |

Derived: Brass-deep `#A88240` for hover; scrims are Night at 0 → 85 % gradients, never flat boxes. Contrast (computed): Ivory on Night 15.9:1, Sand on Night 9.5:1, Brass on Night 8.3:1, Night on Brass 8.3:1, Terracotta on Night 4.6:1 (large text and chips only; body text never in terracotta), Ivory on Terracotta 3.5:1 (large text only).

## 3. Type

- **Cormorant Garamond** for display: h1–h3, prices, pull quotes. Weight 500 for headlines, 400 italic for one accent word per section at most. Latin Extended + Cyrillic + Vietnamese; six weights with italics.
- **Jost** for body and UI: 400 body, 500 buttons and labels. Latin Extended + Cyrillic.
- **Vazirmatn** for Farsi, both roles (display at 300).
- Eyebrows: Jost 500, 0.75 rem, tracking 0.18 em, uppercase, Brass, preceded by a 32 px Brass rule. One per section, never above a card title.
- Numerals tabular everywhere prices or tables appear.

Fluid scale (rem): hero `clamp(3, 1.8 + 6vw, 7.5)`; display `clamp(2.5, 1.6 + 3.5vw, 4.75)`; h2 `clamp(2, 1.4 + 2.2vw, 3.25)`; h3 `clamp(1.5, 1.25 + 0.9vw, 1.9)`; lead `clamp(1.125, 1.05 + 0.5vw, 1.375)`; body 1.0625; small 0.9375; micro 0.8125. Display line-height 1.02, tracking -0.01 em.

## 4. Surfaces, depth, edges

- Sections alternate Night and Espresso. No hard section lines; a 1 px Umber rule only inside components.
- Photographs sit in a 1 px Umber frame that turns Brass on hover, with a soft inner vignette so the picture "glows" against the dark page. Zero radius stays: the black window frames are still the reference.
- Cards: Espresso, 1 px Umber border, 32 px padding, Brass border on hover. No drop shadows; depth comes from the vignette and the gradient scrims.
- Buttons: primary Brass fill with Night text; secondary Ivory 1 px outline that fills Ivory on hover; tertiary Sand text with a Brass underline. Jost 500, 0.04 em tracking, 14 px 28 px padding.
- Header: Night at 70 % with backdrop blur, Ivory links, Brass hover. Wordmark in Cormorant.
- Footer: Espresso, four columns, Brass wordmark, Sand text.

## 5. Homepage (the mockup the owner approves)

1. **Hero scene** — the transformation, full viewport. Bottom gradient scrim; Brass eyebrow "Furniture packages · Northern Cyprus"; Cormorant headline that switches at 60 %; lead; Brass primary + Ivory outline buttons; Brass progress rail; discreet visualisation note.
2. **Trust strip** — four facts from the brief on an Umber-ruled row: prices from £10,000; delivery and installation included; remote selection for buyers abroad; six languages.
3. **Packages** — pinned scene on desktop: a Brass line-drawn floor plan grows Studio → 1+1 → 2+1 while the price counts up £10,000 → £12,000 → £14,000 and the inclusions list changes. Cards on mobile.
4. **Featured project** — the studio, large, hover or tap wipes the empty room in. Facts marked to confirm.
5. **How it works** — six steps with Cormorant numerals in Brass.
6. **Services** — three photo tiles with gradient scrims: home staging, rental furnishing, custom projects.
7. **Where we work** — Kyrenia (Girne), İskele (Trikomo), Famagusta (Gazimağusa), Nicosia (Lefkoşa), from the brief; to confirm.
8. **FAQ** — four questions answered from the brief only.
9. **Contact** — form UI and WhatsApp, side by side. Submission is wired in Phase 5.
10. **Footer**.

Reviews are omitted until real reviews with permission arrive. Nothing on the page states a fact the owner has not confirmed; placeholders say so.

## 6. Principles (revised)

1. **Dusk, not darkness.** Every dark surface is warm; pure black and cool greys are forbidden.
2. **Brass is for actions and numbers.** Terracotta is for emphasis. Neither is used as a background for text blocks.
3. **Photographs glow.** They are the brightest thing on any screen; the UI never competes with them.
4. **Motion answers scroll or click.** The transformation and the packages scene are the two spectacles. Everything else moves only when the visitor does something.
5. **Say the number.** Unchanged from v2.
