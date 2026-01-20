# Vibaro – Editorial Template

**Template-ID:** `editorial`
**Plan:** Artist
**Rolle:** Signature / High-End
**Modus:** Dark only

---

## 0. Leitidee (nicht verhandelbar)

> **Editorial ist kein Hero-Template.**
> Es ist textgeführt, ruhig und reduziert.
> Bilder begleiten – Typografie führt.

Wenn eine Entscheidung zwischen **mehr** und **weniger** steht, ist **weniger korrekt**.

---

## 1. Design-Prinzipien

### 1.1 Haltung

* ruhig
* erwachsen
* kuratiert
* nicht marketinggetrieben

### 1.2 Editorial ≠ Landingpage

Nicht erlaubt:

* Full-Bleed Hero
* Centered Headlines
* Feature-Listen
* Conversion-CTAs

Erlaubt:

* Asymmetrie
* Leere
* Zurückhaltung

---

## 2. Layout-System

### 2.1 Seitenbreite

* Max-Width: `1200px`
* Horizontaler Innenabstand:
  `padding-inline: clamp(24px, 6vw, 96px);`

### 2.2 Textbreite

* Maximale Textzeilenlänge: `60ch`
* Gilt für alle längeren Texte

### 2.3 Raster

* Kein sichtbares Grid
* Spalten nur dort, wo sie dramaturgisch sinnvoll sind

---

## 3. Spacing-System (Tokens)

**Vertikaler Rhythmus ist essenziell.**

```css
--space-2xs: 8px;
--space-xs: 16px;
--space-sm: 32px;
--space-md: 56px;
--space-lg: 96px;
--space-xl: 160px;
--space-2xl: 240px;
```

### Regeln

* Zwischen großen Sektionen: `lg – 2xl`
* Zwischen Textblöcken: `sm – md`
* Abstand ersetzt Linien

---

## 4. Editorial Opening (ersetzt Hero)

### 4.1 Funktion

* Einstieg über Typografie
* Kein visueller „Knall"
* Kein Above-the-Fold-Zwang

### 4.2 Aufbau

**Zweispaltig, asymmetrisch (Desktop)**

* Links: **Text (dominant, ~60 %)**
* Rechts: **Bild (begleitend, ~40 %)**

**Mobile**

* Text zuerst
* Bild darunter

### 4.3 Inhalt

**Text**

* Künstlername (primär)
* 1 Satz Statement
* Optional: Genre / Herkunft (Meta)

**Bild**

* genau ein Bild
* kein Overlay
* keine Effekte
* kein CTA

---

## 5. Typografie

### 5.1 Schrift

* **Inter**
* Eine Schriftfamilie, keine Alternativen

### 5.2 Typo-Hierarchie

| Element          | Gewicht | Größe (relativ) | Hinweise            |
| ---------------- | ------- | --------------- | ------------------- |
| Künstlername     | 600–700 | sehr groß       | Einstieg            |
| Statement        | 400–500 | mittel          | max. 2 Zeilen       |
| Section-Headline | 600     | mittel          | sparsam             |
| Body             | 400     | normal          | line-height 1.7–1.9 |
| Meta             | 400     | klein           | reduzierte Opacity  |

### 5.3 Ausrichtung

* Immer **links**
* Nie zentriert
* Keine Textboxen

---

## 6. Farbkonzept (Editorial DNA)

### 6.1 Grundprinzip

> Farbe darf nicht auffallen.
> Sie unterstützt nur Lesbarkeit.

### 6.2 Farb-Tokens

```css
--bg-primary: #0E0E0F;
--bg-secondary: #141416;

--text-primary: #F4F4F5;
--text-secondary: #CFCFD2;
--text-muted: #8B8B91;

--border-subtle: rgba(255,255,255,0.08);
```

### Regeln

* Kein reines Schwarz
* Kein reines Weiß
* Keine Akzentfarben
* Keine Gradients

---

## 7. Inhalte & Sektionen

### 7.1 Intro-Text

* Direkt nach Opening
* Einspaltig
* Max. 6–8 Zeilen
* Kein Titel notwendig

