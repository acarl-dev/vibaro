# Vibaro Architecture

Status: current
Last verified: 2026-04-22
Scope: current runtime and integration architecture of the monorepo

This file describes the current system shape.
Product visions or historical V1/V2 classification belong in product documents, not here.

## Goal

Vibaro is currently a monorepo with a Next.js web application and a Laravel JSON API for public pages, Studio features, auth, and the current spotlight/tracking/analytics flows.

## Monorepo Structure

- `apps/web`: Next.js App Router, Landing, Auth, Studio, Public Artist Pages, BFF Route Handlers
- `apps/api`: Laravel JSON API for auth, artist pages, Studio CRUD, tracking, analytics, and spotlights
- `packages/shared`: framework-agnostic shared artifacts, without cross-app runtime coupling
- `infra/`: local infrastructure and scripts
- `docs/`: documentation; only correct if kept in sync with code

## Hard Boundaries

- `apps/web` must not import code from `apps/api`.
- Communication between web and API happens over HTTP/JSON.
- Shared code belongs only in `packages/shared` and must remain framework-agnostic.

## Current Runtime Topology

- The browser primarily talks to Next.js.
- Laravel is the backend system for data, auth, policies, and business logic.
- Authenticated browser actions run through Next.js route handlers or server-only utilities.
- Public server fetches may go directly from Next.js to the Laravel API when no browser token is involved.

## Current Auth/Data Flow

### Authentication

- Laravel erzeugt Sanctum Personal Access Tokens.
- Next.js login/register route handlers read the token from the Laravel response and set `vibaro_token` as an `httpOnly` cookie.
- Authenticated requests from browser clients run through Next.js BFF endpoints.
- Authenticated server-side requests run through `backendFetch()`.
- The browser does not hold a readable bearer token.

### Public Artist Pages

- Public pages live under `/p/[handle]`.
- The published public path uses the API's public endpoint.
- The owner preview for unpublished pages uses a separate authenticated preview endpoint.
- Public and preview paths remain deliberately separated so caching rules are not mixed.

## Route Handler Classification

| Category | Current rule | Example |
|---|---|---|
| Auth-sensitive | Must run through BFF or server-only helper | Studio endpoints |
| Upload proxy | Must run through the web layer | Avatar, hero, cover, flyer uploads |
| Public, directly fetchable | May go server-side directly to Laravel | Published public page |
| Public but transformed | Route handler only for additional aggregation/transformation | Special composed web responses |

The binding boundary is simple:
As soon as a request needs `vibaro_token`, the browser layer must not hold the token itself or send it to Laravel.

## Non-Goals (Current)

- no direct database access from `apps/web`
- no second auth path beside the BFF/server-only pattern
- no cross-app imports between web and API
