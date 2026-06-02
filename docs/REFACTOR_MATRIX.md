# Vibaro Refactor Matrix (Documentation-Only Baseline)

Status: initial full assignment matrix
Date: 2026-04-30
Scope: apps/api, apps/web, docs

Note:
- This file is a decision and visibility baseline only.
- No production refactor in this step.
- No file is moved.
- No imports are changed.
- No APIs are changed.
- API_CONTRACTS is currently the only binding contract source.

Allowed Cores:
- Website
- Phase
- Links
- Analytics
- Shared/Foundation

## Consolidation Status 2026-04-30

### P1 completed

- Legacy redirects completed
- UI terminology aligned to Phase
- `results` completed as canonical route/term

### P2 completed

- `apps/web/src/lib/api/studio-page.server.ts` consolidated
- `apps/web/src/lib/api/studio-phase.server.ts` consolidated
- `apps/web/src/lib/api/studio-share.server.ts` consolidated
- `PhaseOverviewClient` split into presentational subcomponents
- `ShareClient` split into presentational subcomponents
- `PerformanceClient` split into presentational subcomponents

### Intentionally open points

- `apps/web/src/lib/api/studio-share.server.ts` still contains composition and marked domain leaks
- `Spotlight` remains a technical backend term
- `Campaign` remains an internal model in the Links core

### No longer part of P2

- Header KPI block in `PerformanceClient` will not be further extracted
- no further frontend component slices in Share/Performance as part of P2
- no DB migrations as part of P2
- no API endpoint changes as part of P2
- no model renames or model refactors as part of P2

## Backend

### Models

| File | Current Core | Target Core | Conflict | Rationale | Action |
|---|---|---|---|---|---|
| apps/api/app/Models/ArtistPage.php | Website | Website | No | Core object for band page, profile, and presentation | Keep |
| apps/api/app/Models/Link.php | Website | Website | No | Social/website links on the ArtistPage | Keep |
| apps/api/app/Models/Show.php | Website | Website | No | Website section content | Keep |
| apps/api/app/Models/Release.php | Website | Website | No | Website section content | Keep |
| apps/api/app/Models/Video.php | Website | Website | No | Website section content | Keep |
| apps/api/app/Models/FeaturedTrack.php | Website | Website | No | Website section content | Keep |
| apps/api/app/Models/GalleryImage.php | Website | Website | No | Website gallery content | Keep |
| apps/api/app/Models/Spotlight.php | Phase | Phase | Yes: wrong term | UI uses Phase; backend model is called Spotlight | Rename UI text |
| apps/api/app/Models/Campaign.php | Links | Links | No | MVP: internal grouping model for tracking/distribution logic in the Links core | Keep |
| apps/api/app/Models/TrackingLink.php | Links | Links | No | Core object for distribution and placement | Keep |
| apps/api/app/Models/ClickEvent.php | Analytics | Analytics | No | Measurement and evaluation object for clicks | Keep |
| apps/api/app/Models/PageViewEvent.php | Analytics | Analytics | No | Measurement and evaluation object for pageviews | Keep |
| apps/api/app/Models/User.php | Shared/Foundation | Shared/Foundation | No | Technical auth and account holder | Keep |

### Controllers

| File | Current Core | Target Core | Conflict | Rationale | Action |
|---|---|---|---|---|---|
| apps/api/app/Http/Controllers/Api/ArtistPageController.php | Website | Website | No | ArtistPage management incl. visibility (publish/unpublish) as website ownership | Keep |
| apps/api/app/Http/Controllers/Api/PublicArtistPageController.php | Website | Website | No | Public page delivery and contact redirect | Keep |
| apps/api/app/Http/Controllers/Api/LinkController.php | Website | Website | No | Social/website links CRUD | Keep |
| apps/api/app/Http/Controllers/Api/ShowController.php | Website | Website | No | Website section CRUD | Keep |
| apps/api/app/Http/Controllers/Api/ReleaseController.php | Website | Website | No | Website section CRUD | Keep |
| apps/api/app/Http/Controllers/Api/VideoController.php | Website | Website | No | Website section CRUD | Keep |
| apps/api/app/Http/Controllers/Api/FeaturedTrackController.php | Website | Website | No | Website section CRUD | Keep |
| apps/api/app/Http/Controllers/Api/GalleryImageController.php | Website | Website | No | Website section CRUD | Keep |
| apps/api/app/Http/Controllers/Api/SpotlightController.php | Phase | Phase | Yes: wrong term | Technically Spotlight, product language is Phase | Rename UI text |
| apps/api/app/Http/Controllers/Api/CampaignController.php | Links | Links | No | MVP: controller for the internal campaign grouping model in the Links core | Keep |
| apps/api/app/Http/Controllers/Api/TrackingLinkController.php | Links | Links | No | Tracking link lifecycle | Keep |
| apps/api/app/Http/Controllers/Api/AnalyticsController.php | Analytics | Analytics | No | Overview/Breakdown/Comparison/Pageview | Keep |
| apps/api/app/Http/Controllers/Api/StudioController.php | Shared/Foundation | Shared/Foundation | No | Composition layer for dashboard aggregation without its own core ownership | Keep |
| apps/api/app/Http/Controllers/Api/AuthController.php | Shared/Foundation | Shared/Foundation | No | Auth cross-cutting logic | Keep |

### Services

