# Vibaro Styleguide (Binding, MVP)

Status: Active  
Scope: Studio, Public Page, Landingpage  
Related: ARCHITECTURE.md, PRODUCT_RULES.md, PRODUCT_V2.md, THEMES.md

Dieser Styleguide definiert verbindlich die visuelle und sprachliche Ausrichtung von Vibaro.
Er gilt fuer alle Design- und UX-Entscheidungen im MVP.

Leitsatz: ruhig, hochwertig, zeitlos. Die Band steht im Mittelpunkt, das Tool bleibt im Hintergrund.

---

## 1. Produkt-DNA

### Was Vibaro ist

- Eine Bandseite auf Vibaro mit klarem aktuellem Fokus.
- Ein Workflow-System fuer konkrete Promotion-Phasen.
- Ein Tool, das Sichtbarkeit und Wirkung pro Phase messbar macht.

### Was Vibaro nicht ist

- Keine generische "Baukasten-Homepage" ohne Handlungsfokus.
- Kein lautes Marketing-Dashboard.
- Kein Feature-Katalog ohne klaren naechsten Schritt.

### Zentraler Produktloop (visuell zu stuetzen)

1. Aktuellen Fokus festlegen.
2. Links und QR-Code teilen.
3. Sehen, was funktioniert.

Regel fuer alle Screens: Der aktuelle Schritt im Loop muss klar erkennbar sein, und der naechste Schritt muss sichtbar vorbereitet werden.

---

## 2. Zielgruppe Und Tonalitaet

### Primare MVP-Zielgruppe

- Ambitionierte Metal-, Metalcore- und Alternative-Bands.

### Tonalitaet

- Ernsthaft.
- Hochwertig.
- Ruhig.
- Kontrolliert.
- Direkt und klar.

### Nicht erlaubt

- Verspielte oder ironische Produktsprache.
- Generische SaaS-Floskeln.
- Startup-Buzzwords.

Referenzgefuehl: moderne Editorial-Aesthetik aus Musik-/Kulturkontext, nicht "Growth-Tool"-Optik.

---

## 3. Sprache Und Begriffe

### Verbindliche Produktbegriffe (UI-nah)

- Meine Seite = dauerhafte Bandseite.
- Phase = aktueller Fokus (z. B. Release, Tour, Merch, Studio).
- Links verteilen = Tracking-Links und QR-Code je Kanal.
- Performance dieser Phase = Auswertung einer konkreten Phase.
- Analyse = uebergreifende Auswertung ueber mehrere Phasen.

### Bevorzugte sichtbare Begriffe in der Primar-UI

- Fokus
- Phase
- Links verteilen
- QR-Code
- Performance dieser Phase
- Analyse
- Veroeffentlichen
- Sichtbar / Nicht sichtbar

### Zu vermeidende technische Begriffe in der Primar-UI

- Distribution (als Hauptbegriff)
- Tracking (als dominante Nutzerbezeichnung)
- Conversion
- Handle
- Hero
- Template
- UTM
- Attribution

Technische Begriffe duerfen in Entwicklerdoku, optionalen Hilfetexten oder API-Kontexten vorkommen, aber nicht als dominante Nutzerfuehrung im Studio.

### Begriffsumgang (verbindlich)

- Distribution: intern okay, extern in der UI durch "Links verteilen" ersetzen.
- Tracking: intern/fachlich okay, in der UI bevorzugt "Performance" oder "Wirkung".
- Conversion: nur in Analyse-Kontexten, nicht als Einstiegssprache.
- Handle: in UI als "Band-Adresse" oder "Seiten-Adresse" erklaeren.
- Hero: nur als interner Designbegriff.
- Template: in UI durch "Design" oder "Look" ersetzen.

### Deutsch/Englisch-Regel

- Studio: Deutsch als Standardsprache fuer Navigation, Aktionen, Hilfetexte und Status.
- Public Page: Sprache der Bandinhalte frei waehlbar; Produkt-/Tool-Sprache bleibt im Hintergrund.
- Technische englische Fachbegriffe nur dann, wenn es keine klare deutsche Alternative im jeweiligen Kontext gibt.

---

## 4. Informationsarchitektur

### Trennung der Kernbereiche

- Meine Seite: dauerhafte Identitaet und Grundauftritt.
- Phase: aktueller Promotion-Fokus.
- Links verteilen: operative Ausspielung pro Kanal inklusive QR.
- Performance dieser Phase: Wirkung einer konkreten Phase.
- Analyse: uebergreifende Sicht auf Entwicklung und Muster.

### Navigationsprinzip

- Jeder Screen braucht einen klaren naechsten Schritt.
- Jeder Screen-Zustand hat genau einen dominanten CTA.
- Sekundaeraktionen bleiben visuell nachgeordnet.

### Priorisierung

- Aktionen sind wichtiger als Datenmasse.
- Daten werden kontextuell gezeigt, nicht als permanente Dashboard-Wand.

---

## 5. Visuelles System

### Farben

