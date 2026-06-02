# Vibaro Data Model (V1 + V2)

This document contains:
- Legacy V1 data model (mini-homepage system)
- Active V2 extensions (stage system)

Active product rules: docs/PRODUCT_V2.md

This file is the binding source for:
- migrations
- Eloquent models
- policies
- API responses

---

# ===============================
# V1 - Representation Layer
# ===============================

## users

Authenticated users.

| Field | Type | Notes |
|----|----|----|
| id | bigint | PK |
| name | string | |
| email | string | unique |
| password | string | hashed |
| is_admin | boolean | default false |
| trial_ends_at | timestamp | nullable. Set on registration. Null = trial expired or never started. |
| created_at | timestamp | |
| updated_at | timestamp | |

---

## artist_pages

Central entity for musician pages.

| Field | Type | Notes |
|----|----|----|
| id | bigint | PK |
| user_id | bigint | FK -> users.id |
| handle | string | unique, lowercase, url-safe |
| display_name | string | publicly visible |
| bio | text | nullable |
| avatar_path | string | nullable |
| header_path | string | nullable |
| logo_path | string | nullable |
| hero_focal_x | integer | nullable, 0-100, default 50. Horizontal focal point of the hero image. |
| hero_focal_y | integer | nullable, 0-100, default 35. Vertical focal point of the hero image. |
| theme_key | string | currently only `modern` |
| theme_variant | string | currently only `auto` |
| accent_mode | string | `auto` \| `manual` |
| accent_color | string | hex, nullable |
| booking_email | string | nullable, PRIVATE (legacy) |
| management_email | string | nullable, PRIVATE (legacy) |
| press_email | string | nullable, PRIVATE (legacy) |
| whatsapp_number | string | nullable, PRIVATE (legacy) |
| contact_message | string | nullable, max 500 |
| contacts | jsonb | nullable. Array of `{ label, type: "email"\|"whatsapp", value }`. Source of truth for public contact section. Falls back to legacy fields if null. |
| is_published | boolean | default false |
| published_at | timestamp | nullable |
| visible_sections | jsonb | default '["profile","links","music","shows","releases","videos","gallery","contact"]' |
| created_at | timestamp | |
| updated_at | timestamp | |

**Indexes**
- unique(handle)
- unique(user_id)

**Important**
- Legacy contact fields (`booking_email`, etc.) remain in the schema for Studio settings.
- The `contacts` array is the new source of truth for the public page. The API builds it from `contacts` (if set) or falls back to the legacy fields.
- Handle must not be changed when published.
- Public queries always run by handle, never by ID.

---

## links

| Field | Type |
|----|----|
| id | bigint |
| artist_page_id | bigint |
| type | string |
| title | string |
| url | string |
| position | int |
| is_visible | boolean |
| created_at | timestamp |
| updated_at | timestamp |

---

## shows

| Field | Type |
|----|----|
| id | bigint |
| artist_page_id | bigint |
| starts_at | datetime |
| venue | string |
| city | string |
| address | text |
| ticket_url | string |
| price | decimal(8,2) |
| is_free | boolean |
| support_acts | json |
| flyer_path | string |
| status | string |
| position | int |
| created_at | timestamp |
| updated_at | timestamp |

---

## releases

| Field | Type |
|----|----|
| id | bigint |
| artist_page_id | bigint |
| title | string |
| release_date | date |
| url | string |
| cover_path | string |
| release_type | string |
| is_featured | boolean |
| position | int |
| created_at | timestamp |
| updated_at | timestamp |

---

## featured_tracks

| Field | Type |
|----|----|
| id | bigint |
| artist_page_id | bigint |
| title | string |
| artist_name | string |
| platform | string |
| platform_url | string |
| embed_id | string |
| position | int |
| created_at | timestamp |
| updated_at | timestamp |

---

## videos

| Field | Type |
|----|----|
| id | bigint |
| artist_page_id | bigint |
| title | string |
| platform | string |
| video_id | string |
| url | string |
| description | text |
| thumbnail_url | string |
| is_featured | boolean | default false |
| position | int |
| created_at | timestamp |
| updated_at | timestamp |

---

## gallery_images

