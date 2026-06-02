# Vibaro UI Rules (Binding, MVP)

Status: Active  
Scope: Studio, Public Page, Landing Page, Settings  
Related: STYLEGUIDE.md, PRODUCT_RULES.md, THEMES.md

This document defines concrete technical UI rules for Vibaro.
It is binding for new screens, component adjustments, and UI refactors.

If STYLEGUIDE.md and UI_RULES.md conflict, the following order applies:
1. STYLEGUIDE.md (product/design DNA)
2. UI_RULES.md (technical implementation rules)

---

## Adoption Status

These rules apply in a binding way to new UI and intentionally touched UI slices.

Existing legacy code does not need to be fully adjusted immediately.
When an existing screen is edited, only the affected area should be gradually moved toward these rules.

No large-scale UI refactors without a dedicated plan.

---

## Official UI Components

These components must be used. New alternatives may not be introduced without documented justification.

| Component | Path | Usage area |
|---|---|---|
| `StudioButton` | `apps/web/src/app/(studio)/components/StudioButton.tsx` | All action buttons in the Studio |
| `StudioCard` | `apps/web/src/app/(studio)/components/StudioCard.tsx` | All cards and container panels in the Studio |
| `StudioEmptyState` | `apps/web/src/app/(studio)/components/StudioEmptyState.tsx` | All empty states in the Studio |
| `StudioTabPage` | `apps/web/src/app/(studio)/components/StudioTabPage.tsx` | Sub-pages under "My Page" |
| `StudioPageHeader` | `apps/web/src/app/(studio)/components/StudioPageHeader.tsx` | Top-level Studio product areas (Phase, Share, QR, Performance, Settings) |
| `StudioPageSubNav` | `apps/web/src/app/(studio)/components/StudioPageSubNav.tsx` | The only allowed Studio subnav pattern |
| `StudioTopNav` | `apps/web/src/app/(studio)/components/StudioTopNav.tsx` | Primary Studio navigation (desktop) |
| `StudioBottomNav` | `apps/web/src/app/(studio)/components/StudioBottomNav.tsx` | Primary Studio navigation (mobile) |
| `StudioStatCard` | `apps/web/src/app/(studio)/components/StudioStatCard.tsx` | Metrics and KPI tiles |
| `StudioStatusBadge` | `apps/web/src/app/(studio)/components/StudioStatusBadge.tsx` | Phase/page status badges |
| `StudioNotice` | `apps/web/src/app/(studio)/components/StudioNotice.tsx` | Inline notices (info, warning, error) |
| `ExplainPanel` | `apps/web/src/app/(studio)/components/ExplainPanel.tsx` | Contextual help in Help Mode |
| `WhyButton` | `apps/web/src/app/(studio)/components/WhyButton.tsx` | Optional deeper explanations |
| `HelpHub` | `apps/web/src/app/(studio)/components/HelpHub.tsx` | Central help entry point in the Studio |

---

## Page Header Rules

- `StudioTabPage` for sub-pages under **My Page**:
  Profile, Appearance, Links, Music, Shows, Releases, Videos, Gallery, Contact.
- `StudioPageHeader` for top-level Studio product areas:
  Dashboard/Home, Phase, Share Links/Share, QR, Performance/Analytics, Settings.
- No new page header pattern without an explicit decision.

---

## Navigation Rules

- `StudioPageSubNav` is the only allowed subnav pattern in the Studio.
- `StudioTopNav` (desktop) and `StudioBottomNav` (mobile) are the primary navigation patterns.
- `StudioSidebar` exists as part of the current shell. New navigation concepts may not be introduced without an explicit decision.

---

## Known Legacy Areas

### Settings

`SettingsClient` currently uses local button, card, and badge styles (no `StudioButton`, no `StudioCard`, no `StudioStatusBadge`).

Rule:
- No new local UI styles in Settings.
- The next time Settings is touched, the affected area must be gradually migrated to `StudioButton`, `StudioCard`, and `StudioStatusBadge` (or a documented central Settings variant).

