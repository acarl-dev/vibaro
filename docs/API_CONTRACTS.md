# Vibaro API Contracts (v1 + v2)

Status: historical / needs update
Last verified: 2026-04-22
Scope: gemischter Vertragsbestand mit teilweise aktuellem, teilweise historischem Inhalt

Diese Datei ist **aktuell nicht mehr als Ganzes bindend**.

Grund:

- sie mischt historische Produktstände und aktuelle Endpunkte in einem Dokument
- sie verwendet gleichzeitig V1-/V2-Sprache und Current-Contract-Sprache
- einzelne Claims sind im aktuellen Routen-Scan nicht eindeutig verifiziert

Bis zur Aufteilung in kleinere Vertragsdateien gilt:

- `apps/api/routes/api.php` ist der Referenzpunkt für die existierende API-Fläche
- diese Datei ist vor allem Kontext- und Migrationsdokumentation
- neue Arbeit an Endpunkten sollte Verträge domänenscharf dokumentieren

Empfohlene Zielaufteilung:

- Auth
- Public Page
- Studio CRUD
- Tracking / Analytics
- Spotlight / Campaign

Alle Responses folgen weiterhin dem Standard aus `CONVENTIONS.md`.

## Domain Map In This File

- Auth
- Private Artist Page / Studio CRUD
- Public Artist Page
- Spotlights / Campaigns
- Tracking / Analytics
- Studio Dashboard

## Historical Context

- V1 (Legacy): Mini-Homepage / Free + Artist
- V2 (Product target / active product language): Stage System (`docs/PRODUCT_V2.md`)

Die V1-/V2-Begriffe in dieser Datei sind daher Kontext, nicht automatisch gleichbedeutend mit vollständig verifiziertem Current Contract.

---

## Base URLs

### Development
- http://localhost:8000

### Production
- https://api.<your-domain>

**API Prefix:** `/api/v1`

---

## Response Format

Success:
```json
{ "data": {} }
```

Error:

```json
{ "error": { "code": "string", "message": "string", "details": {} } }
```

---

## Legacy Baseline Sections

> Status inside this file: historical baseline with partially current endpoint overlap.
> Treat these sections as migration context unless the route shape is re-verified against code.

---

## Auth

### POST /auth/register

Registriert einen neuen User.

Request:

```json
{
  "name": "Alan",
  "email": "alan@example.com",
  "password": "secret123"
}
```

---

### POST /auth/login

Login eines bestehenden Users.

Request:

```json
{
  "email": "alan@example.com",
  "password": "secret123"
}
```

---

### POST /auth/logout

Auth required.

Response:

```json
{
  "data": { "ok": true }
}
```

---

## GET /me

Auth required.

Response:

```json
{
  "data": {
    "id": 1,
    "name": "Alan",
    "email": "alan@example.com",
    "artist_page": {
      "id": 10,
      "handle": "emily-j",
      "is_published": false,
      "published_at": null
    }
  }
}
```

> `artist_page` is `null` when the user has not yet created a page (→ redirect to onboarding).
> Use `artist_page === null` as the onboarding gate; there is no `is_onboarded` field.

---

## Artist Pages (Private)

### GET /artist-pages/me

Auth required.

Response:

```json
{
  "data": {
    "id": 10,
    "handle": "emily-j",
    "display_name": "Emily J.",
    "bio": "Independent artist from Berlin",
    "avatar_url": "https://cdn...",
    "hero_image_url": null,
    "is_published": false,
    "published_at": null
  }
}
```

---

### POST /artist-pages

Erstellt eine Artist Page (MVP: max. eine pro User)

Request:

```json
{
  "handle": "emily-j",
  "display_name": "Emily J."
}
```

---

### PATCH /artist-pages/{id}

Partial updates erlaubt.

Request:

```json
{
  "display_name": "Emily J.",
  "bio": "New bio",
  "avatar_url": "https://cdn...",
  "hero_image_url": null,
  "focus_type": "links"
}
```

