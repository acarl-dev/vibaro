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
| trial_ends_at | timestamp | nullable. Gesetzt bei Registrierung. Null = Probezeit abgelaufen oder nie gestartet. |
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
| logo_path | string | nullable |
| hero_focal_x | integer | nullable, 0–100, default 50. Horizontaler Fokuspunkt des Hero-Bilds. |
| hero_focal_y | integer | nullable, 0–100, default 35. Vertikaler Fokuspunkt des Hero-Bilds. |
| theme_key | string | aktuell nur `modern` |
| theme_variant | string | aktuell nur `auto` |
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

**Indizes**
- unique(handle)
- index(user_id)

**Wichtig**
- Legacy-Kontaktfelder (`booking_email` etc.) bleiben im Schema für die Studio-Settings erhalten.
- Das `contacts`-Array ist die neue Source of Truth für die Public Page. Die API baut es aus `contacts` (falls gesetzt) oder fällt auf die Legacy-Felder zurück.
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
| is_featured | boolean | default false |
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

| Feld | Typ | Hinweise |
|----|----|----|
| id | bigint | PK |
| artist_page_id | bigint | FK → artist_pages.id |
| title | string | Öffentlich sichtbar, kann geändert werden |
| slug | string | **Stabil**, einmalig generiert, unique, url-safe |
| type | string | z.B. `release`, `tour`, `single`, `merch` |
| status | string | `active` \| `scheduled` \| `ended` |
| starts_at | datetime | nullable |
| ends_at | datetime | nullable |
| primary_url | string | nullable |
| cover_image_url | string | nullable, auto-gefüllt via oEmbed (Spotify, YouTube, etc.) |
| artist_name | string | nullable, auto-gefüllt via oEmbed oder manuell |
| platform_name | string | nullable, auto-erkannt aus URL (z.B. "Spotify", "YouTube") |
| description | text | nullable |
| subtitle | string(500) | nullable, ergänzende Zeile unter Titel |
| cta_label | string(100) | nullable, überschreibt den Standard-CTA-Text |
| secondary_cta_url | string(1000) | nullable, zweiter CTA Link |
| secondary_cta_label | string(100) | nullable, Label für zweiten CTA |
| background_image_url | string(1000) | nullable, Custom Hero-Hintergrund |
| meta | jsonb | nullable, typ-spezifische Zusatzdaten (siehe unten) |
| show_on_page | boolean | default true, steuert Hero-Banner |
| archived_at | timestamp | nullable, soft delete |
| created_at | timestamp | |
| updated_at | timestamp | |

**meta (jsonb) – typ-spezifische Felder**
| Type | Mögliche Keys | Beispiel |
|----|----|----|
| album | track_count | `{"track_count": 12}` |
| video | duration | `{"duration": "4:32"}` |
| tour | city_count, country_count | `{"city_count": 15, "country_count": 4}` |
| event | venue, date | `{"venue": "Wacken", "date": "2026-08-06"}` |
| livestream | stream_date | `{"stream_date": "2026-03-15T20:00:00Z"}` |
| collab | partner_name | `{"partner_name": "Meshuggah"}` |
| single | *(keine)* | `{}` |
| merch | *(keine)* | `{}` |

**Regeln**
- Maximal ein `active` Spotlight pro artist_page.
- DB-Enforcement: Partial Unique Index auf `(artist_page_id)` für Zeilen mit `status = 'active'` und `archived_at IS NULL`.
- `ends_at` darf nicht kleiner als `starts_at` sein.
- **slug ist die stabile Campaign-Identität** – Titeländerung beeinflusst Analytics nicht.
- slug wird bei Erstellung generiert (lowercase, url-safe, unique).
- `show_on_page = true` + `status = active` + `archived_at IS NULL` → Hero-Banner sichtbar auf öffentlicher Seite.
- Archivierung eines aktiven Spotlights normalisiert den Status auf `ended`, setzt `ends_at` falls nötig und entfernt es aus dem Hero-Zustand.
- Archivierung (`archived_at`) entfernt Spotlight aus Studio-Ansichten, löscht aber keine TrackingLinks oder ClickEvents.

---

## campaigns (Stage Pro)

| Feld | Typ |
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

**Regeln**
- campaign_id ist optional für tracking_links.
- spotlight_id ist optional – Kampagnen können global oder Spotlight-spezifisch sein.

---

## tracking_links

