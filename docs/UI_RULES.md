# Vibaro UI Rules (Binding, MVP)

Status: Active  
Scope: Studio, Public Page, Landingpage, Settings  
Related: STYLEGUIDE.md, PRODUCT_RULES.md, THEMES.md

Dieses Dokument definiert konkrete technische UI-Regeln fuer Vibaro.
Es ist verbindlich fuer neue Screens, Komponenten-Anpassungen und UI-Refactors.

Wenn STYLEGUIDE.md und UI_RULES.md kollidieren, gilt:
1. STYLEGUIDE.md (Produkt-/Design-DNA)
2. UI_RULES.md (technische Umsetzungsregeln)

---

## Adoption Status

Diese Regeln gelten verbindlich für neue UI und bewusst angefasste UI-Slices.

Bestehender Legacy-Code muss nicht sofort vollständig angepasst werden.
Wenn ein bestehender Screen bearbeitet wird, soll nur der betroffene Bereich schrittweise an diese Regeln angenähert werden.

Keine großflächigen UI-Refactors ohne eigenen Plan.

---

## Official UI Components

Diese Komponenten sind verbindlich zu verwenden. Neue Alternativen duerfen nicht ohne dokumentierte Begruendung eingefuehrt werden.

| Komponente | Pfad | Einsatzgebiet |
|---|---|---|
| `StudioButton` | `apps/web/src/app/(studio)/components/StudioButton.tsx` | Alle Aktions-Buttons im Studio |
| `StudioCard` | `apps/web/src/app/(studio)/components/StudioCard.tsx` | Alle Cards und Container-Panels im Studio |
| `StudioEmptyState` | `apps/web/src/app/(studio)/components/StudioEmptyState.tsx` | Alle Empty States im Studio |
| `StudioTabPage` | `apps/web/src/app/(studio)/components/StudioTabPage.tsx` | Sub-Pages unter "Meine Seite" |
| `StudioPageHeader` | `apps/web/src/app/(studio)/components/StudioPageHeader.tsx` | Top-Level Studio-Produktbereiche (Phase, Share, QR, Performance, Settings) |
| `StudioPageSubNav` | `apps/web/src/app/(studio)/components/StudioPageSubNav.tsx` | Einzig erlaubtes Studio-Subnav-Pattern |
| `StudioTopNav` | `apps/web/src/app/(studio)/components/StudioTopNav.tsx` | Primaere Studio-Navigation (Desktop) |
| `StudioBottomNav` | `apps/web/src/app/(studio)/components/StudioBottomNav.tsx` | Primaere Studio-Navigation (Mobile) |
| `StudioStatCard` | `apps/web/src/app/(studio)/components/StudioStatCard.tsx` | Metriken und KPI-Kacheln |
| `StudioStatusBadge` | `apps/web/src/app/(studio)/components/StudioStatusBadge.tsx` | Phase-/Seiten-Status-Badges |
| `StudioNotice` | `apps/web/src/app/(studio)/components/StudioNotice.tsx` | Inline-Hinweise (info, warning, error) |
| `ExplainPanel` | `apps/web/src/app/(studio)/components/ExplainPanel.tsx` | Kontextuelle Hilfe im Help-Mode |
| `WhyButton` | `apps/web/src/app/(studio)/components/WhyButton.tsx` | Optionale Vertiefungs-Erklaerungen |
| `HelpHub` | `apps/web/src/app/(studio)/components/HelpHub.tsx` | Zentraler Hilfe-Einstiegspunkt im Studio |

---

## Page Header Rules

- `StudioTabPage` fuer Sub-Pages unter **Meine Seite**:
  Profile, Appearance, Links, Music, Shows, Releases, Videos, Gallery, Contact.
- `StudioPageHeader` fuer Top-Level Studio-Produktbereiche:
  Dashboard/Home, Phase, Links verteilen/Share, QR, Performance/Analyse, Settings.
- Kein neues Page-Header-Pattern ohne explizite Entscheidung.

---

## Navigation Rules

- `StudioPageSubNav` ist das einzig erlaubte Subnav-Pattern im Studio.
- `StudioTopNav` (Desktop) und `StudioBottomNav` (Mobile) sind die primaeren Navigationspatterns.
- `StudioSidebar` existiert als Teil der aktuellen Shell. Neue Navigationskonzepte duerfen nicht ohne explizite Entscheidung eingefuehrt werden.