---

### 7.2 Fokus-Sektion (genau **eine**)

Erlaubt:

* Featured Release **oder**
* Featured Video **oder**
* Upcoming Show

Nicht erlaubt:

* mehrere Fokus-Elemente
* Widgets nebeneinander

---

### 7.3 Galerie

* Kein Grid-Look
* Keine Slider
* Unterschiedliche Bildgrößen
* Unregelmäßige Abstände

> Die Galerie folgt einem Rhythmus, nicht einer Logik.

---

## 8. Medienregeln

### 8.1 Bilder

* dokumentarisch / editorial
* kein Stock-Look
* keine Filter
* keine Farbüberlagerungen

### 8.2 Videos

* maximal ein prominentes Video
* kein Autoplay
* dezentes Play-Icon

---

## 9. UI-Elemente

### 9.1 Links

* Farbe: `--text-secondary`
* Hover: `--text-primary`
* Kein permanenter Unterstrich

### 9.2 Buttons

> Editorial vermeidet Buttons.

Falls notwendig:

* transparent
* feine Border
* keine Füllfarbe
* kein Akzent

---

## 10. Mobile Verhalten

* Reihenfolge bleibt erhalten
* Text immer vor Bild
* Abstände bleiben groß
* Keine „Verdichtung" für Mobile

---

## 11. Was explizit verboten ist

* Full-Bleed Hero
* Centered Layouts
* Karten-UI
* Feature-Listen
* Marketing-CTAs
* Farbige Icons
* Decorative Lines

---

## 12. Abgrenzung zu anderen Templates

| Template      | Charakter                     |
| ------------- | ----------------------------- |
| Free          | klar, funktional              |
| Stage         | laut, live, energiegeladen    |
| **Editorial** | ruhig, textgeführt, kuratiert |

---

## 13. Copilot-Regeln (explizit)

> Copilot darf:
>
> * nur definierte Tokens verwenden
> * keine neuen Farben einführen
> * keine zentrierten Layouts erzeugen

> Aufmerksamkeit wird durch **Größe und Abstand**, nicht durch Farbe erzeugt.

---

## 14. Leitsatz

> **Editorial ist Raum.**
> **Alles, was nicht notwendig ist, wird entfernt.**

---

## 15. Mobile & Responsive Verhalten (bindend)

> **Editorial wird nicht „komprimiert", sondern neu gesetzt.**
> Mobile ist kein kleiner Desktop – es ist ein eigener Lesemodus.

---

### 15.1 Grundhaltung Mobile

#### Leitprinzip

* **Lesen vor Scrollen**
* **Text vor Bild**
* **Rhythmus vor Dichte**

Editorial Mobile fühlt sich an wie:

> ein ruhiger Artikel auf einem hochwertigen Reader
> nicht wie eine Landingpage auf dem Handy.

---

### 15.2 Breakpoints (konzeptionell)

Keine Designänderungen pro Breakpoint, nur **Layout-Umordnung**.

Empfohlen:

* Desktop: `≥ 1024px`
* Tablet: `768px – 1023px`
* Mobile: `< 768px`

---

### 15.3 Editorial Opening – Mobile

#### Reihenfolge (zwingend)

1. Künstlername
2. Statement
3. Meta (optional)
4. Bild

> **Text kommt immer vor dem Bild.**

---

#### Layout

* Einspaltig
* Kein Grid
* Kein Centering

#### Regeln

* Künstlername bleibt das dominante Element
* Bild **nie** oben
* Kein „Hero-Gefühl" erzeugen

---

### 15.4 Typografie Mobile

#### Grundsatz

> **Typografische Hierarchie bleibt erhalten.**
> Nur die absolute Größe skaliert leicht.

#### Regeln

* Künstlername:
  * weiterhin deutlich größer als alle anderen Texte
  * kein aggressives Downsizing
* Statement:
  * gleiche Gewichtung wie Desktop
* Body:
  * gleiche Line-Height
  * gleiche Lesebreite (keine Vollbreite erzwingen)

❌ Nicht erlaubt:

* enge Zeilen
* reduzierte Abstände
* kleinere Schrift „um Platz zu sparen"

