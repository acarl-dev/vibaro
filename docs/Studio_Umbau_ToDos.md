

# Vibaro Studio Redesign – Vollständiger Umsetzungsplan

Basierend auf der Gesamtanalyse des Projekts und den Konzepten v2/v3.

---

## Phasen-Übersicht

```
Phase 0 ─ Docs aktualisieren (Foundation)
Phase 1 ─ Backend: Datenmodell + API-Anpassungen
Phase 2 ─ Frontend: Navigations-Umbau + Home-Tab
Phase 3 ─ Frontend: Teilen-Tab (Plattform → Platzierung)
Phase 4 ─ Frontend: Meine Seite verfeinern
Phase 5 ─ Frontend: Mein Projekt + Ergebnisse-Tab
Phase 6 ─ Projekt ↔ Seite Verknüpfung (Hero-Banner)
Phase 7 ─ Polish (Toasts, Tipps, Leer-Zustände, Mobile)
Phase 8 ─ Aufräumen (alte Dateien, Redirects, Tests)
```

---

## Phase 0: Docs aktualisieren

**Ziel:** Alle Änderungen sind dokumentiert bevor Code geschrieben wird.

### 0.1 – DATA_MODEL.md aktualisieren

**Datei:** DATA_MODEL.md

Änderungen an `tracking_links`:

```
tracking_links (ÄNDERUNGEN)
├── platform          VARCHAR(50) NOT NULL     ← NEU
├── placement         VARCHAR(50) NOT NULL     ← NEU
├── click_count       INTEGER DEFAULT 0        ← NEU (denormalisiert)
├── archived_at       TIMESTAMP NULL           ← NEU
├── UNIQUE INDEX (spotlight_id, platform, placement) WHERE archived_at IS NULL  ← NEU
│
├── label             → wird auto-generiert, nicht mehr User-Input
├── utm_source        → wird serverseitig aus `platform` generiert
├── utm_medium        → wird serverseitig aus `placement` generiert
├── utm_campaign      → wird serverseitig aus spotlight.title generiert
├── campaign_id       → bleibt, aber Campaign wird auto-erstellt (nicht mehr Frontend)
```

Änderungen an `spotlights`:

```
spotlights (ÄNDERUNGEN)
├── show_on_page      BOOLEAN DEFAULT FALSE    ← NEU
```

Änderungen an `artist_pages`:

```
artist_pages (ÄNDERUNGEN)
├── visible_sections  JSONB DEFAULT '["profile","links","music","shows","releases","videos","gallery","contact"]'  ← NEU
```

### 0.2 – API_CONTRACTS.md aktualisieren

**Datei:** API_CONTRACTS.md

Neue/geänderte Endpoints:

```
POST   /api/v1/tracking-links          ← Request-Body ändert sich
GET    /api/v1/tracking-links/check    ← NEU (Duplikat-Prüfung)
PATCH  /api/v1/tracking-links/{id}/archive  ← NEU (statt DELETE)
GET    /api/v1/studio/home             ← NEU (aggregierte Home-Daten)
GET    /api/v1/analytics/breakdown     ← NEU (Plattform+Placement Aufschlüsselung)
PATCH  /api/v1/spotlights/{id}/show-on-page  ← NEU (Toggle)
PATCH  /api/v1/artist-pages/{id}/sections    ← NEU (Bereichs-Sichtbarkeit)
```

**POST /api/v1/tracking-links – Neuer Request:**

```json
{
  "spotlight_id": 1,
  "platform": "instagram",
  "placement": "story",
  "target_url": "https://open.spotify.com/track/..."
}
```

Response bleibt Standard-Format. `label`, `utm_source`, `utm_medium`, `utm_campaign`, `campaign_id` werden **serverseitig** gesetzt. Frontend sendet keine UTMs und keine `campaign_id` mehr.

**GET /api/v1/tracking-links/check:**

```
Query: ?spotlight_id=1&platform=instagram&placement=story
Response: { "data": { "exists": true, "link": { ... } } }
       or { "data": { "exists": false } }
```

**PATCH /api/v1/tracking-links/{id}/archive:**

```
Request: (leer)
Response: { "data": { "id": 1, "archived_at": "2026-02-20T..." } }
```

**GET /api/v1/studio/home:**

```json
{
  "data": {
    "spotlight": {
      "id": 1,
      "title": "Neue Single – Sommernacht",
      "type": "release",
      "status": "active",
      "activated_at": "2026-02-15T...",
      "days_active": 5,
      "show_on_page": false
    },
    "stats": {
      "total_clicks_7d": 87,
      "trend": 12
    },
    "top_links": [
      {
        "id": 10,
        "platform": "instagram",
        "placement": "story",
        "tracking_url": "https://vibaro.app/t/abc123",
        "click_count": 38
      },
      {
        "id": 11,
        "platform": "tiktok",
        "placement": "bio",
        "tracking_url": "https://vibaro.app/t/def456",
        "click_count": 18
      }
    ],
    "page": {
      "handle": "sarahmusic",
      "is_published": true,
      "display_name": "Sarah",
      "updated_at": "2026-02-17T..."
    },
    "tip": {
      "type": "best_platform",
      "message": "Deine Instagram-Stories bringen die meisten Klicks. Poste heute nochmal eine!",
      "action_label": "Story-Link kopieren",
      "action_type": "copy_link",
      "action_payload": { "link_id": 10 }
    }
  }
}
```

`tip` ist `null` wenn kein Tipp relevant ist.

**GET /api/v1/analytics/breakdown:**

```
Query: ?spotlight_id=1&period=7d
Response:
{
  "data": {
    "total_clicks": 87,
    "trend": 12,
    "period": "7d",
    "by_platform": [
      {
        "platform": "instagram",
        "clicks": 52,
        "placements": [
          { "placement": "story", "clicks": 38 },
          { "placement": "bio", "clicks": 12 },
          { "placement": "reel", "clicks": 2 }
        ]
      },
      {
        "platform": "tiktok",
        "clicks": 23,
        "placements": [
          { "placement": "bio", "clicks": 18 },
          { "placement": "video", "clicks": 5 }
        ]
      }
    ]
  }
}
```

### 0.3 – PRODUCT_RULES.md ergänzen

**Datei:** `docs/PRODUCT_RULES.md`

Neue Regeln:

```
STUDIO REDESIGN RULES:
- Studio Home ist der Default-Tab für alle Besuche.
- Tracking-Links sind unique pro (spotlight_id, platform, placement) solange nicht archiviert.
- UTM-Parameter werden serverseitig aus platform/placement/spotlight generiert. Frontend sendet nie UTMs.
- Campaigns werden serverseitig auto-erstellt. Frontend erstellt nie direkt Campaigns.
- Attribution formuliert User-Intent ("Dein Link für Instagram · Story"), nicht technisches Tracking.
- Labels werden auto-generiert: "{Platform} · {Placement}".
- Page-Builder im MVP: feste Bereiche mit Toggle (sichtbar/verborgen), keine freien Blöcke, kein Drag-and-Drop.
- Content-Editoren (Profil, Links, Musik, Shows, Releases, Videos, Galerie, Kontakt, Themes) 
  sind Sub-Pages innerhalb "Meine Seite", keine Top-Level-Navigation.
- Öffentliche Seite zeigt nur Bereiche die in visible_sections aktiviert sind.
- Aktives Spotlight mit show_on_page=true wird als Hero-Banner auf der öffentlichen Seite angezeigt.
```

### Dateien Phase 0

| Aktion | Datei |
|---|---|
| Ändern | DATA_MODEL.md |
| Ändern | API_CONTRACTS.md |
| Ändern | `docs/PRODUCT_RULES.md` |

---

## Phase 1: Backend – Datenmodell + API

**Ziel:** Datenmodell steht, alle neuen Endpoints funktionieren.

### 1.1 – Migration: tracking_links erweitern

**Erstellen:** `database/migrations/xxxx_add_platform_placement_to_tracking_links.php`

```
Schema::table('tracking_links', function (Blueprint $table) {
    $table->string('platform', 50)->nullable()->after('module');
    $table->string('placement', 50)->nullable()->after('platform');
    $table->integer('click_count')->default(0)->after('utm_term');
    $table->timestamp('archived_at')->nullable()->after('is_active');
});

// Partial unique index (nur nicht-archivierte Links)
DB::statement('
    CREATE UNIQUE INDEX tracking_links_unique_active 
    ON tracking_links (spotlight_id, platform, placement) 
    WHERE archived_at IS NULL
');
```

`platform` und `placement` sind zunächst nullable für die Backfill-Migration.

### 1.2 – Data-Migration: Backfill bestehender Links

**Erstellen:** `database/migrations/xxxx_backfill_platform_placement_on_tracking_links.php`

```
// Bestehende Links: utm_source → platform, placement = "legacy"
DB::table('tracking_links')
    ->whereNull('platform')
    ->update([
        'platform' => DB::raw('utm_source'),
        'placement' => 'legacy',
    ]);
```

Danach zweite Migration die `platform` und `placement` NOT NULL macht:

**Erstellen:** `database/migrations/xxxx_make_platform_placement_required.php`

```
Schema::table('tracking_links', function (Blueprint $table) {
    $table->string('platform', 50)->nullable(false)->change();
    $table->string('placement', 50)->nullable(false)->change();
});
```

### 1.3 – Migration: spotlights erweitern

**Erstellen:** `database/migrations/xxxx_add_show_on_page_to_spotlights.php`

```
Schema::table('spotlights', function (Blueprint $table) {
    $table->boolean('show_on_page')->default(false)->after('ended_at');
});
```

### 1.4 – Migration: artist_pages erweitern

**Erstellen:** `database/migrations/xxxx_add_visible_sections_to_artist_pages.php`

```
Schema::table('artist_pages', function (Blueprint $table) {
    $table->jsonb('visible_sections')
        ->default('["profile","links","music","shows","releases","videos","gallery","contact"]')
        ->after('is_published');
});
```

### 1.5 – TrackingLink Model anpassen

**Ändern:** `app/Models/TrackingLink.php`

```php
// fillable erweitern
protected $fillable = [
    // ...existing...
    'platform',
    'placement', 
    'click_count',
    'archived_at',
];

protected $casts = [
    // ...existing...
    'archived_at' => 'datetime',
    'click_count' => 'integer',
];

// Neuer Scope: nur aktive (nicht archivierte) Links
public function scopeActive($query)
{
    return $query->whereNull('archived_at');
}

// Auto-Generierung im boot()
protected static function booted()
{
    static::creating(function (TrackingLink $link) {
        // Label auto-generieren
        $platformLabel = ucfirst($link->platform);
        $placementLabel = ucfirst(str_replace('_', ' ', $link->placement));
        $link->label = "{$platformLabel} · {$placementLabel}";
        
        // UTMs auto-generieren
        $link->utm_source = $link->platform;
        $link->utm_medium = $link->placement;
        
        if ($link->spotlight) {
            $link->utm_campaign = Str::slug($link->spotlight->title);
        }
    });
}
```

### 1.6 – Spotlight Model anpassen

**Ändern:** `app/Models/Spotlight.php`

```php
protected $fillable = [
    // ...existing...
    'show_on_page',
];

protected $casts = [
    // ...existing...
    'show_on_page' => 'boolean',
];
```

### 1.7 – ArtistPage Model anpassen

**Ändern:** `app/Models/ArtistPage.php`

```php
protected $fillable = [
    // ...existing...
    'visible_sections',
];

protected $casts = [
    // ...existing...
    'visible_sections' => 'array',
];
```

### 1.8 – TrackingLinkController anpassen

**Ändern:** `app/Http/Controllers/Api/TrackingLinkController.php`

**store() – Neuer Flow:**

