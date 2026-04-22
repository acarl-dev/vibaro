# Vibaro Security

Status: current
Last verified: 2026-04-22
Scope: aktueller Ist-Zustand von Web (`apps/web`) und API (`apps/api`)

Diese Datei beschreibt die aktuell implementierten Sicherheitsregeln.
Zielbilder oder härtere Soll-Vorgaben gehören nicht hierher.

---

## 1) Grundprinzipien

- Öffentlich ist nur, was explizit als public Endpoint gedacht ist.
- Für Artist Pages bedeutet das aktuell: veröffentlicht (`is_published = true`) und ohne private Felder.
- `apps/web` greift nie direkt auf die Datenbank zu, sondern nur per HTTP auf `apps/api`.
- Öffentliche Responses dürfen keine privaten Benutzerfelder enthalten.

---

## 2) Authentifizierung: tatsächlicher Token-Fluss

Aktuell wird token-basierte Auth mit Laravel Sanctum Personal Access Tokens verwendet.

Der reale Login-/Register-Pfad ist:

```text
Browser -> Next.js Route Handler -> Laravel API -> Next.js Route Handler -> httpOnly Cookie
```

Wichtig dabei:

- Laravel `POST /api/v1/auth/login` und `POST /api/v1/auth/register` liefern aktuell `data.token` in ihrer JSON-Response.
- Dieser Token wird nicht an Browser-JavaScript weitergereicht, sondern im Next.js Route Handler gelesen und als `vibaro_token`-Cookie gesetzt.
- Die BFF-Responses an den Browser enthalten aktuell `user` und `next`, aber keinen Token.
- Der Token ist danach browserseitig nicht über Client-JS lesbar, weil der Cookie `httpOnly` gesetzt wird.

Die präzise Aussage für den Ist-Zustand lautet daher:

- Der Token ist nicht browserseitig lesbar.
- Der Token wird aber intern vom Laravel-Auth-Endpoint an die Next.js-BFF-Route ausgeliefert.

Nicht korrekt als Current-State wäre die Aussage, der Token tauche nirgends in einer API-Response auf.

---

## 3) BFF-Regel für authentifizierte Browser-Requests

Für Browser-Requests mit Auth gilt aktuell weiterhin die BFF-Regel:

```text
Browser -> Next.js Route Handler / server-only utility -> Laravel API
```

Das bedeutet:

- Client-Komponenten rufen für authentifizierte Aktionen Next.js-Endpunkte unter `/api/**` auf.
- Server-seitige authentifizierte Fetches laufen über `backendFetch()` und lesen den Cookie serverseitig.
- Der Browser soll keinen Bearer-Token kennen oder direkt an Laravel senden.

Nicht erlaubt:

- Tokens in `localStorage` oder `sessionStorage`
- ein Route Handler, der den Token wieder als JSON an den Browser herausgibt
- direkte Browser-Requests an Laravel mit Bearer-Token

---

## 4) Autorisierung und Sichtbarkeit

- Private Ressourcen laufen hinter `auth:sanctum`.
- Owner-Preview für unveröffentlichte Seiten läuft über `GET /api/v1/p/{handle}/preview` und benötigt Auth.
- Der öffentliche Endpoint `GET /api/v1/p/{handle}` darf nur veröffentlichte Daten ausliefern.

Private Felder dürfen nicht in Public Responses erscheinen, insbesondere:

- `email`
- `user_id`
- interne User-IDs oder Tokenwerte
- interne Billing-Informationen

Kontaktdaten bleiben privat, solange sie nicht explizit als veröffentlichte öffentliche Felder modelliert und abgesichert sind.

---

## 5) Cookies, CORS und Same-Origin-Verhalten

Aktuell relevant:

- Auth-Cookie: `vibaro_token`
- Cookie-Flags: `HttpOnly`, `SameSite=Lax`, `Secure` in Production
- Browser spricht im Regelfall mit derselben Next.js-Origin; Laravel wird für Auth-Fälle über BFF bzw. serverseitige Fetches angesprochen

Deshalb bleibt die CORS-Regel konservativ:

- keine Wildcards in Production
- nur explizit erlaubte Origins
- Credential-Handling nur dort aktivieren, wo es wirklich gebraucht wird

---

## 6) Input Validation und Schreibzugriffe

- Schreibende API-Routen validieren Input serverseitig.
- Responses für Fehler und Validierung müssen `CONVENTIONS.md` folgen.
- Ungeprüfte Massenupdates bleiben verboten.

---

## 7) Rate Limiting und Abuse Protection

Aktuell dokumentiert und im Routing sichtbar:

- strengeres Throttling für `POST /api/v1/auth/login` und `POST /api/v1/auth/register`
- Public-Rate-Limit für öffentliche Artist-Page- und Analytics-Endpoints

Schutzgedanke:

- keine öffentlichen User-Lookup-Endpoints
- keine vermeidbare Enumeration privater Daten

---

## 8) Upload- und Content-Sicherheit

- Uploads laufen nicht direkt vom Browser an Laravel mit Browser-Token, sondern über die Web-Schicht
- MIME-Type, Größe und Dateiname müssen serverseitig kontrolliert werden
- HTML in frei editierbaren Textfeldern ist im MVP nicht vorgesehen
- User-URLs müssen validiert werden

---

## 9) Secrets, Logs und Datenminimierung

- Keine Secrets im Git
- Keine Tokens oder Passwörter in Logs
- Public Responses nur mit den wirklich öffentlichen Feldern

---

## 10) Never-Do-Liste

- ❌ Tokens in Client-Storage speichern
- ❌ BFF umgehen, wenn Browser-Auth nötig ist
- ❌ Token-Re-Exposure über einen Next.js Route Handler
- ❌ CORS-Wildcards in Production
- ❌ Uploads ohne Server-Prüfung
- ❌ öffentliche Responses mit privaten Userdaten
