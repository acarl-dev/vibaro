# Copilot Instructions for Vibaro

You are coding in the Vibaro monorepo (Next.js + Laravel). Optimize for clarity, stability, MVP speed, and long-term consistency.

Vibaro is not just a musician homepage builder. Vibaro is a band page with a current focus, shareable links/QR codes, and visible performance.

Core product loop:
1. Set the current focus
2. Share links and QR code
3. See what works

## Source of truth (must follow)

Always follow these documents first, in this order:

1. docs/ARCHITECTURE.md
2. docs/PRODUCT_RULES.md
3. docs/STYLEGUIDE.md
4. docs/UI_RULES.md
5. docs/CONVENTIONS.md
6. docs/API_CONTRACTS.md
7. docs/DATA_MODEL.md
8. docs/THEMES.md
9. docs/SECURITY.md
10. docs/ENVIRONMENT.md
11. docs/STATE_MANAGEMENT.md

If there is a conflict, follow the earlier document.

Important:
- STYLEGUIDE.md defines product/design DNA.
- UI_RULES.md defines concrete technical UI implementation rules.
- For UI work, both STYLEGUIDE.md and UI_RULES.md must be read before making changes.

## External documentation via Context7 (MCP)

When working with frameworks, libraries, tooling, or configuration (Next.js, React, Laravel, Sanctum, Cashier/Stripe, Tailwind, Docker, Postgres, Redis):

- Always query Context7 (MCP) first to retrieve the relevant official documentation.
- Prefer official/primary documentation sources returned by Context7.
- Briefly cite the documentation title/section and version if available when proposing solutions.
- If Context7 cannot find the needed documentation, do not invent APIs or behavior. Ask for confirmation or propose a conservative fallback and explicitly state uncertainty.

## Context-first rule

Before implementing anything ambiguous:

- Check the relevant docs in /docs.
- For UI work, check docs/STYLEGUIDE.md and docs/UI_RULES.md first.
- If a new endpoint/entity is needed, update the docs first (API_CONTRACTS / DATA_MODEL).
- Do not invent new behavior that contradicts the docs.

## Product language rules

Use these product terms consistently in visible UI:

- “Meine Seite” = the permanent band page
- “Phase” = the current focus, e.g. release, tour, merch, studio
- “Links verteilen” = channel-specific tracking links and QR code
- “Performance dieser Phase” = performance for one specific phase
- “Analyse” = broader analytics overview

Avoid technical terms in primary UI:
- Spotlight
- Campaign
- Distribution
- Slug
- Referrer
- Conversion without explanation
- Handle without explanation
- Hero without explanation
- Template without context

Technical names may remain in code and API paths when already established, for example `spotlights`.

## Hard rules

- Never commit node_modules/ or apps/api/vendor/.
- Never import code between apps/web and apps/api. Communication is HTTP JSON API only.
- Use the API response format defined in docs/CONVENTIONS.md for all endpoints.
- Public endpoints must never expose private fields such as email, user_id, tokens, or internal billing info.
- Theme colors must come from CSS variables or documented tokens; never hardcode random HEX colors in components.
- Keep controllers thin in Laravel and pages thin in Next.js. Put logic into services/lib.
- Do not rename existing database tables, models, or API paths just to align product language unless explicitly requested.

## UI consistency rules

Before any UI change:

1. Read docs/STYLEGUIDE.md.
2. Read docs/UI_RULES.md.
3. Search for an existing component/pattern.
4. Reuse existing components before creating new ones.
5. Do not introduce a second way to solve the same UI problem.
6. Do not create new visual variants without documenting why.

Official Studio UI components must be preferred:

- StudioButton for Studio buttons
- StudioCard for Studio cards and panels
- StudioEmptyState for Studio empty states
- StudioTabPage for “Meine Seite” sub-pages
- StudioPageHeader for top-level Studio product areas
- StudioPageSubNav for Studio subnavigation
- StudioTopNav for primary Studio navigation
- StudioBottomNav for mobile primary navigation
- StudioStatCard for metrics/KPI cards
- StudioStatusBadge for phase/page status badges
- StudioNotice for inline info/warning/error notices
- ExplainPanel for contextual Help Mode explanations
- WhyButton for optional deeper explanations
- HelpHub as central Studio help entry point

If a required central component does not exist yet, do not invent a local style silently. First report the missing component and propose the smallest safe approach.

### UI anti-patterns

Do not introduce:

- free button radii in feature components
- free card radii/shadows/borders in feature components
- inline colors instead of tokens/theme variables
- emoji icons for functional actions
- random inline SVGs for functional actions when an official icon source exists
- new subnav/tab patterns
- multiple primary CTAs in the same screen state
- coming-soon cards without current value
- placeholder-only form labels
- `style={{ ... }}` except for truly dynamic values such as width, transform, chart bars, focal point, or CSS variables

Do not use inline styles for:
- colors
- border radius
- shadows
- font sizes
- static spacing

## Visual mode rules

Vibaro has different visual modes, but each mode must be internally consistent:

### Studio
- workflow-oriented
- calm and controlled
- one clear next step
- higher information density is allowed
- do not overload dashboards with equal-weight actions

### Public Page
- the band is the focus
- dark, editorial, stage-like, mobile-first
- Vibaro branding is allowed only subtly in the footer
- no Vibaro branding in the hero
- no tool-focused copy above band-focused content

### Landingpage
- must explain the product loop early
- do not sell Vibaro only as a homepage builder
- avoid generic SaaS-card-grid aesthetics
- avoid feature walls in the hero

### Settings
- clarity, safety, reversibility
- no experimental navigation
- no unclear consequences for account/page changes
- Settings currently has legacy UI patterns; when touched, move only the touched slice toward the official Studio components

## Empty-state rule

Every empty state must answer:

1. What is empty?
2. Why does it matter?
3. What should the user do next?

Each empty state should have exactly one clear primary action where possible.

## Help-system rules

- ExplainPanel is for short contextual help.
- WhyButton is for optional deeper explanation.
- Help must support the action, not push it below the fold unnecessarily.
- Avoid repeating the same explanation across multiple help boxes.
- HelpHub should start from the product loop: focus, share, learn.

## Edit-first / Minimal-change policy

- Always try to modify existing code in a clean and minimal way before adding new files or large sections.
- Prefer the smallest reasonable diff: fewest files, least new abstractions, minimal refactoring.
- Do not duplicate existing utilities, API clients, fetch wrappers, validators, theme helpers, UI components, or layout patterns.
- If you replace functionality, remove obsolete code instead of leaving parallel implementations.
- Avoid placeholder/speculative code such as unused helpers, empty services, or future-only components.
- Follow existing project patterns and directory rules. If a pattern exists, extend it rather than inventing a new one.
- When suggesting changes, briefly list:
  - which files will be changed/added/removed
  - why this is the minimal, maintainable approach

## Refactor discipline

Refactors must be small, explicit, and slice-based.

Allowed:
- one route
- one component
- one helper group
- one documented concern

Not allowed:
- broad “cleanup” across unrelated areas
- opportunistic formatting churn
- renaming files/classes for aesthetics
- restructuring entire domains without an explicit plan
- solving future problems that are not blocking the current slice

After each refactor:
- list changed files
- explain before/after
- describe risk
- provide test steps

## Legacy adoption rule

New UI must follow STYLEGUIDE.md and UI_RULES.md.

Existing legacy UI does not need to be fully normalized immediately.
When a legacy screen is touched:
- only improve the touched slice
- do not normalize the entire screen opportunistically
- do not create new local styles
- move toward official components where safe