```php
public function store(Request $request)
{
    $validated = $request->validate([
        'spotlight_id' => 'required|exists:spotlights,id',
        'platform'     => 'required|string|in:instagram,tiktok,youtube,facebook,twitter,whatsapp,telegram,email,other',
        'placement'    => 'required|string|max:50',
        'target_url'   => 'required|url',
    ]);

    // Ownership-Check: Spotlight gehört dem User
    $spotlight = Spotlight::where('id', $validated['spotlight_id'])
        ->where('user_id', auth()->id())
        ->firstOrFail();

    // Duplikat-Check
    $existing = TrackingLink::where('spotlight_id', $spotlight->id)
        ->where('platform', $validated['platform'])
        ->where('placement', $validated['placement'])
        ->active()
        ->first();

    if ($existing) {
        return response()->json([
            'message' => 'Ein Link für diese Plattform und Platzierung existiert bereits.',
            'data' => $existing,
        ], 409);
    }

    // Campaign auto-erstellen oder finden
    $campaign = Campaign::firstOrCreate([
        'user_id'      => auth()->id(),
        'spotlight_id' => $spotlight->id,
        'platform'     => $validated['platform'],
    ], [
        'name' => ucfirst($validated['platform']) . ' — ' . $spotlight->title,
    ]);

    // Short-Code generieren
    $shortCode = Str::random(7);

    // Link erstellen (Label + UTMs werden im Model-Boot auto-generiert)
    $link = TrackingLink::create([
        'user_id'      => auth()->id(),
        'spotlight_id' => $spotlight->id,
        'campaign_id'  => $campaign->id,
        'platform'     => $validated['platform'],
        'placement'    => $validated['placement'],
        'target_url'   => $validated['target_url'],
        'short_code'   => $shortCode,
        'tracking_url' => config('app.url') . '/t/' . $shortCode,
        'module'       => 'share',
    ]);

    return response()->json(['data' => $link], 201);
}
```

**Neue Methode: check()**

```php
public function check(Request $request)
{
    $validated = $request->validate([
        'spotlight_id' => 'required|integer',
        'platform'     => 'required|string',
        'placement'    => 'required|string',
    ]);

    $link = TrackingLink::where('spotlight_id', $validated['spotlight_id'])
        ->where('platform', $validated['platform'])
        ->where('placement', $validated['placement'])
        ->where('user_id', auth()->id())
        ->active()
        ->first();

    return response()->json([
        'data' => [
            'exists' => $link !== null,
            'link'   => $link,
        ],
    ]);
}
```

**Neue Methode: archive() (ersetzt destroy für aktive Nutzung)**

```php
public function archive(TrackingLink $trackingLink)
{
    $this->authorize('update', $trackingLink);
    
    $trackingLink->update(['archived_at' => now()]);

    return response()->json(['data' => $trackingLink]);
}
```

### 1.9 – Campaign Model anpassen

**Ändern:** `app/Models/Campaign.php`

`platform`-Feld muss fillable sein für `firstOrCreate`. Prüfen ob das Feld in der Tabelle existiert – falls nicht, Migration:

**Ggf. erstellen:** `database/migrations/xxxx_add_platform_to_campaigns.php`

```
// Nur falls campaigns.platform nicht existiert
Schema::table('campaigns', function (Blueprint $table) {
    $table->string('platform', 50)->nullable()->after('name');
});
```

### 1.10 – StudioHomeController + Service

**Erstellen:** `app/Http/Controllers/Api/StudioHomeController.php`

```php
class StudioHomeController extends Controller
{
    public function __invoke(StudioHomeService $service)
    {
        return response()->json([
            'data' => $service->getHomeData(auth()->user()),
        ]);
    }
}
```

**Erstellen:** `app/Services/StudioHomeService.php`

```php
class StudioHomeService
{
    public function getHomeData(User $user): array
    {
        // 1. Aktives Spotlight
        $spotlight = $user->spotlights()
            ->where('status', 'active')
            ->first();

        // 2. Top Links (max 3, nach click_count)
        $topLinks = $spotlight
            ? TrackingLink::where('spotlight_id', $spotlight->id)
                ->where('user_id', $user->id)
                ->active()
                ->orderByDesc('click_count')
                ->limit(3)
                ->get()
            : collect();

        // 3. Stats (7 Tage + Trend)
        $stats = $this->getStats($user, $spotlight);

        // 4. Page-Status
        $page = $user->artistPage;

        // 5. Tipp generieren
        $tip = $this->generateTip($user, $spotlight, $topLinks, $page, $stats);

        return [
            'spotlight' => $spotlight ? [
                'id'           => $spotlight->id,
                'title'        => $spotlight->title,
                'type'         => $spotlight->type,
                'status'       => $spotlight->status,
                'activated_at' => $spotlight->activated_at,
                'days_active'  => $spotlight->activated_at 
                    ? $spotlight->activated_at->diffInDays(now()) 
                    : 0,
                'show_on_page' => $spotlight->show_on_page,
            ] : null,
            'stats'     => $stats,
            'top_links' => $topLinks->map(fn($l) => [
                'id'           => $l->id,
                'platform'     => $l->platform,
                'placement'    => $l->placement,
                'tracking_url' => $l->tracking_url,
                'click_count'  => $l->click_count,
            ]),
            'page' => $page ? [
                'handle'       => $page->handle,
                'is_published' => $page->is_published,
                'display_name' => $page->display_name,
                'updated_at'   => $page->updated_at,
            ] : null,
            'tip' => $tip,
        ];
    }

    private function getStats(User $user, ?Spotlight $spotlight): array
    {
        if (!$spotlight) {
            return ['total_clicks_7d' => 0, 'trend' => 0];
        }

        $linkIds = TrackingLink::where('spotlight_id', $spotlight->id)
            ->where('user_id', $user->id)
            ->pluck('id'); // aktive + archivierte für Gesamt-Stats

        $last7 = Click::whereIn('tracking_link_id', $linkIds)
            ->where('created_at', '>=', now()->subDays(7))
            ->count();

        $prev7 = Click::whereIn('tracking_link_id', $linkIds)
            ->where('created_at', '>=', now()->subDays(14))
            ->where('created_at', '<', now()->subDays(7))
            ->count();

        return [
            'total_clicks_7d' => $last7,
            'trend'           => $last7 - $prev7,
        ];
    }

    private function generateTip(
        User $user,
        ?Spotlight $spotlight,
        $topLinks,
        ?ArtistPage $page,
        array $stats
    ): ?array {
        // Priorität 1: Keine Seite
        if (!$page) {
            return [
                'type'         => 'no_page',
                'message'      => 'Erstelle deine persönliche Seite, damit Fans dich finden.',
                'action_label' => 'Seite einrichten',
                'action_type'  => 'navigate',
                'action_payload' => ['url' => '/studio/page'],
            ];
        }

        // Priorität 2: Seite nicht veröffentlicht
        if ($page && !$page->is_published) {
            return [
                'type'         => 'unpublished_page',
                'message'      => 'Deine Seite ist noch nicht öffentlich. Veröffentliche sie, damit Fans dich finden.',
                'action_label' => 'Seite veröffentlichen',
                'action_type'  => 'navigate',
                'action_payload' => ['url' => '/studio/page'],
            ];
        }

        // Priorität 3: Kein Projekt
        if (!$spotlight) {
            return [
                'type'         => 'no_project',
                'message'      => 'Starte ein Projekt, um Links zu erstellen und zu sehen wie es läuft.',
                'action_label' => 'Projekt starten',
                'action_type'  => 'navigate',
                'action_payload' => ['url' => '/studio/project'],
            ];
        }

        // Priorität 4: Projekt, aber keine Links
        if ($spotlight && $topLinks->isEmpty()) {
            return [
                'type'         => 'no_links',
                'message'      => 'Du hast noch keine Links erstellt. Starte mit Instagram – dort sind die meisten Fans.',
                'action_label' => 'Ersten Link erstellen',
                'action_type'  => 'navigate',
                'action_payload' => ['url' => '/studio/share'],
            ];
        }

        // Priorität 5: Keine Klicks seit 2 Tagen
        if ($spotlight && $topLinks->isNotEmpty()) {
            $recentClicks = Click::whereIn('tracking_link_id', $topLinks->pluck('id'))
                ->where('created_at', '>=', now()->subDays(2))
                ->count();

            if ($recentClicks === 0) {
                return [
                    'type'         => 'stale_links',
                    'message'      => 'Deine Links wurden seit 2 Tagen nicht geklickt. Teile sie nochmal in einer Story!',
                    'action_label' => 'Zum Teilen',
                    'action_type'  => 'navigate',
                    'action_payload' => ['url' => '/studio/share'],
                ];
            }
        }

        // Priorität 6: Beste Plattform empfehlen
        if ($topLinks->isNotEmpty()) {
            $best = $topLinks->first();
            $platformLabel = ucfirst($best->platform);
            $placementLabel = ucfirst($best->placement);

            return [
                'type'         => 'best_platform',
                'message'      => "Deine {$platformLabel}-{$placementLabel}-Links bringen die meisten Klicks. Poste dort nochmal!",
                'action_label' => "{$platformLabel}-Link kopieren",
                'action_type'  => 'copy_link',
                'action_payload' => ['link_id' => $best->id, 'tracking_url' => $best->tracking_url],
            ];
        }

        return null;
    }
}
```

### 1.11 – AnalyticsService erweitern: Breakdown

**Ändern:** `app/Services/AnalyticsService.php`

Neue Methode hinzufügen:

```php
public function getBreakdown(User $user, int $spotlightId, string $period = '7d'): array
{
    $days = match ($period) {
        '7d'  => 7,
        '30d' => 30,
        '90d' => 90,
        default => 7,
    };

    $links = TrackingLink::where('spotlight_id', $spotlightId)
        ->where('user_id', $user->id)
        ->get();

    $linkIds = $links->pluck('id');

    // Gesamt-Klicks
    $totalCurrent = Click::whereIn('tracking_link_id', $linkIds)
        ->where('created_at', '>=', now()->subDays($days))
        ->count();

    $totalPrevious = Click::whereIn('tracking_link_id', $linkIds)
        ->where('created_at', '>=', now()->subDays($days * 2))
        ->where('created_at', '<', now()->subDays($days))
        ->count();

    // Gruppierung nach Platform + Placement
    $clicksByLink = Click::whereIn('tracking_link_id', $linkIds)
        ->where('created_at', '>=', now()->subDays($days))
        ->selectRaw('tracking_link_id, COUNT(*) as clicks')
        ->groupBy('tracking_link_id')
        ->pluck('clicks', 'tracking_link_id');

    $byPlatform = $links
        ->groupBy('platform')
        ->map(function ($platformLinks, $platform) use ($clicksByLink) {
            $placements = $platformLinks->map(function ($link) use ($clicksByLink) {
                return [
                    'placement' => $link->placement,
                    'clicks'    => $clicksByLink->get($link->id, 0),
                ];
            })
            ->sortByDesc('clicks')
            ->values();

            return [
                'platform'   => $platform,
                'clicks'     => $placements->sum('clicks'),
                'placements' => $placements,
            ];
        })
        ->sortByDesc('clicks')
        ->values();

    return [
        'total_clicks' => $totalCurrent,
        'trend'        => $totalCurrent - $totalPrevious,
        'period'       => $period,
        'by_platform'  => $byPlatform,
    ];
}
```

### 1.12 – SpotlightController erweitern

**Ändern:** `app/Http/Controllers/Api/SpotlightController.php`

Neue Methode:

```php
public function toggleShowOnPage(Spotlight $spotlight)
{
    $this->authorize('update', $spotlight);
    
    $spotlight->update([
        'show_on_page' => !$spotlight->show_on_page,
    ]);

    return response()->json(['data' => $spotlight]);
}
```

Bei `end()` – Links archivieren + `show_on_page` zurücksetzen:

```php
public function end(Spotlight $spotlight)
{
    $this->authorize('update', $spotlight);

    $spotlight->update([
        'status'       => 'ended',
        'ended_at'     => now(),
        'show_on_page' => false,
    ]);

    // Zugehörige Links archivieren
    TrackingLink::where('spotlight_id', $spotlight->id)
        ->active()
        ->update(['archived_at' => now()]);

    return response()->json(['data' => $spotlight]);
}
```

