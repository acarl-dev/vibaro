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

Verpflichtend:
- Genau ein dominanter primaerer Button pro Screen-Zustand.
- Alle Buttons muessen zentrale Button-Komponente und Tokens nutzen.
- Button-Hoehe und Radius duerfen nicht komponentenlokal frei gewaehlt werden.

Verwendung:
- primary: Hauptaktion im aktuellen Schritt
- secondary: naechstwichtige Alternative
- ghost: sekundare Inline-Aktion in ruhigen Flaechen
- danger: irreversible/risikobehaftete Aktion
- link: textnahe Navigation ohne Button-Gewicht

Nicht erlaubt:
- mehrere primary-Buttons in derselben Aktionsgruppe
- eigene Button-Stile in Feature-Komponenten

### 2.2 Cards

Verpflichtend:
- Card-Komposition ueber zentrale Card-Komponente.
- Radius, Border, Shadow nur ueber zentrale Varianten.

Verwendung:
- default: Standard-Container
- emphasis: hervorgehobene, aber nicht kritische Information
- muted: Hintergrund-/Kontextinformation
- danger: Warnung oder irreversible Konsequenz

Nicht erlaubt:
- neue Shadow/Radius/Borders direkt in Feature-Code
- parallele Card-Systeme je Bereich

### 2.3 Empty States

Verpflichtend:
Jeder Empty State muss beantworten:
1. Was ist leer?
2. Warum ist es relevant?
3. Was ist der naechste Schritt?

Zusatzregeln:
- genau ein klarer CTA
- sprachlich kurz, konkret, produktnah
- keine Platzhaltertexte ohne Handlungswert

### 2.4 Tabs / Subnav

Verpflichtend:
- Ein einheitliches Subnav-Muster fuer gleiche IA-Ebene.
- Aktiver Zustand muss klar und barrierearm erkennbar sein.
- Labels folgen den Produktbegriffen aus STYLEGUIDE.md.

Nicht erlaubt:
- neue Subnav-Muster ohne zentrale Entscheidung
- Mischung mehrerer Navigationslogiken auf derselben Ebene

### 2.5 Info- / Help-Panels

Verpflichtend:
- ExplainPanel fuer kurze, kontextuelle Hilfe.
- WhyButton fuer optionale Vertiefung.
- Hilfe unterstuetzt Aktion, ersetzt sie nicht.

Nicht erlaubt:
- Hilfe als dominante Screen-Flaeche
- wiederholte Erklaerung derselben Aussage in mehreren Boxen

### 2.6 Stat Cards

Verpflichtend:
- Kennzahl + Kontext + Zeitraum/Bezug muessen zusammen lesbar sein.
- Stat Cards duerfen die Hauptaktion nicht visuell uebertrumpfen.
- Bei leeren Daten: auf Phase/naechste Aktion verweisen.

Nicht erlaubt:
- isolierte Zahlen ohne Erklaerung
- dekorative Metrik-Kacheln ohne Entscheidungsnutzen

### 2.7 Forms

Verpflichtend:
- Labels immer sichtbar (kein label-only Placeholder).
- Fehlertexte konkret und loesungsorientiert.
- Kritische Felder (z. B. Sichtbarkeit, URL-nahe Felder) brauchen klare Folgenbeschreibung.
- Primaraktion am Formularende eindeutig priorisiert.

Nicht erlaubt:
- uneinheitliche Feldabstaende pro Form
- CTA-Hierarchiebruch in Formular-Footern

### 2.8 Badges

Verpflichtend:
- Badge-Farben und Bedeutung sind zentral definiert.
- Badge-Text ist kurz, statusorientiert und eindeutig.

Nicht erlaubt:
- freie neue Badge-Farben in Feature-Komponenten
- Badge als Ersatz fuer fehlende Erklaerung

### 2.9 Icons

Verpflichtend:
- Ein konsistentes Icon-Set fuer funktionale UI-Elemente.
- Einheitliche Groessenstufen und Ausrichtung.

Nicht erlaubt:
- Mix aus StudioIcons, Inline-SVGs und Emojis fuer dieselbe Funktionsebene
- Emoji-Icons fuer funktionale Aktionen

Hinweis:
- Emojis sind nur in seltenen, rein illustrativen Hilfekontexten erlaubt, nie fuer primaere Funktionselemente.

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

## 8. Token- Und Stil-Disziplin

- Farben nur ueber Theme-Variablen und bestehende Tokens.
- Spacing nur ueber definierte Abstands-Skalen.
- Typografie nur ueber definierte Rollen (Headline, Subheadline, Body, Meta, Label).
- Keine Bereichs-Sonderlogik fuer Radius/Shadow/Border ohne zentrale Freigabe.

---

## 9. Produktloop-Check In Der UI

Jeder neue oder geaenderte Screen muss mindestens einen dieser Punkte klar unterstuetzen:

- Fokus setzen
- Links/QR teilen
- Performance sehen

Wenn ein Screen keinen Bezug zum Produktloop zeigt, muss sein Nutzen fuer den Loop explizit benannt werden (z. B. vorbereitende Einstellungs- oder Inhaltsarbeit).

---

## 10. Geltung

Diese Regeln sind fuer MVP-Slices verbindlich.
Abweichungen sind nur erlaubt, wenn sie:
- dokumentiert sind,
- zentral freigegeben sind,
- und als Systemverbesserung in den zentralen Komponenten landen.
