Ja 👍
Ich habe deine Datei **inhaltlich nicht verändert**, sondern **sauber strukturiert, korrigiert und als gültige Markdown-Datei** aufbereitet.
Du kannst sie **1:1 als `API_CONTRACTS.md` speichern**.

---

```md
# Vibaro API Contracts (v1)

Diese Datei ist die **verbindliche Quelle** für alle API-Endpunkte.  
Frontend (`apps/web`) und Backend (`apps/api`) müssen sich exakt daran halten.

Alle Responses folgen dem Standard aus `CONVENTIONS.md`.

---

## Base URLs

### Development
```

[http://localhost:8000](http://localhost:8000)

```

### Production
```

[https://api](https://api).<your-domain>

````

**API Prefix:** `/api/v1`

---

## Auth

### POST /auth/register
Registriert einen neuen User.

**Request**
```json
{
  "name": "Alan",
  "email": "alan@example.com",
  "password": "secret123"
}
````

---

### POST /auth/login

Login eines bestehenden Users.

**Request**

```json
{
  "email": "alan@example.com",
  "password": "secret123"
}
```

---

### POST /auth/logout

Auth required.

**Response**

```json
{
  "data": { "ok": true }
}
```

---

## GET /me

Auth required.
Wird für **Redirect- & Onboarding-Logik** genutzt.

**Response**

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

**Response**

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

---

### POST /artist-pages

Erstellt eine Artist Page
(MVP: **max. eine pro User**)

**Request**

```json
{
  "handle": "emily-j",
  "display_name": "Emily J."
}
```

---

### PATCH /artist-pages/{id}

Partial Updates erlaubt.

**Request**

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

**Validierung**

* `handle` vorhanden
* `display_name` vorhanden
* `bio` vorhanden

**Response**

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

**Response**

```json
{
  "data": {
    "is_published": false
  }
}
```

---

## Handle Check

### POST /handles/check

**Request**

```json
{
  "handle": "emily-j"
}
```

**Response**

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

**Query Parameters:**
- `q`: Search query (min 2 characters)

**Response**
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

**Use Case:** Autocomplete for Support Acts field

---

## Links / Shows / Releases (Private CRUD)

### Endpoints

* `/artist-pages/{id}/links`
* `/artist-pages/{id}/shows`
* `/artist-pages/{id}/releases`

### Standard CRUD

* `GET` – List
* `POST` – Create
* `PATCH /{resource_id}` – Update
* `DELETE /{resource_id}` – Delete

### Optional

* `POST /{resource}/reorder`

### Links Details

Bei ArtistPage-Erstellung werden automatisch vorgefertigte Social Media Links erstellt:
- instagram, facebook, tiktok, x, youtube, spotify, applemusic, soundcloud, bandcamp, website
- Diese haben anfangs `url: null`
- User trägt URLs im Dashboard ein
- **Nur Links mit ausgefüllten URLs werden öffentlich angezeigt**

**POST /artist-pages/{id}/links**
```json
{
  "type": "instagram",  // optional: facebook, tiktok, x, youtube, spotify, applemusic, soundcloud, bandcamp, website, custom
  "title": "Instagram",  // optional, wird automatisch gesetzt für bekannte types
  "url": "https://instagram.com/artist"  // optional, nullable
}
```

**PATCH /artist-pages/{id}/links/{linkId}**
```json
{
  "url": "https://instagram.com/artist"  // kann auch null sein um Link zu leeren
}
```

**Response**
```json
{
  "data": {
    "id": 1,
    "type": "instagram",
    "title": "Instagram",
    "url": "https://instagram.com/artist",
    "position": 0,
    "is_visible": true
  }
}
```

---

### Shows Details

**GET /artist-pages/{id}/shows**
Returns all shows for the artist page, sorted by `starts_at` ascending.

**Response**
```json
{
  "data": [
    {
      "id": 1,
      "starts_at": "2026-02-15T20:00:00Z",
      "venue": "Club XYZ",
      "city": "Berlin",
      "address": "Musterstraße 123, 10115 Berlin",
      "ticket_url": "https://tickets.com/show123",
      "price": 15.00,
      "is_free": false,
      "support_acts": ["Band A", "Band B"],
      "flyer_path": "/storage/flyers/abc123.jpg",
      "status": "upcoming",
      "position": 0
    }
  ]
}
```

**POST /artist-pages/{id}/shows**
```json
{
  "starts_at": "2026-02-15T20:00:00",
  "venue": "Club XYZ",
  "city": "Berlin",
  "address": "Musterstraße 123, 10115 Berlin",  // optional
  "ticket_url": "https://tickets.com/show123",  // optional
  "price": 15.00,  // optional, decimal
  "is_free": false,  // optional, boolean
  "support_acts": ["Band A", "Band B"]  // optional, array of strings
}
```

**PATCH /artist-pages/{id}/shows/{showId}**
```json
{
  "starts_at": "2026-02-15T21:00:00",
  "venue": "Updated Venue",
  "city": "Hamburg",
  "address": "Neue Straße 456",
  "ticket_url": null,
  "price": null,
  "is_free": true,
  "support_acts": null
}
```

**DELETE /artist-pages/{id}/shows/{showId}**
Returns 204 No Content on success.

**POST /artist-pages/{id}/shows/reorder**
```json
{
  "ids": [3, 1, 2]
}
```

**POST /artist-pages/{id}/shows/{showId}/upload-flyer**
Multipart form data:
- `flyer`: Image file (jpeg, jpg, png, webp, max 5MB)

Response:
```json
{
  "data": {
    "id": 1,
    "flyer_path": "flyers/abc123.jpg",
    "flyer_url": "https://api.example.com/storage/flyers/abc123.jpg"
  }
}
```

**DELETE /artist-pages/{id}/shows/{showId}/flyer**
Deletes the flyer image. Returns 204 No Content on success.

---

### Releases Details

**GET /artist-pages/{id}/releases**
Returns all releases for the artist page, sorted by `release_date` descending (newest first).

**Response**
```json
{
  "data": [
    {
      "id": 1,
      "title": "My New Album",
      "release_date": "2026-03-15",
      "url": "https://open.spotify.com/album/...",
      "cover_path": "covers/xyz789.jpg",
      "is_featured": true,
      "position": 0
    }
  ]
}
```

**POST /artist-pages/{id}/releases**
```json
{
  "title": "My New Album",
  "release_date": "2026-03-15",
  "url": "https://open.spotify.com/album/...",  // optional
  "is_featured": false  // optional, boolean
}
```

**PATCH /artist-pages/{id}/releases/{releaseId}**
```json
{
  "title": "Updated Album Title",
  "release_date": "2026-03-20",
  "url": "https://music.apple.com/album/...",
  "is_featured": true
}
```

**DELETE /artist-pages/{id}/releases/{releaseId}**
Deletes the release and its cover image if exists. Returns `{"data": {"ok": true}}`.

**POST /artist-pages/{id}/releases/reorder**
```json
{
  "release_ids": [3, 1, 2]
}
```

**POST /artist-pages/{id}/releases/{releaseId}/upload-cover**
Multipart form data:
- `cover`: Image file (jpeg, jpg, png, webp, max 5MB)

Response:
```json
{
  "data": {
    "id": 1,
    "cover_path": "covers/xyz789.jpg",
    "cover_url": "https://api.example.com/storage/covers/xyz789.jpg"
  }
}
```

**DELETE /artist-pages/{id}/releases/{releaseId}/cover**
Deletes the cover image. Returns 204 No Content on success.

---

### Featured Tracks Details

**GET /artist-pages/{id}/featured-tracks**
Returns all featured tracks for the artist page, sorted by `position` ascending.

**Response**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Lost in the City",
      "artist_name": null,
      "platform": "spotify",
      "platform_url": "https://open.spotify.com/track/ABC123",
      "embed_id": "ABC123",
      "position": 0
    },
    {
      "id": 2,
      "title": "Late Night Drive",
      "artist_name": "Emily J. ft. John Doe",
      "platform": "youtube",
      "platform_url": "https://www.youtube.com/watch?v=XYZ789",
      "embed_id": "XYZ789",
      "position": 1
    }
  ]
}
```

**POST /artist-pages/{id}/featured-tracks**
```json
{
  "title": "Lost in the City",
  "artist_name": null,  // optional
  "platform": "spotify",  // spotify | soundcloud | youtube
  "platform_url": "https://open.spotify.com/track/ABC123",
  "embed_id": null  // optional, auto-extracted if not provided
}
```

**PATCH /artist-pages/{id}/featured-tracks/{trackId}**
```json
{
  "title": "Lost in the City (Remix)",
  "artist_name": "Emily J. ft. Jane Smith",
  "platform": "spotify",
  "platform_url": "https://open.spotify.com/track/DEF456",
  "position": 2
}
```

**DELETE /artist-pages/{id}/featured-tracks/{trackId}**
Deletes the featured track. Returns 204 No Content.

**POST /artist-pages/{id}/featured-tracks/reorder**
```json
{
  "ids": [3, 1, 2]
}
```

---

## Public Artist Page

### GET /p/{handle}

Public, no auth.

**Behavior**

* `404` if handle unknown
* `404` if `is_published = false`
* Keine internen IDs

**Response**

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
    "focus": {
      "type": "links",
      "limit": 3
    },
    "links": [],
    "shows": [],
    "releases": [],
    "featured_tracks": [
      {
        "title": "Lost in the City",
        "artist_name": null,
        "platform": "spotify",
        "platform_url": "https://open.spotify.com/track/ABC123",
        "embed_id": "ABC123"
      }
    ]
  }
}
```

---

## Status Codes

* `200 OK`
* `201 Created`
* `401 Unauthorized`
* `403 Forbidden`
* `404 Not Found`
* `422 Validation Error`

---

## Regeln

* Keine HTML Responses
* Keine internen IDs in Public Responses
* Keine nicht dokumentierten Felder

```

---

### ✅ Ergebnis
- gültiges, sauberes Markdown  
- konsistent strukturiert  
- Copilot- & Team-tauglich  
- **keine inhaltlichen Überraschungen**

Wenn du willst, kann ich als Nächstes:
- eine **kurze Copilot-Anweisung** schreiben: *„Implementiere API exakt nach diesem Contract“*, oder
- die Datei gegen dein **Laravel Routing & Controller Setup spiegeln** (Check: fehlt noch was?).
```