### 1.13 – ArtistPageController erweitern

**Ändern:** `app/Http/Controllers/Api/ArtistPageController.php`

Neue Methode:

```php
public function updateSections(Request $request, ArtistPage $artistPage)
{
    $this->authorize('update', $artistPage);

    $validated = $request->validate([
        'visible_sections'   => 'required|array',
        'visible_sections.*' => 'string|in:profile,links,music,shows,releases,videos,gallery,contact',
    ]);

    $artistPage->update($validated);

    return response()->json(['data' => $artistPage]);
}
```

### 1.14 – Routes registrieren

**Ändern:** `routes/api.php`

```php
// ...existing routes...

// Studio Home
Route::get('/studio/home', StudioHomeController::class)
    ->middleware('auth:sanctum');

// Tracking Links – neue Methoden
Route::get('/tracking-links/check', [TrackingLinkController::class, 'check'])
    ->middleware('auth:sanctum');
Route::patch('/tracking-links/{trackingLink}/archive', [TrackingLinkController::class, 'archive'])
    ->middleware('auth:sanctum');

// Spotlight – show_on_page
Route::patch('/spotlights/{spotlight}/show-on-page', [SpotlightController::class, 'toggleShowOnPage'])
    ->middleware('auth:sanctum');

// Artist Page – Sections
Route::patch('/artist-pages/{artistPage}/sections', [ArtistPageController::class, 'updateSections'])
    ->middleware('auth:sanctum');

// Analytics – Breakdown
Route::get('/analytics/breakdown', [AnalyticsController::class, 'breakdown'])
    ->middleware('auth:sanctum');
```

### 1.15 – AnalyticsController erstellen/erweitern

**Erstellen oder ändern:** `app/Http/Controllers/Api/AnalyticsController.php`

```php
class AnalyticsController extends Controller
{
    public function breakdown(Request $request, AnalyticsService $service)
    {
        $validated = $request->validate([
            'spotlight_id' => 'required|integer',
            'period'       => 'sometimes|string|in:7d,30d,90d',
        ]);

        // Ownership-Check
        $spotlight = Spotlight::where('id', $validated['spotlight_id'])
            ->where('user_id', auth()->id())
            ->firstOrFail();

        $data = $service->getBreakdown(
            auth()->user(),
            $spotlight->id,
            $validated['period'] ?? '7d'
        );

        return response()->json(['data' => $data]);
    }
}
```

### 1.16 – click_count synchron halten

**Ändern:** `app/Services/TrackingService.php`

Beim Registrieren eines Klicks den `click_count` auf dem Link inkrementieren:

```php
// In der Methode die einen Click registriert:
// ...existing click creation...

// Denormalisierten Counter inkrementieren
$trackingLink->increment('click_count');
```

### Dateien Phase 1 – Zusammenfassung

| Aktion | Datei |
|---|---|
| Erstellen | `database/migrations/xxxx_add_platform_placement_to_tracking_links.php` |
| Erstellen | `database/migrations/xxxx_backfill_platform_placement_on_tracking_links.php` |
| Erstellen | `database/migrations/xxxx_make_platform_placement_required.php` |
| Erstellen | `database/migrations/xxxx_add_show_on_page_to_spotlights.php` |
| Erstellen | `database/migrations/xxxx_add_visible_sections_to_artist_pages.php` |
| Erstellen | `database/migrations/xxxx_add_platform_to_campaigns.php` (falls nötig) |
| Ändern | `app/Models/TrackingLink.php` |
| Ändern | `app/Models/Spotlight.php` |
| Ändern | `app/Models/ArtistPage.php` |
| Ändern | `app/Http/Controllers/Api/TrackingLinkController.php` |
| Ändern | `app/Http/Controllers/Api/SpotlightController.php` |
| Ändern | `app/Http/Controllers/Api/ArtistPageController.php` |
| Erstellen | `app/Http/Controllers/Api/StudioHomeController.php` |
| Erstellen | `app/Http/Controllers/Api/AnalyticsController.php` (oder erweitern) |
| Erstellen | `app/Services/StudioHomeService.php` |
| Ändern | `app/Services/AnalyticsService.php` |
| Ändern | `app/Services/TrackingService.php` |
| Ändern | `routes/api.php` |

### Smoke-Test Phase 1

```bash
# 1. Migrations ausführen
cd apps/api && php artisan migrate

# 2. Studio Home testen
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/studio/home

# 3. Link erstellen (neuer Flow)
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"spotlight_id":1,"platform":"instagram","placement":"story","target_url":"https://spotify.com/track/..."}' \
  http://localhost:8000/api/v1/tracking-links

# 4. Duplikat-Check
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/api/v1/tracking-links/check?spotlight_id=1&platform=instagram&placement=story"

# 5. Duplikat ablehnen (selbe Payload nochmal → erwarte 409)
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"spotlight_id":1,"platform":"instagram","placement":"story","target_url":"https://spotify.com/track/..."}' \
  http://localhost:8000/api/v1/tracking-links

# 6. Archivieren
curl -X PATCH -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/tracking-links/1/archive

# 7. Analytics Breakdown
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/api/v1/analytics/breakdown?spotlight_id=1&period=7d"
```

---

## Phase 2: Frontend – Navigations-Umbau + Home-Tab

**Ziel:** 5-Tab-Layout ersetzt 13-Punkt-Sidebar. Home als Default.

### 2.1 – Plattform-Konfiguration erstellen

**Erstellen:** platforms.ts

```typescript
export type Placement = {
  id: string;
  label: string;
  description: string;
  utmMedium: string;
};

export type Platform = {
  id: string;
  label: string;
  icon: string;
  utmSource: string;
  placements: Placement[];
  copyHints: Record<string, string>;
};

export const PLATFORMS: Platform[] = [
  {
    id: "instagram",
    label: "Instagram",
    icon: "📷",
    utmSource: "instagram",
    placements: [
      { id: "bio", label: "Bio-Link", description: "Für den Link in deiner Instagram-Bio", utmMedium: "bio" },
      { id: "story", label: "Story (Sticker)", description: "Für einen Link-Sticker in deiner Story", utmMedium: "story" },
      { id: "reel", label: "Reel-Beschreibung", description: "Für den Link in der Reel-Caption", utmMedium: "reel" },
      { id: "post", label: "Post-Beschreibung", description: "Für den Link unter einem Foto-Post", utmMedium: "post" },
    ],
    copyHints: {
      bio: "Füge den Link jetzt in deine Instagram-Bio ein. Gehe dazu auf Profil bearbeiten → Website.",
      story: "Füge einen Link-Sticker in deine Story ein und verwende diesen Link.",
      reel: "Füge den Link in die Beschreibung deines Reels ein.",
      post: "Füge den Link in die Beschreibung deines Posts ein.",
    },
  },
  {
    id: "tiktok",
    label: "TikTok",
    icon: "🎵",
    utmSource: "tiktok",
    placements: [
      { id: "bio", label: "Bio-Link", description: "Für den Link in deinem TikTok-Profil", utmMedium: "bio" },
      { id: "video", label: "Video-Beschreibung", description: "Für den Link unter deinem Video", utmMedium: "video" },
      { id: "comment", label: "Angepinnter Kommentar", description: "Für einen angepinnten Kommentar", utmMedium: "comment" },
    ],
    copyHints: {
      bio: "Gehe zu deinem TikTok-Profil → Profil bearbeiten → Website.",
      video: "Füge den Link in die Beschreibung deines Videos ein.",
      comment: "Poste den Link als Kommentar und pinne ihn an.",
    },
  },
  {
    id: "youtube",
    label: "YouTube",
    icon: "▶️",
    utmSource: "youtube",
    placements: [
      { id: "description", label: "Video-Beschreibung", description: "Für die Beschreibung unter deinem Video", utmMedium: "description" },
      { id: "comment", label: "Angepinnter Kommentar", description: "Als Kommentar unter deinem Video", utmMedium: "comment" },
      { id: "about", label: "Kanal-Info", description: "Für deine Kanal-Beschreibung", utmMedium: "about" },
      { id: "shorts", label: "Shorts-Beschreibung", description: "Für ein YouTube Short", utmMedium: "shorts" },
    ],
    copyHints: {
      description: "Füge den Link in die Beschreibung deines Videos ein.",
      comment: "Poste den Link als Kommentar und pinne ihn an.",
      about: "Füge den Link in deine Kanal-Beschreibung ein (Kanal anpassen → Info).",
      shorts: "Füge den Link in die Beschreibung deines Shorts ein.",
    },
  },
  {
    id: "facebook",
    label: "Facebook",
    icon: "👥",
    utmSource: "facebook",
    placements: [
      { id: "post", label: "Beitrag", description: "Für einen Post auf deiner Seite/Profil", utmMedium: "post" },
      { id: "story", label: "Story", description: "Für einen Link in deiner Facebook-Story", utmMedium: "story" },
      { id: "reel", label: "Reel", description: "Für ein Facebook-Reel", utmMedium: "reel" },
      { id: "group", label: "Gruppen-Beitrag", description: "Für einen Post in einer Facebook-Gruppe", utmMedium: "group" },
    ],
    copyHints: {
      post: "Erstelle einen neuen Beitrag und füge den Link ein.",
      story: "Erstelle eine Story und füge den Link als Sticker hinzu.",
      reel: "Füge den Link in die Reel-Beschreibung ein.",
      group: "Teile den Link in einer passenden Facebook-Gruppe.",
    },
  },
  {
    id: "twitter",
    label: "X (Twitter)",
    icon: "🐦",
    utmSource: "twitter",
    placements: [
      { id: "tweet", label: "Tweet / Post", description: "Für einen einzelnen Tweet", utmMedium: "tweet" },
      { id: "bio", label: "Bio-Link", description: "Für den Link in deinem X-Profil", utmMedium: "bio" },
      { id: "thread", label: "Thread", description: "Für einen Link innerhalb eines Threads", utmMedium: "thread" },
    ],
    copyHints: {
      tweet: "Erstelle einen neuen Tweet und füge den Link ein.",
      bio: "Gehe zu deinem X-Profil → Profil bearbeiten → Website.",
      thread: "Füge den Link in einen Tweet innerhalb deines Threads ein.",
    },
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: "💬",
    utmSource: "whatsapp",
    placements: [
      { id: "direct", label: "Direktnachricht", description: "Link zum Verschicken an einzelne Kontakte", utmMedium: "direct" },
      { id: "group", label: "Gruppe / Broadcast", description: "Link für eine Gruppen- oder Broadcast-Nachricht", utmMedium: "group" },
      { id: "status", label: "Status", description: "Link für deinen WhatsApp-Status", utmMedium: "status" },
    ],
    copyHints: {
      direct: "Sende diesen Link direkt an deine Kontakte.",
      group: "Teile diesen Link in deiner WhatsApp-Gruppe oder als Broadcast.",
      status: "Poste diesen Link in deinem WhatsApp-Status.",
    },
  },
  {
    id: "telegram",
    label: "Telegram",
    icon: "✈️",
    utmSource: "telegram",
    placements: [
      { id: "channel", label: "Kanal-Post", description: "Für einen Post in deinem Telegram-Kanal", utmMedium: "channel" },
      { id: "group", label: "Gruppen-Nachricht", description: "Für eine Nachricht in einer Telegram-Gruppe", utmMedium: "group" },
      { id: "direct", label: "Direktnachricht", description: "Zum Verschicken an einzelne Kontakte", utmMedium: "direct" },
    ],
    copyHints: {
      channel: "Poste den Link als Nachricht in deinem Telegram-Kanal.",
      group: "Teile den Link in deiner Telegram-Gruppe.",
      direct: "Sende den Link direkt an deine Kontakte.",
    },
  },
  {
    id: "email",
    label: "E-Mail",
    icon: "✉️",
    utmSource: "email",
    placements: [
      { id: "newsletter", label: "Newsletter", description: "Für deinen E-Mail-Newsletter", utmMedium: "newsletter" },
      { id: "personal", label: "Persönliche E-Mail", description: "Für eine direkte E-Mail", utmMedium: "personal" },
    ],
    copyHints: {
      newsletter: "Füge den Link in deinen nächsten Newsletter ein.",
      personal: "Füge den Link in deine E-Mail ein.",
    },
  },
  {
    id: "other",
    label: "Andere",
    icon: "🔗",
    utmSource: "other",
    placements: [
      { id: "website", label: "Website / Blog", description: "Für deine eigene Website oder einen Blog", utmMedium: "website" },
      { id: "press", label: "Pressemitteilung", description: "Für ein Presskit oder Medienmitteilung", utmMedium: "press" },
      { id: "other", label: "Sonstiges", description: "Für alles andere", utmMedium: "other" },
    ],
    copyHints: {
      website: "Füge den Link auf deiner Website oder in deinem Blog ein.",
      press: "Füge den Link in deine Pressemitteilung ein.",
      other: "Verwende diesen Link überall wo du möchtest.",
    },
  },
];

export function getPlatform(id: string): Platform | undefined {
  return PLATFORMS.find((p) => p.id === id);
}

export function getPlacement(platformId: string, placementId: string): Placement | undefined {
  return getPlatform(platformId)?.placements.find((p) => p.id === placementId);
}

export function getCopyHint(platformId: string, placementId: string): string {
  return getPlatform(platformId)?.copyHints[placementId] ?? "Link kopiert!";
}

export function formatLinkLabel(platform: string, placement: string): string {
  const p = getPlatform(platform);
  const pl = p?.placements.find((x) => x.id === placement);
  return `${p?.label ?? platform} · ${pl?.label ?? placement}`;
}
```