---

## Known Legacy Areas

### Settings

`SettingsClient` nutzt aktuell lokale Button-, Card- und Badge-Stile (kein `StudioButton`, kein `StudioCard`, kein `StudioStatusBadge`).

Regel:
- Keine neuen lokalen UI-Stile in Settings.
- Beim naechsten Anfassen von Settings muss der betroffene Bereich schrittweise auf `StudioButton`, `StudioCard` und `StudioStatusBadge` (oder eine dokumentierte zentrale Settings-Variante) migriert werden.

---

## 1. Visual Modes

Vibaro hat vier Visual Modes. Sie teilen ein gemeinsames System, duerfen sich aber bewusst in Gewichtung und Stimmung unterscheiden.

### 1.1 Studio

Ziel:
- workflow-orientiert
- ruhig, kontrolliert
- handlungsfokussiert

Erlaubte Unterschiede:
- hoehere Informationsdichte als Landing/Public
- klarere funktionale Trennungen (Panels, Subnav, Status)
- staerkere Priorisierung auf CTA und naechsten Schritt

Nicht erlaubt:
- dashboard-artige Ueberladung
- mehrere gleich starke primaere Aktionen

### 1.2 Public Page

Ziel:
- Band im Mittelpunkt
- hochwertig, dunkel, editorial/stage-artig
- mobile-first fuer Fans

Erlaubte Unterschiede:
- emotionalere Bildwirkung als im Studio
- content-first Layout

Nicht erlaubt:
- vibaro-zentrierte Kommunikation
- Vibaro-Branding ausserhalb des dezenten Footers
- toolhafte Fachsprache als Haupttext

### 1.3 Landingpage

Ziel:
- den Produktloop klar zeigen
- Fokus -> Links/QR -> Performance

Erlaubte Unterschiede:
- staerkere narrative Inszenierung als Studio
- gezielte visuelle Hierarchie pro Section

Nicht erlaubt:
- Feature-Wueste
- generische SaaS-Card-Grid-Aesthetik

### 1.4 Settings

Ziel:
- Klarheit, Sicherheit, Reversibilitaet
- risikoarme Interaktion

Erlaubte Unterschiede:
- reduziertere visuelle Sprache
- mehr erklaerende Mikrokopie bei kritischen Aktionen

Nicht erlaubt:
- experimentelle Navigation
- unklare Folgen von Aenderungen

---

## 2. Komponenten-Regeln

### 2.1 Buttons

Zentrale Komponente: `StudioButton` (`apps/web/src/app/(studio)/components/StudioButton.tsx`)

Verpflichtend:
- Genau ein dominanter primaerer Button pro Screen-Zustand.
- Alle Buttons im Studio muessen `StudioButton` nutzen.
- Button-Hoehe und Radius duerfen nicht komponentenlokal frei gewaehlt werden.

Verwendung:
- `primary`: Hauptaktion im aktuellen Schritt
- `secondary`: naechstwichtige Alternative
- `ghost`: sekundare Inline-Aktion in ruhigen Flaechen
- `danger`: irreversible/risikobehaftete Aktion
- `link`: textnahe Navigation ohne Button-Gewicht

Groessen: `md` (Standard), `sm`, `icon`

Nicht erlaubt:
- mehrere primary-Buttons in derselben Aktionsgruppe
- eigene Button-Stile in Feature-Komponenten
- raw `<button>` mit freien Tailwind-Klassen im Studio

### 2.2 Cards

Zentrale Komponente: `StudioCard` (`apps/web/src/app/(studio)/components/StudioCard.tsx`)

Verpflichtend:
- Card-Komposition ueber `StudioCard`.
- Radius, Border, Shadow nur ueber Props/Varianten von `StudioCard`.

Verwendung:
- default: Standard-Container (kein `accentBorder`)
- emphasis: `accentBorder={true}` fuer hervorgehobene Informationen
- clickable: `clickable={true}` fuer navigierbare Kacheln

Nicht erlaubt:
- neue Shadow/Radius/Borders direkt in Feature-Code
- parallele Card-Systeme je Bereich (z. B. lokale `rounded-xl`-Divs statt `StudioCard`)

### 2.3 Empty States

