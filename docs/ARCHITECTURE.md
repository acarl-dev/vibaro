# Vibaro Architecture

## Goal
Vibaro is a B2C SaaS to create and publish musician mini-homepages. MVP focuses on Free + Artist (paid) plans. AI is out of scope for now.

## Monorepo Structure
- apps/web: Next.js (Landing, Dashboard, Public Artist Pages)
- apps/api: Laravel JSON API (Auth, Artist Pages, Billing later)
- packages/shared: optional shared constants/types (no cross-app imports)
- infra/: local docker, scripts
- docs/: source of truth for conventions and contracts

## Hard Boundaries (Do not break)
- `apps/web` must NOT import code from `apps/api`.
- Communication between web and api is HTTP only (JSON API).
- Shared code (if any) goes into `packages/shared` and must be framework-agnostic.

## Runtime Topology (Hybrid)
- Web (Next.js) runs on Vercel.
- API (Laravel) runs on Hetzner.
- Media files go to S3-compatible storage (later).
- DB: PostgreSQL. Cache/Queue: Redis.

## Key Flows
### Authentication
- Token-based auth via Sanctum. Token is stored as a **httpOnly cookie** (`vibaro_token`), set by the Next.js Route Handler on login/register.
- **BFF pattern is mandatory**: the browser never holds the raw token. All authenticated API calls flow through Next.js Route Handlers, which read the cookie server-side and add the `Authorization: Bearer` header.
- Never create a Route Handler whose sole purpose is to expose the token to the browser (e.g. `GET /api/auth/token`).
- FormData / multipart uploads must also be proxied through Route Handlers using `request.arrayBuffer()` – do not bypass the BFF to avoid encoding issues.
- Web uses API endpoints only; no direct DB access.

### Public Artist Page Rendering
- Public pages are served by Next.js route `/p/[handle]`.
- Data is fetched from API public endpoint with `next: { revalidate: 60 }` (cache-friendly).
- Owner preview (`is_published=false`) uses a separate authenticated endpoint `GET /api/v1/p/{handle}/preview` with `cache: "no-store"`. The public route and the preview route are intentionally separate so the public path remains uniformly cacheable.

## Route Handler Categories (When to use a BFF Route Handler)

The BFF pattern (Route Handlers in `apps/web/src/app/api/`) is intentional and mandatory for auth security. Not every call needs to go through a Route Handler. Use this classification:

| Category | Rule | Example |
|---|---|---|
| **Auth-sensitive** | Must use Route Handler — token must never reach the browser | All Studio endpoints (`/api/v1/studio/**`) |
| **Upload proxy** | Must use Route Handler — multipart must be proxied via `request.arrayBuffer()` | `upload-flyer`, `upload-cover`, `upload-avatar` |
| **Public, directly fetchable** | Server Components may call the Laravel API directly (no Route Handler needed) | `GET /api/v1/p/{handle}` (anonymous, published pages) |
| **Public but transformed** | Use a Route Handler only if the Server Component needs data from multiple sources merged, or the shape must differ from what Laravel returns | Future: aggregated landing-page data |

The key invariant: if a call requires the `vibaro_token` cookie, it must go through a Route Handler or a server-only utility (`backendFetch()` in `src/lib/api/backend.ts`). Direct client-side calls to Laravel are only acceptable for truly public, unauthenticated endpoints.

## Non-Goals (MVP)
- No mobile app, no AI features, no complex analytics platform.
- Keep the product simple and stable.

## Decision Notes
- React/Next.js chosen for fast iteration and public page rendering.
- Laravel chosen for rapid SaaS backend development (auth, jobs, later billing).
