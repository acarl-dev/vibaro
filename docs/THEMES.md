# Vibaro Themes & Variants

## Goal
Artist pages must look great with any photo. Users should not be able to "break" design.

## Rules
- No free color picker in MVP.
- Themes are curated templates with safe base colors.
- Variants change only accent/border (small surface), not the whole background.
- Accent usage should be <= 10% of the UI surface.

## CSS Variable Contract
Every page must define:
- --bg
- --surface
- --text
- --muted
- --border
- --accent
- --accent-contrast

## Templates (MVP)
- dark-editorial
- warm-neutral
- soft-light
- monochrome

## Variants (examples)
Each theme supports variants such as:
- auto (accent derived from photo)
- stage-blue
- warm-amber
- pulse-rose
- muted-mint

## Auto Accent
- Extract a dominant, non-extreme accent color from the avatar/header image.
- Never use auto accent for full backgrounds.
- Ensure accessible contrast for buttons (accent-contrast must be readable).

## Implementation
- Web stores `theme_key` and `theme_variant` on artist_pages.
- Web applies `data-theme` and `data-variant` attributes.
- CSS in `apps/web/src/styles/themes.css` maps theme+variant to variables.