| File | Current Core | Target Core | Conflict | Rationale | Action |
|---|---|---|---|---|---|
| apps/api/app/Services/AnalyticsService.php | Analytics | Analytics | No | Analytics aggregations and comparison logic | Keep |
| apps/api/app/Services/SpotlightLifecycleService.php | Phase | Phase | Yes: wrong term | Spotlight lifecycle matches the Phase lifecycle | Rename UI text |
| apps/api/app/Services/LinkService.php | Website | Website | Yes: wrong term | LinkService manages only ArtistPage website/social links, not tracking links | Review |
| apps/api/app/Services/StudioHomeService.php | Shared/Foundation | Shared/Foundation | Yes: mixed responsibility | Composition layer additionally contains domain-near business logic (e.g. Completeness/TopLinks/PhaseStats) | Extract later |
| apps/api/app/Services/SafeHttpService.php | Shared/Foundation | Shared/Foundation | No | Technical HTTP cross-cutting logic | Keep |
| apps/api/app/Services/ReferrerNormalizationService.php | Shared/Foundation | Shared/Foundation | No | Technical normalization for tracking inputs | Keep |
| apps/api/app/Services/MetadataService.php | Shared/Foundation | Shared/Foundation | No | External metadata preparation | Keep |
| apps/api/app/Services/ReleaseMetadataService.php | Website | Website | No | Release-related website content logic | Keep |
| apps/api/app/Services/BotDetectionService.php | Shared/Foundation | Shared/Foundation | No | Technical traffic quality logic | Keep |
| apps/api/app/Services/VisitorIdentityService.php | Shared/Foundation | Shared/Foundation | No | Technical visitor identity logic | Keep |
| apps/api/app/Services/ImageProcessingService.php | Shared/Foundation | Shared/Foundation | No | Technical image processing | Keep |

### Middleware

| File | Current Core | Target Core | Conflict | Rationale | Action |
|---|---|---|---|---|---|
| apps/api/app/Http/Middleware/EnsureHasArtistPage.php | Shared/Foundation | Shared/Foundation | No | Technical access guard for artist-page context | Keep |

### Requests

| File | Current Core | Target Core | Conflict | Rationale | Action |
|---|---|---|---|---|---|
| apps/api/app/Http/Requests (no files present) | Shared/Foundation | Shared/Foundation | No | Currently no dedicated FormRequest classes in the folder | Keep |

### Resources

| File | Current Core | Target Core | Conflict | Rationale | Action |
|---|---|---|---|---|---|
| apps/api/app/Http/Resources/ArtistPageResource.php | Website | Website | No | API presentation of core website data | Keep |
| apps/api/app/Http/Resources/LinkResource.php | Website | Website | No | API presentation of website links | Keep |
| apps/api/app/Http/Resources/ShowResource.php | Website | Website | No | API presentation of shows | Keep |
| apps/api/app/Http/Resources/ReleaseResource.php | Website | Website | No | API presentation of releases | Keep |
| apps/api/app/Http/Resources/VideoResource.php | Website | Website | No | API presentation of videos | Keep |
| apps/api/app/Http/Resources/FeaturedTrackResource.php | Website | Website | No | API presentation of featured tracks | Keep |
| apps/api/app/Http/Resources/GalleryImageResource.php | Website | Website | No | API presentation of gallery content | Keep |
| apps/api/app/Http/Resources/SpotlightResource.php | Phase | Phase | Yes: wrong term | Technically Spotlight, product language is Phase | Rename UI text |

### Policies

| File | Current Core | Target Core | Conflict | Rationale | Action |
|---|---|---|---|---|---|
| apps/api/app/Policies/ArtistPagePolicy.php | Website | Website | No | Authorization for website core object | Keep |
| apps/api/app/Policies/ReleasePolicy.php | Website | Website | No | Authorization for website content | Keep |
| apps/api/app/Policies/SpotlightPolicy.php | Phase | Phase | Yes: wrong term | Spotlight term should be aligned to Phase in the UI | Rename UI text |
| apps/api/app/Policies/CampaignPolicy.php | Links | Links | No | MVP: Authorization for internal campaign grouping model in the Links core | Keep |
| apps/api/app/Policies/TrackingLinkPolicy.php | Links | Links | No | Authorization for tracking link lifecycle | Keep |

### API Routes from routes/api.php