---

### 15.5 Textbreite & Ränder (Mobile)

* Text bleibt **lesbar schmal**
* Kein „Edge-to-Edge"-Text

Empfehlung:

* Innenabstand: `24–32px`
* Max. Textbreite weiterhin visuell begrenzen (kein Vollbreit-Block)

---

### 15.6 Weißraum Mobile (sehr wichtig)

#### Regel

> Mobile bekommt **nicht weniger**, sondern **anders gesetzten** Raum.

#### Konkrete Vorgaben

* Zwischen großen Sektionen: `lg – xl`
* Zwischen Textblöcken: `md`
* Vor & nach Bildern: **mehr Abstand als Desktop**

Editorial Mobile darf sich **luftiger** anfühlen als Desktop.

---

### 15.7 Fokus-Sektion (Release / Video) – Mobile

* Ein Element pro Bildschirm
* Kein Nebeneinander
* Kein Sticky-UI
* Kein Autoplay

Wenn Video:

* Play-Icon dezent
* Keine Overlays
* Kein Vollbild-Zwang

---

### 15.8 Galerie – Mobile

#### Verhalten

* Ein Bild pro „Atemzug"
* Keine Slider
* Kein Masonry
* Kein Swipe-Zwang

#### Reihenfolge

* Bilder untereinander
* Unterschiedliche Abstände
* Rhythmus bleibt erhalten

> Mobile Galerie = ruhiges Durchblättern, kein Scroll-Stress.

---

### 15.9 Navigation & Footer – Mobile

#### Navigation

* Minimal
* Keine Icons
* Keine Hervorhebungen
* Kein Sticky Header

#### Footer

* stark reduziert
* kein CTA
* keine Sektionen

---

### 15.10 Interaktionen – Mobile

* Hover-Effekte dürfen **nicht vorausgesetzt** werden
* Links müssen auch ohne Hover klar funktionieren
* Keine Animationen, die Aufmerksamkeit erzwingen

---

### 15.11 Performance & Verhalten

* Keine großen Initial-Animationen
* Keine Scroll-Hijacks
* Kein „Reveal on Scroll"

Editorial Mobile fühlt sich **stabil und ruhig** an.

---

### 15.12 Was auf Mobile ausdrücklich VERBOTEN ist

* Hero-artige Einstiege
* Centered Headlines
* Text über Bildern
* „Mobile Optimierungen", die Design vereinfachen
* CTA-Fixierungen
* Sticky Player / Sticky Buttons

---

### 15.13 Copilot-Regeln (Mobile – explizit)

> Copilot darf auf Mobile:
>
> * nur Reihenfolge ändern, nicht Bedeutung
> * Abstände **nicht reduzieren**, sondern ggf. erhöhen
> * keine neuen Layoutmuster einführen

> **Mobile ist ein Lesemodus, kein Marketing-Modus.**

---

### 15.14 Editorial Mobile Leitsatz

> **Wenn Mobile sich schneller anfühlt als Desktop, ist es falsch.**
> Editorial darf sich langsam anfühlen – auch auf dem Handy.

---

## 16. GitHub Copilot Instructions (bindend)

> **Gültig nur für Template-ID `editorial`**
> Diese Regeln sind für GitHub Copilot bei der Arbeit am Editorial Template verbindlich.

---

### 16.1 Grundhaltung (oberste Regel)

> **Editorial ist kein Hero-Layout, keine Landingpage und kein Portfolio.**
> Es ist ein ruhiger, redaktioneller Raum.

Wenn eine Entscheidung zwischen:

* „klarer"
* oder „zurückhaltender"

steht, ist **zurückhaltender korrekt**.

---

### 16.2 Allgemeine Verbote (hart)

Copilot **DARF NICHT**:

* Full-Bleed Hero erzeugen
* zentrierte Headlines verwenden
* visuelle Symmetrie erzwingen
* Grid- oder Card-Layouts bauen
* Akzentfarben, Gradients oder Effekte einführen
* neue Farben außerhalb der definierten Tokens nutzen
* Inhalte gleichwertig darstellen