### 2.2 – API-Client erweitern

**Ändern:** stage.ts

Bestehende Funktionen bleiben, neue kommen dazu:

```typescript
// ...existing types and functions...

// ── Neue Typen ──

export type StudioHomeData = {
  spotlight: {
    id: number;
    title: string;
    type: string;
    status: string;
    activated_at: string;
    days_active: number;
    show_on_page: boolean;
  } | null;
  stats: {
    total_clicks_7d: number;
    trend: number;
  };
  top_links: {
    id: number;
    platform: string;
    placement: string;
    tracking_url: string;
    click_count: number;
  }[];
  page: {
    handle: string;
    is_published: boolean;
    display_name: string;
    updated_at: string;
  } | null;
  tip: {
    type: string;
    message: string;
    action_label: string;
    action_type: string;
    action_payload: Record<string, any>;
  } | null;
};

export type AnalyticsBreakdown = {
  total_clicks: number;
  trend: number;
  period: string;
  by_platform: {
    platform: string;
    clicks: number;
    placements: {
      placement: string;
      clicks: number;
    }[];
  }[];
};

export type DuplicateCheckResult = {
  exists: boolean;
  link: TrackingLink | null;
};

// ── Neue Funktionen ──

export async function getStudioHome(): Promise<StudioHomeData> {
  return apiFetch("/api/v1/studio/home");
}

export async function checkTrackingLink(
  spotlightId: number,
  platform: string,
  placement: string
): Promise<DuplicateCheckResult> {
  return apiFetch(
    `/api/v1/tracking-links/check?spotlight_id=${spotlightId}&platform=${platform}&placement=${placement}`
  );
}

export async function archiveTrackingLink(id: number): Promise<TrackingLink> {
  return apiFetch(`/api/v1/tracking-links/${id}/archive`, { method: "PATCH" });
}

export async function getAnalyticsBreakdown(
  spotlightId: number,
  period: string = "7d"
): Promise<AnalyticsBreakdown> {
  return apiFetch(
    `/api/v1/analytics/breakdown?spotlight_id=${spotlightId}&period=${period}`
  );
}

export async function toggleShowOnPage(spotlightId: number): Promise<Spotlight> {
  return apiFetch(`/api/v1/spotlights/${spotlightId}/show-on-page`, {
    method: "PATCH",
  });
}

export async function updateVisibleSections(
  pageId: number,
  sections: string[]
): Promise<void> {
  return apiFetch(`/api/v1/artist-pages/${pageId}/sections`, {
    method: "PATCH",
    body: JSON.stringify({ visible_sections: sections }),
  });
}

// ── Geänderte Funktion: createTrackingLink ──
// NEUER Signatur – kein Label, keine UTMs, keine campaign_id

export async function createTrackingLink(data: {
  spotlight_id: number;
  platform: string;
  placement: string;
  target_url: string;
}): Promise<TrackingLink> {
  return apiFetch("/api/v1/tracking-links", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// createCampaign() → ENTFERNEN – wird nicht mehr vom Frontend aufgerufen
```

### 2.3 – Studio Layout umbauen

**Ändern:** `apps/web/src/app/(studio)/studio/layout.tsx`

Die bestehende Sidebar-Navigation mit 13 Einträgen wird ersetzt durch eine kompakte Tab-Leiste mit 5 Einträgen:

```typescript
const STUDIO_TABS = [
  { label: "Home",          href: "/studio",         icon: "🏡" },
  { label: "Meine Seite",   href: "/studio/page",    icon: "🏠" },
  { label: "Mein Projekt",  href: "/studio/project",  icon: "🎯" },
  { label: "Teilen",        href: "/studio/share",    icon: "📣" },
  { label: "Ergebnisse",    href: "/studio/results",  icon: "📊" },
];
```

Die Tab-Leiste sitzt **horizontal oben** (Desktop) oder als **Bottom-Nav** (Mobile). Die bestehende Sidebar wird entfernt.

Settings-Link bleibt als kleines Zahnrad-Icon rechts oben oder im User-Menü.

### 2.4 – Content-Editoren verschieben (Routing)

Die 9 Content-Editoren werden von Top-Level-Routes zu Sub-Routes unter `/studio/page/`:

| Alt | Neu |
|---|---|
| `/studio/profile` | `/studio/page/profile` |
| `/studio/links` | `/studio/page/links` |
| `/studio/music` | `/studio/page/music` |
| `/studio/shows` | `/studio/page/shows` |
| `/studio/releases` | `/studio/page/releases` |
| `/studio/videos` | `/studio/page/videos` |
| `/studio/gallery` | `/studio/page/gallery` |
| `/studio/appearance` | `/studio/page/appearance` |
| `/studio/contact` | `/studio/page/contact` |

**Umsetzung:** Für jeden Editor:

1. Erstelle das neue Verzeichnis unter `apps/web/src/app/(studio)/studio/page/[bereich]/`
2. Erstelle `page.tsx` dort, die die bestehende Client-Komponente rendert
3. Passe Zurück-Links/Breadcrumbs in der Client-Komponente an (von `/studio` zu `/studio/page`)
4. Erstelle unter der alten Route (`/studio/[bereich]/page.tsx`) einen **Redirect** auf die neue Route

**Dateien pro Editor (am Beispiel Profile):**

```
# NEU
apps/web/src/app/(studio)/studio/page/profile/page.tsx
  → import + render der bestehenden ProfileClient-Komponente

# ÄNDERN
apps/web/src/app/(studio)/studio/profile/page.tsx
  → redirect('/studio/page/profile')
  ODER
  → löschen (wenn keine Backlinks mehr existieren)
```

Dies muss für alle 9 Editoren gemacht werden. Die Client-Komponenten selbst (z.B. `ProfileClient.tsx`) werden **nicht umgeschrieben**, nur die `page.tsx`-Wrapper verschieben sich.

### 2.5 – PageOverviewClient anpassen

**Ändern:** PageOverviewClient.tsx

In der `sections`-Konfiguration die `href`-Werte aktualisieren:

```typescript
const sections = [
  { title: "Profil",    href: "/studio/page/profile",    /* ... */ },
  { title: "Links",     href: "/studio/page/links",      /* ... */ },
  { title: "Musik",     href: "/studio/page/music",      /* ... */ },  // "Music" → "Musik"
  { title: "Konzerte",  href: "/studio/page/shows",      /* ... */ },  // "Shows" → "Konzerte"
  { title: "Releases",  href: "/studio/page/releases",   /* ... */ },
  { title: "Videos",    href: "/studio/page/videos",     /* ... */ },
  { title: "Galerie",   href: "/studio/page/gallery",    /* ... */ },  // "Gallery" → "Galerie"
  { title: "Design",    href: "/studio/page/appearance",  /* ... */ },  // "Themes" → "Design"
  { title: "Kontakt",   href: "/studio/page/contact",    /* ... */ },
];
```

### 2.6 – Stage-Route umleiten

**Ändern:** page.tsx

```typescript
import { redirect } from "next/navigation";
export default function StagePage() {
  redirect("/studio/project");
}
```

### 2.7 – Home-Tab erstellen

**Erstellen:** page.tsx (überschreibt die bestehende Übersicht)

```typescript
import StudioHomeClient from "./StudioHomeClient";

export default function StudioHomePage() {
  return <StudioHomeClient />;
}
```

**Erstellen:** `apps/web/src/app/(studio)/studio/StudioHomeClient.tsx`

```typescript
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStudioHome, type StudioHomeData } from "@/lib/api/stage";
import { formatLinkLabel } from "@/lib/platforms";

export default function StudioHomeClient() {
  const router = useRouter();
  const [data, setData] = useState<StudioHomeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudioHome()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-zinc-400">Lädt…</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20 text-zinc-400">
        Etwas ist schiefgelaufen. Bitte lade die Seite neu.
      </div>
    );
  }

  const isFirstVisit = !data.page && !data.spotlight;

  // ── Erstbesuch ──
  if (isFirstVisit) {
    return <WelcomeView onNavigate={(url) => router.push(url)} />;
  }

  // ── Normaler Besuch ──
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 space-y-6">
      <h1 className="text-2xl font-medium text-zinc-50">
        👋 Hallo{data.page?.display_name ? `, ${data.page.display_name}` : ""}.
      </h1>

      {/* Projekt-Status-Karte */}
      <ProjectStatusCard
        spotlight={data.spotlight}
        stats={data.stats}
        onNavigate={(url) => router.push(url)}
      />

      {/* Top-Links-Karte */}
      {data.top_links.length > 0 && (
        <TopLinksCard
          links={data.top_links}
          totalLinkCount={/* aus separatem count oder top_links.length */}
          onNavigate={(url) => router.push(url)}
        />
      )}

      {/* Seiten-Status-Karte */}
      <PageStatusCard
        page={data.page}
        onNavigate={(url) => router.push(url)}
      />

      {/* Tipp-Karte */}
      {data.tip && (
        <TipCard
          tip={data.tip}
          onNavigate={(url) => router.push(url)}
        />
      )}
    </div>
  );
}
```

### 2.8 – Home-Karten-Komponenten

**Erstellen:** `apps/web/src/components/studio/home/WelcomeView.tsx`

Willkommens-Ansicht für Erstbesuch mit zwei Onboarding-Karten.

**Erstellen:** `apps/web/src/components/studio/home/ProjectStatusCard.tsx`

Zeigt: Titel, Typ, Tage aktiv, Klicks, Trend, Aktions-Buttons.
Leerer Zustand: CTA "Projekt starten".

**Erstellen:** `apps/web/src/components/studio/home/TopLinksCard.tsx`

Zeigt: Top 3 Links mit Platform-Icon, Placement, Klicks, Kopier-Button.
"Alle Links anzeigen" → navigiert zu `/studio/share`.

**Erstellen:** `apps/web/src/components/studio/home/PageStatusCard.tsx`

Zeigt: URL, Status (online/offline), letzte Bearbeitung, Bearbeiten/Ansehen.
Leerer Zustand: CTA "Seite einrichten".