---

## 1. Visual Modes

Vibaro has four visual modes. They share a common system, but may deliberately differ in weighting and mood.

### 1.1 Studio

Goal:
- workflow-orientiert
- ruhig, kontrolliert
- handlungsfokussiert

Allowed differences:
- higher information density than Landing/Public
- clearer functional separation (panels, subnav, status)
- stronger prioritization of CTA and next step

Not allowed:
- dashboard-like overload
- multiple equally strong primary actions

### 1.2 Public Page

Goal:
- band at the center
- high-quality, dark, editorial/stage-like
- mobile-first for fans

Allowed differences:
- more emotional imagery than in the Studio
- content-first layout

Not allowed:
- Vibaro-centered communication
- Vibaro branding outside the subtle footer
- tool-like jargon as main text

### 1.3 Landing Page

Goal:
- clearly show the product loop
- Focus -> Links/QR -> Performance

Allowed differences:
- stronger narrative staging than the Studio
- deliberate visual hierarchy per section

Not allowed:
- feature desert
- generic SaaS card-grid aesthetics

### 1.4 Settings

Goal:
- clarity, safety, reversibility
- low-risk interaction

Allowed differences:
- more reduced visual language
- more explanatory microcopy for critical actions

Not allowed:
- experimental navigation
- unclear consequences of changes

---

## 2. Component Rules

### 2.1 Buttons

Central component: `StudioButton` (`apps/web/src/app/(studio)/components/StudioButton.tsx`)

Required:
- Exactly one dominant primary button per screen state.
- All buttons in the Studio must use `StudioButton`.
- Button height and radius must not be chosen freely at the component level.

Usage:
- `primary`: main action in the current step
- `secondary`: next most important alternative
- `ghost`: secondary inline action in calm surfaces
- `danger`: irreversible/risk-bearing action
- `link`: text-near navigation without button weight

Sizes: `md` (default), `sm`, `icon`

Not allowed:
- multiple primary buttons in the same action group
- custom button styles in feature components
- raw `<button>` with arbitrary Tailwind classes in the Studio

### 2.2 Cards

Central component: `StudioCard` (`apps/web/src/app/(studio)/components/StudioCard.tsx`)

Required:
- Card composition through `StudioCard`.
- Radius, border, and shadow only via props/variants of `StudioCard`.

Usage:
- default: standard container (no `accentBorder`)
- emphasis: `accentBorder={true}` for highlighted information
- clickable: `clickable={true}` for navigable tiles

Not allowed:
- new shadows/radii/borders directly in feature code
- parallel card systems per area (for example local `rounded-xl` divs instead of `StudioCard`)

### 2.3 Empty States

Central component: `StudioEmptyState` (`apps/web/src/app/(studio)/components/StudioEmptyState.tsx`)

Props: `icon` (optional), `title`, `description`, `action` (ReactNode, optional)

Required:
Every empty state must answer:
1. What is empty? -> `title`
2. Why is it relevant? -> `description`
3. What is the next step? -> `action` (CTA via `StudioButton`)

Additional rules:
- exactly one clear CTA
- short, concrete, product-near language
- no placeholder text without action value

### 2.4 Tabs / Subnav

Central component: `StudioPageSubNav` (`apps/web/src/app/(studio)/components/StudioPageSubNav.tsx`)

Required:
- Only `StudioPageSubNav` as the subnav pattern in the Studio.
- Active state must be clearly recognizable and accessible.
- Labels follow the product terms from STYLEGUIDE.md.

Not allowed:
- new subnav patterns without a central decision
- mixing multiple navigation logics on the same level

### 2.5 Info- / Help-Panels

Central components:
- `ExplainPanel` (`apps/web/src/app/(studio)/components/ExplainPanel.tsx`) - contextual help, only visible when `helpMode` is active
- `WhyButton` (`apps/web/src/app/(studio)/components/WhyButton.tsx`) - optional deeper explanation via drawer
- `StudioNotice` (`apps/web/src/app/(studio)/components/StudioNotice.tsx`) - inline notice (type: `info`, `warning`, `error`)
- `HelpHub` (`apps/web/src/app/(studio)/components/HelpHub.tsx`) - central help entry point

