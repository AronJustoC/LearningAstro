---
name: Aron J. Choque Portfolio
description: A software shop's control panel: slate ground, hairline rows, one signal logo blue, condensed uppercase display.
colors:
  signal-blue: "#0a74b3"
  signal-blue-dark: "#0e9be6"
  logo blue-deep: "#155e75"
  ground-light: "#f8fafc"
  ground-dark: "#0b1220"
  ink-light: "#111827"
  ink-dark: "#f9fafb"
  surface-2-light: "#eef2f7"
  surface-2-dark: "#111a2e"
  terminal-ink: "#e2e8f0"
  terminal-muted: "#94a3b8"
  destructive: "#ef4444"
typography:
  display:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(2.5rem, 5.6vw, 5rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.005em"
  headline:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.5rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.005em"
  title:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "Barlow, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "JetBrains Mono Variable, ui-monospace, monospace"
    fontSize: "0.6875rem"
    fontWeight: 500
    letterSpacing: "0.12em"
rounded:
  hairline: "2px"
  focus: "0.25rem"
  dot: "9999px"
spacing:
  row: "24px"
  section: "64px"
  section-lg: "80px"
  gutter: "24px"
  gutter-lg: "32px"
components:
  button-block:
    backgroundColor: "{colors.signal-blue}"
    textColor: "#ffffff"
    typography: "{typography.title}"
    rounded: "{rounded.hairline}"
    padding: "0 20px"
    height: "44px"
  button-block-dark:
    backgroundColor: "{colors.signal-blue-dark}"
    textColor: "{colors.ground-dark}"
  button-action:
    backgroundColor: "transparent"
    textColor: "{colors.ink-light}"
    typography: "{typography.label}"
    rounded: "{rounded.hairline}"
    padding: "0 16px"
    height: "44px"
  stack-tag:
    backgroundColor: "{colors.ground-light}"
    textColor: "{colors.ink-light}"
    rounded: "{rounded.hairline}"
    padding: "0 12px"
    height: "40px"
  status-strip:
    backgroundColor: "{colors.surface-2-light}"
    textColor: "{colors.ink-light}"
    typography: "{typography.label}"
    height: "36px"
  terminal-panel:
    backgroundColor: "{colors.ground-dark}"
    textColor: "{colors.terminal-ink}"
    rounded: "{rounded.hairline}"
---

# Design System: Aron J. Choque Portfolio

## Overview

**Creative North Star: "The Control Panel"**

The site reads as the instrument panel of a working software shop: a status strip, a data panel, rows that are scanned rather than browsed, and one signal color. It is built from instrument parts (hairline rules, tabular rows, mono readouts, a terminal) and carries no decoration that is not also information. Professional here means precision in alignment, type and contrast, not effects.

Density is moderate: generous vertical sections (64 to 80px) separated by hairlines, with rows inside them. A single logo blue carries every action and every live signal; everything else is slate and ink. Display type is condensed, heavy and uppercase, with one outlined line per page headline as the sole typographic flourish.

**Key Characteristics:**
- Slate ground, cool off-white in light, with a hairline grid instead of cards and fills.
- One signal logo blue, used as solid action blocks and tiny live indicators.
- Condensed uppercase display over Barlow body over mono tracked labels.
- 2px corners everywhere; flat at rest, a small lift only on hover.
- Spanish copy, light and dark themes of equal standing.

## Colors

A cool slate pair of grounds with a single logo blue signal that shifts lightness between themes to keep contrast.

### Primary
- **Signal Blue** (#0a74b3): action in the light theme: block button fill, focus ring, current-page underline, hover color of text links, status dot. White text on it.
- **Signal Blue, Lit** (#0e9be6): the same role in the dark theme; text on it is Ground Dark. Also the active tab underline inside the terminal panel.
- **Logo blue Deep** (#155e75): defined only as the start of the brand gradient token; see the not-canonized note.

### Neutral
- **Ground Light** (#f8fafc) and **Ground Dark** (#0b1220): page backgrounds; the terminal panel always uses Ground Dark, in both themes.
- **Ink** (#111827 light, #f9fafb dark): all primary text and outline-text stroke. Secondary text is Ink at 70 to 80 percent via color-mix, never a separate gray.
- **Surface 2** (#eef2f7 light, #111a2e dark): status strip fill, row hover fill, image placeholders.
- **Hairline** (slate #0f172a at 16 percent light, #e2e8f0 at 14 percent dark): every divider and border.
- **Terminal Ink / Muted** (#e2e8f0, #94a3b8): text inside the terminal panel only.
- **Destructive** (#ef4444): shadcn error state only.

### Named Rules
**The One Signal Rule.** Logo blue is the only chromatic color on any screen. It marks actions and live state; it never fills a section, tints a card, or appears as a second accent.
**The Ink-Mix Rule.** Muted text is Ink mixed with transparency (about 75 percent), so contrast follows the theme automatically. Do not introduce separate gray text colors.

## Typography

**Display Font:** Barlow Condensed (700, 800; fallback Arial Narrow)
**Body Font:** Barlow (fallback system-ui)
**Label/Mono Font:** JetBrains Mono Variable

**Character:** A tall, tight, industrial headline voice over a neutral reading face, with mono reserved for data-like metadata. The contrast between the compressed display and the wide mono labels is the system's texture.

### Hierarchy
- **Display** (800, clamp(2.5rem, 5.6vw, 5rem), 0.92): the home H1 only, uppercase, second line outlined (2px text-stroke in Ink, transparent fill).
- **Headline** (800, clamp(2.25rem, 5vw, 3.5rem), 0.95): section H2 (Proyectos, Stack, Blog), left aligned, paired with a mono record count on the right.
- **Title** (700, 1.75rem, 1.25): row and card titles (h3), still Barlow uppercase through the base rule; buttons and nav use Barlow 600 to 700 at 1.0625rem with 0.06em tracking, uppercase.
- **Body** (400, 0.875 to 1.125rem, relaxed): Barlow; descriptions capped near max-w-xl (36rem).
- **Label** (500, 0.6875rem, 0.12em, uppercase mono): status strip, ticker, record counts, years, row action buttons, column captions, empty/error state captions.

### Named Rules
**The Three Voices Rule.** Barlow speaks in headings and commands, Barlow explains, mono reports data. A string uses exactly one voice.
**The One Outline Rule.** One outlined display line per page headline; outlined text is never used for body or small sizes.

## Layout

A single 7xl (80rem) container with 24px gutters (32px from lg). Sections are stacked bands separated by hairlines, vertical padding 64px (80px from lg), anchors offset by scroll-padding 5rem. The first viewport is a stack: 36px status strip, 64px sticky header, 44px ticker, then a 1.1fr/1fr hero grid (headline left, terminal right) with 48 to 64px gap, then a three-cell focus row divided by hairlines. Content lists are rows, not grids: project rows use a 240px thumbnail (8:5), flexible text, year, and an actions cluster, with 24px vertical padding, collapsing to a single column below md. The stack section is a captioned row per category with wrapping tags. Order on home: Hero, Projects, Stack, Blog; proof before capability.

## Elevation & Depth

Flat by default; depth comes from hairlines and the Surface 2 tone shift on hover. Two shadows exist and both respond to state or lift an overlay: a soft pair for rest and a lift with a faint logo blue (light) or logo blue-tinted (dark) glow tail for hovered blocks, cards and the terminal panel. The header is sticky with an 88 percent ground translucency and blur.

### Shadow Vocabulary
- **Soft** (`0 1px 2px rgb(15 23 42 / 0.06), 0 4px 12px -4px rgb(15 23 42 / 0.08)`; dark uses black at 0.4/0.5): defined token, ambient.
- **Lift** (`0 2px 4px rgb(15 23 42 / 0.06), 0 12px 24px -8px rgb(14 116 144 / 0.25)`; dark `rgb(34 211 238 / 0.25)` tail): hover of block buttons and entity cards, and the resting terminal panel.

### Named Rules
**The Hover-Lift Rule.** Interactive blocks rise 1px and take Lift on hover; nothing rises at rest except the terminal panel.

## Shapes

Instrument-square: 2px radius on buttons, tags, thumbnails, cards, icon buttons and the terminal; focus outlines use 0.25rem. Full circles only for the 6px status dot. Borders are always 1px Hairline; separation is a rule, not a box. Stack/ticker markers are small solid squares or dots in Signal Blue.

## Components

### Buttons
- **Shape:** 2px corners, 44px minimum height.
- **Primary (block):** solid Signal Blue, white text (dark theme: Ground Dark text on lit logo blue), Barlow 700 1.0625rem uppercase, 0.06em tracking, padding 0 20px, trailing arrow glyph from inline SVG. One per view: Contactar.
- **Hover / Focus:** rises 1px with Lift and brightens 8 percent; active returns and dims 4 percent; disabled at 50 percent opacity. Focus is a 2px Focus-color outline at 2px offset, global.
- **Secondary (row action):** transparent, 1px Hairline, mono label type, 44px height; hover swaps border to Signal Blue.
- **Text link (link-arrow):** Ink, weight 500, trailing arrow; the gap widens 0.5 to 0.75rem and color turns logo blue on hover.

### Chips (stack tags)
Hairline box, 2px corners, 40px height, ground fill, 16px icon plus name. Icons are grayscale at rest and regain color on hover.

### Cards / Containers
Cards are secondary to rows. EntityCard: 2px corners, Hairline border, ground fill, 192px image over a hairline, 20px padding; hover lifts 1px, takes Lift and a logo blue border. Image-less items show a Surface 2 block with two mono initials.

### Inputs / Fields
shadcn Input/Textarea/Label inherit the mapped tokens (border from logo blue at 20 percent mix, 0.25rem base radius); the contact submit is a full-width block button.

### Navigation
Barlow uppercase links, 40px tall, current page marked by a 2px Signal Blue bottom border; sticky blurred header with hairline underside; the "Aron J. Choque" wordmark (surname in logo blue) beside the square AJ icon; 40px square 2px-radius icon buttons for theme and menu; mobile menu is hairline-divided full-width rows with a Contactar block.

### Status Strip and Ticker (signature)
A 36px Surface 2 band with mono labels (identity, Cusco, live UTC-5 clock) and a 44px stack ticker row with a right-edge fade mask; the first item carries a logo blue square marker.

### Terminal Panel (signature)
A Ground Dark box in both themes: tab strip (mono 0.75rem, active tab logo blue underline and 6 percent logo blue wash), syntax-highlighted code (github-dark, mono 0.78rem at 1.7), and a 36px mono status footer.

### Data Rows
Project rows and blog rows: hairline-separated, hover to Surface 2, loading/empty/error states shown as a mono caption plus one sentence (error caption in logo blue).

## Do's and Don'ts

### Do:
- **Do** use Signal Blue for actions and live markers only, with the theme-appropriate lightness (#0a74b3 light, #0e9be6 dark).
- **Do** separate with 1px Hairline rules and Surface 2 hover tone, with 2px corners.
- **Do** set headings and buttons in uppercase Barlow Condensed, labels in uppercase tracked mono, reading text in Barlow.
- **Do** show real, factual proof (screenshots, years, stack); give every data block loading, empty and error states.
- **Do** keep a 2px Focus-color outline and respect prefers-reduced-motion.

### Don't:
- **Don't** center the hero, put a gradient on a name, or build a card grid as the main list; rows are the list form.
- **Don't** add a second accent color or tint sections with logo blue.
- **Don't** use radii above 2px on controls or media, or shadows at rest on content.
- **Don't** invent metrics, testimonials, or client logos.
- **Don't** set body text in Barlow or mono, or long text in the outline style.

## Known drift, not canonized
- Kept out of the system: `--gradient-brand` and the translucent light-theme `--color-primary` (#26edf7e8) exist in global.css but are tints/mixes only; the system has no gradients. `pages/blog/[slug].astro` uses `rounded-xl`, outside the 2px language. Terminal and its tabs hardcode hex instead of tokens.