- Farben kommen ausschliesslich aus dem Theme-System gemaess THEMES.md.
- Keine freien HEX-Farben in Komponenten.
- Keine grellen Flaechen als Standard.
- Kontraste muessen klar lesbar, aber nicht aggressiv sein.

### Typografie

- Ruhige, moderne Sans-Serif-Systematik.
- Keine verspielten oder dekorativen Schriftstile.
- Klare Hierarchie: Headline, Subheadline, Body, Meta.
- Textbreiten begrenzen, damit Inhalte editorial und lesbar bleiben.

### Spacing

- Grosszuegige Abstaende statt kompakter Verdichtung.
- Weniger Elemente pro Viewport.
- Mobile-first mit sauberer vertikaler Rhythmik.

### Cards

- Klare Gruppierung, dezente Trennung.
- Keine starken Schatten, keine lauten Effekte.
- Karten duerfen nicht wie austauschbare SaaS-Featureboxen wirken.

### Buttons

- Primaerer Button pro Screen-Zustand.
- Klares visuelles Gefaelle zwischen primaer und sekundaer.
- Keine "shiny"- oder spielerischen Stilmittel.

### Icons

- Funktional, sparsam, konsistent.
- Keine Deko-Icons ohne Informationswert.

### Empty States

- Immer mit klarer naechster Aktion.
- Kurz erklaeren, warum etwas leer ist.
- Keine toten Enden.

### Hilfe-Elemente

- Hilfe ist sichtbar, aber nicht dominant.
- Hilfetexte unterstuetzen Entscheidungen statt sie zu ersetzen.

---

## 6. Studio Design

### Grundprinzip

- Ruhig, kontrolliert, workflow-orientiert.

### Verbindliche Regeln

- Keine Dashboard-Ueberladung mit gleichgewichtigen Widgets.
- Aktionen vor Kennzahlen.
- Die aktuelle Phase muss visuell eindeutig sein.
- Hilfesystem ist immer erreichbar, aber draengt Aktionen nicht weg.

### Interaktion

- Kurze, subtile Motion nur zur Orientierung.
- Keine Daueranimationen.
- Keine Effekte, die Aufmerksamkeit unnoetig binden.

---

## 7. Public Page Design

### Zielbild

- Band im Mittelpunkt.
- Hochwertig, dunkel, stage-/editorial-artig.
- Mobile-first fuer Fans.

### Branding-Regel (verbindlich)

- Vibaro-Branding darf sichtbar sein, aber nur dezent im Footer.
- Kein Vibaro-Branding im Hero.
- Keine dominante Vibaro-CTA im Content.
- Die Bandidentitaet hat immer Prioritaet.

### Sprachregel Public Page

- Keine generische Template-Sprache.
- Inhalte sollen nach echter Bandkommunikation klingen, nicht nach Tool-Text.

---

## 8. Landingpage Design

### Positionierung

- Die Landingpage verkauft nicht nur "eine Homepage".
- Sie erklaert den Produktloop: Fokus festlegen, Links/QR teilen, Performance sehen.

### Struktur-Regel

- Hero und erste Sections muessen den Produktloop sichtbar machen.
- Keine Feature-Wueste.
- Keine austauschbare SaaS-Optik.

### Gestaltungsprinzip

- Reduziert, editorial, klar priorisiert.
- Eine dominante Botschaft pro Abschnitt.
- Bildsprache: authentisch, musiknah, nicht stockhaft-startup.

---

## 9. Hilfe-System

### ExplainPanels

- Kurz.
- Kontextbezogen.
- Handlungsorientiert.

### WhyButtons

- Optional fuer mehr Tiefe.
- Kein Pflichtschritt fuer den Hauptworkflow.

### HelpHub

- Einstieg ueber den Produktloop.
- Hilfe entlang der drei Kernschritte strukturieren.

### Konsistenz-Regel

- Keine Wiederholungen gleicher Hilfetexte in mehreren Komponenten.
- Hilfe darf nie die primaere Aktion auf dem Screen verdraengen.

---

## 10. Forbidden / Anti-Patterns

- Zu viele gleich starke CTAs auf einem Screen.
- Technische Begriffe als primaere Nutzerfuehrung.
- "Distribution" als dominanter sichtbarer Begriff.
- Vibaro-zentrierte Public Page statt bandzentrierter Darstellung.
- Generische SaaS-Cards ohne produktive Handlung.
- Zu viele "Coming Soon"-Bloecke in produktiven Flows.
- Hilfe-Elemente, die die eigentliche Aktion ueberlagern.
- Grelle Farben, visuelles Chaos oder dauerhafte Animationen.
- Beliebige Startup-Buzzword-Texte statt klarer, musiknaher Sprache.

---

## Umsetzungshinweis

Bei Konflikten zwischen Design-Wuenschen und Produktlogik gilt der Produktloop:
Fokus setzen -> Links/QR teilen -> Performance sehen.
Alle neuen UX-/UI-Slices muessen diesen Ablauf sicht- und nutzbar staerken.