| File | Current Core | Target Core | Conflict | Rationale | Action |
|---|---|---|---|---|---|
| apps/api/routes/api.php :: GET /api/v1/p/{handle} | Website | Website | No | Public band page | Keep |
| apps/api/routes/api.php :: GET /api/v1/p/{handle}/contact/{label} | Website | Website | No | Contact redirect in the public flow | Keep |
| apps/api/routes/api.php :: GET /api/v1/artist-pages/search | Website | Website | No | Website entity search | Keep |
| apps/api/routes/api.php :: POST /api/v1/analytics/pageview | Analytics | Analytics | No | Public pageview tracking | Keep |
| apps/api/routes/api.php :: POST /api/v1/auth/register | Shared/Foundation | Shared/Foundation | No | Auth cross-cutting | Keep |
| apps/api/routes/api.php :: POST /api/v1/auth/login | Shared/Foundation | Shared/Foundation | No | Auth cross-cutting | Keep |
| apps/api/routes/api.php :: POST /api/v1/auth/logout | Shared/Foundation | Shared/Foundation | No | Auth cross-cutting | Keep |
| apps/api/routes/api.php :: GET /api/v1/me | Shared/Foundation | Shared/Foundation | No | Auth/user context | Keep |
| apps/api/routes/api.php :: GET /api/v1/p/{handle}/preview | Website | Website | No | Owner preview of the website | Keep |
| apps/api/routes/api.php :: GET /api/v1/artist-pages/me | Website | Website | No | Load own ArtistPage | Keep |
| apps/api/routes/api.php :: POST /api/v1/artist-pages | Website | Website | No | Create ArtistPage | Keep |
| apps/api/routes/api.php :: POST /api/v1/handles/check | Website | Website | No | Handle-availability for Website | Keep |
| apps/api/routes/api.php :: POST /api/v1/artist-pages/upload-avatar | Website | Website | No | Website Appearance Asset | Keep |
| apps/api/routes/api.php :: POST /api/v1/artist-pages/upload-hero | Website | Website | No | Website Appearance Asset | Keep |
| apps/api/routes/api.php :: POST /api/v1/artist-pages/upload-logo | Website | Website | No | Website Appearance Asset | Keep |
| apps/api/routes/api.php :: PATCH /api/v1/artist-pages/update-hero-focal | Website | Website | No | Website Appearance | Keep |
| apps/api/routes/api.php :: DELETE /api/v1/artist-pages/delete-avatar | Website | Website | No | Website Appearance Asset | Keep |
| apps/api/routes/api.php :: DELETE /api/v1/artist-pages/delete-hero | Website | Website | No | Website Appearance Asset | Keep |
| apps/api/routes/api.php :: DELETE /api/v1/artist-pages/delete-logo | Website | Website | No | Website Appearance Asset | Keep |
| apps/api/routes/api.php :: PATCH /api/v1/artist-pages/{id} | Website | Website | No | Website master data | Keep |
| apps/api/routes/api.php :: PATCH /api/v1/artist-pages/{artistPage}/sections | Website | Website | No | Website sections | Keep |
| apps/api/routes/api.php :: POST /api/v1/artist-pages/{id}/publish | Website | Website | No | ArtistPage visibility (website publishing) | Keep |
| apps/api/routes/api.php :: POST /api/v1/artist-pages/{id}/unpublish | Website | Website | No | ArtistPage visibility (website publishing) | Keep |
| apps/api/routes/api.php :: /api/v1/artist-pages/{id}/links* | Website | Website | No | Website social links | Keep |
| apps/api/routes/api.php :: /api/v1/artist-pages/{id}/shows* | Website | Website | No | Website shows | Keep |
| apps/api/routes/api.php :: /api/v1/artist-pages/{id}/releases* | Website | Website | No | Website releases | Keep |
| apps/api/routes/api.php :: /api/v1/artist-pages/{id}/featured-tracks* | Website | Website | No | Website featured tracks | Keep |
| apps/api/routes/api.php :: /api/v1/studio/videos* | Website | Website | No | Website videos | Keep |
| apps/api/routes/api.php :: /api/v1/studio/gallery* | Website | Website | No | Website gallery | Keep |
| apps/api/routes/api.php :: GET /api/v1/analytics/overview | Analytics | Analytics | No | KPI overview | Keep |
| apps/api/routes/api.php :: GET /api/v1/analytics/breakdown | Analytics | Analytics | No | breakdown evaluation | Keep |
| apps/api/routes/api.php :: GET /api/v1/analytics/comparison | Analytics | Analytics | No | comparison evaluation | Keep |
| apps/api/routes/api.php :: GET /api/v1/studio/home | Shared/Foundation | Shared/Foundation | No | Dashboard composition endpoint; pure aggregation is allowed in the Shared/Foundation layer | Keep |
| apps/api/routes/api.php :: /api/v1/spotlights* | Phase | Phase | Yes: wrong term | Technically spotlight, UI should speak Phase | Rename UI text |
| apps/api/routes/api.php :: /api/v1/campaigns* | Links | Links | No | MVP: internal campaign grouping model for links/distribution | Keep |
| apps/api/routes/api.php :: /api/v1/tracking-links* | Links | Links | No | Distribution and tracking link flows | Keep |

## Frontend

### Studio Routes and large Studio client components

