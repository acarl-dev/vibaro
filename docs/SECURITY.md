# Vibaro Security

Diese Datei definiert die Sicherheitsregeln für Vibaro (Web + API).
Sie ist verbindlich für Implementierung, Reviews und Copilot.

---

## 1) Grundprinzipien

- **Public by default** gilt nur für veröffentlichte Artist Pages (`is_published = true`).
- Alles andere ist **private** und benötigt Auth.
- Web (apps/web) greift **nie direkt** auf DB zu. Nur über API.
- Keine sensiblen Daten in Public Responses.

---

## 2) Authentifizierung (MVP)

### Empfohlenes MVP-Modell
- Token-basierte Auth (Sanctum Token oder ähnliches)
- Token wird im Frontend **nicht** in LocalStorage gespeichert.
- Speicherung idealerweise als **HttpOnly Cookie** (z.B. über Next Route Handler), oder alternativ in Memory (kurze Sessions).

### Regeln
- Passwort-Hashing: Laravel Standard (bcrypt/argon).
- Rate Limit für Login/Register.
- E-Mail bleibt private Information.

---

## 3) Autorisierung (Policies)

- Jede private Ressource muss per Policy abgesichert sein.
- `artist_pages`:
  - **Nur Owner** darf lesen/ändern/publishen.
- Public Endpoint `/api/v1/p/{handle}`:
  - darf nur veröffentlichte Daten ausliefern
  - niemals `user_id`, `email`, interne IDs des Users

---

## 4) CORS & Cookies

### CORS-Regeln
- Nur erlaubte Origins:
  - dev: `http://localhost:3000`
  - prod: `https://app.<domain>` und ggf. `https://<domain>`
- Keine Wildcards in Production.
- Wenn Cookies genutzt werden: `supports_credentials = true`.

### Cookies (falls verwendet)
- `HttpOnly`, `Secure` (prod), `SameSite=Lax` oder passendes Modell.
- In Prod niemals `SameSite=None` ohne Bedarf.

---

## 5) Input Validation (API)

- Jede schreibende Route validiert Input strikt.
- Keine ungeprüften `mass assignment` Updates:
  - `$fillable` sauber pflegen
  - oder DTO/Request Klassen nutzen
- Validation Errors müssen dem Standard aus `CONVENTIONS.md` folgen.

---

## 6) Rate Limiting & Abuse Protection

- Rate Limits (mindestens):
  - `POST /auth/login`
  - `POST /auth/register`
  - Public Page Endpoint `/p/{handle}` (light)
- Optional später:
  - per-IP + per-handle Limits
- Schutz vor Enumeration:
  - Handle ist public, aber keine “user lookup” endpoints.

---

## 7) File Upload Security (Bilder)

### Regeln
- Nur Bilder: `jpg`, `png`, `webp` (optional `avif` später)
- Max-Größe (MVP): z.B. 5 MB
- MIME-Type prüfen + Server-seitige Prüfung (nicht nur Client)
- Dateinamen nie vom User übernehmen (UUID verwenden)
- Bilder serverseitig neu encoden (empfohlen), um Payloads zu entfernen
- Keine direkten Uploads in public webroot ohne Kontrolle

### Storage
- Prefer S3-compatible Object Storage.
- URLs signieren oder über CDN ausliefern.
- Keine internen Pfade in Responses.

---

## 8) XSS / Content Safety

- Artist Bio ist User-Content:
  - als Plain Text behandeln
  - HTML nicht erlauben (MVP)
  - bei Ausgabe immer escapen
- Links:
  - URL validieren (scheme http/https)
  - optional: allowlist für bekannte Provider später

---

## 9) CSRF

- Wenn Token Auth: CSRF-Risiko geringer, aber sichere Cookie-Strategie beachten.
- Wenn Cookie-Session Auth genutzt wird:
  - CSRF Protection aktiv halten
  - Sanctum/Cookie Setup korrekt konfigurieren
  - CORS + SameSite exakt prüfen

---

## 10) Secrets & Konfiguration

- Niemals Secrets committen:
  - `.env` ist verboten im Git
  - nur `.env.example`
- Rotationsfähigkeit:
  - Stripe Keys etc. müssen austauschbar sein
- In Logs:
  - keine Tokens
  - keine Passwörter
  - keine kompletten Request Bodies

---

## 11) Logging, Monitoring, Alerts

- Error Tracking empfohlen:
  - Sentry (web + api)
- Logs:
  - API: strukturierte Logs (MVP reicht Standard)
- Uptime Monitoring (später):
  - mindestens API Healthcheck

---

## 12) Daten-Minimierung (Public vs Private)

### Public (erlaubt)
- handle
- display_name
- bio
- images (public URLs)
- links/shows/releases (wenn veröffentlicht)
- theme key/variant + accent_color

### Private (niemals public)
- email
- user_id
- interne IDs des Users
- tokens
- billing/status intern (später)

---

## 13) “Never do” Liste

- ❌ Tokens in LocalStorage speichern
- ❌ CORS `*` in Production
- ❌ Uploads ohne MIME/Size Check
- ❌ HTML in Bio ohne Sanitizing
- ❌ Public endpoints, die Userdaten leaken (email/user_id)
- ❌ `node_modules` oder `vendor` committen
