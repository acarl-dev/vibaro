# Vibaro Data Model (V1 + V2)

This document contains:
- Legacy V1 data model (Mini-Homepage system)
- Active V2 extensions (Stage System)

Active product rules: docs/PRODUCT_V2.md

This file is the binding source for:
- Migrations
- Eloquent Models
- Policies
- API Responses

---

# ===============================
# V1 – Representation Layer
# ===============================

## users

Authentifizierte Benutzer.

| Feld | Typ | Hinweise |
|----|----|----|
| id | bigint | PK |
| name | string | |
| email | string | unique |
| password | string | hashed |
| is_admin | boolean | default false |
| created_at | timestamp | |
| updated_at | timestamp | |

---

## artist_pages

Zentrale Entität für Musiker-Seiten.

| Feld | Typ | Hinweise |
|----|----|----|
| id | bigint | PK |
| user_id | bigint | FK → users.id |
| handle | string | unique, lowercase, url-safe |
| display_name | string | öffentlich sichtbar |
| bio | text | nullable |
| avatar_path | string | nullable |
| header_path | string | nullable |
| theme_key | string | z.B. `dark-editorial` |
| theme_variant | string | z.B. `auto`, `stage-blue` |
| accent_mode | string | `auto` \| `manual` |
| accent_color | string | hex, nullable |
| booking_email | string | nullable, PRIVATE |
| management_email | string | nullable, PRIVATE |
| press_email | string | nullable, PRIVATE |
| whatsapp_number | string | nullable, PRIVATE |
| contact_message | string | nullable, max 500 |
| is_published | boolean | default false |
| published_at | timestamp | nullable |
| created_at | timestamp | |
| updated_at | timestamp | |

**Indizes**
- unique(handle)
- index(user_id)

**Wichtig**
- Kontaktfelder sind Studio-only und niemals Teil der Public API.
- Handle darf nicht geändert werden, wenn veröffentlicht.
- Public Queries erfolgen immer über handle, nie über ID.

---

## links

| Feld | Typ |
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

| Feld | Typ |
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

| Feld | Typ |
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

| Feld | Typ |
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

| Feld | Typ |
|----|----|
| id | bigint |
| artist_page_id | bigint |
| title | string |
| platform | string |
| video_id | string |
| url | string |
| description | text |
| thumbnail_url | string |
| position | int |
| created_at | timestamp |
| updated_at | timestamp |

---

## gallery_images

| Feld | Typ |
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
# V2 – Stage System
# ===============================

V2 erweitert Vibaro um ein Spotlight-zentriertes Performance-Modell.

Leitprinzipien:
- Server-side Tracking
- Keine personenbezogenen Profile
- Keine Fingerprints
- Tracking ist kontextualisiert über Spotlight

---

## spotlights

| Feld | Typ |
|----|----|
| id | bigint |
| artist_page_id | bigint |
| title | string |
| type | string |
| status | string (`active` \| `scheduled` \| `ended`) |
| starts_at | datetime |
| ends_at | datetime |
| primary_url | string |
| description | text |
| created_at | timestamp |
| updated_at | timestamp |

**Regeln**
- Maximal ein `active` Spotlight pro artist_page.
- `ends_at` darf nicht kleiner als `starts_at` sein.

---

## campaigns (Stage Pro)

| Feld | Typ |
|----|----|
| id | bigint |
| artist_page_id | bigint |
| spotlight_id | bigint |
| name | string |
| platform | string |
| notes | text |
| starts_at | datetime |
| ends_at | datetime |
| created_at | timestamp |
| updated_at | timestamp |

---

## tracking_links

| Feld | Typ |
|----|----|
| id | bigint |
| artist_page_id | bigint |
| spotlight_id | bigint |
| campaign_id | bigint |
| module | string |
| label | string |
| target_url | string |
| slug | string (unique) |
| utm_source | string |
| utm_medium | string |
| utm_campaign | string |
| utm_content | string |
| utm_term | string |
| is_active | boolean |
| created_at | timestamp |
| updated_at | timestamp |

**Regeln**
- Öffentliche Tracking-Route verwendet nur `slug`.
- target_url wird serverseitig validiert (http/https only).

---

## click_events

| Feld | Typ |
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
| occurred_at | datetime |
| created_at | timestamp |

**Privacy Rules**
- IP addresses must never be stored.
- IP may be used transiently to derive country_code, but must not be persisted.
- No fingerprinting.
- No personal user profiles.

---

## Optional: daily_rollups

| Feld | Typ |
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
