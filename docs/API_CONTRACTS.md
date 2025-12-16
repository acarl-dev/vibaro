# Vibaro API Contracts (v1)

Diese Datei ist die **verbindliche Quelle** für alle API-Endpunkte.
Frontend (apps/web) und Backend (apps/api) müssen sich exakt daran halten.

Alle Responses folgen dem Standard aus `CONVENTIONS.md`.

---

## Base URLs

### Development
http://localhost:8000

### Production
https://api.<your-domain>

---

## Auth

### POST /api/v1/auth/register
Registriert einen neuen User.

**Request**
```json
{
  "name": "Alan",
  "email": "alan@example.com",
  "password": "secret123"
}
Response

json
Code kopieren
{
  "data": {
    "user": {
      "id": 1,
      "name": "Alan",
      "email": "alan@example.com"
    },
    "token": "api-token-string"
  }
}
POST /api/v1/auth/login
Login eines bestehenden Users.

Request

json
Code kopieren
{
  "email": "alan@example.com",
  "password": "secret123"
}
Response

json
Code kopieren
{
  "data": {
    "user": {
      "id": 1,
      "name": "Alan",
      "email": "alan@example.com"
    },
    "token": "api-token-string"
  }
}
POST /api/v1/auth/logout
Auth erforderlich.

Response

json
Code kopieren
{
  "data": { "ok": true }
}
GET /api/v1/me
Gibt den aktuell eingeloggten User zurück.

Auth: required

Response

json
Code kopieren
{
  "data": {
    "id": 1,
    "name": "Alan",
    "email": "alan@example.com"
  }
}
Artist Pages (Private)
GET /api/v1/artist-pages/me
Gibt die eigene Artist Page zurück.

Auth: required

Response

json
Code kopieren
{
  "data": {
    "id": 10,
    "handle": "emily-j",
    "display_name": "Emily J.",
    "bio": "Independent artist from Berlin",
    "theme_key": "dark-editorial",
    "theme_variant": "auto",
    "accent_color": null,
    "is_published": true
  }
}
POST /api/v1/artist-pages
Erstellt eine neue Artist Page (MVP: max. eine pro User).

Auth: required

Request

json
Code kopieren
{
  "handle": "emily-j",
  "display_name": "Emily J."
}
Response

json
Code kopieren
{
  "data": {
    "id": 10,
    "handle": "emily-j",
    "display_name": "Emily J.",
    "is_published": false
  }
}
PATCH /api/v1/artist-pages/{id}
Aktualisiert eine Artist Page.

Auth: required
Partial Updates erlaubt

Request

json
Code kopieren
{
  "bio": "New bio text",
  "avatar_path": "/path/to/avatar.jpg",
  "theme_key": "dark-editorial",
  "theme_variant": "stage-blue",
  "accent_mode": "manual",
  "accent_color": "#7F8FA3"
}
Response

json
Code kopieren
{
  "data": {
    "id": 10,
    "handle": "emily-j",
    "display_name": "Emily J.",
    "bio": "New bio text",
    "avatar_path": "/path/to/avatar.jpg",
    "theme_key": "dark-editorial",
    "theme_variant": "stage-blue",
    "accent_color": "#7F8FA3",
    "is_published": false,
    "published_at": null
  }
}

POST /api/v1/artist-pages/{id}/publish
Veröffentlicht eine Artist Page.

Auth: required

Setzt `is_published = true` und `published_at = now()`.

Validierung:
- Handle muss vorhanden sein
- Display Name muss vorhanden sein
- Bio muss vorhanden sein

Response

json
Code kopieren
{
  "data": {
    "id": 10,
    "handle": "emily-j",
    "display_name": "Emily J.",
    "bio": "Independent artist from Berlin",
    "theme_key": "dark-editorial",
    "theme_variant": "auto",
    "accent_color": null,
    "is_published": true,
    "published_at": "2025-12-16T10:30:00Z"
  }
}

POST /api/v1/handles/check
Prüft die Verfügbarkeit eines Handles.

Auth: required

Request

json
Code kopieren
{
  "handle": "emily-j"
}
Response

json
Code kopieren
{
  "data": {
    "handle": "emily-j",
    "available": true
  }
}

Hinweise
- `accent_mode` ist optional im Request (`auto` | `manual`); wird nicht in Responses ausgegeben.
- Wenn `accent_mode = manual`, ist `accent_color` Pflicht; bei `auto` ist `accent_color` immer null.
- `published_at` ist nullable und wird nur gesetzt, wenn die Seite veröffentlicht wird.
Public Artist Page
GET /api/v1/p/{handle}
Öffentliche, nicht-authentifizierte Ansicht.

Response

json
Code kopieren
{
  "data": {
    "handle": "emily-j",
    "display_name": "Emily J.",
    "bio": "Independent artist from Berlin",
    "images": {
      "avatar_url": "https://cdn...",
      "header_url": "https://cdn..."
    },
    "links": [],
    "shows": [],
    "releases": [],
    "theme": {
      "key": "dark-editorial",
      "variant": "auto",
      "accent_color": null
    }
  }
}
Status Codes
200 OK

201 Created

401 Unauthorized

403 Forbidden

404 Not Found

422 Validation Error

Regeln
Keine internen IDs (user_id) in Public Responses

Keine HTML Responses

Keine nicht dokumentierten Felder
