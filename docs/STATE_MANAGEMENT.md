# Vibaro State Management

Diese Datei definiert, wo welcher Zustand (State) liegen darf.
Ziel: wenig Magie, gut nachvollziehbarer Code.

---

## Grundsatz
State soll so lokal wie möglich bleiben.
Kein globaler State ohne echten Grund.

---

## Server State (API-Daten)
- Wird mit TanStack Query verwaltet
- Beispiele:
  - Artist Page Daten
  - Public Page Daten
- Niemals in React Context speichern

---

## UI State
### Lokal
- useState für einfache UI-Zustände
- z.B. Modals, Tabs, Inputs

### Komplexer UI-Zustand
- Zustand (Store)
- z.B. Editor-Zustand, mehrere abhängige Felder

---

## React Context
Nur erlaubt für:
- Auth / Session-Status
- User-Grundinformationen (eingeloggt / nicht eingeloggt)

Context muss:
- klar benannt sein
- im Ordner `src/context/` liegen
- sparsam eingesetzt werden

---

## Verboten
- API-Daten im Context speichern
- Globalen State „auf Vorrat“ bauen
- Mehrere State-Strategien für dasselbe Problem
