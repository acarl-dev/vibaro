# Public Artist Page Redesign

## Übersicht

Das neue **ModernTemplate** ist ein umfassendes, responsives Template für die persönlichen Künstler-Websites auf Vibaro. Es zeigt alle verfügbaren Studio-Features und folgt den Vibaro-Designprinzipien: ruhig, modern, künstlerzentriert.

## Features

### 1. **Hero Section**
- **Full-Bleed Hero Image** mit adaptivem Gradient-Overlay
- Fallback auf Avatar + Name bei fehlendem Hero-Bild
- Responsive Typography (5xl → 7xl)
- Optimale Lesbarkeit durch dunkles Overlay im unteren Bereich

### 2. **Featured Release (New Release)**
- Prominente Platzierung direkt nach dem Hero
- Große Cover-Darstellung mit Hover-Effekt
- "Listen Now" Call-to-Action Button
- Nur sichtbar, wenn `is_featured: true` gesetzt ist

### 3. **Links Section**
- Social Media Icons (Instagram, Facebook, TikTok, X, YouTube, Spotify, Apple Music, SoundCloud, Bandcamp, Website)
- Hover-Effekte für bessere Interaktivität
- Responsive Grid-Layout

### 4. **Music Player**
- Embedded Tracks von Spotify, SoundCloud, YouTube
- Nur sichtbar, wenn `featured_tracks` vorhanden sind

### 5. **Shows Section**
- Chronologische Liste kommender Konzerte
- Venue, Stadt, Datum
- Ticket-Link wenn vorhanden
- Support Acts, Preise, Flyer (falls verfügbar)

### 6. **Releases/Discography**
- Grid-Layout (1-2 Spalten responsive)
- Cover-Art mit Hover-Effekt
- Release-Datum
- Link zu Streaming-Plattformen

### 7. **Videos Section** (NEU)
- YouTube & Vimeo Support
- Responsive Grid (1-2 Spalten)
- Thumbnail mit Play-Overlay
- Titel und Beschreibung

### 8. **Gallery Section** (NEU)
- Photo Grid (2-4 Spalten responsive)
- Hover-Effekte mit Zoom
- Optional: Titel-Overlay
- Ideal für Press Photos, Live Shots

### 9. **Contact Section** (NEU)
- Strukturierte Kontaktinformationen
- Icons für visuelle Unterscheidung
- Booking, Management, Press, WhatsApp
- Nur sichtbar, wenn Kontaktdaten hinterlegt

## Responsive Design

### Breakpoints (Tailwind CSS)
- **Mobile**: < 768px (1 Spalte)
- **Tablet**: 768px - 1024px (2 Spalten)
- **Desktop**: > 1024px (3-4 Spalten)

### Wichtige Responsive-Features
- Fluid Typography: `clamp()`-basierte Schriftgrößen
- Responsive Images mit Aspect Ratios
- Touch-freundliche Buttons (min. 44x44px)
- Optimierte Abstände für mobile Geräte

## Architektur

### Komponenten-Struktur
```
ModernTemplate.tsx          # Haupt-Template
  ├─ Hero                   # Hero Section
  ├─ FeaturedReleaseHero    # New Release Banner
  └─ Sections               # Dynamische Content-Sections

shared.tsx                  # Geteilte Komponenten
  ├─ LinkList               # Social Links
  ├─ ShowList               # Konzert-Liste
  ├─ ReleaseList            # Release-Grid
  ├─ VideoList              # Video-Grid (NEU)
  ├─ GalleryGrid            # Foto-Gallery (NEU)
  ├─ ContactSection         # Kontakt-Cards (NEU)
  ├─ MusicPlayer            # Embedded Tracks
  └─ Footer                 # Footer mit Vibaro-Branding
```

