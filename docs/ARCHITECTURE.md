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
- MVP: token-based auth OR Sanctum cookie auth (choose one and keep consistent across the codebase).
- Web uses API endpoints only; no direct DB access.

### Public Artist Page Rendering
- Public pages are served by Next.js route `/p/[handle]`.
- Data is fetched from API public endpoint.
- Must be fast and cache-friendly.

## Non-Goals (MVP)
- No mobile app, no AI features, no complex analytics platform.
- Keep the product simple and stable.

## Decision Notes
- React/Next.js chosen for fast iteration and public page rendering.
- Laravel chosen for rapid SaaS backend development (auth, jobs, later billing).
