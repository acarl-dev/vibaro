# Copilot Instructions for Vibaro

You are coding in the Vibaro monorepo (Next.js + Laravel).

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

If there is a conflict, follow the earlier document.

## Hard rules
- Never commit `node_modules/` or `apps/api/vendor/`.
- Never import code between `apps/web` and `apps/api`. Communication is HTTP JSON API only.
- Use the API response format defined in `docs/CONVENTIONS.md`.
- Public endpoints must never expose private fields (email, user_id, tokens).
- Theme colors must come from CSS variables; never hardcode random HEX colors in components.
- Keep controllers thin (Laravel) and pages thin (Next.js). Put logic into services/lib.

## MVP scope (current)
- Only Free + Artist plans.
- No AI features.
- Public pages route: `/p/[handle]`.
- Handle must be lowercase, URL-safe, unique.

## When uncertain
- Prefer simple, stable implementations over clever abstractions.
- Add TODOs only when strictly necessary and make them actionable.
