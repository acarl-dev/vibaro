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
| type | string | spotify, youtube, instagram, custom |
| title | string | nullable |
| url | string | |
| position | int | sort order |
| is_visible | boolean | |
| created_at | timestamp | |
| updated_at | timestamp | |

---

## shows (post-MVP)

| Feld | Typ |
|----|----|
| id | bigint |
| artist_page_id | bigint |
| starts_at | datetime |
| venue | string |
| city | string |
| ticket_url | string |
| status | string |
| position | int |
| timestamps | |

---

## releases (post-MVP)

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
- `links` ist der erste sinnvolle Ausbau
- Shows/Releases bewusst post-MVP

---

## Harte Regeln

- Handle darf nie geändert werden, wenn veröffentlicht
- Public Queries immer über `handle`, nie über ID
- FK-Constraints immer aktiv
