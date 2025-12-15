# Vibaro Styleguide

This styleguide defines the visual and communicative appearance of Vibaro.
It is binding for all UI decisions (web, public pages, dashboard).

Goal: calm, high-quality, timeless – the musician is the focus, not the tool.

---

## 1. Design Philosophy

- calm instead of loud
- clear instead of playful
- reduced instead of overloaded
- professional, not “startup buzz”

Vibaro should feel like:
- a high-quality music magazine
- a minimalist artist website
- not a marketing tool

---

## 2. Colors

- Colors must come **exclusively** from the theme system (`docs/THEMES.md`)
- No free color choices per component
- Accent colors should be used sparingly (buttons, links, highlights)
- Accent colors must never be used as full background surfaces

❌ Forbidden:
- random HEX colors
- colorful gradients
- color wheels / color pickers in the MVP

---

## 3. Typography


Avoid:
- playful fonts

### Typo-Rollen (Landing Page)

🅰️ Headline (Hero & Section Titles)
- Inter, weight 600–700
- leicht negatives Letter-spacing (~-0.01em)
- kompakte Line-height
- Farbe: Primary Text Color (Theme)
- Einsatz: Hero-Headline, Haupt-Section-Titel („So sieht deine Seite aus“, „Bereit für deine eigene Seite?“)

🅱️ Subheadlines / erklärende Titel
- Inter Medium (500)
- etwas kleiner als A
- mehr Zeilenabstand, ruhiger
- etwas weniger Kontrast als A
- Einsatz: erklärende Überschriften, Übergänge zwischen Sections

🅲 Main Copy (Absätze)
- Inter Regular (400)
- großzügige Line-height (z.B. `leading-relaxed`)
- ruhige Textfarbe (nicht reinweiß, z.B. leicht abgedunkeltes Foreground)
- max. Textbreite begrenzen (z.B. `max-w-xl` / `max-w-2xl`)
- Einsatz: Produktbeschreibung, Erklärtexte, Benefits (keine Bullet-Wüsten)

🅳 Meta / Secondary Text
- Inter Regular oder Medium
- kleiner als Main Copy
- weniger Kontrast, aber nie „grau auf grau“
- Einsatz: Hinweise, kleine Erklärungen, Footer, rechtliches

🅴 Buttons & CTAs
- Inter Medium oder Semibold
- klar, keine verspielten Caps
- kein extra Letterspacing
- CTA soll wirken wie eine Entscheidung, nicht wie Werbung
### Hero Typografie (Landing Page)

- Font: Inter (self-hosted, sans-serif)
- Headline: weight 600–700, slightly negative letter-spacing (~0.01em), rather tight line height for an editorial feel
- Subline: Inter Regular/Medium, more relaxed line height, clearly calmer than the headline

---

## 4. Layout & Spacing

- generous spacing
- fewer elements per screen
- mobile-first thinking
- clear separation of content

Principle:
> If something feels cramped, it is wrong.

---

## 5. UI Components

### Buttons
- clear
- calm
- no “shiny” look
- accent color only for primary actions

### Cards
- subtly separated
- no harsh shadows
- no strong contrasts

### Inputs
- simple
- easy to read
- clear but unobtrusive focus states

---

## 6. Interaction & Animation

- smooth transitions
- short, subtle animations
- no continuous motion
- animation supports function, not attention-seeking

---

## 7. Text & Language (UI)

- clear
- friendly
- factual
- no marketing speak
- no buzzwords

Example:
❌ “Boost your artist presence now!”  
✅ “Publish your artist page”

---

## 8. Public Artist Pages

- the artist is always the focus
- Vibaro stays visually in the background
- branding is subtle
- content > UI

Public pages should feel like:
> “The artist’s page – not the tool’s page”

---

## 9. Forbidden (important)

- ❌ flashy colors
- ❌ visual chaos
- ❌ continuous animations
- ❌ playful UI experiments
- ❌ technical language in the UI

---

## 10. Landing Page & Hero Layout (binding)

The Vibaro landing page follows an editorial, calm design.
It must not feel like a classic SaaS landing page.

### Core Principles
- one dominant visual focus (artist image or scene)
- very little text
- lots of white space
- clear hierarchy

---

### Hero Section

The hero is image-driven, not feature-driven.

**Structure:**
- large-scale image (at least 50% of the area)
- text block clearly separated
- no text-heavy overlays
- no patterned backgrounds

**Hero text:**
- one clear headline
- one short explanatory sentence
- one primary action (CTA)

❌ Forbidden in the hero:
- feature lists
- bullet points
- icons
- sliders
- marketing phrases

---

### Imagery

- editorial photography
- authentic musician scenes
- no stock-photo startup look
- no abstract graphics

Images should feel like:
> album covers, magazine photography, artist portraits

---

### Branding in the Hero

- Vibaro logo small and calm
- no dominant branding
- no “look at our product” feeling

Goal:
> Visitors remember the artist, not the tool.

---

### Layout Feel

- desktop: calm and spacious
- mobile: image first, text second
- no visual crowding
- no effects used to force attention