---

### POST /artist-pages/{id}/publish

Auth required.

Validierung:

* handle vorhanden
* display_name vorhanden
* bio vorhanden

Response:

```json
{
  "data": {
    "is_published": true,
    "published_at": "2025-12-16T10:30:00Z"
  }
}
```

---

### POST /artist-pages/{id}/unpublish

Auth required.

Response:

```json
{
  "data": { "is_published": false }
}
```

---

### PATCH /artist-pages/{id}/sections

Auth required.

Updates the visible sections configuration for the artist page.

Request:

```json
{
  "visible_sections": ["profile", "links", "music", "shows", "contact"]
}
```

**Field rules:**
- `visible_sections`: Array of section identifiers
- Valid sections: `profile`, `links`, `music`, `shows`, `releases`, `videos`, `gallery`, `contact`
- Empty array is allowed (hides all sections)

Response:

```json
{
  "data": {
    "id": 1,
    "visible_sections": ["profile", "links", "music", "shows", "contact"]
  }
}
```

---

## Handle Check

### POST /handles/check

Request:

```json
{ "handle": "emily-j" }
```

Response:

```json
{
  "data": {
    "handle": "emily-j",
    "available": true
  }
}
```

---

## Artist Search

### GET /artist-pages/search

Public endpoint. Searches published artist pages by handle or display name.

Query params:

* `q` (min 2 characters)

Response:

```json
{
  "data": [
    {
      "id": 1,
      "handle": "emily-j",
      "display_name": "Emily J.",
      "avatar_url": "https://cdn.example.com/avatars/abc.jpg"
    }
  ]
}
```

Use case: Autocomplete for Support Acts field

---

## Links / Shows / Releases (Private CRUD)

Endpoints:

* `/artist-pages/{id}/links`
* `/artist-pages/{id}/shows`
* `/artist-pages/{id}/releases`

Standard CRUD:

* `GET` list
* `POST` create
* `PATCH /{resource_id}` update
* `DELETE /{resource_id}` delete

Optional:

* `POST /{resource}/reorder`

---

## Public Artist Page

### GET /p/{handle}

Public, no auth.

Behavior:

* 404 if handle unknown
* 404 if `is_published = false`
* No internal IDs
* Contact data stays private

Response (V1 baseline):

```json
{
  "data": {
    "handle": "emily-j",
    "display_name": "Emily J.",
    "bio": "Independent artist from Berlin",
    "images": {
      "avatar_url": "https://cdn...",
      "hero_image_url": null
    },
    "focus": { "type": "links", "limit": 3 },
    "links": [],
    "shows": [],
    "releases": [],
    "featured_tracks": []
  }
}
```

> Note: `focus` is V1 product logic and may change in V2 public page responses.

---

## Stage / Spotlight / Analytics Sections

> Status inside this file: partially current, but still embedded in a mixed historical document.
> Product rules: `docs/PRODUCT_V2.md`
> Data model: `docs/DATA_MODEL.md`

This section extends API v1. All existing v1 endpoints remain valid unless explicitly replaced.

## Implementation Status (Needs Re-Verification)

### Verified in current route scan
- `GET /api/v1/analytics/overview`
- `GET /api/v1/analytics/breakdown`
- `GET /api/v1/analytics/comparison`
- `GET /api/v1/studio/home`
- Spotlight-, Campaign- und Tracking-Link-Endpunkte unter `/api/v1/**`

### Not verified in `apps/api/routes/api.php` during this review
- `GET /t/{slug}` / `GET /t/{short_code}` public tracking redirect
- CSV export endpoint

Diese Punkte sind nicht automatisch falsch, aber aus diesem Review heraus nicht als current source of truth bestätigt.

---

## Spotlights (Stage)

### GET /spotlights/active

Auth required.

Returns the currently active spotlight for the authenticated user's artist page.

**Response:**

