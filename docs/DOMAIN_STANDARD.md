# Vibaro Domain Assignment Standard

Status: binding for consolidation planning
Date: 2026-04-30
Scope: apps/api, apps/web, docs

## 1) Purpose

This document defines the binding product core for consolidation.
The goal is clear ownership per production file before refactors are implemented.

This document does not change production code.

## 2) Binding Sources

1. docs/API_CONTRACTS.md is currently the only binding contract source for API behavior.
2. Outdated documents are not binding for this consolidation.
3. In case of conflict between older documents and API_CONTRACTS, API_CONTRACTS takes precedence.

## 3) In Scope vs Out of Scope

In Scope:
- apps/api
- apps/web
- docs

Out of Scope:
- infra
- node_modules
- vendor
- build artifacts
- tests

## 4) Domain Cores

### 4.1 Website Core
Everything related to ArtistPage, public band page, profile, sections, presentation, and content.

Typical responsibilities:
- ArtistPage master data
- Profile, appearance, contact
- Sections and section visibility
- Shows, releases, videos, gallery, featured content
- Public page rendering and public content presentation

### 4.2 Phase Core
Everything related to the current focus of a band.
UI term: Phase.
The technical backend model remains Spotlight for now.

Typical responsibilities:
- Phase wizard
- Activate, end, archive, restore
- Phase overview and phase-related presentation
- Focus/status changes that alter behavior over time

### 4.3 Links Core
Everything related to TrackingLink, distribution, and channel-specific delivery.

Typical responsibilities:
- Platform/placement links
- QR and redirect flows
- Tracking link creation and link lifecycle
- Link-related campaign logic

### 4.4 Analytics Core
Everything related to evaluation and comparison.

Typical responsibilities:
- PageViewEvent and ClickEvent evaluation
- Performance, results, metrics, reporting
- Breakdown, comparison, insights

### 4.5 Shared/Foundation
Only technical cross-cutting logic that intentionally belongs to no product core.

Allowed contents:
- Auth
- API clients
- BFF proxy
- HTTP utilities
- Error handling
- Toasts
- Base UI components
- Layout shells

Not allowed:
- Hidden product logic from Website, Phase, Links, or Analytics.

## 5) Hard Rules

1. Every production file in apps/api and apps/web must be assigned to exactly one core or Shared/Foundation.
2. Shared/Foundation must not be misused as a catch-all for unclear product logic.
3. Files with multiple responsibilities must be marked as conflict.
4. Refactors are derived only from the matrix in docs/REFACTOR_MATRIX.md.
5. Until implementation, no API changes, no file moves, and no import changes are part of this step.

## 6) Assignment Decision Rule

Primary question per file:
- Which domain state does this file primarily own?

Secondary question when unclear:
- Which product decision would not be possible without this file?

If a file carries multiple product states equally:
- Mark conflict: Yes: mixed responsibility
- Define target core
- Defer measure to later (extract/centralize/review)

## 7) Conflict Taxonomy

Allowed conflict values:
- No
- Yes: mixed responsibility
- Yes: wrong term
- Yes: duplicate logic
- Yes: target unclear

## 8) Action Taxonomy

Allowed actions:
- Keep
- Rename UI text
- Extract later
- Centralize later
- Delete/redirect later
- Review

## 9) Enforcement

A matrix entry is considered complete when all fields are set:
- File
- Current core
- Target core
- Conflict
- Rationale
- Action

New or changed production files should only be accepted in PR reviews in the future when they have a clear domain assignment.
