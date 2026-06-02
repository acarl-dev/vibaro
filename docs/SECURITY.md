# Vibaro Security

Status: current
Last verified: 2026-04-22
Scope: current state of Web (`apps/web`) and API (`apps/api`)

This file describes the security rules that are currently implemented.
Target-state concepts or stricter future requirements do not belong here.

---

## 1) Core principles

- Only what is explicitly intended as a public endpoint is public.
- For Artist Pages, this currently means: published (`is_published = true`) and without private fields.
- `apps/web` never accesses the database directly, only `apps/api` via HTTP.
- Public responses must not contain private user fields.

---

## 2) Authentication: auth architecture and token flow

### Intentional model: bearer token in an httpOnly cookie via BFF

Vibaro does **not** use a classic Sanctum session/CSRF cookie model. It uses an intentional BFF pattern instead:

| Property | Classic (Session/CSRF) | Vibaro (Bearer via BFF) |
|---|---|---|
| Token type | Session cookie + CSRF token | Sanctum personal access token |
| Token storage location | Server session + browser cookie | httpOnly cookie (`vibaro_token`) |
| Authorization header | none (cookie automatically) | Bearer token, set server-side only |
| Who sets the header | Laravel internally | only `backendFetch()` |
| Browser JS access to token | no | no |

**Why not a classic session model:**
- Sanctum session auth requires `cookie` middleware and SPA domain configuration, which adds unnecessary complexity for the BFF pattern.
- Personal access tokens work statelessly; the Next.js BFF layer owns the state via the httpOnly cookie.
- The model remains extensible (future token rotation, multi-device sessions) without Laravel session infrastructure.

### Token flow

```text
Browser -> Next.js Route Handler (BFF) -> Laravel API
                                                 |
                              Token in JSON-Response (server-only)
                                                 |
                    Next.js sets httpOnly cookie <- 
                    Browser receives: { user, next } (no token)
```

Precise statements for the current state:

- Laravel `POST /api/v1/auth/login` and `POST /api/v1/auth/register` return `data.token` in the JSON response, but only to the Next.js route handler, not to the browser.
- This token is read in the route handler and stored as the `vibaro_token` cookie with `HttpOnly`.
- The BFF response to the browser contains `user` and `next`, but no token.
- The token is not readable by browser JavaScript.

### Mandatory rules

These rules are not optional:

1. **A token must never reach browser JS.** No route handler may return the token as a JSON field.
2. **Only `backendFetch()` may set the Authorization header.** Direct `fetch()` calls with manual `Authorization: Bearer ...` in route handlers are forbidden, except for the initial auth endpoints (`/auth/login`, `/auth/register`, `/auth/logout`), which cannot read the token from the cookie yet.
3. **No direct Laravel calls from client components.** Authenticated requests from client components must always go through a Next.js BFF endpoint under `/api/...`.
4. **`backendFetch()` is server-only.** The file `apps/web/src/lib/api/backend.ts` contains `import "server-only"`; it must not be imported into client components.
5. **Never store tokens in client storage.** `localStorage`, `sessionStorage`, and explicit cookies set via client JS are forbidden.

---

## 3) BFF rule for authenticated browser requests

For browser requests that require auth, the BFF rule still applies:

```text
Browser -> Next.js Route Handler / server-only utility -> Laravel API
```

This means:

- Client components call Next.js endpoints under `/api/**` for authenticated actions.
- Server-side authenticated fetches run through `backendFetch()` and read the cookie on the server side.
- The browser should not know the bearer token or send it directly to Laravel.

Not allowed:

- tokens in `localStorage` or `sessionStorage`
- a route handler that returns the token back to the browser as JSON
- direct browser requests to Laravel with a bearer token

---

## 4) Authorization and visibility

- Private resources are protected by `auth:sanctum`.
- Owner preview for unpublished pages runs through `GET /api/v1/p/{handle}/preview` and requires auth.
- The public endpoint `GET /api/v1/p/{handle}` may only return published data.

Private fields must not appear in public responses, especially:

- `email`
- `user_id`
- internal user IDs or token values
- internal billing information

Contact data remains private unless it is explicitly modeled and secured as published public fields.

---

## 5) Cookies, CORS, and same-origin behavior

Currently relevant:

- Auth cookie: `vibaro_token`
- Cookie flags: `HttpOnly`, `SameSite=Lax`, `Secure` in production
- The browser typically talks to the same Next.js origin; Laravel is accessed for auth cases through the BFF or server-side fetches

Therefore the CORS rule remains conservative:

- no wildcards in production
- only explicitly allowed origins
- only enable credential handling where it is actually needed

---

## 6) Input validation and write operations

