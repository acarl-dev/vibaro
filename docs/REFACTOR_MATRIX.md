# Vibaro Refactor Matrix (Documentation-Only Baseline)

Status: initial full assignment matrix
Date: 2026-04-30
Scope: apps/api, apps/web, docs

Hinweis:
- Diese Datei ist reine Entscheidungs- und Sichtbarkeitsgrundlage.
- Kein produktiver Refactor in diesem Schritt.
- Keine Datei wird verschoben.
- Keine Imports werden geaendert.
- Keine APIs werden geaendert.
- API_CONTRACTS ist vorerst die einzige bindende Vertragsquelle.

Zulaessige Kernel:
- Website
- Phase
- Links
- Analytics
- Shared/Foundation

## Konsolidierungsstand 2026-04-30

### P1 abgeschlossen

- Legacy Redirects abgeschlossen
- UI-Terminologie auf Phase ausgerichtet
- `results` als kanonische Route/Begriff abgeschlossen

### P2 abgeschlossen

- `apps/web/src/lib/api/studio-page.server.ts` konsolidiert
- `apps/web/src/lib/api/studio-phase.server.ts` konsolidiert
- `apps/web/src/lib/api/studio-share.server.ts` konsolidiert
- `PhaseOverviewClient` in praesentationale Teilkomponenten zerlegt
- `ShareClient` in praesentationale Teilkomponenten zerlegt
- `PerformanceClient` in praesentationale Teilkomponenten zerlegt

### Bewusst offene Punkte

- `apps/web/src/lib/api/studio-share.server.ts` enthaelt weiter Composition und markierte Domain-Leaks
- serverseitig werden `pageUrl` und `totalPageviews` teils noch berechnet, obwohl aktuelle Clients sie nicht mehr nutzen
- `Spotlight` bleibt technischer Backend-Begriff
- `Campaign` bleibt internes Modell im Links-Kern

### Nicht mehr Teil von P2

- Header-KPI-Block in `PerformanceClient` wird nicht weiter extrahiert
- keine DB-Migrationen im Rahmen von P2
- keine API-Endpunkt-Aenderungen im Rahmen von P2
- keine Model-Umbenennungen oder Model-Refactors im Rahmen von P2

## Backend

### Models

| Datei | Aktueller Kernel | Ziel-Kernel | Konflikt | Begruendung | Massnahme |
|---|---|---|---|---|---|
| apps/api/app/Models/ArtistPage.php | Website | Website | Nein | Kernobjekt fuer Bandseite, Profil und Darstellung | Behalten |
| apps/api/app/Models/Link.php | Website | Website | Nein | Social/Website-Links auf der ArtistPage | Behalten |
| apps/api/app/Models/Show.php | Website | Website | Nein | Section-Inhalt der Website | Behalten |
| apps/api/app/Models/Release.php | Website | Website | Nein | Section-Inhalt der Website | Behalten |
| apps/api/app/Models/Video.php | Website | Website | Nein | Section-Inhalt der Website | Behalten |
| apps/api/app/Models/FeaturedTrack.php | Website | Website | Nein | Section-Inhalt der Website | Behalten |
| apps/api/app/Models/GalleryImage.php | Website | Website | Nein | Gallery-Inhalt der Website | Behalten |
| apps/api/app/Models/Spotlight.php | Phase | Phase | Ja: falscher Begriff | UI nutzt Phase, Backend-Modell heisst Spotlight | Umbenennung UI-Text |
| apps/api/app/Models/Campaign.php | Links | Links | Nein | MVP: internes Gruppierungsmodell fuer Tracking-/Distribution-Logik im Links-Kern | Behalten |
| apps/api/app/Models/TrackingLink.php | Links | Links | Nein | Kernobjekt fuer Distribution und Placement | Behalten |
| apps/api/app/Models/ClickEvent.php | Analytics | Analytics | Nein | Mess- und Auswertungsobjekt fuer Klicks | Behalten |
| apps/api/app/Models/PageViewEvent.php | Analytics | Analytics | Nein | Mess- und Auswertungsobjekt fuer Pageviews | Behalten |
| apps/api/app/Models/User.php | Shared/Foundation | Shared/Foundation | Nein | Technischer Auth- und Account-Traeger | Behalten |

### Controllers

| Datei | Aktueller Kernel | Ziel-Kernel | Konflikt | Begruendung | Massnahme |
|---|---|---|---|---|---|
| apps/api/app/Http/Controllers/Api/ArtistPageController.php | Website | Website | Nein | ArtistPage Verwaltung inkl. Sichtbarkeit (publish/unpublish) als Website-Ownership | Behalten |
| apps/api/app/Http/Controllers/Api/PublicArtistPageController.php | Website | Website | Nein | Oeffentliche Seitenauslieferung und Kontakt-Redirect | Behalten |
| apps/api/app/Http/Controllers/Api/LinkController.php | Website | Website | Nein | Social-/Website-Links CRUD | Behalten |
| apps/api/app/Http/Controllers/Api/ShowController.php | Website | Website | Nein | Website-Section CRUD | Behalten |
| apps/api/app/Http/Controllers/Api/ReleaseController.php | Website | Website | Nein | Website-Section CRUD | Behalten |
| apps/api/app/Http/Controllers/Api/VideoController.php | Website | Website | Nein | Website-Section CRUD | Behalten |
| apps/api/app/Http/Controllers/Api/FeaturedTrackController.php | Website | Website | Nein | Website-Section CRUD | Behalten |
| apps/api/app/Http/Controllers/Api/GalleryImageController.php | Website | Website | Nein | Website-Section CRUD | Behalten |
| apps/api/app/Http/Controllers/Api/SpotlightController.php | Phase | Phase | Ja: falscher Begriff | Technisch Spotlight, produktsprachlich Phase | Umbenennung UI-Text |
| apps/api/app/Http/Controllers/Api/CampaignController.php | Links | Links | Nein | MVP: Controller fuer internes Campaign-Gruppierungsmodell im Links-Kern | Behalten |
| apps/api/app/Http/Controllers/Api/TrackingLinkController.php | Links | Links | Nein | Tracking-Link-Lifecycle | Behalten |
| apps/api/app/Http/Controllers/Api/AnalyticsController.php | Analytics | Analytics | Nein | Overview/Breakdown/Comparison/Pageview | Behalten |
| apps/api/app/Http/Controllers/Api/StudioController.php | Shared/Foundation | Shared/Foundation | Nein | Composition Layer fuer Dashboard-Aggregation ohne eigene Kern-Ownership | Behalten |
| apps/api/app/Http/Controllers/Api/AuthController.php | Shared/Foundation | Shared/Foundation | Nein | Auth-Querschnittslogik | Behalten |