```json
{
  "data": {
    "id": 12,
    "title": "New Album: VOIDBRINGER",
    "slug": "new-album-voidbringer",
    "type": "album",
    "status": "active",
    "starts_at": "2026-02-01T00:00:00Z",
    "ends_at": null,
    "primary_url": "https://open.spotify.com/album/...",
    "cover_image_url": "https://i.scdn.co/image/...",
    "artist_name": "VOIDCULT",
    "platform_name": "Spotify",
    "description": "Our heaviest record so far.",
    "show_on_page": true,
    "subtitle": null,
    "cta_label": null,
    "secondary_cta_url": null,
    "secondary_cta_label": null,
    "background_image_url": null,
    "meta": { "track_count": 10 },
    "created_at": "2026-02-01T10:00:00Z",
    "updated_at": "2026-02-10T18:30:00Z"
  }
}
```

If no active spotlight exists:

```json
{ "data": null }
```

**Notes:**
- Only returns spotlights where `archived_at IS NULL`
- `slug` is the stable campaign identifier (never changes)

---

### GET /spotlights

Auth required.

Returns all non-archived spotlights for the authenticated user's artist page.

**Response:**

```json
{
  "data": [
    {
      "id": 12,
      "title": "New Album: VOIDBRINGER",
      "slug": "new-album-voidbringer",
      "type": "album",
      "status": "active",
      "starts_at": "2026-02-01T00:00:00Z",
      "ends_at": null,
      "primary_url": "https://open.spotify.com/album/...",
      "cover_image_url": "https://i.scdn.co/image/...",
      "artist_name": "VOIDCULT",
      "platform_name": "Spotify",
      "description": "Our heaviest record so far.",
      "show_on_page": true,
      "subtitle": null,
      "cta_label": null,
      "secondary_cta_url": null,
      "secondary_cta_label": null,
      "background_image_url": null,
      "meta": { "track_count": 10 },
      "created_at": "2026-02-01T10:00:00Z",
      "updated_at": "2026-02-10T18:30:00Z"
    },
    {
      "id": 11,
      "title": "Tour: Spring 2026",
      "slug": "tour-spring-2026",
      "type": "tour",
      "status": "scheduled",
      "starts_at": "2026-03-01T00:00:00Z",
      "ends_at": null,
      "primary_url": "https://tickets.example.com",
      "cover_image_url": null,
      "artist_name": null,
      "platform_name": null,
      "description": "New dates announced.",
      "show_on_page": false,
      "subtitle": "15 Städte, 4 Länder",
      "cta_label": "Tickets sichern",
      "secondary_cta_url": null,
      "secondary_cta_label": null,
      "background_image_url": null,
      "meta": { "city_count": 15, "country_count": 4 },
      "created_at": "2026-01-15T10:00:00Z",
      "updated_at": "2026-01-15T10:00:00Z"
    }
  ]
}
```

**Filters:**
- Only returns spotlights where `archived_at IS NULL`
- Ordered by `created_at DESC`

---

### POST /spotlights

Auth required.

Creates a new spotlight.

**Request:**

```json
{
  "title": "New Single: Summer Vibes",
  "type": "single",
  "starts_at": "2026-03-01T00:00:00Z",
  "ends_at": null,
  "primary_url": "https://spotify.com/...",
  "description": "Feel-good summer anthem.",
  "show_on_page": true,
  "subtitle": "feat. Guest Artist",
  "cta_label": "Jetzt hören",
  "secondary_cta_url": "https://apple.music.com/...",
  "secondary_cta_label": "Apple Music",
  "background_image_url": "https://example.com/hero-bg.jpg",
  "meta": { "track_count": 12 }
}
```