| Field | Type |
|----|----|
| id | bigint |
| artist_page_id | bigint |
| title | string |
| image_path | string |
| position | int |
| created_at | timestamp |
| updated_at | timestamp |

---

# ===============================
# V2 - Stage System
# ===============================

V2 extends Vibaro with a spotlight-centered performance model.

Guiding principles:
- server-side tracking
- no personal profiles
- no fingerprints
- tracking is contextualized through spotlight

---

## spotlights

| Field | Type | Notes |
|----|----|----|
| id | bigint | PK |
| artist_page_id | bigint | FK -> artist_pages.id |
| title | string | Publicly visible, can be changed |
| slug | string | **Stable**, generated once, unique, url-safe |
| type | string | e.g. `release`, `tour`, `single`, `merch` |
| status | string | `active` \| `scheduled` \| `ended` |
| starts_at | datetime | nullable |
| ends_at | datetime | nullable |
| primary_url | string | nullable |
| cover_image_url | string | nullable, auto-filled via oEmbed (Spotify, YouTube, etc.) |
| artist_name | string | nullable, auto-filled via oEmbed or manually |
| platform_name | string | nullable, auto-detected from URL (e.g. "Spotify", "YouTube") |
| description | text | nullable |
| subtitle | string(500) | nullable, additional line under title |
| cta_label | string(100) | nullable, overrides default CTA text |
| secondary_cta_url | string(1000) | nullable, second CTA link |
| secondary_cta_label | string(100) | nullable, label for second CTA |
| background_image_url | string(1000) | nullable, custom hero background |
| meta | jsonb | nullable, type-specific additional data (see below) |
| show_on_page | boolean | default true, controls hero banner |
| archived_at | timestamp | nullable, soft delete |
| created_at | timestamp | |
| updated_at | timestamp | |

**meta (jsonb) - type-specific fields**
| Type | Possible keys | Example |
|----|----|----|
| album | track_count | `{"track_count": 12}` |
| video | duration | `{"duration": "4:32"}` |
| tour | city_count, country_count | `{"city_count": 15, "country_count": 4}` |
| event | venue, date | `{"venue": "Wacken", "date": "2026-08-06"}` |
| livestream | stream_date | `{"stream_date": "2026-03-15T20:00:00Z"}` |
| collab | partner_name | `{"partner_name": "Meshuggah"}` |
| single | *(none)* | `{}` |
| merch | *(none)* | `{}` |

**Rules**
- Maximum one `active` spotlight per artist_page.
- DB enforcement: partial unique index on `(artist_page_id)` for rows with `status = 'active'` and `archived_at IS NULL`.
- `ends_at` must not be earlier than `starts_at`.
- **slug is the stable campaign identity** - title changes do not affect analytics.
- slug is generated on creation (lowercase, url-safe, unique).
- `show_on_page = true` + `status = active` + `archived_at IS NULL` -> hero banner visible on public page.
- Archiving an active spotlight normalizes status to `ended`, sets `ends_at` if needed, and removes it from the hero state.
- Archiving (`archived_at`) removes spotlight from Studio views but does not delete tracking links or click events.

---

## campaigns (Stage Pro)

| Field | Type |
|----|----|
| id | bigint |
| artist_page_id | bigint |
| spotlight_id | bigint | nullable |
| name | string |
| platform | string | nullable |
| notes | text | nullable |
| starts_at | datetime | nullable |
| ends_at | datetime | nullable |
| created_at | timestamp |
| updated_at | timestamp |

**Rules**
- campaign_id is optional for tracking_links.
- spotlight_id is optional - campaigns can be global or spotlight-specific.

---

## tracking_links

| Field | Type | Notes |
|----|----|----|
| id | bigint | PK |
| artist_page_id | bigint | FK -> artist_pages.id |
| spotlight_id | bigint | FK -> spotlights.id |
| campaign_id | bigint | nullable, (Stage Pro, future) |
| platform | string | e.g. `instagram`, `tiktok`, `email`, `spotify` |
| placement | string | e.g. `story`, `bio`, `post`, `reel`, `newsletter` |
| label | string | nullable, publicly visible (e.g. "Listen now") |
| target_url | string | destination URL |
| short_code | string | unique, public identifier (8 chars) |
| utm_source | string | server-generated |
| utm_medium | string | server-generated |
| utm_campaign | string | **spotlight.slug** (stable) |
| utm_content | string | nullable |
| utm_term | string | nullable |
| click_count | integer | default 0, only atomically incremented |
| archived_at | timestamp | nullable, soft delete |
| created_at | timestamp | |
| updated_at | timestamp | |

