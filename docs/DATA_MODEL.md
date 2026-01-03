# Vibaro Data Model (MVP)

Diese Datei beschreibt das **verbindliche Datenmodell** für Vibaro.
Sie ist Grundlage für Migrations, Policies und API-Responses.

---

## users

Authentifizierte Benutzer.

| Feld | Typ | Hinweise |
|----|----|----|
| id | bigint | PK |
| name | string | |
| email | string | unique |
| password | string | hashed |
| is_admin | boolean | default false, internes Flag |
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
| is_published | boolean | default false |
| published_at | timestamp | nullable, gesetzt beim ersten Publish |
| created_at | timestamp | |
| updated_at | timestamp | |

**Indizes**
- unique(handle)
- index(user_id)

---

## links (optional im MVP, empfohlen)

| Feld | Typ | Hinweise |
|----|----|----|
| id | bigint | PK |
| artist_page_id | bigint | FK |
| type | string | facebook, instagram, tiktok, x, youtube, spotify, applemusic, soundcloud, bandcamp, website, custom |
| title | string | nullable |
| url | string | nullable (für Social Media vorgefertigt) |
| position | int | sort order |
| is_visible | boolean | |
| created_at | timestamp | |
| updated_at | timestamp | |

**type-Werte:**
- Social Media: `facebook`, `instagram`, `tiktok`, `x` (Twitter)
- Music Platforms: `youtube`, `spotify`, `applemusic`, `soundcloud`, `bandcamp`
- Other: `website`, `custom`

**Verhalten:**
- Bei ArtistPage-Erstellung werden vorgefertigte Social Media Links mit leeren URLs erstellt
- Nur Links mit ausgefüllten URLs werden öffentlich angezeigt
- Vorgefertigte Links haben feste titles basierend auf `type`

---

## shows

| Feld | Typ | Hinweise |
|----|----|-------|
| id | bigint | PK |
| artist_page_id | bigint | FK → artist_pages.id |
| starts_at | datetime | Konzertbeginn |
| venue | string | Ort/Location |
| city | string | Stadt |
| address | text | nullable, vollständige Adresse für Routenplanung |
| ticket_url | string | nullable |
| price | decimal(8,2) | nullable, Eintrittspreis in € |
| is_free | boolean | default false, true = freier Eintritt |
| support_acts | json | nullable, Array von Artist-Namen/Handles |
| flyer_path | string | nullable, Pfad zum Flyer-Bild |
| status | string | `upcoming` \| `sold_out` \| `cancelled` |
| position | int | sortierung |
| created_at | timestamp | |
| updated_at | timestamp | |

**Indizes:**
- index(artist_page_id)
- index(starts_at) für chronologische Sortierung

**Verhalten:**
- Standard-Sortierung nach `starts_at` (aufsteigend für kommende Shows)
- `address` wird für Google Maps Routenplanung verwendet
- `is_free` überschreibt `price` - wenn true, wird `price` ignoriert
- `support_acts` ist ein JSON-Array von Strings (Artist-Namen), später erweitert um Vibaro-Verlinkung
- Optional: Flyer-Upload ähnlich wie Avatar/Hero

---

## releases

| Feld | Typ |
|----|----|
| id | bigint |
| artist_page_id | bigint |
| title | string |
| release_date | date |
| url | string | nullable |
| cover_path | string | nullable |
| is_featured | boolean |
| position | int |
| timestamps | |

**Indizes:**
- index(artist_page_id)
- index(artist_page_id, release_date) für chronologische Sortierung

**Verhalten:**
- Standard-Sortierung nach `release_date` (absteigend für neueste zuerst)
- `url` sollte auf Streaming-Plattformen verweisen (Spotify, Apple Music, etc.)
- `is_featured` kann für hervorgehobene Releases verwendet werden
- Cover-Upload ähnlich wie Flyer/Avatar

---

## releases (entfernt - post-MVP)

| Feld | Typ |
|----|----|

| id | bigint |
| artist_page_id | bigint |
| title | string |
| release_date | date |
| url | string |
| cover_path | string |
| is_featured | boolean |
| position | int |
| timestamps | |

---

## Beziehungen

- User **hasOne** ArtistPage
- ArtistPage **belongsTo** User
- ArtistPage **hasMany** Links
- ArtistPage **hasMany** Shows
- ArtistPage **hasMany** Releases

---

## MVP Notes

- MVP kann mit `users` + `artist_pages` starten
- `links`, `shows` und `releases` sind nun implementiert
- Weitere Features (z.B. AI, erweiterte Plans) post-MVP

---

## Harte Regeln

- Handle darf nie geändert werden, wenn veröffentlicht
- Public Queries immer über `handle`, nie über ID
- FK-Constraints immer aktiv