| Feld | Typ | Hinweise |
|----|----|----|
| id | bigint | PK |
| artist_page_id | bigint | FK → artist_pages.id |
| spotlight_id | bigint | FK → spotlights.id |
| campaign_id | bigint | nullable, (Stage Pro, future) |
| platform | string | z.B. `instagram`, `tiktok`, `email`, `spotify` |
| placement | string | z.B. `story`, `bio`, `post`, `reel`, `newsletter` |
| label | string | nullable, öffentlich sichtbar (z.B. "Hör jetzt rein") |
| target_url | string | Ziel-URL |
| short_code | string | unique, Public identifier (8 chars) |
| utm_source | string | serverseitig generiert |
| utm_medium | string | serverseitig generiert |
| utm_campaign | string | **spotlight.slug** (stabil) |
| utm_content | string | nullable |
| utm_term | string | nullable |
| click_count | integer | default 0, nur atomar inkrementiert |
| archived_at | timestamp | nullable, soft delete |
| created_at | timestamp | |
| updated_at | timestamp | |

**Indizes**
- unique(short_code)
- index(artist_page_id)
- index(spotlight_id)
- **Partial Unique Index**: (spotlight_id, platform, placement) WHERE archived_at IS NULL

**Regeln**
- Öffentliche Tracking-Route verwendet nur `short_code`.
- target_url wird serverseitig validiert (http/https only).
- **Keine Duplikate**: Pro Spotlight kann es nur einen aktiven Link pro (platform, placement) geben.
- Archivierung löscht keine Click-Historie.
- **utm_campaign basiert immer auf spotlight.slug**, nicht auf spotlight.title.
- click_count is a Cache für Performance (Top-Listen), echte Analytics basieren auf click_events.
- **click_count zählt ausschließlich nicht als Preview klassifizierte Klicks** (`is_preview = false`). Preview-Bots (WhatsApp, Telegram, Facebook Link Crawler etc.) werden zwar als ClickEvent gespeichert, erhöhen aber `click_count` nicht. Deshalb kann `click_count` kleiner sein als die Gesamtzahl der ClickEvents für denselben Link.

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
| visitor_key_hash | string (optional, privacy-aware dedupe key for pageview unique metrics) |
| occurred_at | datetime |
| created_at | timestamp |

**Privacy Rules**
- IP addresses must never be stored.
- IP may be used transiently to derive country_code, but must not be persisted.
- No fingerprinting.
- No personal user profiles.

**Unique-Visitor-Einschränkung (MVP)**
- `unique_pageviews` und `visitors` werden über einen privacy-aware Visitor-Key dedupliziert (UA-Hash + coarse IP bucket + primäre Sprache; legacy fallback: `user_agent_hash`).
- Das ist weiterhin eine **grobe Heuristik**: Kollisionen und Fehltrennungen bleiben möglich, daher sind die Werte nur trendtauglich.
- Folge: Conversion-Metriken bleiben Approximationen und sind nicht als belastbare Attribution zu interpretieren.
- **MVP-only.** Für Stage Pro / Insights ist ein robusteres Modell notwendig (z.B. serverseitig generierte Session-Token ohne personenbezogene Daten).

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

---

# V1 → V2 Konsolidierungsplan

## Aktueller Status

V1 (Mini-Homepage) und V2 (Stage System) laufen im Schema und in der API parallel. Das ist für die MVP-Übergangsphase bewusst so.

## Was ist Source of Truth

| Bereich | Führende Version | Begründung |
|---|---|---|
| Spotlight / Phase / Analytics | **V2** | Aktives Produkt |
| TrackingLinks, ClickEvents, PageViews | **V2** | Aktives Produkt |
| Artist Page Metadaten | **V1 + V2 gemischt** | `contacts`-Array ist neue SoT, Legacy-Felder bleiben kompatibel |
| Links, Shows, Releases, Videos, Gallery | **V1** | Noch aktiv, kein V2-Äquivalent geplant |
| `focus_type` | **Legacy / abgekündigt** | Nicht mehr im Produkt, Feld lebt im Schema aber wird nicht mehr befüllt |

## Regeln für neue Features

- **Neue Features landen ausschließlich in V2-Strukturen** (Spotlights, TrackingLinks, ClickEvents).
- V1-Felder werden nicht erweitert; sie werden nur noch kompatibel gehalten.
- Neue API-Endpunkte folgen V2-Konventionen und Contracts.

## Exit-Bedingung für V1

V1-Felder und -Logik werden erst entfernt, wenn:
1. Das V2-Äquivalent stabil ist und genutzt wird.
2. Keine aktiven Nutzer mehr V1-only-Daten haben.
3. Ein expliziter Migrations-Plan existiert (inkl. Backfill-Migration).

Bis dahin gilt: **V1-Code nicht aktiv löschen, aber auch nicht erweitern.**