**Erstellen:** `apps/web/src/components/studio/home/TipCard.tsx`

Zeigt: dynamischer Tipp-Text + Aktions-Button. Unterstützt `action_type: "navigate"` und `action_type: "copy_link"`.

### Dateien Phase 2 – Zusammenfassung

| Aktion | Datei |
|---|---|
| Erstellen | platforms.ts |
| Ändern | stage.ts |
| Ändern | `apps/web/src/app/(studio)/studio/layout.tsx` |
| Ändern | page.tsx (wird Home) |
| Erstellen | `apps/web/src/app/(studio)/studio/StudioHomeClient.tsx` |
| Erstellen | `apps/web/src/components/studio/home/WelcomeView.tsx` |
| Erstellen | `apps/web/src/components/studio/home/ProjectStatusCard.tsx` |
| Erstellen | `apps/web/src/components/studio/home/TopLinksCard.tsx` |
| Erstellen | `apps/web/src/components/studio/home/PageStatusCard.tsx` |
| Erstellen | `apps/web/src/components/studio/home/TipCard.tsx` |
| Ändern | PageOverviewClient.tsx (hrefs + Sprache) |
| Verschieben | 9× Content-Editoren: `/studio/X/page.tsx` → `/studio/page/X/page.tsx` |
| Ändern | page.tsx (Redirect) |

### Manuelle Test-Checkliste Phase 2

1. `/studio` öffnen → Home-Tab mit Karten wird angezeigt
2. Erstbesuch simulieren (kein Page, kein Spotlight) → Willkommens-Ansicht
3. Klick auf "Meine Seite" Tab → PageOverviewClient wird angezeigt
4. Klick auf "Profil" im PageOverview → navigiert zu `/studio/page/profile`
5. Alte Routes `/studio/profile`, `/studio/links` etc. → Redirect zu neuer Route
6. `/studio/stage` → Redirect zu `/studio/project`
7. Mobile: Tab-Navigation ist benutzbar

---

## Phase 3: Teilen-Tab (Plattform → Platzierung)

**Ziel:** 2-Stufen Link-Erstellung mit Duplikat-Schutz.

### 3.1 – Share-Page erstellen

**Erstellen:** page.tsx

```typescript
import ShareClient from "./ShareClient";
export default function SharePage() {
  return <ShareClient />;
}
```

**Erstellen:** ShareClient.tsx

```typescript
"use client";

import { useEffect, useState } from "react";
import {
  getActiveSpotlight,
  getAllTrackingLinks,
  createTrackingLink,
  archiveTrackingLink,
  type Spotlight,
  type TrackingLink,
} from "@/lib/api/stage";
import { PLATFORMS, getCopyHint, formatLinkLabel } from "@/lib/platforms";
import PlatformGrid from "@/components/studio/share/PlatformGrid";
import PlacementSelector from "@/components/studio/share/PlacementSelector";
import ActiveLinksList from "@/components/studio/share/ActiveLinksList";

export default function ShareClient() {
  const [spotlight, setSpotlight] = useState<Spotlight | null>(null);
  const [links, setLinks] = useState<TrackingLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [active, allLinks] = await Promise.all([
        getActiveSpotlight(),
        getAllTrackingLinks(),
      ]);
      setSpotlight(active);
      setLinks(allLinks.filter((l) => !l.archived_at));
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateLink(platform: string, placement: string) {
    if (!spotlight) return;

    try {
      setCreating(true);
      const link = await createTrackingLink({
        spotlight_id: spotlight.id,
        platform,
        placement,
        target_url: spotlight.primary_url,
      });

      // Auto-Copy
      try {
        await navigator.clipboard.writeText(link.tracking_url);
      } catch {}

      // Toast mit Hilfetext anzeigen (Phase 7: richtiges Toast-System)
      const hint = getCopyHint(platform, placement);
      alert(`✅ Link kopiert!\n\n${link.tracking_url}\n\n${hint}`);

      await loadData();
      setSelectedPlatform(null);
    } catch (error: any) {
      if (error.status === 409) {
        alert("Dieser Link existiert bereits. Du kannst ihn unten kopieren.");
      } else {
        alert(error.message || "Link konnte nicht erstellt werden.");
      }
    } finally {
      setCreating(false);
    }
  }

  async function handleCopyLink(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      // Toast: "Kopiert ✅" (Phase 7)
    } catch {
      alert("Kopieren fehlgeschlagen.");
    }
  }

  async function handleArchiveLink(id: number) {
    await archiveTrackingLink(id);
    await loadData();
  }

  // ── Kein Projekt aktiv ──
  if (!loading && !spotlight) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12 text-center">
        <h1 className="text-2xl font-medium text-zinc-50 mb-4">📣 Teilen</h1>
        <p className="text-zinc-400 mb-6">
          Du hast gerade kein aktives Projekt. Starte eines, um Links zu erstellen.
        </p>
        <a
          href="/studio/project"
          className="inline-block rounded-full bg-white/10 px-6 py-3 text-sm font-medium text-zinc-50 hover:bg-white/20"
        >
          🎯 Projekt starten →
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 space-y-8">
      <div>
        <h1 className="text-2xl font-medium text-zinc-50">
          📣 Teilen: „{spotlight?.title}"
        </h1>
        <p className="text-zinc-400 mt-1">
          Wähle eine Plattform, wir erstellen deinen persönlichen Link.
        </p>
      </div>

      {/* Plattform-Grid */}
      <PlatformGrid
        selectedPlatform={selectedPlatform}
        onSelect={setSelectedPlatform}
      />

      {/* Platzierungs-Auswahl (eingeblendet wenn Plattform gewählt) */}
      {selectedPlatform && spotlight && (
        <PlacementSelector
          platformId={selectedPlatform}
          spotlightId={spotlight.id}
          existingLinks={links}
          creating={creating}
          onCreateLink={handleCreateLink}
          onCopyLink={handleCopyLink}
          onBack={() => setSelectedPlatform(null)}
        />
      )}

      {/* Aktive Links */}
      {links.length > 0 && (
        <ActiveLinksList
          links={links}
          onCopy={handleCopyLink}
          onArchive={handleArchiveLink}
        />
      )}
    </div>
  );
}
```

### 3.2 – Komponenten

**Erstellen:** `apps/web/src/components/studio/share/PlatformGrid.tsx`

3×3 Grid mit Plattform-Buttons. Ausgewählte Plattform ist hervorgehoben.

```typescript
import { PLATFORMS } from "@/lib/platforms";

type Props = {
  selectedPlatform: string | null;
  onSelect: (id: string) => void;
};

export default function PlatformGrid({ selectedPlatform, onSelect }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {PLATFORMS.map((platform) => (
        <button
          key={platform.id}
          onClick={() => onSelect(platform.id)}
          className={`flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors
            ${selectedPlatform === platform.id
              ? "border-white/30 bg-white/10"
              : "border-zinc-800 bg-zinc-900/30 hover:bg-zinc-800/50"
            }`}
        >
          <span className="text-2xl">{platform.icon}</span>
          <span className="text-sm text-zinc-300">{platform.label}</span>
        </button>
      ))}
    </div>
  );
}
```

**Erstellen:** `apps/web/src/components/studio/share/PlacementSelector.tsx`

Zeigt Platzierungen für die gewählte Plattform. Prüft Duplikate gegen `existingLinks`.

```typescript
import { getPlatform, type TrackingLink } from "@/lib/platforms";

type Props = {
  platformId: string;
  spotlightId: number;
  existingLinks: TrackingLink[];
  creating: boolean;
  onCreateLink: (platform: string, placement: string) => void;
  onCopyLink: (url: string) => void;
  onBack: () => void;
};

export default function PlacementSelector({
  platformId,
  spotlightId,
  existingLinks,
  creating,
  onCreateLink,
  onCopyLink,
  onBack,
}: Props) {
  const platform = getPlatform(platformId);
  if (!platform) return null;

  function getExistingLink(placementId: string) {
    return existingLinks.find(
      (l) => l.platform === platformId && l.placement === placementId
    );
  }

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-6 space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-zinc-50">
          {platform.icon} {platform.label} – Wo platzierst du den Link?
        </h3>
        <button
          onClick={onBack}
          className="text-sm text-zinc-500 hover:text-zinc-300"
        >
          ← Andere Plattform
        </button>
      </div>

      {platform.placements.map((placement) => {
        const existing = getExistingLink(placement.id);

        return (
          <div
            key={placement.id}
            className="flex items-center justify-between rounded-lg border border-zinc-800 p-4"
          >
            <div>
              <div className="font-medium text-zinc-200">{placement.label}</div>
              <div className="text-sm text-zinc-500">{placement.description}</div>
              {existing && (
                <div className="text-xs text-zinc-600 mt-1">
                  {existing.tracking_url}
                </div>
              )}
            </div>

            {existing ? (
              <button
                onClick={() => onCopyLink(existing.tracking_url)}
                className="rounded-full bg-green-500/10 px-4 py-2 text-sm font-medium text-green-400 hover:bg-green-500/20"
              >
                📋 Kopieren
              </button>
            ) : (
              <button
                onClick={() => onCreateLink(platformId, placement.id)}
                disabled={creating}
                className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-zinc-50 hover:bg-white/20 disabled:opacity-50"
              >
                🔗 Link erstellen
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

**Erstellen:** `apps/web/src/components/studio/share/ActiveLinksList.tsx`

Gruppiert aktive Links nach Plattform. Zeigt Platform-Icon + Placement + URL + Kopieren + Archivieren.

### Dateien Phase 3

| Aktion | Datei |
|---|---|
| Erstellen | page.tsx |
| Erstellen | ShareClient.tsx |
| Erstellen | `apps/web/src/components/studio/share/PlatformGrid.tsx` |
| Erstellen | `apps/web/src/components/studio/share/PlacementSelector.tsx` |
| Erstellen | `apps/web/src/components/studio/share/ActiveLinksList.tsx` |

### Manuelle Test-Checkliste Phase 3

1. `/studio/share` öffnen ohne aktives Projekt → "Kein aktives Projekt" mit CTA
2. Projekt starten → `/studio/share` öffnen → Plattform-Grid wird angezeigt
3. Klick auf "Instagram" → Platzierungs-Auswahl mit 4 Optionen
4. Klick auf "Story (Sticker)" → Link erstellt, kopiert, Toast angezeigt
5. Nochmal auf "Instagram" klicken → Story zeigt "Kopieren" statt "Erstellen"
6. Neuen Link für "Bio" erstellen → funktioniert
7. Link archivieren → verschwindet aus der Liste

---

## Phase 4: Meine Seite verfeinern

**Ziel:** Bereichs-Toggles, Projekt-Hinweis, durchgehend deutsche Begriffe.

### 4.1 – Bereichs-Toggles in PageOverviewClient

**Ändern:** PageOverviewClient.tsx

Hinzufügen:
- Toggle-Switches neben jedem Bereich (statt nur Links)
- API-Call `updateVisibleSections()` bei Toggle-Änderung
- Projekt-Hinweis-Banner wenn Spotlight aktiv ist
- Deutsche Begriffe für alle Sections

```typescript
// Neue Props:
type Props = {
  page: ArtistPage & { visible_sections: string[] };
  counts: ContentCounts;
  activeSpotlight: Spotlight | null;
};

// Sections mit Toggle:
{sections.map((section) => {
  const isVisible = page.visible_sections.includes(section.key);
  return (
    <div key={section.key} className="flex items-center justify-between ...">
      {/* Bestehende Section-Info + Link */}
      <div>...</div>
      {/* Toggle */}
      <button
        onClick={() => handleToggleSection(section.key, !isVisible)}
        className={isVisible ? "bg-green-500/20 ..." : "bg-zinc-800 ..."}
      >
        {isVisible ? "Sichtbar" : "Versteckt"}
      </button>
    </div>
  );
})}