Required:
- `ExplainPanel` for short, contextual help in Help Mode.
- `WhyButton` for optional deeper explanation.
- `StudioNotice` for persistent inline notices outside Help Mode.
- Help supports the action; it does not replace it.

Not allowed:
- help as the dominant screen area
- repeated explanation of the same statement in multiple boxes

### 2.6 Stat Cards

Central component: `StudioStatCard` (`apps/web/src/app/(studio)/components/StudioStatCard.tsx`)

Props: `value`, `label`, `trend` (optional: `{ value: string; positive: boolean }`)

Required:
- Metric + `label` + optional trend must be readable together.
- Stat cards must not visually overpower the main action.
- For empty data (`value === ""`), the component shows `—`; additionally reference Phase/next action.

Not allowed:
- isolated numbers without explanation
- decorative metric tiles without decision value

### 2.7 Forms

Status: **No central form component exists.**

Planned future components: `StudioField`, `StudioInput`, `StudioTextarea`, `StudioSelect`, `StudioFormSection`

Until a central form component exists:
- Reuse the dominant existing Studio input pattern (no new inline input styles).
- Labels must always be visible - no label-only placeholder.
- Error text must be concrete and solution-oriented at the field level.
- Critical fields (for example visibility, URL-adjacent fields) need a clear consequence description.
- The primary action at the end of the form must be clearly prioritized via `StudioButton variant="primary"`.

Not allowed:
- new input styles (new `rounded-*`, new border colors) in feature components
- CTA hierarchy breaks in form footers

### 2.8 Badges

Central component: `StudioStatusBadge` (`apps/web/src/app/(studio)/components/StudioStatusBadge.tsx`)

Allowed status values: `live`, `draft`, `ended`

Required:
- `StudioStatusBadge` for phase/page status.
- Badge text is short, status-oriented, and unambiguous.

Not allowed:
- arbitrary new badge colors in feature components (no local `bg-emerald-*`, etc.)
- badge as a substitute for missing explanation

### 2.9 Icons

Central icon source: `StudioIcons` (`apps/web/src/app/(studio)/components/StudioIcons.tsx`)

Required:
- Functional Studio UI elements use `StudioIcons` or a single explicitly approved icon library (no mix).
- Consistent size steps and alignment.

Not allowed:
- a mix of `StudioIcons`, separate inline SVGs, and emojis for the same functional level
- emoji icons for functional actions
- new inline SVG definitions outside `StudioIcons` without extending the central file

Note:
- Emojis are only allowed in rare, purely illustrative help contexts (for example ExplainPanel examples), never for primary functional elements.

---

## 3. Allowed Variants (Whitelist)

New variants outside this list are only allowed with documented justification and a central component extension.

### 3.1 Button Variants

- primary
- secondary
- ghost
- danger
- link

### 3.2 Card Variants

- default
- emphasis
- muted
- danger

### 3.3 Empty State Variants

- action-empty (with direct CTA)
- onboarding-empty (with short guidance + CTA)
- data-empty (with context about phase/filter + CTA)

### 3.4 Badge Variants

- neutral
- success
- warning
- danger
- info

---

## 4. Forbidden Patterns

- Arbitrary button radii in feature components.
- New card styles without a central component.
- Inline colors instead of token/theme variables.
- Emoji icons for functional actions.
- New subnav patterns without a systemic decision.
- Coming Soon cards without real value or a next step.
- style={{ ... }} except for genuinely dynamic values.
- Multi-CTA hierarchies without a clear primary path.

---

## 5. Empty State Rule (Binding)

Every empty state must contain the following three sentence levels:

1. State: What is empty?
2. Relevance: Why does it matter?
3. Action: What should happen next?

