---
name: Editorial Monolith
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#444748'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#5d5e66'
  on-secondary: '#ffffff'
  secondary-container: '#e3e1ec'
  on-secondary-container: '#63646c'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1d1b1a'
  on-tertiary-container: '#868381'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#e3e1ec'
  secondary-fixed-dim: '#c6c5cf'
  on-secondary-fixed: '#1a1b22'
  on-secondary-fixed-variant: '#46464e'
  tertiary-fixed: '#e6e1df'
  tertiary-fixed-dim: '#cac6c3'
  on-tertiary-fixed: '#1d1b1a'
  on-tertiary-fixed-variant: '#484645'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 44px
    fontWeight: '600'
    lineHeight: 52px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 34px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  label-lg:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.06em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system is tailored for an intentional, contemplative mobile language learning experience. Rejecting hyper-gamified tropes, vibrant cartoons, and artificial urgency, the visual language draws deep inspiration from Swiss international typography, independent literary journals, and architectural monographs. 

The emotional signature is quiet, deliberate, and respectful of the learner's attention. Every interface element treats language acquisition as an intellectual and cultural pursuit rather than an arcade game. Generous whitespace, precise typographic proportions, stark black-and-white tonal balance, and tactile mechanical feedback combine to create a calm, dignified learning sanctuary.

Key tenets:
- **Quiet Authority:** Meaning and structure emerge from typographic scale, whitespace, and sharp ink-on-paper contrast rather than decorative flourishes.
- **Physicality & Tactility:** Surfaces and buttons respond with subtle, deliberate micro-shifts reminiscent of physical press buttons, crisp print stock, and tactile paper artifacts.
- **Pure Intentionality:** Every line, margin, and token serves comprehension and reading cadence. Zero neon glows, zero ambient colored gradients, and zero extraneous decorative visuals.

## Colors

The palette operates strictly within a curated monochromatic spectrum, celebrating the purity of black ink on crisp paper.

- **Primary (`#111111`):** A dense carbon ink tone. Used for dominant headings, primary interactive surfaces, core glyphs, and high-impact structural borders. Avoids true harsh digital black (`#000000`) for longer reading passages while retaining maximum contrast.
- **Secondary (`#71717a`):** A neutral mid-gray tone for secondary copy, meta indicators, grammatical context markers, unselected states, and supporting metadata.
- **Neutral Background (`#ffffff`):** A pure, bright canvas offering paper-like luminescence and stark framing.
- **Subtle Surfaces (`#f4f4f5`):** Light zinc tone used for inset containers, audio playback cards, contextual lesson blocks, and neutral interactive states.
- **Subtle Borders (`#e4e4e7`):** Hairline boundary strokes providing structure without interrupting typographic flow.
- **Pure Black Accent (`#000000`):** Reserved for primary interactive active states and deep contrasting badges.

## Typography

The typographic hierarchy utilizes **Hanken Grotesk**, a neo-grotesque sans-serif with geometric underpinnings and crisp Swiss precision. It bridges mid-century modernist clarity with contemporary screen legibility.

- **Vocabulary & Foreign Script Display:** Primary vocabulary terms and target language phrases utilize `display-lg-mobile` or `headline-lg` with tight tracking (`-0.025em`) to evoke the presence of printed editorial headline typography.
- **Reading Cadence:** Body text maintains an intentional 1.55x–1.6x line-height ratio to optimize scanning and lexical decomposition during intensive comprehension exercises.
- **Phonetic & Syntactic Annotations:** Grammatical annotations, gender classifications, and IPA phonetics utilize uppercase `label-sm` or tracking-spaced `label-md` in secondary zinc tones to sit harmoniously beside prominent vocabulary.

## Layout & Spacing

The layout is built around a single-column, content-first mobile grid designed to emulate editorial spreads and flashcards.

- **Mobile Viewports (< 640px):** Single dynamic column bounded by an uncompromising `1.25rem` (20px) outer margin. Target learning items, translation pairs, and interactive answer blocks fill the horizontal measure while respecting vertical rhythm increments of 8px.
- **Tablet & Larger Screens (≥ 640px):** Content conforms to a fixed-width 560px central column, framed by broad white margins to preserve comfortable eye travel and focused editorial concentration.
- **Typographic Gaps:** Spacing between target language terms and native explanations utilizes tight groupings (`space-xs` to `space-sm`), while semantic sections, card blocks, and bottom action bars use expansive intervals (`space-lg` to `space-xl`) to establish breathing room.

