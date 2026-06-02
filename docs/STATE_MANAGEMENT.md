# Vibaro State Management

Status: current
Last verified: 2026-04-22
Scope: current state in `apps/web`

This file describes the state approach currently used in the frontend.
It is not a target architecture.

---

## Principle

State stays as local as possible.
The current code prefers Server Components, Route Handlers, and local `useState` state instead of a general client-state framework.

---

## What is currently **not** used in the project

- No TanStack Query
- No Zustand store
- No global auth context

These libraries are not installed in the current web package and are not used in the code path.

---

## Server State (API-Daten)

Server data is currently loaded in two ways:

- Server-side via Next.js Server Components and server-only utilities like `backendFetch()`
- Client-side via `fetch()` against Next.js Route Handlers under `/api/**`

Concrete patterns in the current code:

- Authenticated server fetches run through `src/lib/api/backend.ts`
- Public data can be loaded server-side directly from the Laravel API endpoint
- Interactive Studio clients usually load and mutate data directly through `fetch("/api/studio/..." )`

There is currently no central cache layer for server state in the browser.
If the same data is needed in multiple places, it is currently either reloaded on the server side or kept locally in the respective client.

---

## UI State

The dominant UI state mechanism is currently local `useState` in the respective component.

Typical examples:

- forms
- upload status
- modal and panel state
- local error and success messages
- sorting and editing state in Studio views

More complex UI state is also currently kept locally per feature, not in a global store.

---

## React Context

React Context is currently used sparingly for cross-cutting UI concerns, not for API data or auth.

Currently existing contexts:

- `ToastContext` for toast output
- `HelpModeContext` for Help Mode and Help Hub UI

Auth and session checks currently run server-side via cookies, redirects, and `backendFetch()`, not through a React Context.

---

## Forbidden / Not intended

- duplicating API data in React Context
- introducing a global store "just in case"
- running multiple competing strategies for the same state in parallel

If TanStack Query, Zustand, or another global state approach is introduced later, this file must be updated beforehand or at the same time from `current` to the new actual state.
