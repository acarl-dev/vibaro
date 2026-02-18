# Vibaro Product Rules (MVP – Legacy)

⚠️ Status: Legacy (V1)

Dieses Dokument beschreibt die ursprüngliche Produktdefinition 
(Mini-Homepage mit Free + Artist Plan).

Es ist nicht mehr die aktive Produktbasis.

Die aktuelle Produktdefinition ist in:
→ docs/PRODUCT_V2.md

Dieses Dokument bleibt aus historischen Gründen bestehen.
Neue Features dürfen sich nicht mehr auf dieses Dokument beziehen.


Vibaro ist ein B2C-SaaS für Musiker zur Erstellung einer persönlichen, ruhigen Mini-Website
unter `/p/[handle]`.

Leitidee:
> Die Seite des Künstlers – nicht die Seite des Tools.

---

## 1. Plans

### Free (MVP)
- Öffentliche Künstlerseite
- Basisprofil:
  - Display Name
  - Bio
- Fokus-Sektion: **Links**
- Vibaro Branding sichtbar (dezent, Footer)
- Keine Shows & Releases im Free-Plan (MVP-Regel)

### Artist (paid, später)
- Shows + Releases
- Fokus-Sektion frei wählbar (Links / Shows / Releases)
- Branding entfernt
- Mehr Varianten / Themes
- Basic Stats (nach MVP)

---

## 2. Identität & URL

### 2.1 Handle (URL)
- Eindeutig
- lowercase
- URL-safe (`a-z`, `0-9`, `-`)
- Keine Leerzeichen, keine Sonderzeichen
- Repräsentiert die **feste Webadresse** der Seite

**Wichtig**
- Handle ist standardmäßig **stabil**
- Eine Namensänderung darf die URL **nicht** beeinflussen

### 2.2 Display Name (Anzeigename)
- Frei editierbar
- Öffentlich sichtbar
- Darf Sonderzeichen & Großbuchstaben enthalten
- Kann jederzeit geändert werden
- Hat **keinen Einfluss** auf die URL

### 2.3 Option für später (nicht MVP)
- Handle-Änderung mit Warnhinweis
- Optionale Alias-/Redirect-Logik:
  - Alte Handles → neuer canonical Handle (HTTP 301)
- Geeignet für Artist Plan

---

## 3. Publishing Rules

### 3.1 Sichtbarkeit
- Eine Künstlerseite ist **nur öffentlich**, wenn `is_published = true`
- Nicht veröffentlichte Seiten sind **404**
- Kein „Coming soon“, kein Claiming-Flow

### 3.2 Mindestanforderungen zum Veröffentlichen (MVP)
Erforderlich:
- Handle
- Display Name
- Bio (nicht leer)

Nicht erforderlich:
- Links
- Shows
- Releases
- Themes
- Analytics

### 3.3 Unpublish
- Setzt `is_published = false`
- Öffentliche Seite wird wieder **404**

---

## 4. Onboarding (MVP)

### 4.1 Prinzipien
- Max. **3 Schritte**
- Linear, ruhig
- Kein Dashboard
- Live Preview ab Schritt 1

### 4.2 Schritte
**Step 0 – Intro**
- Kurze Orientierung
- CTA: „Los geht’s“

**Step 1 – Adresse & Name**
- Handle wählen (Availability Check)
- Display Name setzen
- Beide Felder Pflicht
- Live Preview aktiv

**Step 2 – Profil-Basics**
- Bio (Pflicht)
- Avatar optional
- Autosave

**Step 3 – Preview & Publish**
- Große Vorschau
- CTA:
  - „Veröffentlichen“
  - „Später weiter bearbeiten“

### 4.3 Login Redirect
- `is_onboarded = false` → `/studio/onboarding`
- sonst → `/studio`

---

## 5. Public Artist Page (MVP)

### 5.1 Seitenstruktur
1. Hero
2. Fokus-Sektion (genau eine)
3. Max. zwei weitere Sektionen (optional)
4. Footer (minimal)

### 5.2 Hero (immer)
- Display Name (dominant)
- Bio (kurz, max. ~300 Zeichen)
- Optional:
  - Hero Image
  - Avatar (Fallback)

Keine:
- Buttons
- Feature-Texte
- Marketing-Sprache

### 5.3 Fokus-Sektion
- Genau **eine**
- Free (MVP): Links
- Artist (später): Links / Shows / Releases
- Max. 3 Items

### 5.4 Weitere Sektionen
- Max. 2
- Nur rendern, wenn Inhalte vorhanden
- Keine leeren States

### 5.5 Inhalt & Tonalität
- Keine Emojis
- Keine Hashtags
- Keine CTA-Phrasen
- Klare Linktitel („Spotify“, „Tickets“)

### 5.6 Nicht Teil der Public Page (MVP)
- Likes, Kommentare
- Counter
- Popups
- Tool-Erklärungen
- Werbung

---

## 6. UX Principles
- Defaults müssen **sofort gut aussehen**
- Weniger ist besser
- Keine aggressiven Upgrade-Nudges
- Ruhe > Features

---

## 7. Out of Scope (MVP)
- AI Features
- Mobile App
- Komplexe Analytics
- Multi-User / Teams

---

## 8. Definition of Done (Features)
- Mobile-tauglich
- Saubere Empty-States
- Theme-Farben nur über Variablen
- API Contract dokumentiert & eingehalten