- Write API routes validate input on the server side.
- Error and validation responses must follow `CONVENTIONS.md`.
- Unchecked mass updates remain forbidden.

---

## 7) Rate limiting and abuse protection

Currently documented and visible in routing:

- stricter throttling for `POST /api/v1/auth/login` and `POST /api/v1/auth/register`
- public rate limiting for public Artist Page and analytics endpoints

Security goal:

- no public user lookup endpoints
- no avoidable enumeration of private data

---

## 8) Upload and content security

- Uploads do not go directly from the browser to Laravel with a browser token; they go through the web layer
- MIME type, size, and filename must be validated on the server side
- HTML in freely editable text fields is not planned in the MVP
- User URLs must be validated

---

## 8a) SSRF protection for server-side remote fetches

Certain services fetch metadata or content server-side from user-provided URLs or URLs returned by oEmbed (`ReleaseMetadataService`, `MetadataService`). All such fetches run through `SafeHttpService`.

### Implemented measures

| Measure | Implementation |
|---|---|
| Only `http` / `https` allowed | Scheme check in `SafeHttpService::isAllowed()` and in `MetadataService::fetchFromUrl()` |
| Private / reserved IP ranges blocked | `FILTER_FLAG_NO_PRIV_RANGE \| FILTER_FLAG_NO_RES_RANGE` + DNS resolution of all A/AAAA records |
| Redirect guard | Every redirect hop is revalidated via the Guzzle `on_redirect` callback |
| Redirect limit | max. 3 hops |
| Timeout | 10 seconds (configurable per call) |
| Max response size | 10 MB; the response is checked after download |
| Logging | Every blocked or failed request is logged with URL and reason (`Log::warning`) |

### Blocked IP ranges (via PHP flags)

- `127.0.0.0/8` — loopback
- `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16` — private ranges
- `169.254.0.0/16` — link-local / AWS EC2 Metadata Service
- `240.0.0.0/4` — reserved
- `::1/128` — IPv6 loopback
- `fc00::/7` — IPv6 unique local
- `fe80::/10` — IPv6 link-local

Hostname literals `localhost`, `ip6-localhost`, and `ip6-loopback` are additionally blocked before DNS resolution.

### Scope

- `ReleaseMetadataService`: direct fetch of Spotify URLs (release type scraping), platform URLs (release date scraping), and oEmbed thumbnail URLs
- `MetadataService`: no direct user URL fetch; the URL is only passed as a query parameter to fixed oEmbed endpoints; scheme validation (`http`/`https`) still applies early

### What is NOT protected by `SafeHttpService`

- The oEmbed endpoints themselves are hardcoded (for example `open.spotify.com/oembed`) and therefore are not an SSRF risk
- DNS rebinding between the preflight check and TCP connect is a residual TOCTOU risk, accepted in the MVP; full mitigation would require a Guzzle post-connect IP check

---

## 9) Secrets, logs, and data minimization

- No secrets in Git
- No tokens or passwords in logs
- Public responses only with fields that are actually public

---

## 10) Token lifecycle and session invalidation

### Current model (MVP)

- Sanctum personal access tokens have no server-side expiration in the MVP. The token remains valid until it is explicitly revoked.
- **Logout** calls `DELETE /api/v1/auth/logout`, which causes Laravel to delete the token from the `personal_access_tokens` table. Afterwards, the `vibaro_token` cookie is deleted in the browser.
- **Session invalidation** via logout is therefore complete: the token exists neither in the cookie nor in the database.

### Token rotation (future)

If token rotation is introduced, it must happen exclusively on the server side:

```text
BFF route receives request -> Token expired? -> backendFetch refresh endpoint
                                                          |
                                          new token in JSON response
                                                          |
                                    update httpOnly cookie <- 
                                    return response with new token to client
```

The client does not get to see a token in this flow; it only receives a new successful response.

### What is NOT allowed

- token expiry checks in client JS
- token refresh from client components directly against Laravel
- expiration times or token values in JSON responses to the browser

---

## 11) Never-do list

- ❌ store tokens in client storage (`localStorage`, `sessionStorage`, explicit client cookies)
- ❌ bypass the BFF when browser auth is required
- ❌ return the token to the browser as a JSON field in a BFF response
- ❌ use direct `fetch()` calls with manual `Authorization: Bearer ...` in Studio route handlers (use `backendFetch()` instead)
- ❌ make authenticated Laravel calls directly from client components
- ❌ import `backendFetch()` or `getTokenFromCookies()` into client components
- ❌ use CORS wildcards in production
- ❌ allow uploads without server-side validation
- ❌ expose private user data in public responses
- ❌ implement token expiry logic in the browser