Known legacy areas:
- Settings has local card/button/badge styles.
- Forms currently lack a central Studio input system.
- Landingpage has its own visual mode but still needs documented consistency.
- Public Page has its own visual mode and must not be forced into Studio components.

## Dependencies policy

- Do not add new dependencies unless explicitly requested.
- If a dependency seems necessary, first propose a solution using the existing stack.
- If adding a dependency is unavoidable, justify it and list the exact package name and why it is worth it.

## Single-way rule

- Do not introduce a second way to do the same thing, for example multiple API clients, multiple auth approaches, multiple theme systems, multiple button systems, or multiple subnav systems.
- If an approach already exists, extend it.
- If it is flawed, refactor minimally and remove the old approach.

## Database & migration rules

- Any schema change requires a migration and an update to docs/DATA_MODEL.md.
- Prefer additive schema changes in the MVP.
- Avoid destructive changes such as drops or renames.
- If a destructive change is unavoidable, explicitly mention the migration impact.
- Do not rename tables/columns from `spotlight` to `phase` unless explicitly requested. “Phase” is the UI/product term; `Spotlight` may remain technical for now.

## Testing & smoke checks

- For new API endpoints: add at least one minimal feature test or provide a curl example to verify behavior.
- For new UI flows: provide a short manual test checklist with 3–5 steps.
- For UI-only changes: run or request at minimum:
  - npm run lint
  - npm run build
- For backend changes: run or request:
  - php artisan test

## Documentation discipline (anti-noise rule)

- Do not create new documentation files unless explicitly requested.
- Do not generate extra docs like README variants, notes, guides, or explanations by default.
- Only update existing docs when behavior, contracts, UI rules, or data models actually change.
- Prefer concise updates to existing documentation over new files.

## Directory rules

### Web (apps/web)

- Routes/layouts: src/app/**
- UI components: src/components/** or existing local component folders where already established
- Studio components: src/app/(studio)/components/**
- API client + fetch wrapper: src/lib/api/**
- Auth helpers: src/lib/auth/**
- Theme helpers: src/lib/theme/**
- Global state:
  - Prefer TanStack Query for server state if already used in the relevant area.
  - Prefer Zustand for UI state if already used in the relevant area.
  - Use React Context only for truly global concerns. If added, place it in src/context/**.

### API (apps/api)

- Routes in routes/api.php under /api/v1
- Controllers thin: app/Http/Controllers/Api/**
- Validation: Form Requests in app/Http/Requests/**
- Authorization: Policies in app/Policies/**
- Business logic only if needed: app/Services/**
- No heavy abstractions in MVP.

## MVP scope (current)

- Paid-only strategy with trial may be introduced separately, but do not implement billing unless explicitly requested.
- No AI features.
- Public pages route: /p/[handle].
- Handle must be lowercase, URL-safe, unique.
- Publishing rule: public page visible only when is_published = true.
- Public pages may show subtle Vibaro branding in the footer.
- No custom domains in MVP unless explicitly requested.

## Change checklist

When implementing a new feature, ensure:

- API contracts are documented/updated in docs/API_CONTRACTS.md.
- Data model is documented/updated in docs/DATA_MODEL.md if relevant.
- Security rules in docs/SECURITY.md are satisfied.
- Errors follow the standard format.
- Empty states are handled.
- UI follows docs/STYLEGUIDE.md and docs/UI_RULES.md.
- The dominant CTA is clear for the current screen state.
- The product loop is supported or the screen’s supporting role is explicit.

## Reporting format after changes

Always report:

- changed files
- what changed
- whether behavior changed
- risk level
- how to test
- whether lint/build/tests were run

For UI changes, also report:

- which official component/pattern was used
- whether a new visual variant was introduced
- why it was necessary if introduced

## When uncertain

- Prefer simple, stable implementations over clever abstractions.
- Avoid adding new dependencies unless absolutely necessary.
- Add TODOs only when strictly necessary and make them actionable.
- When in doubt, ask for clarification rather than guessing.