**Field validation:**
- `title`: required, string, max 255 chars
- `type`: required, one of: `single`, `album`, `tour`, `event`, `video`, `merch`, `livestream`, `collab`
- `starts_at`: optional, date
- `ends_at`: optional, date (must be after `starts_at`)
- `primary_url`: required, URL, max 1000 chars
- `description`: optional, string, max 1000 chars
- `show_on_page`: optional, boolean (default: true)
- `subtitle`: optional, string, max 500 chars
- `cta_label`: optional, string, max 100 chars
- `secondary_cta_url`: optional, URL, max 1000 chars
- `secondary_cta_label`: optional, string, max 100 chars
- `background_image_url`: optional, URL, max 1000 chars
- `meta`: optional, JSON object (type-specific display metadata)

**Response (201 Created):**

```json
{
  "data": {
    "id": 13,
    "title": "New Single: Summer Vibes",
    "slug": "new-single-summer-vibes",
    "type": "single",
    "status": "scheduled",
    "starts_at": "2026-03-01T00:00:00Z",
    "ends_at": null,
    "primary_url": "https://spotify.com/...",
    "cover_image_url": "https://i.scdn.co/image/...",
    "artist_name": "Summer Band",
    "platform_name": "Spotify",
    "description": "Feel-good summer anthem.",
    "show_on_page": true,
    "subtitle": "feat. Guest Artist",
    "cta_label": "Jetzt hören",
    "secondary_cta_url": "https://apple.music.com/...",
    "secondary_cta_label": "Apple Music",
    "background_image_url": "https://example.com/hero-bg.jpg",
    "meta": {},
    "created_at": "2026-02-20T12:00:00Z",
    "updated_at": "2026-02-20T12:00:00Z"
  }
}
```

**Backend behavior:**
- `slug` is auto-generated from `title` (lowercase, URL-safe, unique)
- `status` starts as `scheduled`
- `archived_at` is NULL

---

### PATCH /spotlights/{id}

Auth required.

Updates an existing spotlight.

**Request:**

```json
{
  "title": "New Single: Summer Vibes (Radio Edit)",
  "primary_url": "https://spotify.com/new-url",
  "description": "Updated description",
  "show_on_page": false
}
```

**Field validation:**
- All fields optional
- Same constraints as POST

**Response:**

```json
{ "data": { "ok": true } }
```

**Notes:**
- `slug` never changes (stable identifier for analytics)
- `status` is not changed via PATCH (use activate/end endpoints)

---

### POST /spotlights/{id}/activate

Auth required.

Activates a spotlight (sets `status` to `active`).

**Rules:**
- Only one active spotlight per artist page
- If another spotlight is already active, it is automatically ended with full lifecycle side effects (`ends_at`, `show_on_page=false`, active tracking links archived)
- Archived spotlights cannot be activated
- Domain lifecycle service + DB partial unique index enforce one-active-per-page rule

**Response:**

```json
{ "data": { "active_spotlight_id": 13 } }
```

**Error (400 Bad Request):**

```json
{
  "error": {
    "code": "SPOTLIGHT_ARCHIVED",
    "message": "Archived spotlight cannot be activated."
  }
}
```

---

### POST /spotlights/{id}/end

Auth required.

Ends a spotlight (sets `status` to `ended`, sets `ends_at` to current timestamp).

**Response:**

```json
{ "data": { "ended_spotlight_id": 13 } }
```

---

### POST /spotlights/{id}/archive

Auth required.

Archives a spotlight (soft delete via `archived_at`).

**Behavior:**
- Sets `archived_at` to current timestamp
- If the spotlight was active, its lifecycle is normalized to inactive state: `status = ended`, `ends_at` is set when missing, and `show_on_page = false`
- Archived spotlights are excluded from GET /spotlights and GET /spotlights/active
- Does NOT delete associated tracking links or click events
- Releases the unique constraint for (artist_page_id + slug)

**Response:**

```json
{ "data": { "ok": true } }
```

**Error (400 Bad Request):**

```json
{
  "error": {
    "code": "already_archived",
    "message": "This spotlight is already archived."
  }
}
```

---

### POST /spotlights/{id}/restore

Auth required.