---

### 16.3 Editorial Opening (ersetzt Hero)

#### Ziel

Der Einstieg soll sich **nicht wie ein Start**, sondern wie ein **Ausschnitt** anfühlen.

#### Struktur (bindend)

* Zweispaltig (Desktop)
  * Links: Text (dominant)
  * Rechts: Bild (begleitend)
* Mobile: Text immer vor Bild

#### Regeln für Copilot

* **Top-Spacing bewusst groß setzen**
* Bild **nie** gleichwertig mit dem Künstlernamen platzieren
* Bild darf:
  * kleiner sein
  * weiter rechts stehen
  * tiefer sitzen als der Name
* Intro-Text **nicht direkt** an das Opening binden
  → eigener Abschnitt mit deutlichem Abstand

---

### 16.4 Typografie (Entscheidungslogik)

Copilot **MUSS**:

* Typografie über:
  1. Größe
  2. Gewicht
  3. Abstand
  
  steuern – **nicht über Farbe**
* Alle Texte linksbündig setzen
* Künstlername immer als primäres visuelles Element behandeln

Copilot **DARF NICHT**:

* Text zentrieren
* Text in Boxen oder Cards platzieren
* Typografie verdichten, um Platz zu sparen

---

### 16.5 Fokus-Prinzip (entscheidend)

> **Editorial hat genau EIN visuelles Herz.**

Copilot **MUSS**:

* ein Element klar priorisieren
  (z. B. Featured Release ODER Galerie)

Copilot **MUSS**:

* alle anderen Inhalte visuell entwerten durch:
  * kleinere Größe
  * weniger Abstand
  * ruhigere Platzierung

Copilot **DARF NICHT**:

* mehrere gleich große Fokus-Sektionen erzeugen

---

### 16.6 Galerie-Logik (keine Portfolios!)

Copilot **DARF NICHT**:

* gleich große Bilder untereinander platzieren
* gleichmäßige Abstände verwenden
* Masonry, Slider oder Grid-Gleichförmigkeit erzeugen

Copilot **MUSS**:

* visuelle Rhythmik erzeugen durch:
  * unterschiedliche Bildgrößen
  * bewusst unregelmäßige Abstände
  * mindestens eine große visuelle Pause

> Ziel: Verweilen, nicht Scrollen.

---

### 16.7 Asymmetrie-Regel

Copilot **MUSS**:

* leichte Asymmetrien zulassen
  * minimale Links- / Rechtsverschiebungen
  * unterschiedliche vertikale Abstände

Copilot **DARF NICHT**:

* alles exakt mittig oder perfekt ausbalanciert setzen

> Symmetrie wirkt produktig.
> Editorial braucht Haltung.

---

### 16.8 Shows & Funktionales

Copilot **MUSS**:

* Shows als funktionale Information behandeln
* sie visuell zurücknehmen
* näher an den Footer platzieren

Copilot **DARF NICHT**:

* Shows als Highlight inszenieren

---

### 16.9 Footer-Verhalten

Copilot **MUSS**:

* Footer sehr ruhig halten
* wenig Abstand nach oben lassen
* kein visuelles „Ende" erzeugen

> Editorial endet nicht – es verblasst.

---

### 16.10 Mobile-Spezifische Regeln

Copilot **MUSS**:

* Reihenfolge ändern, nicht Bedeutung
* Text immer vor Bild anzeigen
* Abstände **gleich lassen oder erhöhen**

Copilot **DARF NICHT**:

* Abstände reduzieren „für Mobile"
* Inhalte zusammenziehen
* Hero-artige Einstiege erzeugen

> Mobile ist ein Lesemodus, kein Marketing-Modus.

---

### 16.11 Entscheidungs-Fallback (wichtig)

Wenn Copilot unsicher ist:

1. Element weglassen
2. Abstand vergrößern
3. Gewicht reduzieren

> **Weniger ist immer korrekt.**

---

### 16.12 Editorial Leitsatz (bindend)

> **Editorial entsteht nicht durch Design –
> sondern durch das, was bewusst nicht gestaltet wird.**
