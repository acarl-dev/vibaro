# Vibaro State Management

Status: current
Last verified: 2026-04-22
Scope: aktueller Ist-Zustand in `apps/web`

Diese Datei beschreibt den derzeit tatsächlich genutzten State-Ansatz im Frontend.
Sie ist keine Zielarchitektur.

---

## Grundsatz

State bleibt so lokal wie möglich.
Der aktuelle Code bevorzugt Server Components, Route Handlers und lokale `useState`-Zustände statt eines allgemeinen Client-State-Frameworks.

---

## Was aktuell **nicht** im Projekt verwendet wird

- Kein TanStack Query
- Kein Zustand Store
- Kein globaler Auth-Context

Diese Bibliotheken sind im aktuellen Web-Paket nicht installiert und werden im Codepfad nicht verwendet.

---

## Server State (API-Daten)

Serverdaten werden aktuell auf zwei Arten geladen:

- Server-seitig über Next.js Server Components und server-only Utilities wie `backendFetch()`
- Client-seitig über `fetch()` gegen Next.js Route Handlers unter `/api/**`

Konkrete Muster im aktuellen Code:

- Authentifizierte Server-Fetches laufen über `src/lib/api/backend.ts`
- Öffentliche Daten können server-seitig direkt vom Laravel-API-Endpunkt geladen werden
- Interaktive Studio-Clients laden und mutieren Daten meist direkt über `fetch("/api/studio/..." )`

Es gibt derzeit keinen zentralen Cache-Layer für Server State im Browser.
Wenn dieselben Daten an mehreren Stellen gebraucht werden, werden sie heute entweder server-seitig erneut geladen oder lokal im jeweiligen Client gehalten.

---

## UI State

Der dominante UI-State-Mechanismus ist aktuell lokales `useState` in der jeweiligen Komponente.

Typische Beispiele:

- Formulare
- Upload-Status
- Modal- und Panel-Zustände
- lokale Fehler- und Erfolgsanzeigen
- Sortier- und Bearbeitungszustände in Studio-Ansichten

Komplexerer UI-State wird momentan ebenfalls lokal pro Feature gehalten, nicht in einem globalen Store.

---

## React Context

React Context wird aktuell sparsam für querschnittliche UI-Themen eingesetzt, nicht für API-Daten oder Auth.

Derzeit vorhandene Contexts:

- `ToastContext` für Toast-Ausgabe
- `HelpModeContext` für Help-Mode und Help-Hub-UI

Auth- und Session-Prüfung laufen aktuell server-seitig über Cookies, Redirects und `backendFetch()`, nicht über einen React Context.

---

## Verboten / Nicht vorgesehen

- API-Daten in React Context duplizieren
- einen globalen Store „auf Vorrat“ einführen
- mehrere konkurrierende Strategien für denselben Zustand parallel betreiben

Wenn TanStack Query, Zustand oder ein anderer globaler State-Ansatz später eingeführt wird, muss diese Datei vorher oder gleichzeitig von `current` auf den neuen Ist-Zustand angepasst werden.
