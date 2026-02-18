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

Response:

```json
{
  "data": {
    "id": 12,
    "title": "New Album: VOIDBRINGER",
    "type": "release",
    "status": "active",
    "starts_at": "2026-02-01T00:00:00Z",
    "ends_at": null,
    "primary_url": "https://open.spotify.com/album/...",
    "description": "Our heaviest record so far.",
    "created_at": "2026-02-01T10:00:00Z",
    "updated_at": "2026-02-10T18:30:00Z"
  }
}
```

If no active spotlight exists:

```json
{ "data": null }
```

---

### POST /spotlights

Auth required.

Request:

```json
{
  "title": "Tour: Spring 2026",
  "type": "tour",
  "starts_at": "2026-03-01T00:00:00Z",
  "ends_at": null,
  "primary_url": "https://tickets.example.com",
  "description": "New dates announced."
}
```

Response:

```json
{
  "data": { "id": 13, "status": "scheduled" }
}
```

---

### PATCH /spotlights/{id}

Auth required.

Request:

```json
{
  "title": "Tour: Spring 2026 (updated)",
  "primary_url": "https://tickets.example.com/new"
}
```

Response:

```json
{ "data": { "ok": true } }
```

---

### POST /spotlights/{id}/activate

Auth required.

Rules:

* Only one active spotlight per artist page.
* If another spotlight is active, it becomes ended.

Response:

```json
{ "data": { "active_spotlight_id": 13 } }
```

---

### POST /spotlights/{id}/end

Auth required.

Response:

```json
{ "data": { "ended_spotlight_id": 13 } }
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
      "spotlight_id": 12,
      "starts_at": "2026-02-10T00:00:00Z",
      "ends_at": null
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
{ "data": { "id": 22 } }
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

Response:

```json
{
  "data": [
    {
      "id": 100,
      "slug": "t_vK3a9QpN",
      "module": "spotlight",
      "label": "Spotify",
      "target_url": "https://open.spotify.com/album/...",
      "spotlight_id": 12,
      "campaign_id": 21,
      "is_active": true
    }
  ]
}
```

---

### POST /tracking-links

Auth required.

Request:

```json
{
  "module": "spotlight",
  "label": "Spotify",
  "target_url": "https://open.spotify.com/album/...",
  "spotlight_id": 12,
  "campaign_id": 21,
  "utm_source": "instagram",
  "utm_medium": "story",
  "utm_campaign": "album_launch"
}
```

Response:

```json
{
  "data": {
    "id": 100,
    "slug": "t_vK3a9QpN",
    "tracking_url": "https://<your-domain>/t/t_vK3a9QpN"
  }
}
```

---

### PATCH /tracking-links/{id}

Auth required.

Request:

```json
{ "label": "Spotify (Link in Bio)", "is_active": true }
```

Response:

```json
{ "data": { "ok": true } }
```

---

### DELETE /tracking-links/{id}

Auth required.

Response:

```json
{ "data": { "ok": true } }
```

---

## Public Tracking Redirect (Stage + Pro)

### GET /t/{slug}

Public endpoint. Server-side tracking + 302 redirect to target_url.

Behavior:

* creates click event (server-side)
* stores:

  * occurred_at (UTC)
  * referrer_host (host only)
  * spotlight_id / campaign_id / module (denormalized)
* must NOT store:

  * IP addresses (may only be used transiently)
  * full referrer URLs
  * any user-identifying data

Response:

* `302 Found` redirect to target_url
* `404 Not Found` if slug unknown or inactive

---

## Analytics (Stage + Pro)

### GET /analytics/overview

Auth required.

Query params:

* `range`: `7d` | `30d` (default `7d`)
  * Note: MVP implements 7d and 30d only. 90d planned for future.
* `spotlight_id`: optional (not yet implemented)
* `campaign_id`: optional (not yet implemented)

Response:

```json
{
  "data": {
    "range": "7d",
    "total_clicks": 1240,
    "by_module": [
      { "module": "spotlight", "clicks": 740 },
      { "module": "links", "clicks": 310 },
      { "module": "shows", "clicks": 190 }
    ],
    "by_referrer": [
      { "referrer_host": "instagram.com", "clicks": 820 },
      { "referrer_host": "t.co", "clicks": 110 },
      { "referrer_host": "direct", "clicks": 310 }
    ],
    "trend": [
      { "date": "2026-02-12", "clicks": 120 },
      { "date": "2026-02-13", "clicks": 180 }
    ]
  }
}
```

Notes:

* `direct` is used when referrer is missing.

---

## Export (Stage Pro)

### GET /exports/campaigns/{id}.csv

Auth required.

Returns a CSV file. Default content: daily rollup for the campaign (date, clicks, referrer_host, module).

MVP may return CSV synchronously.

```

---
