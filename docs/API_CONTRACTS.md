# Vibaro API Contracts (v1 + v2)

Diese Datei ist die **verbindliche Quelle** für alle API-Endpunkte.  
Frontend (`apps/web`) und Backend (`apps/api`) müssen sich exakt daran halten.

Alle Responses folgen dem Standard aus `CONVENTIONS.md`.

**Product Definition**
- V1 (Legacy): Mini-Homepage / Free + Artist (historisch)
- V2 (Active): Stage System (docs/PRODUCT_V2.md)

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
````

Error:

```json
{ "error": { "code": "string", "message": "string", "details": {} } }
```

---

# ===============================

# V1 (Legacy) – Current Implementation Baseline

# ===============================

> ⚠️ Status: Legacy Product Definition
> This section documents the existing endpoints as implemented for the original Vibaro MVP.
> Active product definition is V2 (Stage System). New development should follow V2.

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
Wird für Redirect- & Onboarding-Logik genutzt.

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
      "is_onboarded": true,
      "is_published": false,
      "published_at": null
    }
  }
}
```

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
    "focus_type": "links",
    "is_onboarded": true,
    "is_published": false,
    "published_at": null
  }
}
```

> Note: `focus_type` is part of V1 product logic. In V2 it may be removed or repurposed.

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

# ===============================

# V2 – Stage System (Active Additions)

# ===============================

Status: Active for new development
Product rules: docs/PRODUCT_V2.md
Data model: docs/DATA_MODEL.md (V2 section)

This section extends API v1. All existing v1 endpoints remain valid unless explicitly replaced.

## Implementation Status

### ✅ Implemented (Stage MVP)
- `GET /t/{slug}` - Public tracking redirect
- `GET /api/v1/analytics/overview` - Performance analytics (7d, 30d)

### 🔄 Planned (Stage Pro)
- Spotlight CRUD endpoints
- Campaign CRUD endpoints  
- Tracking Link CRUD endpoints
- CSV Export

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
    "description": "Our heaviest record so far.",
    "show_on_page": true,
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
      "description": "Our heaviest record so far.",
      "show_on_page": true,
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
      "description": "New dates announced.",
      "show_on_page": false,
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
  "show_on_page": true
}
```

**Field validation:**
- `title`: required, string, max 255 chars
- `type`: required, one of: `single`, `album`, `tour`, `event`
- `starts_at`: optional, date
- `ends_at`: optional, date (must be after `starts_at`)
- `primary_url`: required, URL, max 1000 chars
- `description`: optional, string, max 1000 chars
- `show_on_page`: optional, boolean (default: true)

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
    "description": "Feel-good summer anthem.",
    "show_on_page": true,
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
- If another spotlight is already active, it is automatically set to `ended`
- Model boot hook enforces one-active-per-page rule

**Response:**

```json
{ "data": { "active_spotlight_id": 13 } }
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

### DELETE /tracking-links/{id}

Auth required.

Archives the tracking link (soft delete via `archived_at`).

Response:

```json
{ "data": { "ok": true } }
```

**Rules:**
- Does not delete click history
- Archived links can be restored via backend (not exposed in MVP)
- Archivierung removes the link from active queries and releases the unique constraint

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
    "by_module": [
      { "module": "spotlight", "clicks": 740 },
      { "module": "links", "clicks": 310 },
      { "module": "shows", "clicks": 190 }
    ],
    "by_referrer": [
      { "referrer": "instagram.com", "clicks": 820 },
      { "referrer": "t.co", "clicks": 110 },
      { "referrer": "direct", "clicks": 310 }
    ],
    "trend": [
      { "date": "2026-02-12", "clicks": 120 },
      { "date": "2026-02-13", "clicks": 180 }
    ]
  }
}
```

Notes:

* **V2 Platform Tracking:** `by_platform` and `by_placement` provide granular breakdown of clicks by platform (Instagram, TikTok, etc.) and placement (Story, Bio, etc.).
* `by_platform`: Groups clicks by platform only. Only includes platforms with clicks.
* `by_placement`: Groups clicks by (platform, placement) pairs. Limited to top 15 results ordered by clicks DESC.
* `by_module`: Legacy field for backwards compatibility. Groups clicks by content module (spotlight, links, shows).
* `direct` is used when referrer is missing.
* All breakdown arrays only include entries with click_count > 0.

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
      "url": "https://vibaro.com/p/myhandle",
      "is_published": true
    },
    "stats": {
      "total_clicks_7d": 342,
      "trend": 12
    },
    "tip": {
      "type": "spotlight",
      "message": "Erstelle ein Spotlight, um deine Performance zu tracken.",
      "action": "/studio/project"
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