Zentrale Komponente: `StudioEmptyState` (`apps/web/src/app/(studio)/components/StudioEmptyState.tsx`)

Props: `icon` (optional), `title`, `description`, `action` (ReactNode, optional)

Verpflichtend:
Jeder Empty State muss beantworten:
1. Was ist leer? → `title`
2. Warum ist es relevant? → `description`
3. Was ist der naechste Schritt? → `action` (CTA via `StudioButton`)

Zusatzregeln:
- genau ein klarer CTA
- sprachlich kurz, konkret, produktnah
- keine Platzhaltertexte ohne Handlungswert

### 2.4 Tabs / Subnav

Zentrale Komponente: `StudioPageSubNav` (`apps/web/src/app/(studio)/components/StudioPageSubNav.tsx`)

Verpflichtend:
- Nur `StudioPageSubNav` als Subnav-Pattern im Studio.
- Aktiver Zustand muss klar und barrierearm erkennbar sein.
- Labels folgen den Produktbegriffen aus STYLEGUIDE.md.

Nicht erlaubt:
- neue Subnav-Muster ohne zentrale Entscheidung
- Mischung mehrerer Navigationslogiken auf derselben Ebene

### 2.5 Info- / Help-Panels

Zentrale Komponenten:
- `ExplainPanel` (`apps/web/src/app/(studio)/components/ExplainPanel.tsx`) – kontextuelle Hilfe, nur sichtbar wenn `helpMode` aktiv
- `WhyButton` (`apps/web/src/app/(studio)/components/WhyButton.tsx`) – optionale Vertiefung via Drawer
- `StudioNotice` (`apps/web/src/app/(studio)/components/StudioNotice.tsx`) – Inline-Hinweis (type: `info`, `warning`, `error`)
- `HelpHub` (`apps/web/src/app/(studio)/components/HelpHub.tsx`) – zentraler Hilfe-Einstiegspunkt

Verpflichtend:
- `ExplainPanel` fuer kurze, kontextuelle Hilfe im Help-Mode.
- `WhyButton` fuer optionale Vertiefung.
- `StudioNotice` fuer persistente Inline-Hinweise ausserhalb des Help-Mode.
- Hilfe unterstuetzt Aktion, ersetzt sie nicht.

Nicht erlaubt:
- Hilfe als dominante Screen-Flaeche
- wiederholte Erklaerung derselben Aussage in mehreren Boxen

### 2.6 Stat Cards

Zentrale Komponente: `StudioStatCard` (`apps/web/src/app/(studio)/components/StudioStatCard.tsx`)

Props: `value`, `label`, `trend` (optional: `{ value: string; positive: boolean }`)

Verpflichtend:
- Kennzahl + `label` + optional Trend muessen zusammen lesbar sein.
- Stat Cards duerfen die Hauptaktion nicht visuell uebertrumpfen.
- Bei leeren Daten (`value === ""`) zeigt die Komponente `—`; zusaetzlich auf Phase/naechste Aktion verweisen.

Nicht erlaubt:
- isolierte Zahlen ohne Erklaerung
- dekorative Metrik-Kacheln ohne Entscheidungsnutzen

### 2.7 Forms

Status: **Keine zentrale Form-Komponente vorhanden.**

Geplante zukuenftige Komponenten: `StudioField`, `StudioInput`, `StudioTextarea`, `StudioSelect`, `StudioFormSection`

Bis eine zentrale Formular-Komponente existiert:
- Dominantes bestehendes Studio-Input-Pattern wiederverwenden (keine neuen Inline-Input-Stile).
- Labels immer sichtbar – kein label-only Placeholder.
- Fehlertexte konkret und loesungsorientiert auf Feldebene.
- Kritische Felder (z. B. Sichtbarkeit, URL-nahe Felder) brauchen klare Folgenbeschreibung.
- Primaraktion am Formularende eindeutig priorisiert via `StudioButton variant="primary"`.

Nicht erlaubt:
- neue Input-Stile (neue `rounded-*`, neue Border-Farben) in Feature-Komponenten
- CTA-Hierarchiebruch in Formular-Footern

### 2.8 Badges

Zentrale Komponente: `StudioStatusBadge` (`apps/web/src/app/(studio)/components/StudioStatusBadge.tsx`)