### Services

| Datei | Aktueller Kernel | Ziel-Kernel | Konflikt | Begruendung | Massnahme |
|---|---|---|---|---|---|
| apps/api/app/Services/AnalyticsService.php | Analytics | Analytics | Nein | Analytics-Aggregationen und Vergleichslogik | Behalten |
| apps/api/app/Services/SpotlightLifecycleService.php | Phase | Phase | Ja: falscher Begriff | Lifecycle fuer Spotlight entspricht Phase-Lifecycle | Umbenennung UI-Text |
| apps/api/app/Services/LinkService.php | Website | Website | Ja: falscher Begriff | LinkService verwaltet ausschliesslich Website/Social Links der ArtistPage, nicht Tracking Links | Pruefen |
| apps/api/app/Services/StudioHomeService.php | Shared/Foundation | Shared/Foundation | Ja: Mischverantwortung | Composition Layer enthaelt zusaetzlich domainnahe Business-Logik (z. B. Completeness/TopLinks/PhaseStats) | Spaeter extrahieren |
| apps/api/app/Services/SafeHttpService.php | Shared/Foundation | Shared/Foundation | Nein | Technischer HTTP-Querschnitt | Behalten |
| apps/api/app/Services/ReferrerNormalizationService.php | Shared/Foundation | Shared/Foundation | Nein | Technische Normalisierung fuer Tracking-Inputs | Behalten |
| apps/api/app/Services/MetadataService.php | Shared/Foundation | Shared/Foundation | Nein | Externe Metadata-Aufbereitung | Behalten |
| apps/api/app/Services/ReleaseMetadataService.php | Website | Website | Nein | Release-bezogene Website-Inhaltslogik | Behalten |
| apps/api/app/Services/BotDetectionService.php | Shared/Foundation | Shared/Foundation | Nein | Technische Traffic-Qualitaetslogik | Behalten |
| apps/api/app/Services/VisitorIdentityService.php | Shared/Foundation | Shared/Foundation | Nein | Technische Besucher-Identitaetslogik | Behalten |
| apps/api/app/Services/ImageProcessingService.php | Shared/Foundation | Shared/Foundation | Nein | Technische Bildverarbeitung | Behalten |

### Middleware

| Datei | Aktueller Kernel | Ziel-Kernel | Konflikt | Begruendung | Massnahme |
|---|---|---|---|---|---|
| apps/api/app/Http/Middleware/EnsureHasArtistPage.php | Shared/Foundation | Shared/Foundation | Nein | Technischer Zugriffsguard fuer artist-page Kontext | Behalten |

### Requests

| Datei | Aktueller Kernel | Ziel-Kernel | Konflikt | Begruendung | Massnahme |
|---|---|---|---|---|---|
| apps/api/app/Http/Requests (keine Dateien vorhanden) | Shared/Foundation | Shared/Foundation | Nein | Derzeit keine dedizierten FormRequest-Klassen im Ordner | Behalten |

### Resources

| Datei | Aktueller Kernel | Ziel-Kernel | Konflikt | Begruendung | Massnahme |
|---|---|---|---|---|---|
| apps/api/app/Http/Resources/ArtistPageResource.php | Website | Website | Nein | API-Darstellung der Website-Kerndaten | Behalten |
| apps/api/app/Http/Resources/LinkResource.php | Website | Website | Nein | API-Darstellung von Website-Links | Behalten |
| apps/api/app/Http/Resources/ShowResource.php | Website | Website | Nein | API-Darstellung von Shows | Behalten |
| apps/api/app/Http/Resources/ReleaseResource.php | Website | Website | Nein | API-Darstellung von Releases | Behalten |
| apps/api/app/Http/Resources/VideoResource.php | Website | Website | Nein | API-Darstellung von Videos | Behalten |
| apps/api/app/Http/Resources/FeaturedTrackResource.php | Website | Website | Nein | API-Darstellung von Featured Tracks | Behalten |
| apps/api/app/Http/Resources/GalleryImageResource.php | Website | Website | Nein | API-Darstellung von Gallery-Inhalten | Behalten |
| apps/api/app/Http/Resources/SpotlightResource.php | Phase | Phase | Ja: falscher Begriff | Technisch Spotlight, produktsprachlich Phase | Umbenennung UI-Text |

### Policies

| Datei | Aktueller Kernel | Ziel-Kernel | Konflikt | Begruendung | Massnahme |
|---|---|---|---|---|---|
| apps/api/app/Policies/ArtistPagePolicy.php | Website | Website | Nein | Autorisierung fuer Website-Kernobjekt | Behalten |
| apps/api/app/Policies/ReleasePolicy.php | Website | Website | Nein | Autorisierung fuer Website-Inhalte | Behalten |
| apps/api/app/Policies/SpotlightPolicy.php | Phase | Phase | Ja: falscher Begriff | Spotlight-Begriff soll im UI auf Phase ausgerichtet werden | Umbenennung UI-Text |
| apps/api/app/Policies/CampaignPolicy.php | Links | Links | Nein | MVP: Autorisierung fuer internes Campaign-Gruppierungsmodell im Links-Kern | Behalten |
| apps/api/app/Policies/TrackingLinkPolicy.php | Links | Links | Nein | Autorisierung fuer Tracking-Link-Lifecycle | Behalten |

### API Routes aus routes/api.php