**Indexes**
- unique(short_code)
- index(artist_page_id)
- index(spotlight_id)
- **Partial unique index**: (spotlight_id, platform, placement) WHERE archived_at IS NULL

**Rules**
- Public tracking route uses only `short_code`.
- target_url is validated server-side (http/https only).
- **No duplicates**: Per spotlight, there can be only one active link per (platform, placement).
- Archiving does not delete click history.
- **utm_campaign is always based on spotlight.slug**, not spotlight.title.
- click_count is a cache for performance (top lists); real analytics are based on click_events.
- **click_count counts only clicks not classified as preview** (`is_preview = false`). Preview bots (WhatsApp, Telegram, Facebook link crawler, etc.) are stored as ClickEvents but do not increment `click_count`. Therefore, `click_count` can be lower than the total number of ClickEvents for the same link.

---

## click_events

| Field | Type |
|----|----|
| id | bigint |
| tracking_link_id | bigint |
| artist_page_id | bigint |
| spotlight_id | bigint |
| campaign_id | bigint |
| module | string |
| referrer_host | string |
| country_code | string (optional, derived transiently from IP; IP is never stored) |
| user_agent_hash | string (optional, abuse-only) |
| visitor_key_hash | string (optional, privacy-aware dedupe key for pageview unique metrics) |
| occurred_at | datetime |
| created_at | timestamp |

**Privacy Rules**
- IP addresses must never be stored.
- IP may be used transiently to derive country_code, but must not be persisted.
- No fingerprinting.
- No personal user profiles.

**Unique Visitor Limitation (MVP)**
- `unique_pageviews` and `visitors` are deduplicated via a privacy-aware visitor key (UA hash + coarse IP bucket + primary language; legacy fallback: `user_agent_hash`).
- This is still a **coarse heuristic**: collisions and false splits remain possible, so these values are only trend-suitable.
- Consequence: conversion metrics remain approximations and must not be interpreted as robust attribution.
- **MVP only.** A more robust model is required for Stage Pro / Insights (e.g. server-generated session tokens without personal data).

---

## Optional: daily_rollups

| Field | Type |
|----|----|
| id | bigint |
| artist_page_id | bigint |
| date | date |
| spotlight_id | bigint |
| campaign_id | bigint |
| module | string |
| referrer_host | string |
| clicks | int |
| created_at | timestamp |
| updated_at | timestamp |

---

# Binding Rules

- FK constraints must always be active.
- Public queries must never expose internal IDs.
- New development must align with PRODUCT_V2.md.

---

# V1 -> V2 Consolidation Plan

## Current Status

V1 (mini-homepage) and V2 (stage system) currently run in parallel in schema and API. This is intentional for the MVP transition phase.

## What Is the Source of Truth

| Area | Leading version | Rationale |
|---|---|---|
| Spotlight / Phase / Analytics | **V2** | Active product |
| TrackingLinks, ClickEvents, PageViews | **V2** | Active product |
| Artist page metadata | **V1 + V2 mixed** | `contacts` array is the new SoT, legacy fields remain compatible |
| Links, Shows, Releases, Videos, Gallery | **V1** | Still active, no V2 equivalent planned |
| `focus_type` | **Legacy / deprecated** | No longer in product, field remains in schema but is no longer populated |

## Rules for New Features

- **New features go exclusively into V2 structures** (spotlights, tracking links, click events).
- V1 fields are not expanded; they are only kept compatible.
- New API endpoints follow V2 conventions and contracts.

## Exit Condition for V1

V1 fields and logic are removed only when:
1. The V2 equivalent is stable and in use.
2. No active users still have V1-only data.
3. An explicit migration plan exists (including backfill migration).

Until then: **do not actively delete V1 code, but also do not expand it.**