Restores an archived spotlight (sets `archived_at` to NULL).

**Response:**

```json
{ "data": { "ok": true } }
```

**Error (400 Bad Request):**

```json
{
  "error": {
    "code": "not_archived",
    "message": "This spotlight is not archived."
  }
}
```

---

### PATCH /spotlights/{id}/show-on-page

Auth required.

Toggles the `show_on_page` flag for a spotlight (controls Hero Banner visibility on public page).

Request:

```json
{
  "show_on_page": true
}
```

Response:

```json
{
  "data": {
    "id": 12,
    "show_on_page": true
  }
}
```

**Rules:**
- Only active, non-archived spotlights can have `show_on_page = true`
- Hero Banner is visible when `show_on_page = true` AND `status = active` AND `archived_at IS NULL`

---

## Campaigns (Stage Pro)

### GET /campaigns

Auth required.

Response:

```json
{
  "data": [
    {
      "id": 21,
      "name": "Instagram Story – Feb 2026",
      "platform": "instagram",
      "notes": "A/B test - different creatives",
      "spotlight_id": 12,
      "spotlight_title": "New Album: VOIDBRINGER",
      "starts_at": "2026-02-10T00:00:00Z",
      "ends_at": null,
      "created_at": "2026-02-10T10:00:00Z",
      "updated_at": "2026-02-10T10:00:00Z"
    }
  ]
}
```

---

### POST /campaigns

Auth required.

Request:

```json
{
  "name": "Meta Ads – Album Launch",
  "platform": "meta_ads",
  "spotlight_id": 12,
  "notes": "A/B test - different creatives",
  "starts_at": "2026-02-15T00:00:00Z",
  "ends_at": "2026-02-28T23:59:59Z"
}
```

Response:

```json
{ "data": { "id": 22, "name": "Meta Ads – Album Launch" } }
```

---

### PATCH /campaigns/{id}

Auth required.

Request:

```json
{ "ends_at": "2026-03-03T23:59:59Z" }
```

Response:

```json
{ "data": { "ok": true } }
```

---

### DELETE /campaigns/{id}

Auth required.

Response:

```json
{ "data": { "ok": true } }
```

---

## Tracking Links (Stage + Pro)

### GET /tracking-links

Auth required.

Returns all tracking links for the authenticated user.

Response:

```json
{
  "data": [
    {
      "id": 100,
      "spotlight_id": 12,
      "platform": "instagram",
      "placement": "story",
      "label": "Instagram · Story",
      "short_code": "a1b2c3d4",
      "target_url": "https://open.spotify.com/album/...",
      "url": "https://vibaro.app/t/a1b2c3d4",
      "click_count": 87,
      "utm_source": "instagram",
      "utm_medium": "story",
      "utm_campaign": "new-album-release",
      "created_at": "2026-02-10T10:00:00Z"
    }
  ]
}
```

**Rules:**
- Archived links are not returned
- `label` is auto-generated if not provided: `{Platform} · {Placement}`
- `utm_campaign` is always `spotlight.slug` (stable identifier)

---

### GET /tracking-links/check

Auth required.

Checks if a tracking link with the given combination already exists.

Query params:
- `spotlight_id`: Required
- `platform`: Required
- `placement`: Required

Response (exists):

```json
{
  "data": {
    "exists": true,
    "link": {
      "id": 100,
      "platform": "instagram",
      "placement": "story",
      "label": "Instagram · Story",
      "short_code": "a1b2c3d4",
      "url": "https://vibaro.app/t/a1b2c3d4",
      "click_count": 87
    }
  }
}
```

Response (does not exist):

```json
{
  "data": {
    "exists": false
  }
}
```

**Rules:**
- Only checks non-archived links
- Used by frontend to prevent duplicate creation attempts

---

### POST /tracking-links

Auth required.

Creates a new tracking link. Checks for duplicates (spotlight_id + platform + placement).

Request:

```json
{
  "spotlight_id": 12,
  "platform": "instagram",
  "placement": "story",
  "target_url": "https://open.spotify.com/album/...",
  "label": "Instagram Story"
}
```

**Field rules:**
- `spotlight_id`: Required
- `platform`: Required (validated against Platform enum)
- `placement`: Required
- `target_url`: Required, must be valid http/https URL
- `label`: Optional, auto-generated if not provided

Response (success):

```json
{
  "data": {
    "id": 100,
    "short_code": "a1b2c3d4",
    "url": "https://vibaro.app/t/a1b2c3d4",
    "label": "Instagram · Story",
    "platform": "instagram",
    "placement": "story",
    "utm_source": "instagram",
    "utm_medium": "story",
    "utm_campaign": "new-album-release",
    "click_count": 0,
    "created_at": "2026-02-10T10:00:00Z"
  }
}
```

Response (duplicate):

```json
{
  "error": {
    "code": "duplicate_link",
    "message": "Ein Link für diese Kombination existiert bereits.",
    "details": {
      "spotlight_id": 12,
      "platform": "instagram",
      "placement": "story"
    }
  }
}
```

**Backend rules:**
- Partial unique index enforces uniqueness: `(spotlight_id, platform, placement) WHERE archived_at IS NULL`
- `short_code` is auto-generated (8 characters, unique)
- UTM parameters are auto-generated:
  - `utm_source` = `platform`
  - `utm_medium` = `placement`
  - `utm_campaign` = `spotlight.slug`
- `click_count` starts at 0

---

### PATCH /tracking-links/{id}/archive

Auth required.

Archives the tracking link (soft delete via `archived_at`).

Response:

```json
{
  "data": {
    "id": 100,
    "archived_at": "2026-02-20T12:30:00Z"
  }
}
```

**Rules:**
- Does not delete click history
- Archived links can be restored via backend (not exposed in MVP)
- Archivierung removes the link from active queries and releases the unique constraint

---

### DELETE /tracking-links/{id}

Auth required.

**Deprecated:** Use `PATCH /tracking-links/{id}/archive` instead.

Archives the tracking link (soft delete via `archived_at`).

Response:

```json
{ "data": { "ok": true } }
```

---

## Public Tracking Redirect (Stage + Pro)

### GET /t/{short_code}

Public endpoint. Server-side tracking + 302 redirect to target_url.

**Path parameter:**
- `short_code`: 8-character unique identifier for tracking link

**Behavior:**

* Creates ClickEvent (server-side)
* Denormalized data stored:
  * `occurred_at` (UTC)
  * `referrer_host` (host only, from HTTP Referer header)
  * `spotlight_id` (from TrackingLink)
  * `platform` (from TrackingLink)
  * `placement` (from TrackingLink)
* Must NOT store:
  * IP addresses (may only be used transiently for bot detection)
  * Full referrer URLs (only extract host)
  * Any user-identifying data (cookies, fingerprints, etc.)
* Increments `tracking_links.click_count` atomically

**Response:**
* `302 Found` - Redirect to `tracking_link.target_url`
* `404 Not Found` - If short_code unknown or tracking link archived

**Privacy rules:**
- No cookies set
- No fingerprinting
- Server-side only (no client tracking scripts)

---

## Analytics (Stage + Pro)

### GET /analytics/overview

Auth required.

Query params:

* `range`: `7d` | `30d` (default `7d`)
  * Note: MVP implements 7d and 30d only. 90d planned for future.
* `spotlight_id`: optional, filters analytics by spotlight
* `campaign_id`: optional, filters analytics by campaign

Response:

