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

## 2) Authentifizierung: Auth-Architektur und Token-Fluss

### Bewusstes Modell: Bearer-Token im httpOnly Cookie via BFF

Vibaro verwendet **kein klassisches Sanctum-Session/CSRF-Cookie-Modell**, sondern ein bewusstes BFF-Muster:

| Eigenschaft | Klassisch (Session/CSRF) | Vibaro (Bearer via BFF) |
|---|---|---|
| Token-Typ | Session-Cookie + CSRF-Token | Sanctum Personal Access Token |
| Token-Speicherort | Server-Session + Browser-Cookie | httpOnly Cookie (`vibaro_token`) |
| Authorization-Header | keiner (Cookie automatisch) | Bearer-Token, nur serverseitig gesetzt |
| Wer setzt den Header | Laravel intern | ausschließlich `backendFetch()` |
| Browser-JS-Zugriff auf Token | nein | nein |

**Warum kein klassisches Session-Modell:**
- Sanctum-Session-Auth erfordert `cookie`-Middleware und SPA-Domain-Konfiguration, die für das BFF-Muster überflüssige Komplexität erzeugt.
- Personal Access Tokens funktionieren stateless; die Next.js-BFF-Schicht übernimmt die Zustandshaltung im httpOnly Cookie.
- Das Modell bleibt erweiterbar (zukünftige Token-Rotation, Multi-Device-Sessions) ohne Laravel-Session-Infrastruktur.

### Token-Fluss

```text
Browser -> Next.js Route Handler (BFF) -> Laravel API
                                                 |
                              Token in JSON-Response (server-only)
                                                 |
                    Next.js setzt httpOnly Cookie <- 
                    Browser erhält: { user, next } (kein Token)
```

Präzise Aussagen für den Ist-Zustand:

- Laravel `POST /api/v1/auth/login` und `POST /api/v1/auth/register` liefern `data.token` in der JSON-Response — aber nur an den Next.js Route Handler, nicht an den Browser.
- Dieser Token wird im Route Handler gelesen und als `vibaro_token`-Cookie mit `HttpOnly` gesetzt.
- Die BFF-Response an den Browser enthält `user` und `next`, aber keinen Token.
- Der Token ist für Browser-JavaScript nicht lesbar.

### Zwingend geltende Regeln

Diese Regeln sind nicht optional:

1. **Token darf nie an Browser-JS gelangen.** Kein Route Handler darf den Token als JSON-Feld zurückgeben.
2. **Nur `backendFetch()` darf den Authorization-Header setzen.** Direkte `fetch()`-Aufrufe mit manuellem `Authorization: Bearer ...` in Route Handlern sind verboten — ausgenommen die initialen Auth-Endpunkte (`/auth/login`, `/auth/register`, `/auth/logout`), die den Token noch nicht aus dem Cookie lesen können.
3. **Kein direkter Laravel-Aufruf aus Client Components.** Authentifizierte Requests aus Client Components laufen immer über einen Next.js-BFF-Endpunkt unter `/api/...`.
4. **`backendFetch()` ist server-only.** Die Datei `apps/web/src/lib/api/backend.ts` enthält `import "server-only"` — sie darf nicht in Client Components importiert werden.
5. **Token nie in Client-Storage.** `localStorage`, `sessionStorage` und explizite Cookies per Client-JS sind verboten.

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

## 8a) SSRF-Schutz für serverseitige Remote-Fetches

Bestimmte Services holen Metadaten oder Inhalte von nutzergegebenen oder oEmbed-zurückgegebenen URLs serverseitig ab (`ReleaseMetadataService`, `MetadataService`). Alle solchen Fetches laufen über `SafeHttpService`.

### Implementierte Maßnahmen

| Maßnahme | Umsetzung |
|---|---|
| Nur `http` / `https` erlaubt | Scheme-Check in `SafeHttpService::isAllowed()` und in `MetadataService::fetchFromUrl()` |
| Private / reservierte IP-Ranges blockiert | `FILTER_FLAG_NO_PRIV_RANGE \| FILTER_FLAG_NO_RES_RANGE` + DNS-Auflösung aller A/AAAA-Records |
| Redirect-Guard | Jeder Redirect-Hop wird via Guzzle `on_redirect`-Callback erneut validiert |
| Redirect-Limit | max. 3 Hops |
| Timeout | 10 Sekunden (konfigurierbar per Aufruf) |
| Max Response Size | 10 MB; Response wird nach dem Download geprüft |
| Logging | Jede blockierte oder fehlgeschlagene Anfrage wird mit URL und Grund geloggt (`Log::warning`) |