// Projekt-Hinweis (oben, wenn Spotlight aktiv):
{activeSpotlight && !activeSpotlight.show_on_page && (
  <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
    <p className="text-sm text-blue-300">
      💡 Du promotest gerade „{activeSpotlight.title}".
      Soll es oben auf deiner Seite hervorgehoben werden?
    </p>
    <div className="mt-3 flex gap-3">
      <button onClick={handleShowOnPage} className="...">
        Ja, anzeigen ✨
      </button>
      <button className="text-zinc-500 text-sm">Nein danke</button>
    </div>
  </div>
)}
```

### 4.2 – Öffentliche Seite: Bereiche filtern

**Ändern:** `apps/web/src/app/p/[handle]/page.tsx` (oder die Server-Seite die die Daten lädt)

Beim Rendern der öffentlichen Seite: nur Bereiche zeigen die in `visible_sections` enthalten sind.

```typescript
// In der Public-Page:
const visibleSections = page.visible_sections ?? ["profile","links","music","shows","releases","videos","gallery","contact"];

{visibleSections.includes("music") && musicData.length > 0 && (
  <MusicSection data={musicData} />
)}
// ... etc für alle Sections
```

### Dateien Phase 4

| Aktion | Datei |
|---|---|
| Ändern | PageOverviewClient.tsx |
| Ändern | page.tsx (Props erweitern) |
| Ändern | `apps/web/src/app/p/[handle]/page.tsx` (Bereichs-Filter) |
| Ändern | Backend: `PublicPageController.php` (visible_sections im Response) |

---

## Phase 5: Mein Projekt + Ergebnisse-Tab

**Ziel:** Bestehende Spotlight-Logik in neuem UI + Ergebnisse mit Breakdown.

### 5.1 – Mein Projekt

**Erstellen:** page.tsx
**Erstellen:** ProjectClient.tsx

Basiert auf der bestehenden `FocusSection.tsx`-Logik, aber als eigenständige Seite:

- Aktives Projekt: Status-Karte mit Titel, Typ, Tage aktiv, Klicks
- Kein Projekt: Formular (Titel, Typ, Ziel-Link)
- Projekt beenden/wechseln: Dropdown oder Buttons
- Frühere Projekte: Liste mit "Reaktivieren"-Option

### 5.2 – Ergebnisse

**Erstellen:** page.tsx
**Erstellen:** ResultsClient.tsx

**Erstellen:** `apps/web/src/components/studio/results/PlatformBreakdown.tsx`

Zeigt für jede Plattform einen Balken, darunter eingerückte Balken pro Platzierung.

```typescript
type Props = {
  data: AnalyticsBreakdown;
};

