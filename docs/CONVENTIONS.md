# Vibaro Conventions

Diese Datei definiert verbindliche Konventionen für das gesamte Vibaro-Projekt.
Alle Implementierungen (Web, API, später Add-ons) müssen sich daran halten.

---

## 1. Naming & URLs

### Artist Handle
- lowercase
- URL-safe (`a-z`, `0-9`, `-`)
- eindeutig (unique)
- Beispiel: `emily-j`, `darkwave-berlin`

### Öffentliche Seiten
- Public Route: `/p/[handle]`
- Keine Großbuchstaben
- Keine internen IDs in URLs

---

## 2. Frontend – apps/web (Next.js)

### Grundsätze
- Next.js App Router
- TypeScript überall
- Server Components bevorzugen, **wo sinnvoll**
- Client Components nur für:
  - Formulare
  - Editoren
  - Interaktive UI

### Ordnerstruktur
- `src/app/` → Routen & Layouts
- `src/components/` → UI-Komponenten
- `src/lib/api/` → API-Clients & Fetch-Wrapper
- `src/lib/theme/` → Theme- & Variant-Logik
- `src/styles/` → globale Styles & Themes (`themes.css`)

### Styling
- **Keine hardcodierten Farben**
- Farben **nur über CSS-Variablen**
- Theme-Zuweisung über:
  - `data-theme`
  - `data-variant`

❌ Verboten:
```tsx
style={{ color: "#ff00ff" }}
````

✅ Erlaubt:

```css
color: var(--text);
```

---

## 3. Backend – apps/api (Laravel)

### API-Struktur

* REST JSON API
* Versioniert: `/api/v1/...`
* Keine HTML-Responses

### Controller-Regeln

* Controller sind **thin**
* Keine Business-Logik im Controller
* Validierung:

  * Request-Klassen, wenn sinnvoll
* Autorisierung:

  * Laravel Policies

### Services

* Services nur, wenn Logik:

  * wiederverwendbar
  * oder komplexer wird
* Kein Overengineering im MVP

---

## 4. API Response Format (verbindlich)

### Erfolg

```json
{
  "data": {}
}
```

### Fehler

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

### Validierungsfehler

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "fields": {
      "fieldName": ["Error message"]
    }
  }
}
```

❌ Keine gemischten Response-Formate
❌ Keine nackten Strings oder Arrays als Response

---

## 5. Auth & Security (MVP)

* Auth erfolgt ausschließlich über API
* Web greift **nie direkt** auf DB zu
* Keine sensiblen Felder in Public Responses:

  * keine E-Mail
  * keine internen IDs
  * keine Tokens

---

## 6. Git & Workflow

### Branches

* `main` → stabil / produktionsnah
* `develop` → aktive Entwicklung
* `feature/<name>`
* `fix/<name>`

### Commits

* Imperativ
* Kurz & klar

✅ Beispiele:

* `Add artist page editor`
* `Fix public page caching`
* `Refactor theme handling`

❌ Keine:

* `stuff`
* `wip`
* `changes`

---

## 7. MVP-Fokus (wichtig)

* Fokus auf **Free + Artist**
* Keine AI-Features
* Keine App
* Keine Feature-Flut

> Wenn etwas nicht klar ist:
> **einfach, stabil, nachvollziehbar > clever**

---

## 8. Harte Verbote

* ❌ `node_modules` oder `vendor` committen
* ❌ Cross-Imports zwischen `apps/web` und `apps/api`
* ❌ Farbpicker im MVP
* ❌ „Magic“ ohne Dokumentation

---

## 9. Leitsatz

> Vibaro ist ein Produkt für Musiker.
> Klarheit, Ruhe und Geschmack sind wichtiger als technische Spielereien.

```

