# Copilot Instructions for Vibaro

You are coding in the Vibaro monorepo (Next.js + Laravel). Optimize for clarity, stability, and MVP speed.

## Source of truth (must follow)
Always follow these documents first, in this order:
1) docs/ARCHITECTURE.md
2) docs/PRODUCT_RULES.md
3) docs/CONVENTIONS.md
4) docs/API_CONTRACTS.md
5) docs/DATA_MODEL.md
6) docs/THEMES.md
7) docs/SECURITY.md
8) docs/ENVIRONMENT.md
9) docs/STATE_MANAGEMENT.md

If there is a conflict, follow the earlier document.

## External documentation via Context7 (MCP)
When working with frameworks, libraries, tooling, or configuration (Next.js, React, Laravel, Sanctum, Cashier/Stripe, Tailwind, Docker, Postgres, Redis):
- Always query Context7 (MCP) first to retrieve the relevant official documentation.
- Prefer official/primary documentation sources returned by Context7.
- Briefly cite the documentation title/section (and version if available) when proposing solutions.
- If Context7 cannot find the needed documentation, do NOT invent APIs or behavior. Ask for confirmation or propose a conservative fallback and explicitly state uncertainty.

## Context-first rule
Before implementing anything ambiguous:
- Check the relevant docs in /docs.
- If a new endpoint/entity is needed, update the docs first (API_CONTRACTS / DATA_MODEL).
Do not invent new behavior that contradicts the docs.

## Hard rules
- Never commit node_modules/ or apps/api/vendor/.
- Never import code between apps/web and apps/api. Communication is HTTP JSON API only.
- Use the API response format defined in docs/CONVENTIONS.md for ALL endpoints.
- Public endpoints must never expose private fields (email, user_id, tokens, internal billing info).
- Theme colors must come from CSS variables; never hardcode random HEX colors in components.
- Keep controllers thin (Laravel) and pages thin (Next.js). Put logic into services/lib.

## Edit-first / Minimal-change policy
- Always try to modify existing code in a clean and minimal way before adding new files or new large code sections.
- Prefer the smallest reasonable diff: fewest files, least new abstractions, minimal refactoring.
- Do not duplicate existing utilities (API clients, fetch wrappers, validators, theme helpers). Reuse what exists.
- If you replace functionality, remove the obsolete code instead of leaving parallel implementations.
- Avoid placeholder / speculative code (“for later”, unused helpers, empty services). Only add code that is used now.
- Follow existing project patterns and directory rules. If a pattern exists, extend it rather than inventing a new one.
- When suggesting changes, briefly list:
  - which files will be changed/added/removed
  - why this is the minimal, maintainable approach

## Dependencies policy
- Do not add new dependencies unless explicitly requested.
- If a dependency seems necessary, first propose a solution using the existing stack.
- If adding a dependency is unavoidable, justify it and list the exact package name and why it is worth it.

## Single-way rule
- Do not introduce a second way to do the same thing (e.g. multiple API clients, multiple auth approaches, multiple theme systems).
- If an approach already exists, extend it.
- If it is flawed, refactor minimally and remove the old approach.

## Database & migration rules
- Any schema change requires a migration and an update to docs/DATA_MODEL.md.
- Prefer additive schema changes in the MVP.
- Avoid destructive changes (drops/renames).
- If a destructive change is unavoidable, explicitly mention the migration impact.

## Testing & smoke checks
- For new API endpoints: add at least one minimal feature test OR provide a curl example to verify behavior.
- For new UI flows: provide a short manual test checklist (3–5 steps).

## Documentation discipline (anti-noise rule)
- Do NOT create new documentation files unless explicitly requested.
- Do NOT generate “extra” docs like README variants, notes, guides, or explanations by default.
- Only update existing docs when behavior, contracts, or data models actually change.
- Prefer concise updates to existing documentation over new files.

## Directory rules (where code must go)
### Web (apps/web)
- Routes/layouts: src/app/**
- UI components: src/components/**
- API client + fetch wrapper: src/lib/api/**
- Auth helpers: src/lib/auth/**
- Theme helpers: src/lib/theme/**
- Global state:
  - Prefer TanStack Query for server state.
  - Prefer Zustand for UI state.
  - Use React Context only for truly global concerns. If added, place it in src/context/**.

### API (apps/api)
- Routes in routes/api.php under /api/v1
- Controllers thin: app/Http/Controllers/Api/**
- Validation: Form Requests in app/Http/Requests/**
- Authorization: Policies in app/Policies/**
- Business logic (only if needed): app/Services/**
- No heavy abstractions in MVP.

## MVP scope (current)
- Only Free + Artist plans.
- No AI features.
- Public pages route: /p/[handle].
- Handle must be lowercase, URL-safe, unique.
- Publishing rule: public page visible only when is_published = true.

## Change checklist (for any feature)
When implementing a new feature, ensure:
- API contracts are documented/updated in docs/API_CONTRACTS.md
- Data model is documented/updated in docs/DATA_MODEL.md (if relevant)
- Security rules in docs/SECURITY.md are satisfied (public vs private)
- Errors follow the standard format
- Empty states are handled (no broken UI)

## When uncertain
- Prefer simple, stable implementations over clever abstractions.
- Avoid adding new dependencies unless absolutely necessary.
- Add TODOs only when strictly necessary and make them actionable.
- When in doubt, ask for clarification rather than guessing.