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
    "releases": []
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