| File | Current Core | Target Core | Conflict | Rationale | Action |
|---|---|---|---|---|---|
| apps/web/src/app/(studio)/studio/page.tsx | Shared/Foundation | Shared/Foundation | Yes: duplicate logic | Parallel structure to studio/home and studio/page/* | Review |
| apps/web/src/app/(studio)/studio/home/HomeClient.tsx | Shared/Foundation | Shared/Foundation | No | Dashboard composition in the Shared/Foundation layer (UI aggregation) | Keep |
| apps/web/src/app/(studio)/studio/home/cards/QuickActions.tsx | Shared/Foundation | Shared/Foundation | No | Navigation/Action Shell | Keep |
| apps/web/src/app/(studio)/studio/home/cards/TrafficSnapshot.tsx | Analytics | Analytics | No | Analytics KPI card | Keep |
| apps/web/src/app/(studio)/studio/home/cards/PageReadinessCard.tsx | Website | Website | No | Website-completeness | Keep |
| apps/web/src/app/(studio)/studio/home/cards/HeroCard.tsx | Website | Website | No | Website presentation status | Keep |
| apps/web/src/app/(studio)/studio/home/cards/PageStatusCard.tsx | Website | Website | No | Website publish/status display | Keep |
| apps/web/src/app/(studio)/studio/home/cards/ComparisonCard.tsx | Analytics | Analytics | No | Comparison presentation | Keep |
| apps/web/src/app/(studio)/studio/profile/page.tsx | Website | Website | No | Profile route entry | Keep |
| apps/web/src/app/(studio)/studio/profile/ProfileClient.tsx | Website | Website | No | ArtistPage profile management | Keep |
| apps/web/src/app/(studio)/studio/appearance/page.tsx | Website | Website | No | Appearance-route entry | Keep |
| apps/web/src/app/(studio)/studio/appearance/AppearanceClient.tsx | Website | Website | No | presentation/Theme/Appearance | Keep |
| apps/web/src/app/(studio)/studio/contact/page.tsx | Website | Website | No | Contact route entry | Keep |
| apps/web/src/app/(studio)/studio/contact/ContactClient.tsx | Website | Website | No | Contact content of the website | Keep |
| apps/web/src/app/(studio)/studio/music/page.tsx | Website | Website | No | Music/Content-Section | Keep |
| apps/web/src/app/(studio)/studio/music/MusicClient.tsx | Website | Website | No | Music/Content-Section management | Keep |
| apps/web/src/app/(studio)/studio/shows/page.tsx | Website | Website | No | Shows-route entry | Keep |
| apps/web/src/app/(studio)/studio/shows/ShowsClient.tsx | Website | Website | No | Shows-management | Keep |
| apps/web/src/app/(studio)/studio/shows/ShowForm.tsx | Website | Website | No | Shows form logic | Keep |
| apps/web/src/app/(studio)/studio/releases/page.tsx | Website | Website | No | Releases-route entry | Keep |
| apps/web/src/app/(studio)/studio/releases/ReleasesClient.tsx | Website | Website | No | Releases-management | Keep |
| apps/web/src/app/(studio)/studio/releases/ReleaseForm.tsx | Website | Website | No | Releases form logic | Keep |
| apps/web/src/app/(studio)/studio/videos/page.tsx | Website | Website | No | Videos-route entry | Keep |
| apps/web/src/app/(studio)/studio/videos/VideosClient.tsx | Website | Website | No | Videos-management | Keep |
| apps/web/src/app/(studio)/studio/gallery/page.tsx | Website | Website | No | Gallery-route entry | Keep |
| apps/web/src/app/(studio)/studio/gallery/GalleryClient.tsx | Website | Website | No | Gallery-management | Keep |
| apps/web/src/app/(studio)/studio/links/page.tsx | Website | Website | Yes: target unclear | Links can mean website social links or tracking links | Review |
| apps/web/src/app/(studio)/studio/links/LinksClient.tsx | Website | Website | Yes: target unclear | Semantic overlap with distribution tracking links | Review |
| apps/web/src/app/(studio)/studio/stage/page.tsx | Phase | Phase | Yes: wrong term | Stage label should run product-wide as Phase | Rename UI text |
| apps/web/src/app/(studio)/studio/project/page.tsx | Phase | Phase | No | Phase management entry | Keep |
| apps/web/src/app/(studio)/studio/project/ProjectClient.tsx | Phase | Phase | No | Phase focus control | Keep |
| apps/web/src/app/(studio)/studio/project/CreatePhaseWizard.tsx | Phase | Phase | No | Wizard for the current Phase | Keep |
| apps/web/src/app/(studio)/studio/project/CreateSpotlightForm.tsx | Phase | Phase | Yes: wrong term | Technical term spotlight in the UI | Rename UI text |
| apps/web/src/app/(studio)/studio/project/EditSpotlightModal.tsx | Phase | Phase | Yes: wrong term | Technical term spotlight in the UI | Rename UI text |
| apps/web/src/app/(studio)/studio/project/SpotlightCard.tsx | Phase | Phase | Yes: wrong term | Technical term spotlight in the UI | Rename UI text |
| apps/web/src/app/(studio)/studio/project/SpotlightList.tsx | Phase | Phase | Yes: wrong term | Technical term spotlight in the UI | Rename UI text |
| apps/web/src/app/(studio)/studio/project/PhaseDisplayFields.tsx | Phase | Phase | No | Phase presentation parameters | Keep |
| apps/web/src/app/(studio)/studio/project/ModulesClient.tsx | Phase | Phase | No | Phase modules and focus | Keep |
| apps/web/src/app/(studio)/studio/project/spotlights/page.tsx | Phase | Phase | Yes: wrong term | Spotlight term as UI route path | Rename UI text |
| apps/web/src/app/(studio)/studio/share/page.tsx | Phase | Phase | Yes: mixed responsibility | Overview combines phase, links, and parts of analytics context | Extract later |
| apps/web/src/app/(studio)/studio/share/PhaseOverviewClient.tsx | Phase | Phase | No | P2 consolidated UI orchestrator after extracting presentational subcomponents | Keep |
| apps/web/src/app/(studio)/studio/share/ShareClient.tsx | Links | Links | No | Distribution and tracking-link creation | Keep |
| apps/web/src/app/(studio)/studio/share/PlatformSelector.tsx | Links | Links | No | Platform assignment for distribution | Keep |
| apps/web/src/app/(studio)/studio/share/PlacementSelector.tsx | Links | Links | No | Placement assignment for distribution | Keep |
| apps/web/src/app/(studio)/studio/share/new/page.tsx | Links | Links | No | New tracking-link flow | Keep |
| apps/web/src/app/(studio)/studio/share/distribution/page.tsx | Links | Links | No | Distribution subroute | Keep |
| apps/web/src/app/(studio)/studio/share/qr/page.tsx | Links | Links | No | QR link flow | Keep |
| apps/web/src/app/(studio)/studio/share/phases/page.tsx | Phase | Phase | No | Phase-related share view | Keep |
| apps/web/src/app/(studio)/studio/share/performance/page.tsx | Analytics | Analytics | Yes: mixed responsibility | Performance in share tree can contain phase filters | Extract later |
| apps/web/src/app/(studio)/studio/share/performance/PerformanceClient.tsx | Analytics | Analytics | No | P2-consolidated analytics orchestrator after extractions; header KPI block intentionally kept inline | Keep |
| apps/web/src/app/(studio)/studio/results/page.tsx | Analytics | Analytics | No | Canonical analytics route (results) | Keep |
| apps/web/src/app/(studio)/studio/results/ResultsClient.tsx | Analytics | Analytics | No | Analytics Breakdown/Filter presentation | Keep |
| apps/web/src/app/(studio)/studio/ergebnisse/page.tsx | Analytics | Analytics | Yes: duplicate logic | legacy alias to the canonical results route | Delete/redirect later |
| apps/web/src/app/(studio)/studio/settings/page.tsx | Shared/Foundation | Shared/Foundation | Yes: target unclear | Settings without clear product assignment | Review |
| apps/web/src/app/(studio)/studio/settings/SettingsClient.tsx | Shared/Foundation | Shared/Foundation | Yes: target unclear | Settings without clear product assignment | Review |
| apps/web/src/app/(studio)/studio/page/layout.tsx | Shared/Foundation | Shared/Foundation | No | Layout Shell | Keep |
| apps/web/src/app/(studio)/studio/page/page.tsx | Website | Website | No | Website builder entry | Keep |
| apps/web/src/app/(studio)/studio/page/actions.ts | Website | Website | No | Website builder actions | Keep |
| apps/web/src/app/(studio)/studio/page/PageOverviewClient.tsx | Website | Website | No | Website builder overview | Keep |
| apps/web/src/app/(studio)/studio/page/LivePreviewPanel.tsx | Website | Website | No | Public page preview | Keep |
| apps/web/src/app/(studio)/studio/page/profile/page.tsx | Website | Website | No | Builder section profile | Keep |
| apps/web/src/app/(studio)/studio/page/appearance/page.tsx | Website | Website | No | Builder section Appearance | Keep |
| apps/web/src/app/(studio)/studio/page/contact/page.tsx | Website | Website | No | Builder section contact | Keep |
| apps/web/src/app/(studio)/studio/page/music/page.tsx | Website | Website | No | Builder section Music | Keep |
| apps/web/src/app/(studio)/studio/page/shows/page.tsx | Website | Website | No | Builder section Shows | Keep |
| apps/web/src/app/(studio)/studio/page/releases/page.tsx | Website | Website | No | Builder section Releases | Keep |
| apps/web/src/app/(studio)/studio/page/videos/page.tsx | Website | Website | No | Builder section Videos | Keep |
| apps/web/src/app/(studio)/studio/page/gallery/page.tsx | Website | Website | No | Builder section Gallery | Keep |
| apps/web/src/app/(studio)/studio/page/links/page.tsx | Website | Website | No | Builder section Social Links | Keep |

### Public Page Routes

| File | Current Core | Target Core | Conflict | Rationale | Action |
|---|---|---|---|---|---|
| apps/web/src/app/(public)/p/[handle]/page.tsx | Website | Website | No | Public band page | Keep |
| apps/web/src/app/(public)/p/preview/[template]/page.tsx | Website | Website | No | Public template preview | Keep |
| apps/web/src/app/(public)/p/hooks/useActiveSectionObserver.ts | Shared/Foundation | Shared/Foundation | No | Technical UI hook | Keep |
| apps/web/src/app/(public)/p/hooks/useLazyLoad.ts | Shared/Foundation | Shared/Foundation | No | Technical UI hook | Keep |
| apps/web/src/app/(public)/p/hooks/useThrottledScroll.ts | Shared/Foundation | Shared/Foundation | No | Technical UI hook | Keep |
| apps/web/src/app/(public)/p/components/PageviewTracker.tsx | Analytics | Analytics | No | Pageview tracking on public page | Keep |
| apps/web/src/app/(public)/p/components/types.ts | Shared/Foundation | Shared/Foundation | No | Technical type definitions | Keep |
| apps/web/src/app/(public)/p/components/constants.ts | Shared/Foundation | Shared/Foundation | No | Technical constants for templates | Keep |
| apps/web/src/app/(public)/p/components/helpers.ts | Shared/Foundation | Shared/Foundation | No | Rendering helper functions | Keep |
| apps/web/src/app/(public)/p/components/shared.tsx | Shared/Foundation | Shared/Foundation | No | Shared rendering building blocks | Keep |
| apps/web/src/app/(public)/p/components/Hero.tsx | Website | Website | No | Website hero presentation | Keep |
| apps/web/src/app/(public)/p/components/FullHeroSection.tsx | Website | Website | No | Website hero presentation | Keep |
| apps/web/src/app/(public)/p/components/FeaturedReleaseHero.tsx | Website | Website | No | Website Featured Release | Keep |
| apps/web/src/app/(public)/p/components/FeaturedReleaseSection.tsx | Website | Website | No | Website Featured Release | Keep |
| apps/web/src/app/(public)/p/components/ReleaseList.tsx | Website | Website | No | Website releases list | Keep |
| apps/web/src/app/(public)/p/components/VideoList.tsx | Website | Website | No | Website videos list | Keep |
| apps/web/src/app/(public)/p/components/GalleryGrid.tsx | Website | Website | No | Website gallery-presentation | Keep |
| apps/web/src/app/(public)/p/components/GallerySlider.tsx | Website | Website | No | Website gallery-presentation | Keep |
| apps/web/src/app/(public)/p/components/ImageModal.tsx | Website | Website | No | Website gallery-presentation | Keep |
| apps/web/src/app/(public)/p/components/ShowList.tsx | Website | Website | No | Website shows list | Keep |
| apps/web/src/app/(public)/p/components/LinkList.tsx | Website | Website | No | Website social links | Keep |
| apps/web/src/app/(public)/p/components/MusicPlayer.tsx | Website | Website | No | Website music section | Keep |
| apps/web/src/app/(public)/p/components/ContactInquiryButton.tsx | Website | Website | No | Website contact component | Keep |
| apps/web/src/app/(public)/p/components/ContentSection.tsx | Website | Website | No | Website section container | Keep |
| apps/web/src/app/(public)/p/components/SectionLayout.tsx | Shared/Foundation | Shared/Foundation | No | Technical layout for sections | Keep |
| apps/web/src/app/(public)/p/components/StickyNavigationBar.tsx | Shared/Foundation | Shared/Foundation | No | Technical navigation shell | Keep |
| apps/web/src/app/(public)/p/components/LazyVideoEmbed.tsx | Shared/Foundation | Shared/Foundation | No | Technical embedding logic | Keep |
| apps/web/src/app/(public)/p/components/PreviewBanner.tsx | Shared/Foundation | Shared/Foundation | No | Preview hint for rendering mode | Keep |
| apps/web/src/app/(public)/p/components/EmptyStates.tsx | Shared/Foundation | Shared/Foundation | No | Generic empty-state presentation | Keep |
| apps/web/src/app/(public)/p/components/StageTemplate.tsx | Phase | Phase | Yes: wrong term | Stage term should become Phase in the UI | Rename UI text |
| apps/web/src/app/(public)/p/components/PhaseHero.tsx | Phase | Phase | No | Phase-related hero component | Keep |
| apps/web/src/app/(public)/p/components/ProjectHeroBanner.tsx | Phase | Phase | Yes: wrong term | Project/Stage wording is not consistent with Phase | Rename UI text |
| apps/web/src/app/(public)/p/components/MinimalTemplate.tsx | Website | Website | No | Public website template presentation | Keep |
| apps/web/src/app/(public)/p/components/ModernTemplate.tsx | Website | Website | No | Public website template presentation | Keep |
| apps/web/src/app/(public)/p/components/EditorialTemplate.tsx | Website | Website | No | Public website template presentation | Keep |
| apps/web/src/app/(public)/p/components/DarkStageTemplate.tsx | Phase | Phase | Yes: wrong term | Stage term should become Phase in the UI | Rename UI text |
| apps/web/src/app/(public)/p/components/DarkEditorialTemplate.tsx | Website | Website | No | Public website template presentation | Keep |
| apps/web/src/app/(public)/p/components/DarkMinimalTemplate.tsx | Website | Website | No | Public website template presentation | Keep |
| apps/web/src/app/(public)/p/components/DarkEditorialFullTemplate.tsx | Website | Website | No | Public website template presentation | Keep |

### API Route Handler (Next.js)

| File | Current Core | Target Core | Conflict | Rationale | Action |
|---|---|---|---|---|---|
| apps/web/src/app/api/auth/login/route.ts | Shared/Foundation | Shared/Foundation | No | Auth BFF Handler | Keep |
| apps/web/src/app/api/auth/register/route.ts | Shared/Foundation | Shared/Foundation | No | Auth BFF Handler | Keep |
| apps/web/src/app/api/auth/logout/route.ts | Shared/Foundation | Shared/Foundation | No | Auth BFF Handler | Keep |
| apps/web/src/app/api/artist-pages/search/route.ts | Website | Website | No | Website search BFF | Keep |
| apps/web/src/app/api/studio/artist-pages/route.ts | Website | Website | No | ArtistPage BFF | Keep |
| apps/web/src/app/api/studio/artist-pages/[id]/route.ts | Website | Website | No | ArtistPage BFF | Keep |
| apps/web/src/app/api/studio/artist-pages/[id]/publish/route.ts | Website | Website | Yes: duplicate logic | Website publishing endpoint; overlaps with /studio/publish | Centralize later |
| apps/web/src/app/api/studio/publish/route.ts | Website | Website | Yes: duplicate logic | Website publishing endpoint; duplicate of artist-pages/[id]/publish | Centralize later |
| apps/web/src/app/api/studio/unpublish/route.ts | Website | Website | Yes: duplicate logic | Website unpublish endpoint; duplicate logic | Centralize later |
| apps/web/src/app/api/studio/handles/check/route.ts | Website | Website | No | Handle check for ArtistPage | Keep |
| apps/web/src/app/api/studio/upload-avatar/route.ts | Website | Website | No | Website Asset Upload | Keep |
| apps/web/src/app/api/studio/upload-hero/route.ts | Website | Website | No | Website Asset Upload | Keep |
| apps/web/src/app/api/studio/upload-logo/route.ts | Website | Website | No | Website Asset Upload | Keep |
| apps/web/src/app/api/studio/delete-avatar/route.ts | Website | Website | No | Website Asset Delete | Keep |
| apps/web/src/app/api/studio/delete-hero/route.ts | Website | Website | No | Website Asset Delete | Keep |
| apps/web/src/app/api/studio/delete-logo/route.ts | Website | Website | No | Website Asset Delete | Keep |
| apps/web/src/app/api/studio/update-hero-focal/route.ts | Website | Website | No | Website Appearance Update | Keep |
| apps/web/src/app/api/studio/links/route.ts | Website | Website | Yes: target unclear | Links term collides with tracking links | Review |
| apps/web/src/app/api/studio/links/[id]/route.ts | Website | Website | Yes: target unclear | Links term collides with tracking links | Review |
| apps/web/src/app/api/studio/links/reorder/route.ts | Website | Website | Yes: target unclear | Links term collides with tracking links | Review |
| apps/web/src/app/api/studio/shows/route.ts | Website | Website | No | Shows BFF | Keep |
| apps/web/src/app/api/studio/shows/[id]/route.ts | Website | Website | No | Shows BFF | Keep |
| apps/web/src/app/api/studio/shows/[id]/upload-flyer/route.ts | Website | Website | No | Shows Asset Upload | Keep |
| apps/web/src/app/api/studio/shows/[id]/flyer/route.ts | Website | Website | No | Shows Asset Delete | Keep |
| apps/web/src/app/api/studio/releases/route.ts | Website | Website | No | Releases BFF | Keep |
| apps/web/src/app/api/studio/releases/[id]/route.ts | Website | Website | No | Releases BFF | Keep |
| apps/web/src/app/api/studio/releases/[id]/upload-cover/route.ts | Website | Website | No | Releases Asset Upload | Keep |
| apps/web/src/app/api/studio/releases/[id]/cover/route.ts | Website | Website | No | Releases Asset Delete | Keep |
| apps/web/src/app/api/studio/featured-tracks/route.ts | Website | Website | No | Featured Tracks BFF | Keep |
| apps/web/src/app/api/studio/featured-tracks/[id]/route.ts | Website | Website | No | Featured Tracks BFF | Keep |
| apps/web/src/app/api/studio/featured-tracks/reorder/route.ts | Website | Website | No | Featured Tracks Reorder | Keep |
| apps/web/src/app/api/studio/videos/route.ts | Website | Website | No | Videos BFF | Keep |
| apps/web/src/app/api/studio/videos/[id]/route.ts | Website | Website | No | Videos BFF | Keep |
| apps/web/src/app/api/studio/videos/[id]/featured/route.ts | Website | Website | No | Videos Featured Toggle | Keep |
| apps/web/src/app/api/studio/videos/reorder/route.ts | Website | Website | No | Videos Reorder | Keep |
| apps/web/src/app/api/studio/gallery/route.ts | Website | Website | No | Gallery BFF | Keep |
| apps/web/src/app/api/studio/gallery/[id]/route.ts | Website | Website | No | Gallery BFF | Keep |
| apps/web/src/app/api/studio/gallery/reorder/route.ts | Website | Website | No | Gallery Reorder | Keep |
| apps/web/src/app/api/studio/spotlights/route.ts | Phase | Phase | Yes: wrong term | Spotlight term remains technical, UI should use Phase | Rename UI text |
| apps/web/src/app/api/studio/spotlights/[id]/route.ts | Phase | Phase | Yes: wrong term | Spotlight term remains technical, UI should use Phase | Rename UI text |
| apps/web/src/app/api/studio/spotlights/[id]/activate/route.ts | Phase | Phase | Yes: wrong term | Spotlight term remains technical, UI should use Phase | Rename UI text |
| apps/web/src/app/api/studio/spotlights/[id]/end/route.ts | Phase | Phase | Yes: wrong term | Spotlight term remains technical, UI should use Phase | Rename UI text |
| apps/web/src/app/api/studio/spotlights/[id]/archive/route.ts | Phase | Phase | Yes: wrong term | Spotlight term remains technical, UI should use Phase | Rename UI text |
| apps/web/src/app/api/studio/spotlights/[id]/restore/route.ts | Phase | Phase | Yes: wrong term | Spotlight term remains technical, UI should use Phase | Rename UI text |
| apps/web/src/app/api/studio/spotlights/active/route.ts | Phase | Phase | Yes: wrong term | Spotlight term remains technical, UI should use Phase | Rename UI text |
| apps/web/src/app/api/studio/spotlights/fetch-metadata/route.ts | Phase | Phase | Yes: wrong term | Spotlight term remains technical, UI should use Phase | Rename UI text |
| apps/web/src/app/api/studio/tracking-links/route.ts | Links | Links | No | Tracking-Link BFF | Keep |
| apps/web/src/app/api/studio/tracking-links/[id]/route.ts | Links | Links | No | Tracking-Link BFF | Keep |
| apps/web/src/app/api/studio/analytics/breakdown/route.ts | Analytics | Analytics | No | Analytics Breakdown BFF | Keep |
| apps/web/src/app/api/studio/page-counts/route.ts | Analytics | Analytics | No | Metrics/count endpoint for Studio | Keep |

### Central lib/api files

| File | Current Core | Target Core | Conflict | Rationale | Action |
|---|---|---|---|---|---|
| apps/web/src/lib/api/backend.ts | Shared/Foundation | Shared/Foundation | No | Server-side API client | Keep |
| apps/web/src/lib/api/client-fetch.ts | Shared/Foundation | Shared/Foundation | No | Client-side API wrapper | Keep |
| apps/web/src/lib/api/studio.types.ts | Shared/Foundation | Shared/Foundation | Yes: mixed responsibility | Shared Studio types contain multiple product cores | Centralize later |
| apps/web/src/lib/api/studio.ts | Shared/Foundation | Shared/Foundation | Yes: mixed responsibility | Studio API layer mixes Home/Website/Phase data | Centralize later |
| apps/web/src/lib/api/spotlights.ts | Phase | Phase | Yes: wrong term | Spotlight term remains technical, UI should use Phase | Rename UI text |
| apps/web/src/lib/api/tracking-links.ts | Links | Links | No | Tracking link API | Keep |
| apps/web/src/lib/api/analytics.ts | Analytics | Analytics | No | Analytics API Client | Keep |
| apps/web/src/lib/api/analytics.server.ts | Analytics | Analytics | No | Analytics server fetch | Keep |

### Central lib/bff files

| File | Current Core | Target Core | Conflict | Rationale | Action |
|---|---|---|---|---|---|
| apps/web/src/lib/bff/studio-proxy.ts | Shared/Foundation | Shared/Foundation | No | BFF proxy core technology | Keep |
| apps/web/src/lib/bff/studio-endpoints.ts | Shared/Foundation | Shared/Foundation | No | Endpoint mapping for proxy | Keep |

### Shared Components

| File | Current Core | Target Core | Conflict | Rationale | Action |
|---|---|---|---|---|---|
| apps/web/src/components/Toast.tsx | Shared/Foundation | Shared/Foundation | No | Global UI feedback infrastructure | Keep |
| apps/web/src/components/studio/results/PlatformBreakdown.tsx | Analytics | Analytics | No | Analytics presentation component | Keep |
| apps/web/src/components/public-page/PhaseHero.tsx | Phase | Phase | No | Phase-related hero component | Keep |
| apps/web/src/components/public-page/ProjectHeroBanner.tsx | Phase | Phase | Yes: wrong term | Project/Stage term in the UI is not consistent | Rename UI text |

## 1) Open conflict files

- apps/api/app/Services/StudioHomeService.php
- apps/api/app/Services/LinkService.php
- apps/web/src/app/(studio)/studio/page.tsx
- apps/web/src/app/(studio)/studio/links/page.tsx
- apps/web/src/app/(studio)/studio/links/LinksClient.tsx
- apps/web/src/app/(studio)/studio/share/page.tsx
- apps/web/src/app/(studio)/studio/share/performance/page.tsx
- apps/web/src/app/(studio)/studio/ergebnisse/page.tsx
- apps/web/src/app/(studio)/studio/settings/page.tsx
- apps/web/src/app/(studio)/studio/settings/SettingsClient.tsx
- apps/web/src/lib/api/studio.ts
- apps/web/src/lib/api/studio.types.ts
- apps/web/src/app/api/studio/publish/route.ts
- apps/web/src/app/api/studio/unpublish/route.ts
- apps/web/src/app/api/studio/artist-pages/[id]/publish/route.ts

## 2) P1 Quick Wins

- Unify UI terminology to Phase without breaking API paths.
- Define results as the canonical analytics route and mark /ergebnisse as a legacy redirect.
- Sharpen LinkService naming semantically (website links vs tracking links), initially documentation/naming plan only.
- Use conflict markers from this matrix as a PR checklist.

## 3) P2 medium refactors

- Share frontend component slices for `PhaseOverviewClient`, `ShareClient`, and `PerformanceClient` are completed; no further P2 slices planned.
- Duplicate website publishing handlers (/studio/publish, /studio/unpublish, artist-pages/[id]/publish) to be centralized later.
- Reduce StudioHomeService to pure composition and extract domain-near business logic.
- Split the share tree into clear subareas: Phase Overview, Links Distribution, Analytics Performance.
- Split the Studio API layer into smaller core-focused adapters.

## 4) P3 deep refactors

- Long-term, merge the historically grown dual structure studio/* and studio/page/*.
- Split large Studio clients with mixed responsibilities into core-focused building blocks.

## 5) Files intentionally not touched for now

- apps/api/routes/api.php (documentation only, no change in this step)
- apps/web/src/app/api/** (classified only, no handler change)
- apps/web/src/lib/bff/studio-proxy.ts
- apps/web/src/lib/bff/studio-endpoints.ts
- apps/web/src/lib/api/backend.ts
- apps/web/src/lib/api/client-fetch.ts
- apps/web/src/components/Toast.tsx