### Blockierte IP-Ranges (via PHP-Flags)

- `127.0.0.0/8` — Loopback
- `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16` — Private Ranges
- `169.254.0.0/16` — Link-Local / AWS EC2 Metadata Service
- `240.0.0.0/4` — Reserviert
- `::1/128` — IPv6 Loopback
- `fc00::/7` — IPv6 Unique Local
- `fe80::/10` — IPv6 Link-Local

Hostname-Literale `localhost`, `ip6-localhost`, `ip6-loopback` werden zusätzlich vor DNS-Auflösung blockiert.

### Scope

- `ReleaseMetadataService`: direkter Fetch von Spotify-URLs (Release-Type-Scraping), Plattform-URLs (Release-Date-Scraping), oEmbed-Thumbnail-URLs
- `MetadataService`: kein direkter User-URL-Fetch; URL wird nur als Query-Param an fixe oEmbed-Endpoints weitergegeben; Scheme-Validierung (`http`/`https`) greift trotzdem frühzeitig

### Was NICHT durch `SafeHttpService` abgesichert ist

- oEmbed-Endpunkte selbst sind hardcodiert (z. B. `open.spotify.com/oembed`) — kein SSRF-Risiko
- DNS-Rebinding zwischen Pre-Flight-Check und TCP-Connect: TOCTOU-Restrisiko, akzeptiert im MVP; vollständige Abhilfe würde einen Guzzle-Post-Connect-IP-Check erfordern

---

## 9) Secrets, Logs und Datenminimierung

- Keine Secrets im Git
- Keine Tokens oder Passwörter in Logs
- Public Responses nur mit den wirklich öffentlichen Feldern

---

## 10) Token-Lifecycle und Session-Invalidation

### Aktuelles Modell (MVP)

- Sanctum Personal Access Tokens haben kein serverseitiges Ablaufdatum im MVP. Der Token bleibt gültig, bis er explizit revoziert wird.
- **Logout** ruft `DELETE /api/v1/auth/logout` auf, wodurch Laravel den Token aus der `personal_access_tokens`-Tabelle löscht. Anschließend wird das `vibaro_token`-Cookie im Browser gelöscht.
- **Session-Invalidation** durch Logout ist damit vollständig: Token ist weder im Cookie noch in der Datenbank vorhanden.

### Token-Rotation (zukünftig)

Wenn Token-Rotation eingeführt wird, muss sie ausschließlich serverseitig ablaufen:

```text
BFF-Route empfängt Request -> Token abgelaufen? -> backendFetch refresh-Endpoint
                                                          |
                                          neuer Token in JSON-Response
                                                          |
                                    httpOnly Cookie aktualisieren <- 
                                    Response mit neuem Token an Client weitergeben
```

Der Client bekommt dabei keinen Token zu sehen — er erhält lediglich eine neue erfolgreiche Response.

### Was NICHT erlaubt ist

- Token-Expiry-Prüfung im Client-JS
- Token-Refresh aus Client Components direkt gegen Laravel
- Ablaufzeit oder Token-Value in JSON-Responses an den Browser

---

## 11) Never-Do-Liste

- ❌ Tokens in Client-Storage speichern (`localStorage`, `sessionStorage`, explizite Client-Cookies)
- ❌ BFF umgehen, wenn Browser-Auth nötig ist
- ❌ Token als JSON-Feld in BFF-Response an den Browser zurückgeben
- ❌ Direkte `fetch()`-Aufrufe mit manuellem `Authorization: Bearer ...` in Studio Route Handlern (stattdessen `backendFetch()` verwenden)
- ❌ Authentifizierte Laravel-Calls direkt aus Client Components
- ❌ `backendFetch()` oder `getTokenFromCookies()` in Client Components importieren
- ❌ CORS-Wildcards in Production
- ❌ Uploads ohne Server-Prüfung
- ❌ öffentliche Responses mit privaten Userdaten
- ❌ Token-Expiry-Logik im Browser
