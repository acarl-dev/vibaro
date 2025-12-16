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
