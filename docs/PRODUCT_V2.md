# Vibaro Product V2 – Stage System

Status: Active Product Definition  
Replaces: PRODUCT_RULES.md (V1 – Legacy)

This document defines the binding product logic for Vibaro V2.

Vibaro is no longer primarily a mini-homepage builder.
Vibaro is a digital Stage System for bands.

---

## 1. Product Shift

V1:
- Representation-first
- Free + Artist plan
- Homepage as core value

V2:
- Performance-first
- Paid-only
- Spotlight-centered
- Homepage is infrastructure, not the product

The website is not the product.
Control over the digital stage is the product.

---

## 2. Core Problem

Bands typically:
- post without performance clarity
- do not know which channel drives traffic
- cannot compare campaign phases
- lack decision data

Vibaro solves:
Performance uncertainty.

---

## 3. Core Entity: Spotlight

### 3.1 Definition

A Spotlight represents the currently most important strategic action of a band.

Examples:
- Album release
- Single launch
- Tour announcement
- Ticket push
- Merch drop
- Presave campaign

### 3.2 Rules

- Each artist page has exactly ONE active Spotlight.
- Spotlight is optional but required for performance tracking.
- All tracking data is associated with a Spotlight.
- Spotlight is time-aware (start date required, end date optional).

### 3.3 Purpose

Spotlight creates context for performance data.
Without context, tracking has no strategic meaning.

---

## 4. Product Architecture Alignment

The existing system remains:

- ArtistPage
- Shows
- Releases
- Links
- Media
- Themes
- Publishing
- Security model
- API-only communication

Spotlight becomes an additional domain layer on top of ArtistPage.

No architectural rewrite is required.

---

## 5. Plans (Paid Only)

There is no Free plan in V2.

### 5.1 Vibaro Stage

Purpose: Understand performance.

Includes:
- Full Artist Page
- One active Spotlight
- Server-side click tracking
- Referrer breakdown
- Module-level click counts
- 7-day and 30-day trend views

Excludes:
- Campaign comparison
- Scheduling
- Export
- Interpretative insights

Stage is descriptive.

---

### 5.2 Vibaro Stage Pro

Purpose: Control and optimize performance.

Includes everything from Stage plus:
- Campaign link builder (UTM generator)
- Platform-specific tracking links
- Campaign comparison
- Spotlight phase comparison
- Time-based Spotlight scheduling
- CSV export
- Basic interpretative insights (rule-based, not AI)

Stage Pro is controlling.

---

## 6. Tracking Principles

### 6.1 Technical

- Tracking is server-side.
- No third-party analytics dependency.
- No invasive cross-site tracking.
- No external scripts required.

### 6.2 Captured Data

For each tracked click:
- ArtistPage reference
- Spotlight reference (if active)
- Target module
- Referrer (if available)
- UTM parameters (if present)
- Timestamp

No personal user profiles.
No fingerprinting.
No advertising tracking.

---

## 7. Studio Shift

Studio is no longer content-first.

Studio becomes Stage Control Center.

Primary dashboard elements:
- Active Spotlight status
- Traffic last 7 days
- Referrer breakdown
- Module performance
- Campaign overview (Pro)

Content editing remains accessible but secondary.

---

## 8. Removed From Core Logic

- Free plan
- Plan-based content restrictions (e.g. Links-only focus)
- Homepage as main selling argument
- Feature comparison based on content quantity

---

## 9. MVP Scope V2

Initial V2 implementation must remain minimal.

Stage MVP:
- Spotlight entity
- Click tracking layer
- Aggregated performance endpoint
- Basic performance dashboard

Stage Pro MVP:
- Campaign entity
- Link builder
- Comparison endpoint
- CSV export

Not included:
- AI
- Social features
- Public stats
- Public counters
- Ranking systems
- Behavioral manipulation features

---

## 10. Product Philosophy V2

Vibaro is:
- Calm
- Measurable
- Controlled
- Artist-centered

Vibaro is not:
- A social network
- A marketing automation tool
- A growth-hacking platform
- A data-harvesting system

---

## 11. Binding Rule

All new features must align with:

Spotlight-centered performance control.

If a feature does not strengthen:
- clarity
- control
- measurability
- stage ownership

it does not belong in Vibaro V2.

---

## 12. Technical Implementation Rules (Studio V2)

### 12.1 Spotlight Identity

- **Spotlight.slug** is the stable campaign identity for analytics.
- Title changes do not affect analytics or UTM parameters.
- slug is generated once at creation (lowercase, url-safe, unique).
- utm_campaign is always based on spotlight.slug.

### 12.2 Tracking Links

- TrackingLinks are unique per (Spotlight, Platform, Placement).
- Partial unique index enforces: `(spotlight_id, platform, placement) WHERE archived_at IS NULL`.
- Duplicate prevention: check existence before creating new link.
- click_count is a performance cache (for Top-N lists only).
- Real analytics are always based on click_events.

### 12.3 Archivierung

- Spotlight archivierung deletes no TrackingLinks or ClickEvents.
- Archivierung via `archived_at` timestamp (soft delete pattern).
- Archived entities remain queryable for historic analytics.
- Studio UI filters out archived entities by default.

### 12.4 Hero Integration

- Active Spotlight with `show_on_page = true` + `archived_at IS NULL` → visible on public page.
- `show_on_page` toggle allows Hero-Banner control without archiving.
- Archivierung automatically removes Hero-Banner.

### 12.5 Studio Navigation

- `/studio` → Home (default, lightweight, no heavy analytics)
- `/studio/page` → Meine Seite (content editing)
- `/studio/project` → Projekt (Spotlight management)
- `/studio/share` → Teilen (Tracking Link creation)
- `/studio/results` → Ergebnisse (Analytics dashboard)

### 12.6 Home Endpoint Performance

- Home endpoint must remain lightweight and fast.
- No expensive analytics aggregations on Home.
- Top-N links use click_count (cached counter).
- Heavy analytics only in `/studio/results`.

### 12.7 Page Builder (MVP Scope)

- Fixed content areas: About, Music, Socials (required).
- Optional areas: Tour, Shop.
- No drag & drop in MVP.
- No CMS-like flexibility.
- Content editing remains simple and predictable.
- **Implementation**: `/studio/page` is an overview/dashboard page showing page status, content counts, and quick navigation to all content editing pages (Profile, Links, Music, Shows, Releases, Videos, Gallery, Themes, Contact). Each section has its own dedicated CRUD page accessible via sidebar.

### 12.8 Platform Configuration

- Platform definitions (Instagram, TikTok, Spotify, …) in frontend config (`platforms.ts`).
- Each platform defines available placements (Story, Bio, Post, Reel, …).
- Backend validates platform/placement as strings (no hardcoded enums in MVP).
- Future: move to DB if platform config becomes user-customizable.
