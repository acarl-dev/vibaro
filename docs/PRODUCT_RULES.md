# Vibaro Product Rules – Studio Redesign

Status: Active (Studio V3 Redesign)  
Related: PRODUCT_V2.md (Stage System)

This document defines the binding product rules for the Studio Redesign (V3).

---

## Studio Redesign Rules

### Navigation & Structure

- **Studio Home is the default tab** for all Studio visits
- Studio structure follows a flat navigation pattern with primary tabs:
  - Home (default)
  - Teilen (Share)
  - Meine Seite (My Page)
  - Ergebnisse (Results, analytics)
- Content editors (Profile, Links, Music, Shows, Releases, Videos, Gallery, Contact, Themes) are sub-pages within "Meine Seite", not top-level navigation items

### Tracking Links

- **Tracking links are unique** per `(spotlight_id, platform, placement)` as long as not archived
- **UTM parameters are generated server-side** from platform/placement/spotlight
  - `utm_source` = `platform`
  - `utm_medium` = `placement`
  - `utm_campaign` = `spotlight.slug` (stable identifier)
- Frontend **never sends UTM parameters** manually
- **Campaigns are auto-created** server-side. Frontend does not directly create campaigns
- **Labels are auto-generated**: `"{Platform} · {Placement}"`
- Attribution is user-intent focused: "Dein Link für Instagram · Story", not technical tracking jargon

### Page Builder (MVP)

- **Fixed sections with toggle visibility**, not free blocks or drag-and-drop
- Available sections: `profile`, `links`, `music`, `shows`, `releases`, `videos`, `gallery`, `contact`
- Page builder uses a toggle-based approach: sections can be shown or hidden via `visible_sections` array
- Public page only shows sections that are enabled in `visible_sections`

### Spotlights & Hero Banner

- **Active spotlight** with `show_on_page = true` is displayed as Hero Banner on the public page
- Hero Banner visibility requires:
  - `show_on_page = true`
  - `status = active`
  - `archived_at IS NULL`
- Only one active spotlight per artist page

### Public Page

- Public page route: `/p/[handle]`
- Handle must be lowercase, URL-safe, unique
- **Publishing rule**: Public page is visible only when `is_published = true`
- Public page respects `visible_sections` configuration
- Private fields (booking_email, management_email, press_email, whatsapp_number, etc.) are **never** exposed on public pages or public API responses

### Content Management

- Content editors remain accessible as sub-sections of "Meine Seite"
- Theme selection is part of "Meine Seite" workflow
- No content is lost during navigation restructuring
- Existing routes redirect to new structure where necessary

---

## Legacy Compatibility

V1 (Mini-Homepage):
- Documented in: `docs/legacy/PRODUCT_RULES.md`
- Status: Legacy, no longer active product definition

V2 (Stage System):
- Documented in: `docs/PRODUCT_V2.md`
- Status: Active foundation for V3 Studio Redesign