## Elevation & Depth

Visual hierarchy rejects diffuse multi-layered drop shadows, saturated glows, and heavy skeuomorphic shading. Depth is articulated purely through tonal planes, mechanical outlines, and spatial contrast.

- **Flat Tonal Grounding:** The primary canvas remains clean `#ffffff`. Secondary contexts (e.g., transcript drawers, phrase breakdowns, or grammar hints) rest on flat `#f4f4f5` surfaces.
- **Crisp Hairline Boundaries:** Containers and interactive modules use 1px solid borders (`#e4e4e7`), reinforcing the feel of architectural drafting or printed newsprint columns.
- **Physical Press Depth (Micro-elevation):** For primary actionable cards and flash options, a tactile mechanical offset is achieved not with soft blur, but with a 1px solid `#111111` border coupled with an optional 2px solid downward offset (`box-shadow: 0 2px 0 0 #111111`). When active/pressed, the element translates down 2px with zero shadow, providing instantaneous, crisp physical response.

## Shapes

The design system employs a soft, architectural geometry (`roundedness: 1`). 

- **Containers & Cards:** Styled with a subtle `0.25rem` (4px) or `0.5rem` (8px) radius. This prevents corners from feeling digital or overly sterile while avoiding the playful, toy-like appearance of heavy bubbles.
- **Metadata & Status Badges:** Formed into strict, slim pill capsules (`rounded-full`) to distinctly contrast with rectilinear cards and modular layout blocks.
- **Input Fields & Audio Triggers:** Maintain the structural `0.25rem` corner radius, aligning with the typographic grid and disciplined Swiss aesthetic.

## Components

### Buttons
- **Primary Action Button:** Solid `#111111` fill with `#ffffff` text, 48px height, `0.25rem` corner radius. Typography set to `label-lg` (semi-bold). On tap, instantaneous tonal feedback to `#000000` with subtle scale compression (0.99).
- **Secondary / Outline Button:** `#ffffff` background with a 1px solid `#111111` border, `#111111` text. On hover/active, fills solid with `#f4f4f5`.
- **Tertiary Text Action:** Transparent background, underlined `#111111` text, or accompanied by a hairline directional arrow (`→`).

### Badges & Chips
- **Lexical Pill Badges:** Height 24px, 100px border-radius, background `#f4f4f5`, text `#111111`, styled in uppercase `label-sm` tracking. Used to denote noun gender (e.g., `MASC`, `FEM`), CEFR difficulty (`B2`), or parts of speech.
- **Interactive Filter Chips:** `#ffffff` background with 1px solid `#e4e4e7`. When active, inverts cleanly to `#111111` fill with `#ffffff` typography.

### Language Learning Cards (Prompt & Flashcard)
- Bound by 1px solid `#e4e4e7` on `#ffffff` canvas. Generous interior padding (`1.5rem`).
- Large target word placed prominently in `headline-lg`, accompanied by phonetic notation in `label-md` (`#71717a`).
- Minimalist circular audio trigger button: 36px diameter, 1px border `#e4e4e7`, containing a pure black geometric speaker/waveform icon.

### Selection Lists & Multiple Choice
- Interactive choice rows set against `#ffffff` with a 1px `#e4e4e7` border and 8px vertical margin gap.
- Leading alphanumeric accelerator index (A, B, C) encased in a hairline 20px square badge.
- When selected: Border shifts to 1.5px solid `#111111`, background remains `#ffffff` or fills `#f4f4f5`, providing confident legibility without neon greens or reds.

### Text Inputs & Cloze Tests
- Seamless inline underline fields (2px solid `#111111`) for fill-in-the-blank vocabulary, mimicking physical workbook exercises.
- Standalone inputs feature a 1px `#e4e4e7` perimeter, shifting to `#111111` on focus, with quiet placeholder copy set in `#71717a`.

### Progress & Cadence Indicators
- Micro segmented progress bar running along the top viewport: 2px height, unfilled segments `#e4e4e7`, completed segments filled solid `#111111`. No rounded ends, no pulsing gradients; pure mathematical progression.