Erlaubte Status-Werte: `live`, `draft`, `ended`

Verpflichtend:
- `StudioStatusBadge` fuer Phase-/Seiten-Status.
- Badge-Text ist kurz, statusorientiert und eindeutig.

Nicht erlaubt:
- freie neue Badge-Farben in Feature-Komponenten (kein lokales `bg-emerald-*` etc.)
- Badge als Ersatz fuer fehlende Erklaerung

### 2.9 Icons

Zentrale Icon-Quelle: `StudioIcons` (`apps/web/src/app/(studio)/components/StudioIcons.tsx`)

Verpflichtend:
- Funktionale Studio-UI-Elemente verwenden `StudioIcons` oder eine einzige explizit freigegebene Icon-Bibliothek (kein Mix).
- Einheitliche Groessenstufen und Ausrichtung.

Nicht erlaubt:
- Mix aus `StudioIcons`, separaten Inline-SVGs und Emojis fuer dieselbe Funktionsebene
- Emoji-Icons fuer funktionale Aktionen
- Neue Inline-SVG-Definitionen ausserhalb von `StudioIcons` ohne Erweiterung der zentralen Datei

Hinweis:
- Emojis sind nur in seltenen, rein illustrativen Hilfekontexten erlaubt (z. B. ExplainPanel-Beispiele), nie fuer primaere Funktionselemente.

---

## 3. Erlaubte Varianten (Whitelist)

Neue Varianten ausserhalb dieser Liste sind nur mit dokumentierter Begruendung und zentraler Komponentenerweiterung erlaubt.

### 3.1 Button Variants

- primary
- secondary
- ghost
- danger
- link

### 3.2 Card Variants

- default
- emphasis
- muted
- danger

### 3.3 Empty State Variants

- action-empty (mit direktem CTA)
- onboarding-empty (mit kurzer Anleitung + CTA)
- data-empty (mit Kontext auf Phase/Filter + CTA)

### 3.4 Badge Variants

- neutral
- success
- warning
- danger
- info

---

## 4. Verbotene Patterns

- Freie Button-Radii in Feature-Komponenten.
- Neue Card-Stile ohne zentrale Komponente.
- Inline-Farben statt Token/Theme-Variablen.
- Emoji-Icons fuer funktionale Aktionen.
- Neue Subnav-Muster ohne systemische Entscheidung.
- Coming-Soon-Cards ohne echten Nutzen oder naechsten Schritt.
- style={{ ... }} ausser fuer echte dynamische Werte.
- Mehrfach-CTA-Hierarchien ohne klaren primaeren Pfad.

---

## 5. Empty-State-Regel (Binding)

Jeder Empty State muss folgende drei Saetzebenen enthalten:

1. Zustand: Was ist leer?
2. Relevanz: Warum ist das wichtig?
3. Aktion: Was soll jetzt als naechstes passieren?

Mindestanforderungen:
- ein klarer CTA
- kurze Sprache ohne Fachjargon
- Bezug zum Produktloop (falls sinnvoll)

Qualitaetscheck:
- Versteht eine neue Nutzerin in unter 5 Sekunden, was zu tun ist?

---

## 6. Review-Gate Fuer Jede UI-Aenderung

Jede UI-Aenderung muss vor Merge diese Fragen beantworten:

1. Welche zentrale Komponente wird genutzt?
2. Gibt es bereits ein bestehendes Pattern?
3. Ist der dominante CTA klar?
4. Wird der Produktloop unterstuetzt?
5. Entsteht ein neuer Stil oder bleibt es im System?

Wenn eine Frage mit nein oder unklar beantwortet wird, ist die Aenderung nicht merge-ready.

---

## 7. Codex/Copilot-Regel

Vor jeder UI-Aenderung verpflichtend:

1. STYLEGUIDE.md lesen.
2. UI_RULES.md lesen.
3. Vorhandene Komponenten/Varianten im Code suchen.
4. Keine neuen Varianten ohne kurze Begruendung im PR.

Ergaenzende Regel:
- Erst bestehendes Pattern erweitern, dann neu bauen.
- Kein zweiter Weg fuer dieselbe UI-Aufgabe.

---

## 8. Layout & Spacing Standards

Diese Werte sind verbindlich fuer neue UI-Arbeit. Bestehender Legacy-Code muss beim naechsten Anfassen schrittweise angeglichen werden.