| Datei | Aktueller Kernel | Ziel-Kernel | Konflikt | Begruendung | Massnahme |
|---|---|---|---|---|---|
| apps/api/routes/api.php :: GET /api/v1/p/{handle} | Website | Website | Nein | Oeffentliche Bandseite | Behalten |
| apps/api/routes/api.php :: GET /api/v1/p/{handle}/contact/{label} | Website | Website | Nein | Kontakt-Weiterleitung im Public-Flow | Behalten |
| apps/api/routes/api.php :: GET /api/v1/artist-pages/search | Website | Website | Nein | Website-Entitaetssuche | Behalten |
| apps/api/routes/api.php :: POST /api/v1/analytics/pageview | Analytics | Analytics | Nein | Public Pageview-Erfassung | Behalten |
| apps/api/routes/api.php :: POST /api/v1/auth/register | Shared/Foundation | Shared/Foundation | Nein | Auth-Querschnitt | Behalten |
| apps/api/routes/api.php :: POST /api/v1/auth/login | Shared/Foundation | Shared/Foundation | Nein | Auth-Querschnitt | Behalten |
| apps/api/routes/api.php :: POST /api/v1/auth/logout | Shared/Foundation | Shared/Foundation | Nein | Auth-Querschnitt | Behalten |
| apps/api/routes/api.php :: GET /api/v1/me | Shared/Foundation | Shared/Foundation | Nein | Auth/User-Kontext | Behalten |
| apps/api/routes/api.php :: GET /api/v1/p/{handle}/preview | Website | Website | Nein | Owner-Preview der Website | Behalten |
| apps/api/routes/api.php :: GET /api/v1/artist-pages/me | Website | Website | Nein | Eigene ArtistPage laden | Behalten |
| apps/api/routes/api.php :: POST /api/v1/artist-pages | Website | Website | Nein | ArtistPage anlegen | Behalten |
| apps/api/routes/api.php :: POST /api/v1/handles/check | Website | Website | Nein | Handle-Verfuegbarkeit fuer Website | Behalten |
| apps/api/routes/api.php :: POST /api/v1/artist-pages/upload-avatar | Website | Website | Nein | Website Appearance Asset | Behalten |
| apps/api/routes/api.php :: POST /api/v1/artist-pages/upload-hero | Website | Website | Nein | Website Appearance Asset | Behalten |
| apps/api/routes/api.php :: POST /api/v1/artist-pages/upload-logo | Website | Website | Nein | Website Appearance Asset | Behalten |
| apps/api/routes/api.php :: PATCH /api/v1/artist-pages/update-hero-focal | Website | Website | Nein | Website Appearance | Behalten |
| apps/api/routes/api.php :: DELETE /api/v1/artist-pages/delete-avatar | Website | Website | Nein | Website Appearance Asset | Behalten |
| apps/api/routes/api.php :: DELETE /api/v1/artist-pages/delete-hero | Website | Website | Nein | Website Appearance Asset | Behalten |
| apps/api/routes/api.php :: DELETE /api/v1/artist-pages/delete-logo | Website | Website | Nein | Website Appearance Asset | Behalten |
| apps/api/routes/api.php :: PATCH /api/v1/artist-pages/{id} | Website | Website | Nein | Website-Stammdaten | Behalten |
| apps/api/routes/api.php :: PATCH /api/v1/artist-pages/{artistPage}/sections | Website | Website | Nein | Website-Sections | Behalten |
| apps/api/routes/api.php :: POST /api/v1/artist-pages/{id}/publish | Website | Website | Nein | Sichtbarkeit der ArtistPage (Website-Publishing) | Behalten |
| apps/api/routes/api.php :: POST /api/v1/artist-pages/{id}/unpublish | Website | Website | Nein | Sichtbarkeit der ArtistPage (Website-Publishing) | Behalten |
| apps/api/routes/api.php :: /api/v1/artist-pages/{id}/links* | Website | Website | Nein | Website Social Links | Behalten |
| apps/api/routes/api.php :: /api/v1/artist-pages/{id}/shows* | Website | Website | Nein | Website Shows | Behalten |
| apps/api/routes/api.php :: /api/v1/artist-pages/{id}/releases* | Website | Website | Nein | Website Releases | Behalten |
| apps/api/routes/api.php :: /api/v1/artist-pages/{id}/featured-tracks* | Website | Website | Nein | Website Featured Tracks | Behalten |
| apps/api/routes/api.php :: /api/v1/studio/videos* | Website | Website | Nein | Website Videos | Behalten |
| apps/api/routes/api.php :: /api/v1/studio/gallery* | Website | Website | Nein | Website Gallery | Behalten |
| apps/api/routes/api.php :: GET /api/v1/analytics/overview | Analytics | Analytics | Nein | KPI-Uebersicht | Behalten |
| apps/api/routes/api.php :: GET /api/v1/analytics/breakdown | Analytics | Analytics | Nein | Breakdown-Auswertung | Behalten |
| apps/api/routes/api.php :: GET /api/v1/analytics/comparison | Analytics | Analytics | Nein | Vergleichsauswertung | Behalten |
| apps/api/routes/api.php :: GET /api/v1/studio/home | Shared/Foundation | Shared/Foundation | Nein | Dashboard-Composition-Endpunkt; reine Aggregation ist im Shared/Foundation Layer erlaubt | Behalten |
| apps/api/routes/api.php :: /api/v1/spotlights* | Phase | Phase | Ja: falscher Begriff | Technisch Spotlight, UI soll Phase sprechen | Umbenennung UI-Text |
| apps/api/routes/api.php :: /api/v1/campaigns* | Links | Links | Nein | MVP: internes Campaign-Gruppierungsmodell fuer Links/Distribution | Behalten |
| apps/api/routes/api.php :: /api/v1/tracking-links* | Links | Links | Nein | Distribution- und Tracking-Link-Flows | Behalten |

## Frontend

### Studio Routes und grosse Studio Client Components