export default function PlatformBreakdown({ data }: Props) {
  const maxClicks = Math.max(...data.by_platform.map((p) => p.clicks), 1);

  return (
    <div className="space-y-4">
      {data.by_platform.map((platform) => (
        <div key={platform.platform}>
          {/* Platform-Zeile */}
          <div className="flex items-center gap-3">
            <span className="text-lg">{getPlatform(platform.platform)?.icon}</span>
            <span className="text-sm font-medium text-zinc-200 w-24">
              {getPlatform(platform.platform)?.label}
            </span>
            <div className="flex-1 h-3 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-zinc-400 rounded-full"
                style={{ width: `${(platform.clicks / maxClicks) * 100}%` }}
              />
            </div>
            <span className="text-sm text-zinc-400 w-16 text-right">
              {platform.clicks} Klicks
            </span>
          </div>

          {/* Placement-Zeilen (eingerückt) */}
          {platform.placements.map((pl) => (
            <div key={pl.placement} className="flex items-center gap-3 ml-10 mt-1">
              <span className="text-xs text-zinc-500 w-24">
                {getPlacement(platform.platform, pl.placement)?.label ?? pl.placement}
              </span>
              <div className="flex-1 h-2 bg-zinc-800/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-zinc-600 rounded-full"
                  style={{ width: `${(pl.clicks / maxClicks) * 100}%` }}
                />
              </div>
              <span className="text-xs text-zinc-500 w-16 text-right">
                {pl.clicks}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
```

### Dateien Phase 5

| Aktion | Datei |
|---|---|
| Erstellen | page.tsx |
| Erstellen | ProjectClient.tsx |
| Erstellen | page.tsx |
| Erstellen | ResultsClient.tsx |
| Erstellen | `apps/web/src/components/studio/results/PlatformBreakdown.tsx` |

---

## Phase 6: Projekt ↔ Seite Verknüpfung

**Ziel:** Hero-Banner auf der öffentlichen Seite wenn Projekt aktiv + `show_on_page = true`.

### 6.1 – Hero-Banner Komponente

**Erstellen:** `apps/web/src/components/public-page/ProjectHeroBanner.tsx`

```typescript
type Props = {
  title: string;
  type: string;
  primaryUrl: string;
};

export default function ProjectHeroBanner({ title, type, primaryUrl }: Props) {
  const ctaLabel = type === "release" ? "Jetzt hören" :
                   type === "tour" ? "Tickets sichern" :
                   "Mehr erfahren";

  return (
    <div className="rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-white/10 p-8 text-center mb-8">
      <p className="text-sm text-zinc-400 mb-2 uppercase tracking-wider">
        {type === "release" ? "🎵 Neue Veröffentlichung" :
         type === "tour" ? "🎤 Auf Tour" :
         "📢 Aktuell"}
      </p>
      <h2 className="text-2xl font-bold text-zinc-50 mb-4">{title}</h2>
      <a
        href={primaryUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block rounded-full bg-white px-8 py-3 text-sm font-bold text-black hover:bg-zinc-200 transition-colors"
      >
        {ctaLabel} →
      </a>
    </div>
  );
}
```

### 6.2 – Öffentliche Seite anpassen

**Ändern:** `apps/web/src/app/p/[handle]/page.tsx`

```typescript
// Beim Laden der Page-Daten: aktives Spotlight mit show_on_page prüfen
// Backend: PublicPageController gibt spotlight-Daten mit wenn show_on_page = true

{pageData.active_spotlight && (
  <ProjectHeroBanner
    title={pageData.active_spotlight.title}
    type={pageData.active_spotlight.type}
    primaryUrl={pageData.active_spotlight.primary_url}
  />
)}
```

### 6.3 – Backend: PublicPageController erweitern

**Ändern:** `app/Http/Controllers/Api/PublicPageController.php`

In der Response für die öffentliche Seite: Wenn ein aktives Spotlight mit `show_on_page = true` existiert, diese Daten mit-liefern.

```php
// In der show()-Methode:
$spotlight = $page->user->spotlights()
    ->where('status', 'active')
    ->where('show_on_page', true)
    ->first();

// Response ergänzen:
'active_spotlight' => $spotlight ? [
    'title'       => $spotlight->title,
    'type'        => $spotlight->type,
    'primary_url' => $spotlight->primary_url,
] : null,
```

### Dateien Phase 6

| Aktion | Datei |
|---|---|
| Erstellen | `apps/web/src/components/public-page/ProjectHeroBanner.tsx` |
| Ändern | `apps/web/src/app/p/[handle]/page.tsx` |
| Ändern | `app/Http/Controllers/Api/PublicPageController.php` |

---

## Phase 7: Polish

**Ziel:** Toasts, Tipps, Leer-Zustände, Mobile.

### 7.1 – Toast-System

Kein neues Dependency. Minimale eigene Implementierung:

**Erstellen:** `apps/web/src/components/ui/Toast.tsx`

Einfacher Toast mit Text + optionalem Subtext. Auto-dismiss nach 4 Sekunden. Positioniert unten-rechts.

**Erstellen:** `apps/web/src/context/ToastContext.tsx`

React Context mit `showToast(message, subtext?)` Funktion. Provider im Studio Layout.

### 7.2 – Alle `alert()`-Aufrufe ersetzen

In `ShareClient.tsx`, `ProjectClient.tsx`, `PageOverviewClient.tsx`: Alle `alert()` durch `showToast()` ersetzen.

### 7.3 – Leer-Zustände

Jede Seite prüfen auf einladende Empty States:

| Seite | Leer-Zustand |
|---|---|
| Home – kein Projekt | "Starte ein Projekt, um Links zu erstellen." + CTA |
| Home – kein Page | "Erstelle deine Seite, damit Fans dich finden." + CTA |
| Teilen – kein Projekt | "Starte ein Projekt, um Links zu erstellen." + CTA |
| Teilen – keine Links | "Wähle eine Plattform um deinen ersten Link zu erstellen." |
| Ergebnisse – keine Daten | "Sobald du Links teilst, siehst du hier wie es läuft." + CTA |
| Projekt – kein Projekt | Formular zum Erstellen |

### 7.4 – Mobile

- PlatformGrid: `grid-cols-2` auf Mobile (`sm:grid-cols-3`)
- Tab-Navigation: Horizontal scrollbar oder Bottom-Nav (`fixed bottom-0`)
- Karten: volle Breite, weniger Padding
- PlacementSelector: Stack statt side-by-side

### 7.5 – Sprache bereinigen

Alle verbleibenden englischen Begriffe in deutschen UI-Texten finden und übersetzen:

- "Music" → "Musik"
- "Shows" → "Konzerte"
- "Gallery" → "Galerie"
- "Themes" → "Design"
- "Releases" → "Releases" (kann bleiben, ist musikbranchenüblich)
- "Featured Tracks" → "Ausgewählte Tracks"

### Dateien Phase 7

| Aktion | Datei |
|---|---|
| Erstellen | `apps/web/src/components/ui/Toast.tsx` |
| Erstellen | `apps/web/src/context/ToastContext.tsx` |
| Ändern | `apps/web/src/app/(studio)/studio/layout.tsx` (ToastProvider) |
| Ändern | Alle Client-Komponenten die `alert()` verwenden |
| Ändern | Alle Komponenten mit fehlenden Leer-Zuständen |

---

## Phase 8: Aufräumen

**Ziel:** Alte Dateien entfernen, Redirects verifizieren, Konsistenz prüfen.

### 8.1 – Alte Stage-Dateien entfernen

| Aktion | Datei |
|---|---|
| Löschen | StageClient.tsx |
| Löschen | FocusSection.tsx |
| Löschen | SpreadSection.tsx |
| Löschen | ActiveSpreadList.tsx |
| Löschen | MiniPerformanceSummary.tsx |
| Behalten | page.tsx (Redirect → /studio/project) |

### 8.2 – Alte Top-Level Editor-Routes entfernen

Wenn alle Backlinks aktualisiert sind, die alten `page.tsx`-Dateien unter `/studio/profile/`, `/studio/links/`, etc. löschen oder als Redirects behalten.

### 8.3 – Nicht mehr benötigte API-Funktionen entfernen

In stage.ts:

| Funktion | Aktion |
|---|---|
| `createCampaign()` | Löschen – Frontend erstellt keine Campaigns mehr |
| `deleteTrackingLink()` | Ersetzen durch `archiveTrackingLink()` |
| Alte `createTrackingLink()` Signatur | Bereits in Phase 2 ersetzt |

### 8.4 – Alte PLATFORMS-Konstante entfernen

Die `PLATFORMS`-Konstante in `SpreadSection.tsx` wird durch `src/lib/platforms.ts` ersetzt. Wenn SpreadSection gelöscht wird, ist das automatisch erledigt.

### 8.5 – Docs final aktualisieren

Letzte Überprüfung dass DATA_MODEL.md, API_CONTRACTS.md und PRODUCT_RULES.md den finalen Zustand widerspiegeln.

### Test-Checkliste Phase 8

1. Keine toten Links im Studio (alle Navigation funktioniert)
2. `/studio/stage` → Redirect zu `/studio/project` funktioniert
3. Alte Editor-Routes → Redirect zu neuen Routes funktioniert
4. Keine `import`s von gelöschten Dateien
5. `npm run build` erfolgreich (keine Compiler-Fehler)
6. Öffentliche Seite funktioniert weiterhin
7. Bestehende Tracking-Links funktionieren (Klick-Tracking)

---

## Gesamt-Datei-Übersicht

### Neue Dateien (25)

```
Backend (8):
  database/migrations/xxxx_add_platform_placement_to_tracking_links.php
  database/migrations/xxxx_backfill_platform_placement_on_tracking_links.php
  database/migrations/xxxx_make_platform_placement_required.php
  database/migrations/xxxx_add_show_on_page_to_spotlights.php
  database/migrations/xxxx_add_visible_sections_to_artist_pages.php
  database/migrations/xxxx_add_platform_to_campaigns.php
  app/Http/Controllers/Api/StudioHomeController.php
  app/Services/StudioHomeService.php

Frontend (17):
  src/lib/platforms.ts
  src/app/(studio)/studio/StudioHomeClient.tsx
  src/app/(studio)/studio/share/page.tsx
  src/app/(studio)/studio/share/ShareClient.tsx
  src/app/(studio)/studio/project/page.tsx
  src/app/(studio)/studio/project/ProjectClient.tsx
  src/app/(studio)/studio/results/page.tsx
  src/app/(studio)/studio/results/ResultsClient.tsx
  src/components/studio/home/WelcomeView.tsx
  src/components/studio/home/ProjectStatusCard.tsx
  src/components/studio/home/TopLinksCard.tsx
  src/components/studio/home/PageStatusCard.tsx
  src/components/studio/home/TipCard.tsx
  src/components/studio/share/PlatformGrid.tsx
  src/components/studio/share/PlacementSelector.tsx
  src/components/studio/share/ActiveLinksList.tsx
  src/components/studio/results/PlatformBreakdown.tsx
  src/components/public-page/ProjectHeroBanner.tsx
  src/components/ui/Toast.tsx
  src/context/ToastContext.tsx
```

### Geänderte Dateien (17)

```
Backend (8):
  app/Models/TrackingLink.php
  app/Models/Spotlight.php
  app/Models/ArtistPage.php
  app/Http/Controllers/Api/TrackingLinkController.php
  app/Http/Controllers/Api/SpotlightController.php
  app/Http/Controllers/Api/ArtistPageController.php
  app/Http/Controllers/Api/PublicPageController.php
  app/Services/AnalyticsService.php
  app/Services/TrackingService.php
  routes/api.php

Frontend (7+):
  src/lib/api/stage.ts
  src/app/(studio)/studio/layout.tsx
  src/app/(studio)/studio/page.tsx
  src/app/(studio)/studio/page/PageOverviewClient.tsx
  src/app/(studio)/studio/stage/page.tsx
  src/app/p/[handle]/page.tsx
  + 9× Content-Editor page.tsx (Routing-Verschiebung)
```

### Gelöschte Dateien (5, in Phase 8)

```
  src/app/(studio)/studio/stage/StageClient.tsx
  src/app/(studio)/studio/stage/FocusSection.tsx
  src/app/(studio)/studio/stage/SpreadSection.tsx
  src/app/(studio)/studio/stage/ActiveSpreadList.tsx
  src/app/(studio)/studio/stage/MiniPerformanceSummary.tsx
```

### Docs-Änderungen (3)

```
  docs/DATA_MODEL.md
  docs/API_CONTRACTS.md
  docs/PRODUCT_RULES.md
```

## Checkliste zum Abhaken

### Phase 0: Docs aktualisieren
- [x] `docs/DATA_MODEL.md` – `tracking_links`: Felder `platform`, `placement`, `click_count`, `archived_at`, Unique Index dokumentieren
- [x] `docs/DATA_MODEL.md` – `spotlights`: Feld `show_on_page` dokumentieren
- [x] `docs/DATA_MODEL.md` – `artist_pages`: Feld `visible_sections` dokumentieren
- [x] `docs/API_CONTRACTS.md` – `POST /tracking-links` neuer Request-Body (platform, placement statt UTMs)
- [x] `docs/API_CONTRACTS.md` – `GET /tracking-links/check` Duplikat-Prüfung dokumentieren
- [x] `docs/API_CONTRACTS.md` – `PATCH /tracking-links/{id}/archive` dokumentieren
- [x] `docs/API_CONTRACTS.md` – `GET /studio/home` Endpoint dokumentieren
- [x] `docs/API_CONTRACTS.md` – `GET /analytics/breakdown` Endpoint dokumentieren
- [x] `docs/API_CONTRACTS.md` – `PATCH /spotlights/{id}/show-on-page` dokumentieren
- [x] `docs/API_CONTRACTS.md` – `PATCH /artist-pages/{id}/sections` dokumentieren
- [x] `docs/PRODUCT_RULES.md` – Studio Redesign Rules ergänzen (Home-Tab Default, UTM serverseitig, Campaign auto, Labels auto, Page-Builder MVP, Editoren als Sub-Pages, visible_sections, show_on_page)

### Phase 1: Backend – Datenmodell + API

#### Migrations
- [x] Migration erstellen: `add_platform_placement_to_tracking_links` (platform, placement, click_count, archived_at)
- [x] Partial Unique Index auf `tracking_links` (spotlight_id, platform, placement) WHERE archived_at IS NULL
- [x] Migration erstellen: `backfill_platform_placement_on_tracking_links` (utm_source → platform, placement = "legacy")
- [x] Migration erstellen: `make_platform_placement_required` (NOT NULL)
- [x] Migration erstellen: `add_show_on_page_to_spotlights`
- [x] Migration erstellen: `add_visible_sections_to_artist_pages`
- [x] Migration erstellen: `add_platform_to_campaigns` (falls Feld fehlt)
- [x] Alle Migrations ausführen und verifizieren

#### Models
- [x] `TrackingLink.php` – `$fillable` erweitern (platform, placement, click_count, archived_at)
- [x] `TrackingLink.php` – `$casts` erweitern (archived_at → datetime, click_count → integer)
- [x] `TrackingLink.php` – Scope `scopeActive()` hinzufügen (whereNull archived_at)
- [x] `TrackingLink.php` – `booted()`: Label auto-generieren (Platform · Placement)
- [x] `TrackingLink.php` – `booted()`: UTMs auto-generieren (utm_source = platform, utm_medium = placement)
- [x] `TrackingLink.php` – `booted()`: utm_campaign aus Spotlight-Titel generieren
- [x] `Spotlight.php` – `$fillable` + `$casts` erweitern (show_on_page → boolean)
- [x] `ArtistPage.php` – `$fillable` + `$casts` erweitern (visible_sections → array)

#### Controllers
- [x] `TrackingLinkController@store` – Neuer Flow: nur platform + placement + target_url + spotlight_id akzeptieren
- [x] `TrackingLinkController@store` – Ownership-Check (Spotlight gehört User)
- [x] `TrackingLinkController@store` – Duplikat-Check vor Erstellung (409 bei Duplikat)
- [x] `TrackingLinkController@store` – Campaign auto-erstellen via `firstOrCreate`
- [x] `TrackingLinkController@store` – Short-Code generieren + tracking_url setzen
- [x] `TrackingLinkController@check` – Neue Methode: Duplikat-Prüfung Endpoint
- [x] `TrackingLinkController@archive` – Neue Methode: Soft-Archive statt Hard-Delete
- [x] `SpotlightController@toggleShowOnPage` – Neue Methode
- [x] `SpotlightController@end` – Beim Beenden: zugehörige Links archivieren + show_on_page zurücksetzen
- [x] `ArtistPageController@updateSections` – Neue Methode: visible_sections aktualisieren

#### Services
- [x] `StudioHomeService.php` erstellen – `getHomeData()` mit Spotlight, Stats, Top-Links, Page, Tip
- [x] `StudioHomeService.php` – `getStats()`: Klicks letzte 7 Tage + Trend (vs. vorherige 7 Tage)
- [x] `StudioHomeService.php` – `generateTip()`: Regelbasierte Tipps (kein Page → unpublished → kein Projekt → keine Links → stale → best platform)
- [x] `StudioHomeController.php` erstellen – `__invoke()` mit StudioHomeService
- [x] `AnalyticsService.php` – `getBreakdown()` hinzufügen: Gruppierung nach Platform + Placement
- [x] `AnalyticsController.php` erstellen/erweitern – `breakdown()` Methode
- [x] `TrackingService.php` – Bei Klick-Registrierung `click_count` auf TrackingLink inkrementieren

#### Routes
- [x] `routes/api.php` – `GET /studio/home` registrieren
- [x] `routes/api.php` – `GET /tracking-links/check` registrieren
- [x] `routes/api.php` – `PATCH /tracking-links/{id}/archive` registrieren
- [x] `routes/api.php` – `PATCH /spotlights/{id}/show-on-page` registrieren
- [x] `routes/api.php` – `PATCH /artist-pages/{id}/sections` registrieren
- [x] `routes/api.php` – `GET /analytics/breakdown` registrieren

#### Smoke-Tests Phase 1
- [ ] `GET /studio/home` gibt gültige Daten zurück
- [ ] `POST /tracking-links` mit platform+placement erstellt Link und Campaign
- [ ] `POST /tracking-links` mit Duplikat gibt 409 zurück
- [ ] `GET /tracking-links/check` erkennt existierende Links
- [ ] `PATCH /tracking-links/{id}/archive` setzt archived_at
- [ ] `GET /analytics/breakdown` gibt Plattform+Placement-Aufschlüsselung zurück
- [ ] Spotlight beenden archiviert zugehörige Links

### Phase 2: Frontend – Navigations-Umbau + Home-Tab

#### Plattform-Konfiguration
- [x] `src/lib/platforms.ts` erstellen – PLATFORMS-Array mit Plattformen, Platzierungen, copyHints
- [x] `src/lib/platforms.ts` – Helper-Funktionen: getPlatform, getPlacement, getCopyHint, formatLinkLabel

#### API-Client
- [x] `src/lib/api/stage.ts` – Neue Typen: StudioHomeData, AnalyticsBreakdown, DuplicateCheckResult
- [x] `src/lib/api/stage.ts` – Neue Funktion: `getStudioHome()`
- [x] `src/lib/api/stage.ts` – Neue Funktion: `checkTrackingLink()`
- [x] `src/lib/api/stage.ts` – Neue Funktion: `archiveTrackingLink()`
- [x] `src/lib/api/stage.ts` – Neue Funktion: `getAnalyticsBreakdown()`
- [x] `src/lib/api/stage.ts` – Neue Funktion: `toggleShowOnPage()`
- [x] `src/lib/api/stage.ts` – Neue Funktion: `updateVisibleSections()`
- [x] `src/lib/api/stage.ts` – `createTrackingLink()` Signatur ändern (nur platform, placement, target_url, spotlight_id)
- [x] `src/lib/api/stage.ts` – `createCampaign()` entfernen
- [x] `src/lib/api/stage.ts` – `deleteTrackingLink()` durch `archiveTrackingLink()` ersetzen

#### Studio Layout
- [x] `studio/layout.tsx` – Sidebar mit 13 Punkten ersetzen durch Tab-Leiste mit 5 Tabs (Home, Meine Seite, Mein Projekt, Teilen, Ergebnisse)
- [x] `studio/layout.tsx` – Settings als Zahnrad-Icon / User-Menü, nicht als Tab
- [x] `studio/layout.tsx` – Mobile: Bottom-Nav oder horizontal scrollbare Tabs

#### Content-Editoren verschieben (Routing)
- [x] `/studio/profile` → `/studio/page/profile` (page.tsx erstellen, Komponente importieren)
- [x] `/studio/links` → `/studio/page/links`
- [x] `/studio/music` → `/studio/page/music`
- [x] `/studio/shows` → `/studio/page/shows`
- [x] `/studio/releases` → `/studio/page/releases`
- [x] `/studio/videos` → `/studio/page/videos`
- [x] `/studio/gallery` → `/studio/page/gallery`
- [x] `/studio/appearance` → `/studio/page/appearance`
- [x] `/studio/contact` → `/studio/page/contact`
- [x] Alte Routes: Redirects zu neuen Routes einrichten oder löschen
- [x] Alle Backlinks/Breadcrumbs in Editor-Komponenten aktualisieren (Zurück → /studio/page)

#### PageOverviewClient anpassen
- [x] `hrefs` in sections-Array auf `/studio/page/X` aktualisieren
- [x] Deutsche Begriffe: Music→Musik, Shows→Konzerte, Gallery→Galerie, Themes→Design
- [x] Stage-Route Redirect: `/studio/stage/page.tsx` → redirect('/studio/project')

#### Home-Tab erstellen
- [x] `studio/page.tsx` überschreiben → rendert StudioHomeClient
- [x] `StudioHomeClient.tsx` erstellen – Lädt StudioHomeData, zeigt Karten
- [x] `StudioHomeClient.tsx` – Erstbesuch-Erkennung (kein Page + kein Spotlight → WelcomeView)
- [x] `StudioHomeClient.tsx` – Normaler Besuch: Begrüßung + ProjectStatusCard + TopLinksCard + PageStatusCard + TipCard
- [x] `components/studio/home/WelcomeView.tsx` erstellen
- [x] `components/studio/home/ProjectStatusCard.tsx` erstellen
- [x] `components/studio/home/TopLinksCard.tsx` erstellen
- [x] `components/studio/home/PageStatusCard.tsx` erstellen
- [x] `components/studio/home/TipCard.tsx` erstellen

#### Manuelle Tests Phase 2
- [ ] `/studio` öffnen → Home-Tab mit Karten angezeigt
- [ ] Erstbesuch simulieren → Willkommens-Ansicht
- [ ] Klick auf "Meine Seite" Tab → PageOverviewClient
- [ ] Klick auf "Profil" im PageOverview → `/studio/page/profile`
- [ ] Alte Routes `/studio/profile` etc. → Redirect zu neuer Route
- [ ] `/studio/stage` → Redirect zu `/studio/project`
- [ ] Mobile: Tab-Navigation benutzbar

### Phase 3: Teilen-Tab (Plattform → Platzierung)

- [x] `studio/share/page.tsx` erstellen
- [x] `studio/share/ShareClient.tsx` erstellen
- [x] `ShareClient.tsx` – Leerer Zustand: "Kein aktives Projekt" mit CTA zu /studio/project
- [x] `ShareClient.tsx` – Spotlight laden + aktive Links laden
- [x] `ShareClient.tsx` – Plattform-Auswahl → Platzierungs-Auswahl → Auto-Create → Auto-Copy
- [x] `ShareClient.tsx` – Duplikat-Schutz: existierende Links zeigen "Kopieren" statt "Erstellen"
- [x] `ShareClient.tsx` – Context-Hint nach Link-Erstellung (getCopyHint)
- [x] `ShareClient.tsx` – 409-Fehler abfangen und User-freundlich anzeigen
- [x] `components/studio/share/PlatformGrid.tsx` erstellen – 3×3 Grid mit Plattformen (PlatformSelector.tsx)
- [x] `components/studio/share/PlacementSelector.tsx` erstellen – Platzierungen für gewählte Plattform
- [x] `components/studio/share/PlacementSelector.tsx` – Duplikat-Erkennung: bestehende Links visuell markieren
- [x] `components/studio/share/ActiveLinksList.tsx` erstellen – Gruppiert nach Plattform, Kopieren + Archivieren
- [x] Backend: TrackingLinkController.index() – Vollständige Response mit platform, placement, click_count
- [x] Frontend: TypeScript-Typen angepasst (tracking_url statt url)
- [x] Frontend: Link-Liste nach Plattform gruppiert mit Icons und Gesamt-Klicks
- [x] Frontend: PlacementSelector zeigt Beschreibungen an

#### Manuelle Tests Phase 3
- [ ] `/studio/share` ohne Projekt → "Kein aktives Projekt" mit CTA
- [ ] Projekt starten → Plattform-Grid angezeigt
- [ ] Klick "Instagram" → 4 Platzierungen angezeigt
- [ ] Klick "Story (Sticker)" → Link erstellt + kopiert + Hint angezeigt
- [ ] Nochmal "Instagram" → Story zeigt "Kopieren" statt "Erstellen"
- [ ] Neuen Link für "Bio" erstellen → funktioniert
- [ ] Link archivieren → verschwindet aus Liste

### Phase 4: Meine Seite verfeinern

- [x] `PageOverviewClient.tsx` – Bereichs-Toggles hinzufügen (sichtbar/verborgen pro Bereich)
- [x] `PageOverviewClient.tsx` – API-Call `updateVisibleSections()` bei Toggle-Änderung
- [x] `PageOverviewClient.tsx` – Props erweitern um `visible_sections` und `activeSpotlight`
- [x] `PageOverviewClient.tsx` – Projekt-Hinweis-Banner: "Du promotest gerade X. Auf Seite anzeigen?"
- [x] `PageOverviewClient.tsx` – `handleShowOnPage()` Funktion (ruft toggleShowOnPage API auf)
- [x] `page/page.tsx` – Props mit visible_sections und activeSpotlight laden und übergeben
- [x] Öffentliche Seite (`p/[handle]/page.tsx`) – Nur Bereiche rendern die in visible_sections enthalten sind
- [x] Backend: `PublicPageController.php` – `visible_sections` im Response mitliefern

### Phase 5: Mein Projekt + Ergebnisse-Tab

#### Mein Projekt
- [x] `studio/project/page.tsx` erstellen
- [x] `studio/project/ProjectClient.tsx` erstellen
- [x] `ProjectClient.tsx` – Aktives Projekt: Status-Karte (Titel, Typ, Tage aktiv, Klicks)
- [x] `ProjectClient.tsx` – Kein Projekt: Formular (Titel, Typ, Ziel-Link)
- [x] `ProjectClient.tsx` – Projekt beenden: Bestätigung + API-Call
- [x] `ProjectClient.tsx` – Frühere Projekte: Liste mit Reaktivieren-Option

#### Ergebnisse
- [x] `studio/results/page.tsx` erstellen
- [x] `studio/results/ResultsClient.tsx` erstellen
- [x] `ResultsClient.tsx` – Leerer Zustand: "Sobald du Links teilst, siehst du hier wie es läuft."
- [x] `ResultsClient.tsx` – Zeitraum-Auswahl (7d, 30d, 90d)
- [x] `ResultsClient.tsx` – Gesamt-Klicks + Trend-Anzeige
- [x] `ResultsClient.tsx` – PlatformBreakdown Komponente einbinden
- [x] `components/studio/results/PlatformBreakdown.tsx` erstellen – Balken pro Plattform + eingerückte Balken pro Platzierung

#### Manuelle Tests Phase 5
- [ ] `/studio/project` ohne Projekt → Formular angezeigt
- [ ] Projekt erstellen → Status-Karte angezeigt
- [ ] Projekt beenden → Links archiviert, Status aktualisiert
- [ ] `/studio/results` ohne Daten → Leerer Zustand
- [ ] `/studio/results` mit Daten → Breakdown nach Plattform + Platzierung

### Phase 6: Projekt ↔ Seite Verknüpfung

- [ ] `components/public-page/ProjectHeroBanner.tsx` erstellen
- [ ] Hero-Banner zeigt: Titel, Typ-Label, CTA-Button mit richtigem Text (Jetzt hören / Tickets sichern / Mehr erfahren)
- [ ] Backend: `PublicPageController.php` – Aktives Spotlight mit show_on_page=true in Response aufnehmen
- [ ] Öffentliche Seite (`p/[handle]/page.tsx`) – Hero-Banner rendern wenn active_spotlight vorhanden

#### Manuelle Tests Phase 6
- [ ] Projekt mit show_on_page=false → Kein Hero-Banner auf öffentlicher Seite
- [ ] show_on_page einschalten → Hero-Banner erscheint
- [ ] Projekt beenden → Hero-Banner verschwindet (show_on_page wird zurückgesetzt)

### Phase 7: Polish

#### Toast-System
- [ ] `components/ui/Toast.tsx` erstellen – Auto-dismiss nach 4s, unten-rechts positioniert
- [ ] `context/ToastContext.tsx` erstellen – `showToast(message, subtext?)` Funktion
- [ ] `studio/layout.tsx` – ToastProvider einbinden

#### alert() ersetzen
- [ ] `ShareClient.tsx` – Alle alert() durch showToast() ersetzen
- [ ] `ProjectClient.tsx` – Alle alert() durch showToast() ersetzen
- [ ] `PageOverviewClient.tsx` – Alle alert() durch showToast() ersetzen
- [ ] Alle weiteren Stellen im Studio mit alert() identifizieren und ersetzen

#### Leer-Zustände
- [ ] Home – kein Projekt: Einladender CTA
- [ ] Home – kein Page: Einladender CTA
- [ ] Teilen – kein Projekt: Einladender CTA
- [ ] Teilen – keine Links: Ermutigende Nachricht
- [ ] Ergebnisse – keine Daten: Erklärender Hinweis + CTA
- [ ] Projekt – kein Projekt: Formular (bereits in Phase 5)

#### Mobile-Optimierung
- [ ] PlatformGrid: `grid-cols-2` auf Mobile, `sm:grid-cols-3` ab sm
- [ ] Tab-Navigation: Horizontal scrollbar oder Bottom-Nav (fixed bottom-0)
- [ ] Home-Karten: Volle Breite, reduziertes Padding auf Mobile
- [ ] PlacementSelector: Stack-Layout statt Side-by-Side auf Mobile

#### Sprache bereinigen
- [ ] "Music" → "Musik" (PageOverviewClient + Navigation)
- [ ] "Shows" → "Konzerte" (PageOverviewClient + Navigation)
- [ ] "Gallery" → "Galerie" (PageOverviewClient + Navigation)
- [ ] "Themes" → "Design" (PageOverviewClient + Navigation)
- [ ] "Featured Tracks" → "Ausgewählte Tracks" (wo relevant)
- [ ] Alle weiteren englischen UI-Texte im Studio identifizieren und übersetzen

### Phase 8: Aufräumen

#### Alte Stage-Dateien löschen
- [ ] `studio/stage/StageClient.tsx` löschen
- [ ] `studio/stage/FocusSection.tsx` löschen
- [ ] `studio/stage/SpreadSection.tsx` löschen
- [ ] `studio/stage/ActiveSpreadList.tsx` löschen
- [ ] `studio/stage/MiniPerformanceSummary.tsx` löschen
- [ ] `studio/stage/page.tsx` behalten (Redirect → /studio/project)

#### Alte Top-Level Editor-Routes
- [ ] Alle 9 alten Routes prüfen: Redirects vorhanden oder gelöscht
- [ ] Keine toten Links im Studio (alle Navigation funktioniert)

#### Nicht mehr benötigte API-Funktionen
- [ ] `createCampaign()` aus stage.ts entfernt
- [ ] `deleteTrackingLink()` aus stage.ts entfernt (ersetzt durch archiveTrackingLink)
- [ ] Alte PLATFORMS-Konstante aus SpreadSection.tsx entfernt (ersetzt durch platforms.ts)

#### Finale Prüfung
- [ ] `npm run build` erfolgreich (keine Compiler-Fehler)
- [ ] Keine Imports von gelöschten Dateien
- [ ] Öffentliche Seite funktioniert weiterhin
- [ ] Bestehende Tracking-Links funktionieren (Klick-Tracking)
- [ ] Backfilled Links (placement="legacy") werden korrekt angezeigt

#### Docs final aktualisieren
- [ ] `docs/DATA_MODEL.md` spiegelt finalen Zustand wider
- [ ] `docs/API_CONTRACTS.md` spiegelt finalen Zustand wider
- [ ] `docs/PRODUCT_RULES.md` spiegelt finalen Zustand wider