Minimum requirements:
- one clear CTA
- short language without jargon
- relation to the product loop (where sensible)

Quality check:
- Does a new user understand in under 5 seconds what to do?

---

## 6. Review Gate For Every UI Change

Every UI change must answer these questions before merge:

1. Which central component is used?
2. Is there already an existing pattern?
3. Is the dominant CTA clear?
4. Is the product loop supported?
5. Does this create a new style or stay within the system?

If any question is answered with no or unclear, the change is not merge-ready.

---

## 7. Codex/Copilot Rule

Required before every UI change:

1. Read STYLEGUIDE.md.
2. Read UI_RULES.md.
3. Search for existing components/variants in the code.
4. No new variants without a short justification in the PR.

Additional rule:
- Extend the existing pattern first, then build something new.
- No second way for the same UI task.

---

## 8. Layout & Spacing Standards

These values are binding for new UI work. Existing legacy code should be gradually aligned the next time it is touched.

### 8.1 Studio

| Area | Standard | Technical |
|---|---|---|
| Content max-width | 1200px | `style={{ maxWidth: "1200px" }}` (CSS token planned) |
| Page padding | px-4 sm:px-6, py-8 | defined by the Studio layout - do not repeat |
| Main section gap | 32px | `space-y-8` |
| Card padding | 24px | `p-6` via `StudioCard` |
| Card radius | 8px | `rounded-lg` via `StudioCard` |
| Grid gap | 20px | `gap-5` |
| Button | `StudioButton` only | No arbitrary `<button>` with Tailwind classes |
| Input | `studio-input` + `px-3 py-2` | class from `globals.css` |
| Mobile bottom safe area | `pb-20 md:pb-0` | only where `StudioBottomNav` is active |

Forbidden:
- Diverging card paddings or radii directly in feature components.
- New `gap-*` values without justification.
- `StudioStatCard` must not appear with different padding than `StudioCard` (alignment is still pending, but no new inconsistency).

### 8.2 Landing Page

- May deliberately use larger spacing and `rounded-full` CTAs - this is a documented mode difference from the Studio.
- Standard section widths:
  - text sections: `max-w-4xl`
  - feature/grid sections: `max-w-7xl`
- No additional `max-w-*` values without justification.

### 8.3 Public Page

- May use editorial spacing and template-specific widths.
- Must be internally consistent per template.
- Mobile-first for fans.
- No Studio components on the Public Page.

### 8.4 Settings

- Known legacy area with local card/button/badge styles.
- The next time it is touched: gradually migrate the affected area to Studio spacing and official components.
- No new local styles in Settings.

---

## 8.5 Inline Style Rules

`style={{ ... }}` is **only** allowed for genuine dynamic values.

Allowed:
- `width`/`height` from runtime data (for example chart bars, progress bars)
- `transform` (for example positioning, animation)
- CSS variables (`var(--studio-accent)`, etc.)
- Conditional layout values from props/state (for example `maxWidth: isVideo ? "960px" : "680px"`)
- `focal point` for image positioning

Not allowed:
- radius (`borderRadius: "..."`)
- shadow (`boxShadow: "..."`)
- colors (`color: "#..."`, `background: "#..."`) - CSS variables are okay
- static padding/margin values that could also be expressed as Tailwind classes
- static font sizes (`fontSize: "14px"`, etc.)

---

## 9. Token And Style Discipline

- Colors only through theme variables and existing tokens.
- Spacing only through defined spacing scales.
- Typography only through defined roles (Headline, Subheadline, Body, Meta, Label).
- No area-specific special logic for radius/shadow/border without central approval.

---

## 10. Product Loop Check In The UI

Every new or changed screen must clearly support at least one of these points:

- Set focus
- Share links/QR
- See performance

If a screen does not show a connection to the product loop, its value for the loop must be named explicitly (for example preparatory settings or content work).

---

## 11. Scope

These rules are binding for MVP slices.
Deviations are only allowed if they are:
- documented,
- centrally approved,
- and end up as a system improvement in the central components.