| Datei | Aktueller Kernel | Ziel-Kernel | Konflikt | Begruendung | Massnahme |
|---|---|---|---|---|---|
| apps/web/src/app/(studio)/studio/page.tsx | Shared/Foundation | Shared/Foundation | Ja: doppelte Logik | Parallelstruktur zu studio/home und studio/page/* | Pruefen |
| apps/web/src/app/(studio)/studio/OverviewClient.tsx | Shared/Foundation | Shared/Foundation | Ja: doppelte Logik | Ueberblickslogik ueberschneidet Home und andere Dashboards | Pruefen |
| apps/web/src/app/(studio)/studio/home/HomeClient.tsx | Shared/Foundation | Shared/Foundation | Nein | Dashboard-Composition im Shared/Foundation Layer (UI-Aggregation) | Behalten |
| apps/web/src/app/(studio)/studio/home/cards/QuickActions.tsx | Shared/Foundation | Shared/Foundation | Nein | Navigation/Action Shell | Behalten |
| apps/web/src/app/(studio)/studio/home/cards/TrafficSnapshot.tsx | Analytics | Analytics | Nein | Analytics-KPI Card | Behalten |
| apps/web/src/app/(studio)/studio/home/cards/PageReadinessCard.tsx | Website | Website | Nein | Website-Vollstaendigkeit | Behalten |
| apps/web/src/app/(studio)/studio/home/cards/HeroCard.tsx | Website | Website | Nein | Website-Darstellungsstatus | Behalten |
| apps/web/src/app/(studio)/studio/home/cards/PageStatusCard.tsx | Website | Website | Nein | Website-Publish/Statusanzeige | Behalten |
| apps/web/src/app/(studio)/studio/home/cards/ComparisonCard.tsx | Analytics | Analytics | Nein | Vergleichsdarstellung | Behalten |
| apps/web/src/app/(studio)/studio/profile/page.tsx | Website | Website | Nein | Profil-Routenentry | Behalten |
| apps/web/src/app/(studio)/studio/profile/ProfileClient.tsx | Website | Website | Nein | ArtistPage-Profilverwaltung | Behalten |
| apps/web/src/app/(studio)/studio/appearance/page.tsx | Website | Website | Nein | Appearance-Routenentry | Behalten |
| apps/web/src/app/(studio)/studio/appearance/AppearanceClient.tsx | Website | Website | Nein | Darstellung/Theme/Appearance | Behalten |
| apps/web/src/app/(studio)/studio/contact/page.tsx | Website | Website | Nein | Kontakt-Routenentry | Behalten |
| apps/web/src/app/(studio)/studio/contact/ContactClient.tsx | Website | Website | Nein | Kontakt-Inhalte der Website | Behalten |
| apps/web/src/app/(studio)/studio/music/page.tsx | Website | Website | Nein | Music/Content-Section | Behalten |
| apps/web/src/app/(studio)/studio/music/MusicClient.tsx | Website | Website | Nein | Music/Content-Section Verwaltung | Behalten |
| apps/web/src/app/(studio)/studio/shows/page.tsx | Website | Website | Nein | Shows-Routenentry | Behalten |
| apps/web/src/app/(studio)/studio/shows/ShowsClient.tsx | Website | Website | Nein | Shows-Verwaltung | Behalten |
| apps/web/src/app/(studio)/studio/shows/ShowForm.tsx | Website | Website | Nein | Shows-Formlogik | Behalten |
| apps/web/src/app/(studio)/studio/releases/page.tsx | Website | Website | Nein | Releases-Routenentry | Behalten |
| apps/web/src/app/(studio)/studio/releases/ReleasesClient.tsx | Website | Website | Nein | Releases-Verwaltung | Behalten |
| apps/web/src/app/(studio)/studio/releases/ReleaseForm.tsx | Website | Website | Nein | Releases-Formlogik | Behalten |
| apps/web/src/app/(studio)/studio/videos/page.tsx | Website | Website | Nein | Videos-Routenentry | Behalten |
| apps/web/src/app/(studio)/studio/videos/VideosClient.tsx | Website | Website | Nein | Videos-Verwaltung | Behalten |
| apps/web/src/app/(studio)/studio/gallery/page.tsx | Website | Website | Nein | Gallery-Routenentry | Behalten |
| apps/web/src/app/(studio)/studio/gallery/GalleryClient.tsx | Website | Website | Nein | Gallery-Verwaltung | Behalten |
| apps/web/src/app/(studio)/studio/links/page.tsx | Website | Website | Ja: Ziel unklar | Links kann Website-Social oder Tracking bedeuten | Pruefen |
| apps/web/src/app/(studio)/studio/links/LinksClient.tsx | Website | Website | Ja: Ziel unklar | Semantische Ueberschneidung mit Distribution Tracking Links | Pruefen |
| apps/web/src/app/(studio)/studio/stage/page.tsx | Phase | Phase | Ja: falscher Begriff | Stage-Label sollte produktweit als Phase laufen | Umbenennung UI-Text |
| apps/web/src/app/(studio)/studio/project/page.tsx | Phase | Phase | Nein | Phase-Verwaltungseintritt | Behalten |
| apps/web/src/app/(studio)/studio/project/ProjectClient.tsx | Phase | Phase | Nein | Phase-Fokussteuerung | Behalten |
| apps/web/src/app/(studio)/studio/project/CreatePhaseWizard.tsx | Phase | Phase | Nein | Wizard fuer aktuelle Phase | Behalten |
| apps/web/src/app/(studio)/studio/project/CreateSpotlightForm.tsx | Phase | Phase | Ja: falscher Begriff | Technischer Begriff Spotlight im UI | Umbenennung UI-Text |
| apps/web/src/app/(studio)/studio/project/EditSpotlightModal.tsx | Phase | Phase | Ja: falscher Begriff | Technischer Begriff Spotlight im UI | Umbenennung UI-Text |
| apps/web/src/app/(studio)/studio/project/SpotlightCard.tsx | Phase | Phase | Ja: falscher Begriff | Technischer Begriff Spotlight im UI | Umbenennung UI-Text |
| apps/web/src/app/(studio)/studio/project/SpotlightList.tsx | Phase | Phase | Ja: falscher Begriff | Technischer Begriff Spotlight im UI | Umbenennung UI-Text |
| apps/web/src/app/(studio)/studio/project/PhaseDisplayFields.tsx | Phase | Phase | Nein | Phase-Darstellungsparameter | Behalten |
| apps/web/src/app/(studio)/studio/project/ModulesClient.tsx | Phase | Phase | Nein | Phase-Module und Fokus | Behalten |
| apps/web/src/app/(studio)/studio/project/spotlights/page.tsx | Phase | Phase | Ja: falscher Begriff | Spotlight-Begriff als UI-Routenpfad | Umbenennung UI-Text |
| apps/web/src/app/(studio)/studio/share/page.tsx | Phase | Phase | Ja: Mischverantwortung | Uebersicht kombiniert Phase, Links und teils Analytics-Kontext | Spaeter extrahieren |
| apps/web/src/app/(studio)/studio/share/PhaseOverviewClient.tsx | Phase | Phase | Ja: Mischverantwortung | Phase-UI mit Analytics-Signalen in einem Client | Spaeter extrahieren |
| apps/web/src/app/(studio)/studio/share/ShareClient.tsx | Links | Links | Nein | Distribution und Tracking-Link-Erzeugung | Behalten |
| apps/web/src/app/(studio)/studio/share/PlatformSelector.tsx | Links | Links | Nein | Plattformzuordnung fuer Distribution | Behalten |
| apps/web/src/app/(studio)/studio/share/PlacementSelector.tsx | Links | Links | Nein | Placementzuordnung fuer Distribution | Behalten |
| apps/web/src/app/(studio)/studio/share/new/page.tsx | Links | Links | Nein | Neuer Tracking-Link-Flow | Behalten |
| apps/web/src/app/(studio)/studio/share/distribution/page.tsx | Links | Links | Nein | Distribution-Subroute | Behalten |
| apps/web/src/app/(studio)/studio/share/qr/page.tsx | Links | Links | Nein | QR-Link-Flow | Behalten |
| apps/web/src/app/(studio)/studio/share/phases/page.tsx | Phase | Phase | Nein | Phase-bezogene Share-Ansicht | Behalten |
| apps/web/src/app/(studio)/studio/share/performance/page.tsx | Analytics | Analytics | Ja: Mischverantwortung | Performance in Share-Baum kann Phase-Filter enthalten | Spaeter extrahieren |
| apps/web/src/app/(studio)/studio/share/performance/PerformanceClient.tsx | Analytics | Analytics | Ja: Mischverantwortung | Performance-UI mit Share-Kontext gekoppelt | Spaeter extrahieren |
| apps/web/src/app/(studio)/studio/results/page.tsx | Analytics | Analytics | Nein | Kanonische Analytics-Route (results) | Behalten |
| apps/web/src/app/(studio)/studio/results/ResultsClient.tsx | Analytics | Analytics | Nein | Analytics Breakdown/Filter Darstellung | Behalten |
| apps/web/src/app/(studio)/studio/ergebnisse/page.tsx | Analytics | Analytics | Ja: doppelte Logik | Legacy-Alias zur kanonischen results-Route | Spaeter loeschen/redirecten |
| apps/web/src/app/(studio)/studio/settings/page.tsx | Shared/Foundation | Shared/Foundation | Ja: Ziel unklar | Settings ohne klare Produktzuordnung | Pruefen |
| apps/web/src/app/(studio)/studio/settings/SettingsClient.tsx | Shared/Foundation | Shared/Foundation | Ja: Ziel unklar | Settings ohne klare Produktzuordnung | Pruefen |
| apps/web/src/app/(studio)/studio/page/layout.tsx | Shared/Foundation | Shared/Foundation | Nein | Layout Shell | Behalten |
| apps/web/src/app/(studio)/studio/page/page.tsx | Website | Website | Nein | Website Builder Einstieg | Behalten |
| apps/web/src/app/(studio)/studio/page/actions.ts | Website | Website | Nein | Website-Builder Actions | Behalten |
| apps/web/src/app/(studio)/studio/page/PageOverviewClient.tsx | Website | Website | Nein | Website-Builder Uebersicht | Behalten |
| apps/web/src/app/(studio)/studio/page/LivePreviewPanel.tsx | Website | Website | Nein | Oeffentliche Page-Vorschau | Behalten |
| apps/web/src/app/(studio)/studio/page/profile/page.tsx | Website | Website | Nein | Builder Abschnitt Profil | Behalten |
| apps/web/src/app/(studio)/studio/page/appearance/page.tsx | Website | Website | Nein | Builder Abschnitt Appearance | Behalten |
| apps/web/src/app/(studio)/studio/page/contact/page.tsx | Website | Website | Nein | Builder Abschnitt Kontakt | Behalten |
| apps/web/src/app/(studio)/studio/page/music/page.tsx | Website | Website | Nein | Builder Abschnitt Music | Behalten |
| apps/web/src/app/(studio)/studio/page/shows/page.tsx | Website | Website | Nein | Builder Abschnitt Shows | Behalten |
| apps/web/src/app/(studio)/studio/page/releases/page.tsx | Website | Website | Nein | Builder Abschnitt Releases | Behalten |
| apps/web/src/app/(studio)/studio/page/videos/page.tsx | Website | Website | Nein | Builder Abschnitt Videos | Behalten |
| apps/web/src/app/(studio)/studio/page/gallery/page.tsx | Website | Website | Nein | Builder Abschnitt Gallery | Behalten |
| apps/web/src/app/(studio)/studio/page/links/page.tsx | Website | Website | Nein | Builder Abschnitt Social Links | Behalten |

### Public Page Routes

| Datei | Aktueller Kernel | Ziel-Kernel | Konflikt | Begruendung | Massnahme |
|---|---|---|---|---|---|
| apps/web/src/app/(public)/p/[handle]/page.tsx | Website | Website | Nein | Oeffentliche Bandseite | Behalten |
| apps/web/src/app/(public)/p/preview/[template]/page.tsx | Website | Website | Nein | Oeffentliche Template-Preview | Behalten |
| apps/web/src/app/(public)/p/hooks/useActiveSectionObserver.ts | Shared/Foundation | Shared/Foundation | Nein | Technischer UI-Hook | Behalten |
| apps/web/src/app/(public)/p/hooks/useLazyLoad.ts | Shared/Foundation | Shared/Foundation | Nein | Technischer UI-Hook | Behalten |
| apps/web/src/app/(public)/p/hooks/useThrottledScroll.ts | Shared/Foundation | Shared/Foundation | Nein | Technischer UI-Hook | Behalten |
| apps/web/src/app/(public)/p/components/PageviewTracker.tsx | Analytics | Analytics | Nein | Pageview-Erfassung auf Public Page | Behalten |
| apps/web/src/app/(public)/p/components/types.ts | Shared/Foundation | Shared/Foundation | Nein | Technische Typdefinitionen | Behalten |
| apps/web/src/app/(public)/p/components/constants.ts | Shared/Foundation | Shared/Foundation | Nein | Technische Konstanten fuer Templates | Behalten |
| apps/web/src/app/(public)/p/components/helpers.ts | Shared/Foundation | Shared/Foundation | Nein | Hilfsfunktionen fuer Rendering | Behalten |
| apps/web/src/app/(public)/p/components/shared.tsx | Shared/Foundation | Shared/Foundation | Nein | Geteilte Renderbausteine | Behalten |
| apps/web/src/app/(public)/p/components/Hero.tsx | Website | Website | Nein | Website Hero-Darstellung | Behalten |
| apps/web/src/app/(public)/p/components/FullHeroSection.tsx | Website | Website | Nein | Website Hero-Darstellung | Behalten |
| apps/web/src/app/(public)/p/components/FeaturedReleaseHero.tsx | Website | Website | Nein | Website Featured Release | Behalten |
| apps/web/src/app/(public)/p/components/FeaturedReleaseSection.tsx | Website | Website | Nein | Website Featured Release | Behalten |
| apps/web/src/app/(public)/p/components/ReleaseList.tsx | Website | Website | Nein | Website Releases-Liste | Behalten |
| apps/web/src/app/(public)/p/components/VideoList.tsx | Website | Website | Nein | Website Videos-Liste | Behalten |
| apps/web/src/app/(public)/p/components/GalleryGrid.tsx | Website | Website | Nein | Website Gallery-Darstellung | Behalten |
| apps/web/src/app/(public)/p/components/GallerySlider.tsx | Website | Website | Nein | Website Gallery-Darstellung | Behalten |
| apps/web/src/app/(public)/p/components/ImageModal.tsx | Website | Website | Nein | Website Gallery-Darstellung | Behalten |
| apps/web/src/app/(public)/p/components/ShowList.tsx | Website | Website | Nein | Website Shows-Liste | Behalten |
| apps/web/src/app/(public)/p/components/LinkList.tsx | Website | Website | Nein | Website Social Links | Behalten |
| apps/web/src/app/(public)/p/components/MusicPlayer.tsx | Website | Website | Nein | Website Music-Section | Behalten |
| apps/web/src/app/(public)/p/components/ContactInquiryButton.tsx | Website | Website | Nein | Website Kontakt-Komponente | Behalten |
| apps/web/src/app/(public)/p/components/ContentSection.tsx | Website | Website | Nein | Website Section-Container | Behalten |
| apps/web/src/app/(public)/p/components/SectionLayout.tsx | Shared/Foundation | Shared/Foundation | Nein | Technisches Layout fuer Sections | Behalten |
| apps/web/src/app/(public)/p/components/StickyNavigationBar.tsx | Shared/Foundation | Shared/Foundation | Nein | Technische Navigationsshell | Behalten |
| apps/web/src/app/(public)/p/components/LazyVideoEmbed.tsx | Shared/Foundation | Shared/Foundation | Nein | Technische Einbettungslogik | Behalten |
| apps/web/src/app/(public)/p/components/PreviewBanner.tsx | Shared/Foundation | Shared/Foundation | Nein | Preview-Hinweis fuer Rendering-Modus | Behalten |
| apps/web/src/app/(public)/p/components/EmptyStates.tsx | Shared/Foundation | Shared/Foundation | Nein | Generische Empty-State-Darstellung | Behalten |
| apps/web/src/app/(public)/p/components/StageTemplate.tsx | Phase | Phase | Ja: falscher Begriff | Stage-Begriff soll im UI zu Phase werden | Umbenennung UI-Text |
| apps/web/src/app/(public)/p/components/PhaseHero.tsx | Phase | Phase | Nein | Phase-bezogene Hero-Komponente | Behalten |
| apps/web/src/app/(public)/p/components/ProjectHeroBanner.tsx | Phase | Phase | Ja: falscher Begriff | Project/Stage-Sprache nicht konsistent mit Phase | Umbenennung UI-Text |
| apps/web/src/app/(public)/p/components/MinimalTemplate.tsx | Website | Website | Nein | Oeffentliche Website-Template-Darstellung | Behalten |
| apps/web/src/app/(public)/p/components/ModernTemplate.tsx | Website | Website | Nein | Oeffentliche Website-Template-Darstellung | Behalten |
| apps/web/src/app/(public)/p/components/EditorialTemplate.tsx | Website | Website | Nein | Oeffentliche Website-Template-Darstellung | Behalten |
| apps/web/src/app/(public)/p/components/DarkStageTemplate.tsx | Phase | Phase | Ja: falscher Begriff | Stage-Begriff soll im UI zu Phase werden | Umbenennung UI-Text |
| apps/web/src/app/(public)/p/components/DarkEditorialTemplate.tsx | Website | Website | Nein | Oeffentliche Website-Template-Darstellung | Behalten |
| apps/web/src/app/(public)/p/components/DarkMinimalTemplate.tsx | Website | Website | Nein | Oeffentliche Website-Template-Darstellung | Behalten |
| apps/web/src/app/(public)/p/components/DarkEditorialFullTemplate.tsx | Website | Website | Nein | Oeffentliche Website-Template-Darstellung | Behalten |

### API Route Handler (Next.js)

| Datei | Aktueller Kernel | Ziel-Kernel | Konflikt | Begruendung | Massnahme |
|---|---|---|---|---|---|
| apps/web/src/app/api/auth/login/route.ts | Shared/Foundation | Shared/Foundation | Nein | Auth BFF Handler | Behalten |
| apps/web/src/app/api/auth/register/route.ts | Shared/Foundation | Shared/Foundation | Nein | Auth BFF Handler | Behalten |
| apps/web/src/app/api/auth/logout/route.ts | Shared/Foundation | Shared/Foundation | Nein | Auth BFF Handler | Behalten |
| apps/web/src/app/api/artist-pages/search/route.ts | Website | Website | Nein | Website-Suche BFF | Behalten |
| apps/web/src/app/api/studio/artist-pages/route.ts | Website | Website | Nein | ArtistPage BFF | Behalten |
| apps/web/src/app/api/studio/artist-pages/[id]/route.ts | Website | Website | Nein | ArtistPage BFF | Behalten |
| apps/web/src/app/api/studio/artist-pages/[id]/publish/route.ts | Website | Website | Ja: doppelte Logik | Website-Publishing-Endpunkt; ueberschneidet sich mit /studio/publish | Spaeter zentralisieren |
| apps/web/src/app/api/studio/publish/route.ts | Website | Website | Ja: doppelte Logik | Website-Publishing-Endpunkt; Duplicate zu artist-pages/[id]/publish | Spaeter zentralisieren |
| apps/web/src/app/api/studio/unpublish/route.ts | Website | Website | Ja: doppelte Logik | Website-Unpublish-Endpunkt; Duplicate Logik | Spaeter zentralisieren |
| apps/web/src/app/api/studio/handles/check/route.ts | Website | Website | Nein | Handle-Pruefung fuer ArtistPage | Behalten |
| apps/web/src/app/api/studio/upload-avatar/route.ts | Website | Website | Nein | Website Asset Upload | Behalten |
| apps/web/src/app/api/studio/upload-hero/route.ts | Website | Website | Nein | Website Asset Upload | Behalten |
| apps/web/src/app/api/studio/upload-logo/route.ts | Website | Website | Nein | Website Asset Upload | Behalten |
| apps/web/src/app/api/studio/delete-avatar/route.ts | Website | Website | Nein | Website Asset Delete | Behalten |
| apps/web/src/app/api/studio/delete-hero/route.ts | Website | Website | Nein | Website Asset Delete | Behalten |
| apps/web/src/app/api/studio/delete-logo/route.ts | Website | Website | Nein | Website Asset Delete | Behalten |
| apps/web/src/app/api/studio/update-hero-focal/route.ts | Website | Website | Nein | Website Appearance Update | Behalten |
| apps/web/src/app/api/studio/links/route.ts | Website | Website | Ja: Ziel unklar | Links-Begriff kollidiert mit Tracking-Links | Pruefen |
| apps/web/src/app/api/studio/links/[id]/route.ts | Website | Website | Ja: Ziel unklar | Links-Begriff kollidiert mit Tracking-Links | Pruefen |
| apps/web/src/app/api/studio/links/reorder/route.ts | Website | Website | Ja: Ziel unklar | Links-Begriff kollidiert mit Tracking-Links | Pruefen |
| apps/web/src/app/api/studio/shows/route.ts | Website | Website | Nein | Shows BFF | Behalten |
| apps/web/src/app/api/studio/shows/[id]/route.ts | Website | Website | Nein | Shows BFF | Behalten |
| apps/web/src/app/api/studio/shows/[id]/upload-flyer/route.ts | Website | Website | Nein | Shows Asset Upload | Behalten |
| apps/web/src/app/api/studio/shows/[id]/flyer/route.ts | Website | Website | Nein | Shows Asset Delete | Behalten |
| apps/web/src/app/api/studio/releases/route.ts | Website | Website | Nein | Releases BFF | Behalten |
| apps/web/src/app/api/studio/releases/[id]/route.ts | Website | Website | Nein | Releases BFF | Behalten |
| apps/web/src/app/api/studio/releases/[id]/upload-cover/route.ts | Website | Website | Nein | Releases Asset Upload | Behalten |
| apps/web/src/app/api/studio/releases/[id]/cover/route.ts | Website | Website | Nein | Releases Asset Delete | Behalten |
| apps/web/src/app/api/studio/featured-tracks/route.ts | Website | Website | Nein | Featured Tracks BFF | Behalten |
| apps/web/src/app/api/studio/featured-tracks/[id]/route.ts | Website | Website | Nein | Featured Tracks BFF | Behalten |
| apps/web/src/app/api/studio/featured-tracks/reorder/route.ts | Website | Website | Nein | Featured Tracks Reorder | Behalten |
| apps/web/src/app/api/studio/videos/route.ts | Website | Website | Nein | Videos BFF | Behalten |
| apps/web/src/app/api/studio/videos/[id]/route.ts | Website | Website | Nein | Videos BFF | Behalten |
| apps/web/src/app/api/studio/videos/[id]/featured/route.ts | Website | Website | Nein | Videos Featured Toggle | Behalten |
| apps/web/src/app/api/studio/videos/reorder/route.ts | Website | Website | Nein | Videos Reorder | Behalten |
| apps/web/src/app/api/studio/gallery/route.ts | Website | Website | Nein | Gallery BFF | Behalten |
| apps/web/src/app/api/studio/gallery/[id]/route.ts | Website | Website | Nein | Gallery BFF | Behalten |
| apps/web/src/app/api/studio/gallery/reorder/route.ts | Website | Website | Nein | Gallery Reorder | Behalten |
| apps/web/src/app/api/studio/spotlights/route.ts | Phase | Phase | Ja: falscher Begriff | Spotlight-Begriff bleibt technisch, UI soll Phase nutzen | Umbenennung UI-Text |
| apps/web/src/app/api/studio/spotlights/[id]/route.ts | Phase | Phase | Ja: falscher Begriff | Spotlight-Begriff bleibt technisch, UI soll Phase nutzen | Umbenennung UI-Text |
| apps/web/src/app/api/studio/spotlights/[id]/activate/route.ts | Phase | Phase | Ja: falscher Begriff | Spotlight-Begriff bleibt technisch, UI soll Phase nutzen | Umbenennung UI-Text |
| apps/web/src/app/api/studio/spotlights/[id]/end/route.ts | Phase | Phase | Ja: falscher Begriff | Spotlight-Begriff bleibt technisch, UI soll Phase nutzen | Umbenennung UI-Text |
| apps/web/src/app/api/studio/spotlights/[id]/archive/route.ts | Phase | Phase | Ja: falscher Begriff | Spotlight-Begriff bleibt technisch, UI soll Phase nutzen | Umbenennung UI-Text |
| apps/web/src/app/api/studio/spotlights/[id]/restore/route.ts | Phase | Phase | Ja: falscher Begriff | Spotlight-Begriff bleibt technisch, UI soll Phase nutzen | Umbenennung UI-Text |
| apps/web/src/app/api/studio/spotlights/active/route.ts | Phase | Phase | Ja: falscher Begriff | Spotlight-Begriff bleibt technisch, UI soll Phase nutzen | Umbenennung UI-Text |
| apps/web/src/app/api/studio/spotlights/fetch-metadata/route.ts | Phase | Phase | Ja: falscher Begriff | Spotlight-Begriff bleibt technisch, UI soll Phase nutzen | Umbenennung UI-Text |
| apps/web/src/app/api/studio/tracking-links/route.ts | Links | Links | Nein | Tracking-Link BFF | Behalten |
| apps/web/src/app/api/studio/tracking-links/[id]/route.ts | Links | Links | Nein | Tracking-Link BFF | Behalten |
| apps/web/src/app/api/studio/analytics/breakdown/route.ts | Analytics | Analytics | Nein | Analytics Breakdown BFF | Behalten |
| apps/web/src/app/api/studio/page-counts/route.ts | Analytics | Analytics | Nein | Metrik-/Count-Endpoint fuer Studio | Behalten |

### Zentrale lib/api Dateien

| Datei | Aktueller Kernel | Ziel-Kernel | Konflikt | Begruendung | Massnahme |
|---|---|---|---|---|---|
| apps/web/src/lib/api/backend.ts | Shared/Foundation | Shared/Foundation | Nein | Serverseitiger API Client | Behalten |
| apps/web/src/lib/api/client-fetch.ts | Shared/Foundation | Shared/Foundation | Nein | Clientseitiger API Wrapper | Behalten |
| apps/web/src/lib/api/studio.types.ts | Shared/Foundation | Shared/Foundation | Ja: Mischverantwortung | Gemeinsame Studio-Typen enthalten mehrere Produktkerne | Spaeter zentralisieren |
| apps/web/src/lib/api/studio.ts | Shared/Foundation | Shared/Foundation | Ja: Mischverantwortung | Studio API Layer vermischt Home/Website/Phase-Daten | Spaeter zentralisieren |
| apps/web/src/lib/api/spotlights.ts | Phase | Phase | Ja: falscher Begriff | Spotlight-Begriff bleibt technisch, UI soll Phase nutzen | Umbenennung UI-Text |
| apps/web/src/lib/api/tracking-links.ts | Links | Links | Nein | Tracking-Link API | Behalten |
| apps/web/src/lib/api/analytics.ts | Analytics | Analytics | Nein | Analytics API Client | Behalten |
| apps/web/src/lib/api/analytics.server.ts | Analytics | Analytics | Nein | Analytics Server-Fetch | Behalten |

### Zentrale lib/bff Dateien

| Datei | Aktueller Kernel | Ziel-Kernel | Konflikt | Begruendung | Massnahme |
|---|---|---|---|---|---|
| apps/web/src/lib/bff/studio-proxy.ts | Shared/Foundation | Shared/Foundation | Nein | BFF Proxy Kerntechnik | Behalten |
| apps/web/src/lib/bff/studio-endpoints.ts | Shared/Foundation | Shared/Foundation | Nein | Endpoint Mapping fuer Proxy | Behalten |

### Shared Components

| Datei | Aktueller Kernel | Ziel-Kernel | Konflikt | Begruendung | Massnahme |
|---|---|---|---|---|---|
| apps/web/src/components/Toast.tsx | Shared/Foundation | Shared/Foundation | Nein | Globale UI-Feedback Infrastruktur | Behalten |
| apps/web/src/components/studio/results/PlatformBreakdown.tsx | Analytics | Analytics | Nein | Analytics-Darstellungskomponente | Behalten |
| apps/web/src/components/public-page/PhaseHero.tsx | Phase | Phase | Nein | Phase-bezogene Hero-Komponente | Behalten |
| apps/web/src/components/public-page/ProjectHeroBanner.tsx | Phase | Phase | Ja: falscher Begriff | Project/Stage Begriff im UI nicht konsistent | Umbenennung UI-Text |

## 1) Offene Konfliktdateien

- apps/api/app/Services/StudioHomeService.php
- apps/api/app/Services/LinkService.php
- apps/web/src/app/(studio)/studio/page.tsx
- apps/web/src/app/(studio)/studio/OverviewClient.tsx
- apps/web/src/app/(studio)/studio/links/page.tsx
- apps/web/src/app/(studio)/studio/links/LinksClient.tsx
- apps/web/src/app/(studio)/studio/share/page.tsx
- apps/web/src/app/(studio)/studio/share/PhaseOverviewClient.tsx
- apps/web/src/app/(studio)/studio/share/performance/page.tsx
- apps/web/src/app/(studio)/studio/share/performance/PerformanceClient.tsx
- apps/web/src/app/(studio)/studio/ergebnisse/page.tsx
- apps/web/src/app/(studio)/studio/settings/page.tsx
- apps/web/src/app/(studio)/studio/settings/SettingsClient.tsx
- apps/web/src/lib/api/studio.ts
- apps/web/src/lib/api/studio.types.ts
- apps/web/src/app/api/studio/publish/route.ts
- apps/web/src/app/api/studio/unpublish/route.ts
- apps/web/src/app/api/studio/artist-pages/[id]/publish/route.ts

## 2) P1 Quick Wins

- UI-Terminologie auf Phase vereinheitlichen, ohne API-Pfade zu brechen.
- results als kanonische Analytics-Route festschreiben und ergebnisse als Legacy-Redirect markieren.
- LinkService Benennung fachlich schaerfen (Website Links vs Tracking Links), zunaechst nur Doku/Benennungsplan.
- Konfliktmarkierungen aus dieser Matrix als PR-Checkliste verwenden.

## 3) P2 mittlere Refactors

- Doppelte Website-Publishing-Handler (/studio/publish, /studio/unpublish, artist-pages/[id]/publish) spaeter zentralisieren.
- StudioHomeService auf reine Composition reduzieren und domainnahe Business-Logik auslagern.
- Share-Baum in klare Unterbereiche trennen: Phase Overview, Links Distribution, Analytics Performance.
- Studio API Layer in kleinere kernscharfe Adapter aufteilen.

## 4) P3 tiefe Refactors

- Historisch gewachsene Doppelstruktur studio/* und studio/page/* langfristig zusammenfuehren.
- Grosse Studio Clients mit Mischverantwortung in kernscharfe Bausteine schneiden.

## 5) Dateien, die bewusst vorerst nicht angefasst werden

- apps/api/routes/api.php (nur dokumentiert, keine Aenderung in diesem Schritt)
- apps/web/src/app/api/** (nur klassifiziert, keine Handler-Aenderung)
- apps/web/src/lib/bff/studio-proxy.ts
- apps/web/src/lib/bff/studio-endpoints.ts
- apps/web/src/lib/api/backend.ts
- apps/web/src/lib/api/client-fetch.ts
- apps/web/src/components/Toast.tsx