```json
{
  "data": {
    "range": "7d",
    "spotlight_id": 12,
    "campaign_id": null,
    "total_clicks": 1240,
    "by_platform": [
      { "platform": "instagram", "clicks": 620 },
      { "platform": "tiktok", "clicks": 380 },
      { "platform": "youtube", "clicks": 140 },
      { "platform": "x", "clicks": 100 }
    ],
    "by_placement": [
      { "platform": "instagram", "placement": "story", "clicks": 420 },
      { "platform": "instagram", "placement": "bio", "clicks": 200 },
      { "platform": "tiktok", "placement": "bio", "clicks": 280 },
      { "platform": "tiktok", "placement": "video", "clicks": 100 },
      { "platform": "youtube", "placement": "description", "clicks": 90 },
      { "platform": "youtube", "placement": "bio", "clicks": 50 },
      { "platform": "x", "placement": "bio", "clicks": 100 }
    ],
    "by_referrer": [
      { "referrer": "instagram.com", "clicks": 820 },
      { "referrer": "t.co", "clicks": 110 },
      { "referrer": "direct", "clicks": 310 }
    ],
    "total_pageviews": 980,
    "unique_pageviews": 740,
    "conversion_rate": 0.1135,
    "trend": [
      { "date": "2026-02-12", "clicks": 120 },
      { "date": "2026-02-13", "clicks": 180 }
    ],
    "pv_trend": [
      { "date": "2026-02-12", "views": 310 },
      { "date": "2026-02-13", "views": 420 }
    ]
  }
}
```

Notes:

* **V2 Platform Tracking:** `by_platform` and `by_placement` provide granular breakdown of clicks by platform (Instagram, TikTok, etc.) and placement (Story, Bio, etc.).
* `by_platform`: Groups clicks by platform only. Only includes platforms with clicks.
* `by_placement`: Groups clicks by (platform, placement) pairs. Limited to top 15 results ordered by clicks DESC.
* `by_module` is **not returned**. The legacy `module` column is no longer meaningfully populated (defaults to `'legacy'`). Use `by_platform` + `by_placement` instead.
* `direct` is used when referrer is missing.
* All breakdown arrays only include entries with click_count > 0.
* **Pageviews:** Reloads are deduplicated at ingest time. For the same artist page + spotlight context, at most one non-preview pageview per `visitor_key_hash` is stored per day. `visitor_key_hash` is a privacy-aware server hash derived from coarse, non-identifying buckets (UA-hash + coarse IP bucket + primary language) and remains an approximation. `total_pageviews` therefore reflects deduplicated daily visits (not raw reload count). `unique_pageviews` deduplicates by `visitor_key_hash` across the selected range (with legacy fallback to `user_agent_hash` for older rows). Pageviews without a `spotlight_id` are counted globally but excluded from conversion calculation.
* **Conversion rate (MVP approximation):** `total_clicks / unique_pageviews`, capped at `1.0` for display safety. `null` when no `spotlight_id` is provided or when `unique_pageviews = 0`. This is NOT a true unique-click conversion metric: `total_clicks` is not deduplicated, so a repeat-clicker inflates the numerator while the denominator counts them once. The cap prevents values > 100% in the UI. V2: switch to `unique_clicks / unique_pageviews`.
* **`pv_trend`:** pageviews per day, same date range and spotlight filter as `trend`.

---

### GET /analytics/comparison

Auth required. No query params.

Returns all-time aggregated metrics for two phases to be compared side-by-side.

**Phase selection logic (MVP):**
- If an **active** spotlight exists: `current` = active, `previous` = last ended
- If **no active** spotlight: `current` = last ended, `previous` = second-to-last ended
- If fewer than two phases exist: `previous` is `null`

**Comparison semantics:**
- This is a **chronological** comparison only (most recent vs. the one before).
- `previous` is selected purely by `ends_at` recency, not by content, type, or theme similarity.
- Use case: trend/progress view ("how am I doing now vs. last time?"), not campaign benchmarking.
- No content or thematic relationship between `current` and `previous` is implied.

**Conversion formula:** `total_clicks / unique_visitors × 100`, capped at 100.0 (MVP approximation — see overview notes). `null` when `unique_visitors = 0`.
**Delta for Conversion:** displayed in percentage points (pp), not %. E.g. 51.3% → 52.9% = +1.6 pp.