### Datenstruktur
```typescript
type PublicArtistPageData = {
  handle: string;
  display_name: string;
  bio: string | null;
  images: {
    avatar_url: string | null;
    hero_image_url: string | null;
  };
  links: LinkItem[];
  shows: ShowItem[];
  releases: ReleaseItem[];
  featured_tracks: FeaturedTrackItem[];
  videos?: VideoItem[];              // NEU
  gallery_images?: GalleryImageItem[]; // NEU
  booking_email?: string | null;     // NEU
  management_email?: string | null;  // NEU
  press_email?: string | null;       // NEU
  whatsapp_number?: string | null;   // NEU
  theme?: {
    key: string | null;
    variant: string | null;
  };
};
```

## Design Principles

### 1. **Künstler im Fokus**
- Keine aufdringlichen CTAs
- Keine Marketing-Sprache
- Kein Tool-Branding außer im Footer
- Die Seite repräsentiert den Künstler, nicht das Tool

### 2. **Ruhe und Klarheit**
- Klare Hierarchie
- Großzügige Abstände
- Dezente Animationen
- Keine Emojis, keine Hashtags

### 3. **Responsive First**
- Mobile-optimiert
- Touch-freundlich
- Performance-optimiert
- Accessibility-Standards

### 4. **Conditionally Rendered Content**
- Nur gefüllte Sections werden angezeigt
- Keine leeren States auf der Public Page
- Intelligente Content-Priorisierung

## Zukünftige Erweiterungen (Artist Plan)

### Limitierungen Free vs. Artist Plan
- **Free Plan**: Begrenzte Anzahl an:
  - Videos (z.B. max. 3)
  - Gallery Images (z.B. max. 8)
  - Featured Tracks (z.B. max. 5)
  - Keine Shows & Releases

- **Artist Plan**: Unbegrenzt (oder höhere Limits)
  - Shows & Releases verfügbar
  - Mehr Videos
  - Größere Gallery
  - Kontaktfelder verfügbar

## Template-Auswahl

Das Template wird über `theme_key` im Backend gesteuert:

```typescript
// In page.tsx
const themeKey = page.theme?.key || "modern";

switch (themeKey) {
  case "modern":
    return <ModernTemplate page={page} />;
  case "dark-editorial":
    return <DarkEditorialTemplate page={page} />;
  // ... weitere Templates
}
```

### Verfügbare Templates
1. **ModernTemplate** (Standard) - Umfassend, alle Features
2. **DarkEditorialTemplate** - Minimal, Links-fokussiert
3. **DarkMinimalTemplate** - Ultra-minimal
4. **DarkStageTemplate** - Performance-fokussiert
5. **DarkEditorialFullTemplate** - Editorial mit Shows/Releases

## Performance-Optimierungen

### Implementierte Optimierungen
- ✅ Lazy Loading für Images
- ✅ Responsive Images mit srcSet (via native img)
- ✅ Minimale JavaScript-Bundle-Size
- ✅ CSS-in-JS vermieden (Tailwind only)
- ✅ Server-Side Rendering (Next.js)

### Geplante Optimierungen
- [ ] Next.js Image Component für automatische Optimierung
- [ ] Bildkompression via CDN
- [ ] Intersection Observer für Videos
- [ ] Preload für kritische Assets

## Testing Checklist

### Responsive Design
- [ ] Mobile (320px - 767px)
- [ ] Tablet (768px - 1023px)
- [ ] Desktop (1024px+)
- [ ] Ultra-wide (1920px+)

### Content Variationen
- [ ] Mit Hero Image
- [ ] Ohne Hero Image (nur Avatar)
- [ ] Mit Featured Release
- [ ] Ohne Featured Release
- [ ] Alle Sections gefüllt
- [ ] Nur Links
- [ ] Nur Shows
- [ ] Leere States

### Browser-Kompatibilität
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS 15+)
- [ ] Chrome Mobile (Android 10+)

## Deployment

Das Template ist produktionsbereit und benötigt:
1. Backend-API mit allen Feldern (videos, gallery_images, contact)
2. Next.js Build & Deploy
3. Optional: CDN für Image-Optimierung

## Kontakt & Wartung

Bei Fragen oder Anpassungen:
- Dokumentation: `/docs/`
- API Contracts: `docs/API_CONTRACTS.md`
- Data Model: `docs/DATA_MODEL.md`
- Design System: `docs/THEMES.md`
