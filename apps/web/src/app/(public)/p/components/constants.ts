/**
 * Layout & Spacing Constants for Public Artist Pages
 * 
 * Centralizes all hardcoded values for consistent styling across templates.
 * IMPORTANT: Do not modify these without checking all templates for design impacts.
 */

// -----------------------------------------------------------------------------
// Container Widths
// -----------------------------------------------------------------------------

/** Standard content width for editorial/text-heavy sections (980px) */
export const CONTAINER_WIDTH_STANDARD = "980px";

/** Wide content width for galleries, releases (1200px) */
export const CONTAINER_WIDTH_WIDE = "1200px";

/** Narrow content width for ModernTemplate (800px) */
export const CONTAINER_WIDTH_NARROW = "800px";

/** Max-width for bio/text blocks for readability (60ch) */
export const TEXT_MAX_WIDTH = "60ch";

// -----------------------------------------------------------------------------
// Responsive Padding
// -----------------------------------------------------------------------------

/** Standard horizontal padding: clamp(16px, 4vw, 48px) */
export const PADDING_X_STANDARD = "0 clamp(16px, 4vw, 48px)";

/** Narrow horizontal padding for tighter layouts: clamp(16px, 4vw, 32px) */
export const PADDING_X_NARROW = "0 clamp(16px, 4vw, 32px)";

/** Vertical + horizontal padding for hero sections without image */
export const PADDING_HERO_NO_IMAGE = "clamp(40px, 8vh, 80px) clamp(16px, 4vw, 48px)";

/** Mobile-only padding for hero text below image */
export const PADDING_HERO_MOBILE = "clamp(10px, 3vw, 28px) clamp(16px, 4vw, 48px)";

/** Full section padding (vertical + horizontal) for FocusSection */
export const PADDING_SECTION_FULL = "48px clamp(16px, 4vw, 48px)";

// -----------------------------------------------------------------------------
// Section Spacing (py-* classes translated to inline if needed)
// -----------------------------------------------------------------------------

/** Section vertical padding: py-10 md:py-12 → approx 40px/48px */
export const SECTION_PADDING_Y_MODERN = "py-10 md:py-12";

/** Large section vertical padding: py-20 → 80px */
export const SECTION_PADDING_Y_LARGE = "py-20";

/** Featured release section: py-10 md:py-14 */
export const SECTION_PADDING_Y_FEATURED = "py-10 md:py-14";

// -----------------------------------------------------------------------------
// Border Colors (Tailwind classes - for reference only)
// -----------------------------------------------------------------------------

/** Light border for sections: border-zinc-800/40 */
export const BORDER_SECTION_LIGHT = "border-zinc-800/40";

/** Standard border: border-zinc-800/50 */
export const BORDER_STANDARD = "border-zinc-800/50";

/** Dark border for full template: border-zinc-900 */
export const BORDER_DARK = "border-zinc-900";

/** Hover border: border-zinc-700/70 */
export const BORDER_HOVER = "border-zinc-700/70";

// -----------------------------------------------------------------------------
// Background Colors (Tailwind classes - for reference only)
// -----------------------------------------------------------------------------

/** Card background: bg-zinc-900/20 */
export const BG_CARD_LIGHT = "bg-zinc-900/20";

/** Card background (darker): bg-zinc-900/30 */
export const BG_CARD = "bg-zinc-900/30";

/** Card background (medium): bg-zinc-900/50 */
export const BG_CARD_MEDIUM = "bg-zinc-900/50";

// -----------------------------------------------------------------------------
// Helper: Style object generators
// -----------------------------------------------------------------------------

/**
 * Standard container style for content sections
 * Usage: <div className="mx-auto" style={containerStyle()}>
 */
export function containerStyle(width: "standard" | "wide" | "narrow" = "standard") {
  const widthMap = {
    standard: CONTAINER_WIDTH_STANDARD,
    wide: CONTAINER_WIDTH_WIDE,
    narrow: CONTAINER_WIDTH_NARROW,
  };
  
  return {
    maxWidth: widthMap[width],
    padding: PADDING_X_STANDARD,
  };
}

/**
 * Narrow container style (for ModernTemplate)
 */
export function containerStyleNarrow() {
  return {
    maxWidth: CONTAINER_WIDTH_NARROW,
    padding: PADDING_X_NARROW,
  };
}

/**
 * Bio/text block style with max-width for readability
 */
export function bioTextStyle() {
  return {
    maxWidth: TEXT_MAX_WIDTH,
  };
}

// -----------------------------------------------------------------------------
// Animation & Interaction Constants
// -----------------------------------------------------------------------------

/** Scroll threshold for showing sticky navigation (in pixels) */
export const SCROLL_THRESHOLD_NAV = 600;

/** Transition duration for hover effects (Tailwind class) */
export const TRANSITION_DURATION_DEFAULT = "duration-300";

/** Transition duration for slower animations (Tailwind class) */
export const TRANSITION_DURATION_SLOW = "duration-500";

/** Hover scale for images - slight zoom effect */
export const HOVER_SCALE_SLIGHT = "scale-[1.02]";

/** Hover scale for images - medium zoom effect */
export const HOVER_SCALE_MEDIUM = "scale-[1.03]";

// -----------------------------------------------------------------------------
// Z-Index Layers
// -----------------------------------------------------------------------------

/** Z-index for hero overlay text */
export const Z_INDEX_HERO_OVERLAY = 10;

/** Z-index for modal backdrop */
export const Z_INDEX_MODAL_BACKDROP = 40;

/** Z-index for sticky navigation */
export const Z_INDEX_STICKY_NAV = 50;

/** Z-index for modal content */
export const Z_INDEX_MODAL_CONTENT = 50;