Response:

```json
{
  "data": {
    "current": {
      "id": 42,
      "title": "Release Week",
      "visitors": 742,
      "clicks": 381,
      "qr_scans": 63,
      "conversion": 51.3,
      "top_platform": "instagram"
    },
    "previous": {
      "id": 39,
      "title": "Pre-Save Phase",
      "visitors": 510,
      "clicks": 270,
      "qr_scans": 12,
      "conversion": 52.9,
      "top_platform": "instagram"
    }
  }
}
```

Notes:

* Metrics are **all-time** (no date range filter) — captures the full phase lifecycle.
* `qr_scans` is excluded from `clicks` total in frontend display.
* `top_platform` excludes QR (`platform != 'qr'`).
* Both `current` and `previous` can be `null` if no phase data exists.

---

### GET /analytics/breakdown

Auth required.

Provides nested breakdown of clicks by platform and placement (for detailed visualization).

Query params:

* `spotlight_id`: Required
* `period`: `7d` | `30d` (default `7d`)

Response:

```json
{
  "data": {
    "total_clicks": 87,
    "trend": 12,
    "period": "7d",
    "by_platform": [
      {
        "platform": "instagram",
        "clicks": 52,
        "placements": [
          { "placement": "story", "clicks": 38 },
          { "placement": "bio", "clicks": 12 },
          { "placement": "reel", "clicks": 2 }
        ]
      },
      {
        "platform": "tiktok",
        "clicks": 23,
        "placements": [
          { "placement": "bio", "clicks": 18 },
          { "placement": "video", "clicks": 5 }
        ]
      },
      {
        "platform": "youtube",
        "clicks": 12,
        "placements": [
          { "placement": "description", "clicks": 12 }
        ]
      }
    ]
  }
}
```

**Notes:**
- Nested structure: platform → placements array
- Only includes platforms/placements with clicks > 0
- `trend` is percentage change vs previous period (integer)
- Used for "Plattform × Platzierung" breakdowns in Studio

---

## Studio Dashboard

### GET /studio/home

Auth required.

Returns lightweight dashboard data for Studio Home page (3-second-check optimized).

Response:

```json
{
  "data": {
    "spotlight": {
      "id": 12,
      "title": "New Album Release",
      "slug": "new-album-release",
      "type": "release",
      "status": "active",
      "show_on_page": true,
      "starts_at": "2026-02-15T00:00:00Z",
      "ends_at": null
    },
    "top_links": [
      {
        "id": 42,
        "label": "Instagram · Story",
        "short_code": "a1b2c3d4",
        "url": "https://vibaro.com/t/a1b2c3d4",
        "clicks": 87,
        "platform": "instagram",
        "placement": "story"
      }
    ],
    "page": {
      "handle": "myhandle",
      "url": "https://vibaro.com/p/myhandle",
      "is_published": true,
      "display_name": "My Artist Name",
      "updated_at": "2026-02-18T10:00:00Z"
    },
    "stats": {
      "total_clicks_7d": 342,
      "trend": 12
    },
    "tip": {
      "type": "spotlight",
      "message": "Erstelle ein Spotlight, um deine Performance zu tracken.",
      "action_label": "Spotlight erstellen",
      "action_type": "navigate",
      "action_payload": { "path": "/studio/project" }
    }
  }
}
```

Rules:
- `spotlight`: null if no active spotlight exists (not archived, status = active)
- `top_links`: max 3, ordered by `click_count` DESC, only active (not archived)
- `stats.trend`: percentage change vs previous 7-day period (integer)
- `tip`: null if no contextual tip available

---

## Export (Stage Pro)

### GET /exports/campaigns/{id}.csv

Auth required.

Returns a CSV file. Default content: daily rollup for the campaign (date, clicks, referrer_host, module).

MVP may return CSV synchronously.

---
