# Studio Redesign â€“ Detaillierte Todo-Liste

> **Ziel:** Rein optisches Remake des Studios fÃ¼r die Zielgruppe Metal-Bands.
> **Leitbild:** "The Backstage" â€“ Dark, kontrolliert, kraftvoll, konsistent.
> **Regel:** Keine Logik-Ã„nderungen, keine neuen Dependencies (auÃŸer explizit begrÃ¼ndet), Theme-Farben Ã¼ber CSS-Variablen.

---

## Inhaltsverzeichnis

- [Phase 0: Vorbereitung & Grundlagen](#phase-0-vorbereitung--grundlagen)
- [Phase 1: Layout & Navigation](#phase-1-layout--navigation)
- [Phase 2: Einheitliches Seiten-Layout (Page Shell)](#phase-2-einheitliches-seiten-layout-page-shell)
- [Phase 3: Tab-Seiten einzeln umbauen](#phase-3-tab-seiten-einzeln-umbauen)
- [Phase 4: QR-Code Feature (projektweite Ã„nderung)](#phase-4-qr-code-feature-projektweite-Ã¤nderung)
- [Phase 5: Feinschliff & Konsistenz](#phase-5-feinschliff--konsistenz)
- [Phase 6: Dokumentation](#phase-6-dokumentation)
- [Datei-Übersicht](#datei-Übersicht-Ã¤nderungen--neuerstellungen--lÃ¶schungen)
- [Checkliste zum Abhaken](#checkliste-zum-abhaken)

---

## Phase 0: Vorbereitung & Grundlagen

### 0.1 â€“ Studio-Theme als CSS-Variablen definieren
- **Datei Ã¤ndern:** `apps/web/src/app/globals.css`
- Neuen Scope `.studio-theme` (oder via `data-theme="studio"`) definieren mit:
  - `--studio-bg: #0A0A0F` (Haupthintergrund)
  - `--studio-surface: #14141C` (Cards, Panels, Navbar)
  - `--studio-surface-elevated: #1C1C28` (Hover-States, aktive Tabs)
  - `--studio-border: #2A2A3A` (Trennlinien)
  - `--studio-text-primary: #EAEAF0` (Ãœberschriften)
  - `--studio-text-secondary: #8888A0` (Beschreibungen, Meta)
  - `--studio-accent: #E63946` (CTAs, aktiver Tab)
  - `--studio-accent-hover: #FF4D5A` (Hover auf Accent)
  - `--studio-accent-muted: rgba(230, 57, 70, 0.15)` (Tags, Badges)
  - `--studio-success: #22C55E` (Live-Status)
  - `--studio-warning: #F59E0B` (Entwurf-Status)
- **Wichtig:** Keine HEX-Farben in Komponenten hardcoden! Alles Ã¼ber diese Variablen.
- PrÃ¼fen ob das bestehende Theme-System in `apps/web/src/lib/theme/` Konflikte erzeugt. Das Studio-Theme ist **intern fest**, nicht vom User Ã¤nderbar. Die User-Themes (`apps/web/src/lib/theme/themes.ts`) gelten nur fÃ¼r die Public Page.

### 0.2 â€“ Globale Studio-Utility-Klassen erstellen
- **Datei Ã¤ndern:** `apps/web/src/app/globals.css`
- Tailwind-kompatible Utility-Klassen fÃ¼r wiederkehrende Studio-Patterns:
  - `.studio-card` â†’ Background, Border, Border-Radius (8px), Padding (24px), kein Shadow, Hover-Border
  - `.studio-page-header` â†’ Flex, Justify-between, Items-center, Border-bottom
  - `.studio-h1` â†’ Uppercase, Bold, Letter-Spacing 0.05em, Text-Primary
  - `.studio-h2` â†’ Semibold, Normal-Case, Text-Primary
  - `.studio-subtitle` â†’ Text-Secondary, 14px
  - `.studio-input` â†’ Surface-Elevated Background, Border, Text-Primary, Focus: Accent-Border
  - `.studio-badge-live` â†’ Success-Farbe
  - `.studio-badge-draft` â†’ Warning-Farbe
  - `.studio-badge-ended` â†’ Text-Secondary

### 0.3 â€“ Typografie-Anpassungen
- **Datei prÃ¼fen:** `apps/web/src/app/layout.tsx` (Font-Imports)
- Inter ist bereits im Projekt â†’ keine neue Dependency nÃ¶tig.
- JetBrains Mono fÃ¼r Mono-Daten (URLs, Handles, Stats): PrÃ¼fen ob `font-mono` in Tailwind Config bereits auf eine passende Mono-Font zeigt. Falls ja, beibehalten. Falls nein, System-Mono (`ui-monospace, monospace`) verwenden â€“ **keine neue Font-Dependency**.

---

## Phase 1: Layout & Navigation

### 1.1 â€“ Studio-Layout auf Sidebar umbauen (Desktop)
- **Datei Ã¤ndern:** `apps/web/src/app/(studio)/layout.tsx`
- Aktuelles Layout: `StudioNavbar` oben + Content darunter.
- Neues Layout:
  - **Desktop (â‰¥1024px):** Sidebar links (220px) + Content rechts (flex-1)
  - **Tablet (768â€“1023px):** Sidebar collapsed (64px, nur Icons) + Content
  - **Mobile (<768px):** Keine Sidebar, Bottom-Navigation-Bar + Content fullwidth
- Body/Main-Bereich: `background: var(--studio-bg)`, `color: var(--studio-text-primary)`
- Min-height: 100vh
- Das `studio-theme` Class/Data-Attribut auf dem Layout-Wrapper setzen, damit alle CSS-Variablen greifen.

### 1.2 â€“ StudioNavbar â†’ StudioSidebar umbauen
- **Datei Ã¤ndern:** `apps/web/src/components/studio/StudioNavbar.tsx` (umbenennen zu `StudioSidebar.tsx` oder Inhalt komplett ersetzen)
- **Sidebar-Struktur (Desktop expanded):**
  ```
  Logo (Vibaro, klein, Accent-Color)
  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  DASHBOARD         (Icon: LayoutGrid / Grid2x2)
  Übersicht
  
  MEINE SEITE       (Icon: FileEdit / FilePen)
  Seite bearbeiten
  
  PROJEKT           (Icon: Zap / Bolt)
  Aktives Projekt
  
  TEILEN            (Icon: Megaphone)
  Links & Sharing
  
  ERGEBNISSE        (Icon: TrendingUp)
  Stats & Daten
  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  âš™ Einstellungen   (fixiert unten)
  â†— Seite ansehen   (fixiert unten, Ã¶ffnet Public Page)
  ```
- **Aktiver Tab:** Linker Border (3px, Accent-Color), Background: Surface-Elevated
- **Inaktiver Tab:** Kein Border, Background: transparent, Text: Text-Secondary, Hover: Surface-Elevated
- **Icons:** Lucide-Icons verwenden (bereits im Projekt), aber **Filled-Varianten** bevorzugen wo verfÃ¼gbar. Konkret:
  - `LayoutGrid` statt `Home`
  - `FilePen` statt `Globe`
  - `Zap` statt `FolderKanban`
  - `Megaphone` statt `Share2`
  - `TrendingUp` statt `BarChart3`
  - `Settings` (bleibt)
  - `ExternalLink` fÃ¼r "Seite ansehen"
- **Collapsed-State (Tablet):** Nur Icons, zentriert, Tooltip on hover
- Transition zwischen expanded/collapsed: `transition: width 200ms ease`

### 1.3 â€“ Mobile Bottom-Navigation erstellen
- **Neue Datei:** `apps/web/src/components/studio/StudioBottomNav.tsx`
- 5 Icons (gleiche wie Sidebar), zentriert in einer 64px hohen Bar
- Background: Surface, Border-Top: 1px solid Border
- Aktiver Tab: Icon in Accent-Color + kleiner roter Dot (4px) darunter
- Fixiert am unteren Bildschirmrand (`fixed bottom-0`)
- Nur sichtbar unter 768px Breakpoint
- **Achtung:** Content-Bereich braucht `padding-bottom: 80px` auf Mobile, damit nichts verdeckt wird.

### 1.4 â€“ "Seite ansehen"-Link hinzufÃ¼gen
- **Datei Ã¤ndern:** `StudioSidebar.tsx` (neu)
- Link unten in der Sidebar, der zur Public Page (`/p/[handle]`) navigiert
- `target="_blank"`, `rel="noopener noreferrer"`
- Icon: `ExternalLink`
- Den Handle aus dem User/Page-Context ziehen (prÃ¼fen wie der Handle aktuell im Studio verfÃ¼gbar ist, vermutlich via `usePublicPage()` oder API-Call)

---

## Phase 2: Einheitliches Seiten-Layout (Page Shell)

### 2.1 â€“ Studio Page Header Komponente erstellen
- **Neue Datei:** `apps/web/src/components/studio/StudioPageHeader.tsx`
- Props: `title: string`, `subtitle?: string`, `action?: ReactNode`
- Layout: Flex, justify-between, items-center
- Titel: H1, Uppercase, Bold, Letter-Spacing, Text-Primary
- Subtitle: Text-Secondary, 14px
- Action-Slot: Rechts ausgerichtet (z.B. Button "VerÃ¶ffentlichen")
- Border-Bottom: 1px solid Border, Margin-Bottom: 24px, Padding-Bottom: 16px

### 2.2 â€“ Studio Content Card Komponente erstellen
- **Neue Datei:** `apps/web/src/components/studio/StudioCard.tsx`
- Props: `title?: string`, `children: ReactNode`, `accentBorder?: boolean`, `className?: string`
- Styles: Background Surface, Border 1px Border, Border-Radius 8px, Padding 24px
- Kein Box-Shadow
- Hover: Border-Color â†’ Accent-Muted (nur wenn interaktiv/klickbar, via optionale Prop)
- Optional: Linker Accent-Border (3px, fÃ¼r Highlight-Cards wie "Aktives Projekt")
- Optionaler Title im Card-Header: H3, Semibold, Margin-Bottom 16px

### 2.3 â€“ Studio Empty State Komponente erstellen
- **Neue Datei:** `apps/web/src/components/studio/StudioEmptyState.tsx`
- Props: `icon?: LucideIcon`, `title: string`, `description: string`, `action?: ReactNode`
- Layout: Zentriert, vertikal gestackt
- Icon: GroÃŸ (48px), Border-Farbe (subtil)
- Text: Title in Text-Primary (18px, Semibold), Description in Text-Secondary (14px, max 2 Zeilen)
- Action: CTA-Button darunter

### 2.4 â€“ Studio Button Styles definieren
- **Datei Ã¤ndern:** Bestehende Button-Komponente prÃ¼fen (`apps/web/src/components/ui/button.tsx`)
- Neue Varianten hinzufÃ¼gen oder Studio-spezifische Overrides:
  - **Primary CTA:** Background Accent, Text White, Border-Radius 6px, Uppercase, 14px, Bold, Letter-Spacing +0.05em
  - **Secondary:** Background transparent, Border: Border-Color, Text: Text-Primary, Hover: Surface-Elevated
  - **Danger:** Background transparent, Border: Red/30%, Text: Red, Hover: Red Background
  - **Ghost:** Kein Border, Text: Text-Secondary, Hover: Underline
- Alle Buttons: `transition: all 150ms ease`
- Focus: `outline: 2px solid Accent, outline-offset: 2px`

### 2.5 â€“ Studio Input/Form Styles definieren
- **Datei Ã¤ndern:** Bestehende Input-Komponente prÃ¼fen (`apps/web/src/components/ui/input.tsx`)
- Studio-Context-Overrides:
  - Background: Surface-Elevated
  - Border: 1px solid Border
  - Text: Text-Primary
  - Placeholder: Text-Secondary
  - Focus: Border-Color â†’ Accent
  - Border-Radius: 6px

---

## Phase 3: Tab-Seiten einzeln umbauen

### 3.1 â€“ Dashboard (Home) umbauen
- **Datei Ã¤ndern:** `apps/web/src/app/(studio)/dashboard/page.tsx` (oder entsprechender Home-Route)
- StudioPageHeader einfÃ¼gen: "DASHBOARD" / "Willkommen zurÃ¼ck, [Bandname]"
- **Stat-Cards Row** (3er Grid):
  - Neue Sub-Komponente: `StudioStatCard.tsx` in `apps/web/src/components/studio/`
  - Props: `value: string | number`, `label: string`, `trend?: { value: string, positive: boolean }`
  - GroÃŸe Zahl (32px, Bold, Text-Primary), Label (14px, Text-Secondary), Trend-Pfeil (GrÃ¼n/Rot, 12px)
  - Falls noch keine Daten: Wert "â€“" anzeigen (kein Ladeindikator, kein Error)
- **Aktives-Projekt-Card:** StudioCard mit `accentBorder`, Projekt-Titel, Status-Badge, Link "Zum Projekt â†’"
- **Seiten-Status-Card:** StudioCard, Published-Status (Dot grÃ¼n/gelb + Text), URL in Mono, Link "Bearbeiten â†’"
- **Empty State** (kein Projekt, keine Seite): StudioEmptyState mit passendem Text

### 3.2 â€“ Meine Seite umbauen
- **Datei Ã¤ndern:** `apps/web/src/app/(studio)/my-page/page.tsx` (oder entsprechend)
- StudioPageHeader: "MEINE SEITE" / Action: Button "VerÃ¶ffentlichen"
- **Desktop Split-Layout:**
  - Links (40%): Live-Preview in simuliertem Phone-Frame
    - Neue Sub-Komponente: `StudioPhonePreview.tsx` in `apps/web/src/components/studio/`
    - Dunkler Rahmen (Border, Border-Radius 24px), zeigt die Public Page verkleinert
    - Kann ein iframe sein (auf eigene `/p/[handle]` zeigend) oder eine statische Vorschau-Komponente
    - **Entscheidung nÃ¶tig:** iframe wÃ¤re einfacher aber ggf. Performance-Problem. Empfehlung: Vereinfachte statische Vorschau-Komponente, die die gleichen Daten rendert.
  - Rechts (60%): Bearbeitungsformular (bestehend, nur gestylt mit Studio-Input-Styles)
- **Mobile:** Kein Split, nur Formular, Preview Ã¼ber Toggle-Button oder gar nicht
- Alle Form-Felder mit Studio-Input-Styles versehen
- Link-Liste: Bestehende Darstellung beibehalten, aber visuell vereinheitlichen (Studio-Cards)

### 3.3 â€“ Projekt umbauen
- **Datei Ã¤ndern:** `apps/web/src/app/(studio)/project/page.tsx` (oder entsprechend)
- StudioPageHeader: "PROJEKT" / Action: ggf. "Neues Projekt"
- **Projekt-Card:**
  - Titel groÃŸ, Uppercase
  - Status-Badge: Neue Sub-Komponente `StudioStatusBadge.tsx`
    - `LIVE` â†’ grÃ¼ner Dot + grÃ¼ner Text auf Accent-Muted-Green Background
    - `ENTWURF` â†’ gelber Dot + Text
    - `BEENDET` â†’ grauer Dot + Text
  - Optional: Fortschrittsbalken (dÃ¼nner horizontaler Balken, Accent-Red gefÃ¼llt)
  - Verbleibende Tage als Text-Secondary
- **Projekt-Einstellungen:** In Sektionen/Akkordeons gruppieren (visuell, nicht unbedingt technisch collapsible)
  - Jede Sektion als eigene StudioCard
- **Empty State:** "Kein aktives Projekt. Starte eine Kampagne." + CTA

### 3.4 â€“ Teilen umbauen
- **Datei Ã¤ndern:** `apps/web/src/app/(studio)/share/page.tsx` (oder entsprechend)
- StudioPageHeader: "TEILEN" / "Verbreite deine Seite"
- **URL-Bereich:** Zentriert, prominent
  - URL in Mono-Font, in einer Surface-Elevated Box
  - Copy-Button rechts daneben (Icon: `Copy`, Feedback: "Kopiert!" als kurzer Toast oder Text-Swap)
- **Social-Share-Buttons:** 4er Row, quadratische Icon-Buttons
  - Instagram, Facebook, Twitter/X, WhatsApp
  - Bestehende Share-Logik beibehalten, nur visuell umgestalten
  - Icons: Lucide hat keine Brand-Icons â†’ PrÃ¼fen ob bereits Brand-Icons im Projekt sind. Falls nicht: Einfache Text-Labels in quadratischen Buttons als Fallback ("IG", "FB", "X", "WA") â€“ **keine neue Icon-Library hinzufÃ¼gen**.
- **QR-Code-Bereich:** StudioCard
  - QR-Code-Darstellung (siehe Phase 4 â€“ QR-Code)
  - Text: "Perfekt fÃ¼r Flyer, Merch & Backstage-PÃ¤sse"
  - Download-Button: "Download PNG"

### 3.5 â€“ Ergebnisse umbauen
- **Datei Ã¤ndern:** `apps/web/src/app/(studio)/results/page.tsx` (oder entsprechend)
- StudioPageHeader: "ERGEBNISSE" / "Stats & Daten"
- **Kennzahlen-Row:** StudioStatCards (wie Dashboard, aber detaillierter)
  - Aufrufe, Klicks, Klickrate, ggf. nach Plattform
- **Zeitverlauf:** Einfacher Balken-/Liniendiagramm
  - PrÃ¼fen ob Chart-Library bereits im Projekt ist. Falls nicht: **Kein neues Package**. Stattdessen einfache CSS-Balken (div-basiert) als MVP. Sieht im Dark-Theme gut aus.
  - Accent-Red fÃ¼r Highlight-Datenpunkte, Text-Secondary fÃ¼r Achsenbeschriftungen
- **Tabellen:** Zebra-Striping mit Surface / Surface-Elevated alternierend
  - Text-Primary fÃ¼r Werte, Text-Secondary fÃ¼r Labels
  - Border-Bottom je Zeile: Border-Color
- **Empty State:** "Noch keine Daten. Sobald deine Seite live ist, siehst du hier die Ergebnisse."

---

## Phase 4: QR-Code Feature (projektweite Ã„nderung)

### 4.1 â€“ QR-Code-Generierung evaluieren
- **PrÃ¼fen:** Ist eine QR-Code-Library bereits im Projekt? (`package.json` durchsuchen)
- **Falls nein:** Clientseitige Generierung mit `qrcode` (npm) oder `qrcode.react`
  - **BegrÃ¼ndung:** QR-Code ist ein Kern-Feature der Teilen-Seite, kann nicht sinnvoll ohne Library gelÃ¶st werden.
  - **Empfehlung:** `qrcode.react` â€“ kleinstes Bundle, React-nativ, keine Server-Dependency.
  - **Dependency-Regel:** Im PR explizit begrÃ¼nden warum nÃ¶tig.
- **Falls ja:** Bestehende Library verwenden.

### 4.2 â€“ QR-Code-Komponente erstellen
- **Neue Datei:** `apps/web/src/components/studio/StudioQRCode.tsx`
- Props: `url: string`, `size?: number` (default: 200)
- Rendert QR-Code mit:
  - Dunklem Hintergrund (Surface) und hellen Modulen (Text-Primary) â†’ invertiertes Schema fÃ¼r Dark-UI
  - Oder: WeiÃŸer Hintergrund mit schwarzen Modulen in einem abgerundeten Container (klassisch, besser scanbar)
- **Empfehlung:** Klassisch (weiÃŸ/schwarz) fÃ¼r maximale Scan-KompatibilitÃ¤t, eingebettet in eine StudioCard.

### 4.3 â€“ QR-Code Download-Funktion
- **In gleicher Datei:** `StudioQRCode.tsx`
- Button "Download PNG" â†’ Canvas-to-Blob â†’ Download-Trigger
- Dateiname: `vibaro-qr-[handle].png`
- Keine Server-Roundtrip nÃ¶tig, alles clientseitig.

---

## Phase 5: Feinschliff & Konsistenz

### 5.1 â€“ Transitions & Hover-States durchgÃ¤ngig prÃ¼fen
- Alle interaktiven Elemente im Studio: `transition: all 150ms ease`
- Cards: Border-Color â†’ Accent-Muted on hover (nur wenn klickbar)
- Buttons: `filter: brightness(1.1)` on hover fÃ¼r Primary
- **Keine** Bounce/Spring-Animationen, keine Glow-Effekte

### 5.2 â€“ Focus-States fÃ¼r Accessibility
- Alle fokussierbaren Elemente: `outline: 2px solid var(--studio-accent)`, `outline-offset: 2px`
- Gut sichtbar auf dunklem Hintergrund
- Tastatur-Navigation durch Sidebar testen

### 5.3 â€“ Responsive Testing
- Desktop (â‰¥1024px): Sidebar expanded, Split-Layouts funktionieren
- Tablet (768â€“1023px): Sidebar collapsed, Content fÃ¼llt Raum
- Mobile (<768px): Bottom-Nav, kein Split-Layout, Fullwidth-Content
- Padding-Bottom auf Mobile fÃ¼r Bottom-Nav (80px)

### 5.4 â€“ Dark-Mode-only sicherstellen
- Studio hat **keinen Light-Mode**. PrÃ¼fen dass kein `dark:` Tailwind-Prefix nÃ¶tig ist und kein System-Preference das Theme Ã¼berschreibt.
- Falls das Projekt global ein Light/Dark-Toggle hat: Im Studio-Layout forcieren, dass immer das dunkle Studio-Theme aktiv ist.

### 5.5 â€“ Bestehende Komponenten aufrÃ¤umen
- Nach Umbau: Alte `StudioNavbar.tsx` entfernen (falls durch `StudioSidebar.tsx` ersetzt)
- PrÃ¼fen ob andere Stellen im Projekt die alte Navbar importieren
- Unbenutzte Imports/Styles entfernen

---

## Phase 6: Dokumentation

### 6.1 â€“ THEMES.md aktualisieren (nur falls nÃ¶tig)
- **Datei Ã¤ndern:** `docs/THEMES.md`
- Abschnitt ergÃ¤nzen: "Studio-Theme (intern, nicht user-facing)" mit Variablen-Liste
- Klarstellen: Studio-Theme â‰  Public-Page-Themes

### 6.2 â€“ ARCHITECTURE.md aktualisieren (nur falls nÃ¶tig)
- **Datei Ã¤ndern:** `docs/ARCHITECTURE.md`
- Falls Sidebar-Layout eine architektonische Ã„nderung darstellt: kurz dokumentieren
- Falls QR-Code als neues Feature gilt: kurz unter "Features" erwÃ¤hnen

---

## Datei-Übersicht: Ã„nderungen / Neuerstellungen / LÃ¶schungen

### GeÃ¤nderte Dateien
| Datei | Ã„nderung |
|---|---|
| `apps/web/src/app/globals.css` | Studio-Theme CSS-Variablen + Utility-Klassen |
| `apps/web/src/app/(studio)/layout.tsx` | Sidebar-Layout statt Top-Navbar |
| `apps/web/src/components/studio/StudioNavbar.tsx` | Ersetzen durch StudioSidebar (oder umbenennen + umbauen) |
| `apps/web/src/app/(studio)/dashboard/page.tsx` | Redesign mit neuen Komponenten |
| `apps/web/src/app/(studio)/my-page/page.tsx` | Split-Layout, Preview, Form-Styles |
| `apps/web/src/app/(studio)/project/page.tsx` | Card-basiertes Layout, Status-Badges |
| `apps/web/src/app/(studio)/share/page.tsx` | URL-Box, Social-Buttons, QR-Code |
| `apps/web/src/app/(studio)/results/page.tsx` | Stat-Cards, Tabellen-Styles |
| `apps/web/src/components/ui/button.tsx` | Studio-Varianten hinzufÃ¼gen |
| `apps/web/src/components/ui/input.tsx` | Studio-Style-Overrides |
| `docs/THEMES.md` | Studio-Theme dokumentieren |

### Neue Dateien
| Datei | Zweck |
|---|---|
| `apps/web/src/components/studio/StudioSidebar.tsx` | Vertikale Navigation (Desktop + Tablet) |
| `apps/web/src/components/studio/StudioBottomNav.tsx` | Mobile Bottom-Navigation |
| `apps/web/src/components/studio/StudioPageHeader.tsx` | Einheitlicher Seiten-Header |
| `apps/web/src/components/studio/StudioCard.tsx` | Einheitliche Content-Card |
| `apps/web/src/components/studio/StudioEmptyState.tsx` | Leere ZustÃ¤nde |
| `apps/web/src/components/studio/StudioStatCard.tsx` | Statistik-Kennzahl-Card |
| `apps/web/src/components/studio/StudioStatusBadge.tsx` | Status-Badges (Live/Entwurf/Beendet) |
| `apps/web/src/components/studio/StudioPhonePreview.tsx` | Handy-Preview fÃ¼r "Meine Seite" |
| `apps/web/src/components/studio/StudioQRCode.tsx` | QR-Code-Anzeige + Download |

### Zu lÃ¶schende Dateien
| Datei | Grund |
|---|---|
| `apps/web/src/components/studio/StudioNavbar.tsx` | Ersetzt durch StudioSidebar (falls neue Datei statt Umbau) |

### Neue Dependencies (BegrÃ¼ndung erforderlich)
| Package | Zweck | BegrÃ¼ndung |
|---|---|---|
| `qrcode.react` | QR-Code-Rendering | Kern-Feature der Teilen-Seite, keine sinnvolle Eigenimplementierung mÃ¶glich, kleines Bundle (~5kb), kein Server nÃ¶tig |

---

## Checkliste zum Abhaken

### Phase 0: Vorbereitung
- [x] Studio CSS-Variablen in `globals.css` definiert
- [x] Studio Utility-Klassen (`.studio-card`, `.studio-h1` etc.) erstellt
- [x] Typografie geprÃ¼ft (Inter vorhanden, Mono-Font geklÃ¤rt â†’ Geist Mono via `--font-geist-mono`, kein neues Package nÃ¶tig)

### Phase 1: Layout & Navigation
- [x] `layout.tsx` auf Sidebar-Layout umgebaut (Desktop/Tablet/Mobile)
- [ ] `StudioSidebar.tsx` erstellt und funktionsfÃ¤hig
- [x] Sidebar: Alle 5 Tabs mit neuen Icons und Styling
- [x] Sidebar: Aktiver Tab visuell hervorgehoben (Accent-Border links)
- [ ] Sidebar: Collapsed-State fÃ¼r Tablet funktioniert
- [x] Sidebar: "Seite ansehen" und "Einstellungen" Links unten fixiert
- [ ] `StudioBottomNav.tsx` erstellt und funktionsfÃ¤hig
- [x] Bottom-Nav: Nur auf Mobile sichtbar (<768px)
- [x] Bottom-Nav: Aktiver Tab mit Accent-Color + Dot
- [ ] Content-Bereich: Padding-Bottom auf Mobile fÃ¼r Bottom-Nav
- [x] Alte `StudioNavbar.tsx` entfernt / ersetzt (StudioHeader + StudioTabs durch StudioSidebar + StudioBottomNav ersetzt; Aufräumen in Phase 5)

### Phase 2: Einheitliche Komponenten
- [x] `StudioPageHeader.tsx` erstellt (Title, Subtitle, Action-Slot)
- [x] `StudioCard.tsx` erstellt (Surface, Border, optional Accent-Border)
- [x] `StudioEmptyState.tsx` erstellt (Icon, Title, Description, Action)
- [x] `StudioStatCard.tsx` erstellt (Value, Label, Trend)
- [x] `StudioStatusBadge.tsx` erstellt (Live/Entwurf/Beendet)
- [x] Button-Varianten für Studio definiert (Primary/Secondary/Danger/Ghost) → `StudioButton.tsx` + `.studio-btn-*` CSS-Klassen in `globals.css`
- [x] Input-Styles für Studio definiert (Dark-Inputs) → `.studio-input` bereits in `globals.css` vorhanden

### Phase 3: Tab-Seiten
- [x] **Dashboard:** PageHeader eingebaut
- [x] **Dashboard:** Stat-Cards-Row implementiert
- [x] **Dashboard:** Aktives-Projekt-Card mit Accent-Border
- [x] **Dashboard:** Seiten-Status-Card
- [x] **Dashboard:** Empty State für keine Daten
- [x] **Meine Seite:** PageHeader mit "Veröffentlichen"-Button
- [ ] **Meine Seite:** Split-Layout (Desktop: Preview links, Form rechts) — zurückgestellt, aktuell Section-Grid
- [ ] **Meine Seite:** `StudioPhonePreview.tsx` erstellt — zurückgestellt
- [ ] **Meine Seite:** Form-Felder mit Studio-Input-Styles
- [ ] **Meine Seite:** Mobile: Kein Split, nur Formular
- [x] **Projekt:** PageHeader eingebaut
- [x] **Projekt:** Projekt-Card mit Status-Badge
- [x] **Projekt:** Einstellungen in Sektionen gruppiert
- [x] **Projekt:** Empty State
- [x] **Teilen:** PageHeader eingebaut
- [x] **Teilen:** URL-Box prominent + Copy-Button mit Feedback
- [x] **Teilen:** Link-Rows visuell vereinheitlicht (Social-Share-Buttons deferred zu Phase 4)
- [x] **Teilen:** QR-Code-Card mit Beschreibung — Phase 4
- [x] **Ergebnisse:** PageHeader eingebaut
- [x] **Ergebnisse:** Kennzahlen-Row mit StatCards
- [x] **Ergebnisse:** Zeitverlauf-Darstellung (CSS-Balken)
- [x] **Ergebnisse:** Tabellen mit Zebra-Striping
- [x] **Ergebnisse:** Empty State

### Phase 4: QR-Code
- [x] `qrcode.react` evaluiert und installiert (v4.2.0; Kern-Feature, keine sinnvolle Eigenimplementierung, ~5kb, kein Server nötig)
- [x] `StudioQRCode.tsx` erstellt (Rendering + Styling)
- [x] Download-Funktion (PNG, clientseitig) implementiert
- [ ] QR-Code scanbar getestet (Kontrast weiÃŸ/schwarz)

### Phase 5: Feinschliff
- [x] Transitions auf allen interaktiven Elementen (150ms ease) — `globals.css`: `.studio-btn`, `.studio-card`, `.studio-input`, Sidebar-Links, BottomNav
- [x] Hover-States konsistent (Cards, Buttons, Nav-Items) — `.studio-card-interactive:hover`, `.studio-btn-*:hover`, Sidebar hover: Surface-Elevated
- [x] Focus-States sichtbar und konsistent (Accent-Outline) — `[data-theme="studio"] *:focus-visible { outline: 2px solid var(--studio-accent); outline-offset: 2px; }` in `globals.css`
- [ ] Responsive Testing: Desktop (≥1024px) bestanden
- [ ] Responsive Testing: Tablet (768–1023px) bestanden
- [ ] Responsive Testing: Mobile (<768px) bestanden
- [x] Dark-Mode-only im Studio sichergestellt (kein Light-Mode-Bleed) — alle `dark:`-Varianten und `bg-white`/`bg-gray-*` aus Studio-Komponenten entfernt (`SpotlightCard`, `CreateSpotlightForm`, `EditSpotlightModal`, `MusicClient`)
- [x] Alte/unbenutzte Imports und Styles entfernt — `StudioHeader.tsx`, `StudioTabs.tsx`, `SpotlightClient.tsx` gelöscht
- [x] Kein HEX-Farbwert direkt in Komponenten (alles über CSS-Variablen) — `bg-[#0A0A0A]` in `MusicClient.tsx` entfernt; `#ffffff`/`#000000` in `StudioQRCode.tsx` sind intentionale Ausnahme (maximale Scan-Kompatibilität)

### Phase 6: Dokumentation
- [ ] `docs/THEMES.md` aktualisiert (Studio-Theme Variablen)
- [ ] `docs/ARCHITECTURE.md` aktualisiert (falls architektonische Ã„nderung)
- [ ] Diese Todo-Datei als erledigt markiert

### Finale Abnahme
- [ ] Jede Studio-Seite sieht visuell konsistent aus (gleiche Cards, gleiche Header, gleiche Spacing)
- [ ] Navbar/Sidebar fÃ¼hlt sich intuitiv an und sieht hochwertig aus
- [ ] Gesamteindruck: "Backstage einer Metal-Band", nicht "SaaS-Dashboard"
- [ ] Keine Logik-Regressionen (alle bestehenden Features funktionieren weiterhin)
- [ ] Keine kaputten Empty States (jede Seite hat einen)
