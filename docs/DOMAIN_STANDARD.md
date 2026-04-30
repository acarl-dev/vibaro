# Vibaro Domain Assignment Standard

Status: binding for consolidation planning
Date: 2026-04-30
Scope: apps/api, apps/web, docs

## 1) Purpose

Dieses Dokument definiert den verbindlichen Produkt-Kern fuer die Konsolidierung.
Ziel ist eindeutige Verantwortung pro produktiver Datei, bevor Refactors umgesetzt werden.

Dieses Dokument aendert keinen produktiven Code.

## 2) Binding Sources

1. docs/API_CONTRACTS.md ist vorerst die einzige bindende Vertragsquelle fuer API-Verhalten.
2. Veraltete Dokumente sind fuer diese Konsolidierung nicht bindend.
3. Bei Widerspruch zwischen aelteren Dokumenten und API_CONTRACTS gilt API_CONTRACTS.

## 3) In Scope vs Out of Scope

In Scope:
- apps/api
- apps/web
- docs

Out of Scope:
- infra
- node_modules
- vendor
- build artefacts
- tests

## 4) Domain Cores

### 4.1 Website-Kern
Alles rund um ArtistPage, oeffentliche Bandseite, Profil, Sections, Darstellung und Inhalte.

Typische Verantwortung:
- ArtistPage-Stammdaten
- Profile, Appearance, Contact
- Sections und Sichtbarkeit von Sections
- Shows, Releases, Videos, Gallery, Featured Content
- Public Page Rendering und oeffentliche Content-Darstellung

### 4.2 Phase-Kern
Alles rund um den aktuellen Fokus einer Band.
UI-Begriff: Phase.
Technisches Backend-Modell bleibt vorerst Spotlight.

Typische Verantwortung:
- Phase Wizard
- Aktivierung, Beenden, Archivieren, Wiederherstellen
- Phase Overview und phasebezogene Darstellung
- Fokus-/Statuswechsel, die Verhalten zeitlich veraendern

### 4.3 Links-Kern
Alles rund um TrackingLink, Distribution und kanalbezogene Ausspielung.

Typische Verantwortung:
- Plattform-/Placement-Links
- QR und Redirect-Flows
- Tracking-Link-Erzeugung und Link-Lifecycle
- Linkbezogene Kampagnenlogik

### 4.4 Analytics-Kern
Alles rund um Auswertung und Vergleich.

Typische Verantwortung:
- PageViewEvent und ClickEvent Auswertung
- Performance, Results, Metriken, Reporting
- Breakdown, Comparison, Insights

### 4.5 Shared/Foundation
Nur technische Querschnittslogik, die bewusst keinem Produktkern gehoert.

Erlaubte Inhalte:
- Auth
- API Clients
- BFF Proxy
- HTTP Utilities
- Error Handling
- Toasts
- Base UI Components
- Layout Shells

Nicht erlaubt:
- Versteckte Produktlogik aus Website, Phase, Links oder Analytics.

## 5) Hard Rules

1. Jede produktive Datei in apps/api und apps/web muss genau einem Kern oder Shared/Foundation zugeordnet werden.
2. Shared/Foundation darf nicht als Sammelbecken fuer unklare Produktlogik missbraucht werden.
3. Dateien mit mehreren Verantwortlichkeiten muessen als Konflikt markiert werden.
4. Refactors werden erst aus der Matrix in docs/REFACTOR_MATRIX.md abgeleitet.
5. Bis zur Umsetzung sind keine API-Aenderungen, keine Datei-Verschiebungen, keine Import-Aenderungen Teil dieses Schritts.

## 6) Assignment Decision Rule

Primarfrage pro Datei:
- Welchen fachlichen Zustand besitzt diese Datei primaer?

Sekundaerfrage bei Unschaerfe:
- Welche Produktentscheidung waere ohne diese Datei nicht moeglich?

Wenn Datei mehrere Produktzustaende gleichwertig traegt:
- Konflikt markieren: Ja: Mischverantwortung
- Ziel-Kernel festlegen
- Massnahme auf spaeter setzen (extrahieren/zentralisieren/pruefen)

## 7) Conflict Taxonomy

Zulaessige Konfliktwerte:
- Nein
- Ja: Mischverantwortung
- Ja: falscher Begriff
- Ja: doppelte Logik
- Ja: Ziel unklar

## 8) Action Taxonomy

Zulaessige Massnahmen:
- Behalten
- Umbenennung UI-Text
- Spaeter extrahieren
- Spaeter zentralisieren
- Spaeter loeschen/redirecten
- Pruefen

## 9) Enforcement

Ein Matrix-Eintrag gilt als vollstaendig, wenn alle Felder gesetzt sind:
- Datei
- Aktueller Kernel
- Ziel-Kernel
- Konflikt
- Begruendung
- Massnahme

Neue oder geaenderte produktive Dateien sollen kuenftig nur mit klarer Domain-Zuordnung in PR-Reviews akzeptiert werden.