### 8.1 Studio

| Bereich | Standard | Technisch |
|---|---|---|
| Content max-width | 1200px | `style={{ maxWidth: "1200px" }}` (CSS-Token geplant) |
| Page padding | px-4 sm:px-6, py-8 | vom Studio-Layout vorgegeben — nicht wiederholen |
| Main section gap | 32px | `space-y-8` |
| Card padding | 24px | `p-6` via `StudioCard` |
| Card radius | 8px | `rounded-lg` via `StudioCard` |
| Grid gap | 20px | `gap-5` |
| Button | `StudioButton` only | Keine freien `<button>` mit Tailwind-Klassen |
| Input | `studio-input` + `px-3 py-2` | Klasse aus `globals.css` |
| Mobile bottom safe area | `pb-20 md:pb-0` | Nur wo `StudioBottomNav` aktiv ist |

Verboten:
- Abweichende Card-Paddings oder Radien direkt in Feature-Komponenten.
- Neue `gap-*`-Werte ohne Begruendung.
- `StudioStatCard` darf nicht mit anderem Padding als `StudioCard` erscheinen (Angleichung ausstehend, aber kein neuer Wildwuchs).

### 8.2 Landingpage

- Kann bewusst groessere Abstaende und `rounded-full`-CTAs verwenden — dies ist ein dokumentierter Mode-Unterschied zum Studio.
- Standard Section-Breiten:
  - Textsektionen: `max-w-4xl`
  - Feature-/Grid-Sektionen: `max-w-7xl`
- Keine weiteren `max-w-*`-Werte ohne Begruendung.

### 8.3 Public Page

- Darf editorial spacing und template-spezifische Breiten verwenden.
- Muss pro Template intern konsistent sein.
- Mobile-first fuer Fans.
- Keine Studio-Komponenten auf der Public Page.

### 8.4 Settings

- Bekanntes Legacy-Gebiet mit lokalen Card-/Button-/Badge-Stilen.
- Beim naechsten Anfassen: betroffenen Bereich schrittweise auf Studio-Spacing und offizielle Komponenten migrieren.
- Keine neuen lokalen Stile in Settings.

---

## 8.5 Inline-Style-Regeln

`style={{ ... }}` ist **nur** fuer echte dynamische Werte erlaubt.

Erlaubt:
- `width`/`height` aus Runtime-Daten (z. B. Chart-Balken, Fortschrittsbalken)
- `transform` (z. B. Positionierung, Animation)
- CSS-Variablen (`var(--studio-accent)` etc.)
- Bedingte Layout-Werte aus Props/State (z. B. `maxWidth: isVideo ? "960px" : "680px"`)
- `focal point` fuer Bild-Positionierung

Nicht erlaubt:
- Radius (`borderRadius: "..."`)
- Shadow (`boxShadow: "..."`)
- Farben (`color: "#..."`, `background: "#..."`) — CSS-Variablen sind ok
- Statische Padding/Margin-Werte, die auch als Tailwind-Klasse ausgedrueckt werden koennten
- Statische Schriftgroessen (`fontSize: "14px"` etc.)

---

## 9. Token- Und Stil-Disziplin

- Farben nur ueber Theme-Variablen und bestehende Tokens.
- Spacing nur ueber definierte Abstands-Skalen.
- Typografie nur ueber definierte Rollen (Headline, Subheadline, Body, Meta, Label).
- Keine Bereichs-Sonderlogik fuer Radius/Shadow/Border ohne zentrale Freigabe.

---

## 10. Produktloop-Check In Der UI

Jeder neue oder geaenderte Screen muss mindestens einen dieser Punkte klar unterstuetzen:

- Fokus setzen
- Links/QR teilen
- Performance sehen

Wenn ein Screen keinen Bezug zum Produktloop zeigt, muss sein Nutzen fuer den Loop explizit benannt werden (z. B. vorbereitende Einstellungs- oder Inhaltsarbeit).

---

## 11. Geltung

Diese Regeln sind fuer MVP-Slices verbindlich.
Abweichungen sind nur erlaubt, wenn sie:
- dokumentiert sind,
- zentral freigegeben sind,
- und als Systemverbesserung in den zentralen Komponenten landen.
