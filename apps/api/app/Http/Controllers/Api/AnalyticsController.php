<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ArtistPage;
use App\Models\ClickEvent;
use App\Models\PageViewEvent;
use App\Models\Spotlight;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    /**
     * Get analytics overview for authenticated user's artist page.
     */
    public function overview(Request $request)
    {
        $request->validate([
            'range' => 'in:7d,30d',
            'spotlight_id' => 'nullable|exists:spotlights,id',
            'campaign_id' => 'nullable|exists:campaigns,id',
        ]);

        $range = $request->input('range', '7d');
        $days = $range === '7d' ? 7 : 30;
        $spotlightId = $request->input('spotlight_id');
        $campaignId = $request->input('campaign_id');

        $artistPage = $request->user()->artistPage;

        if (!$artistPage) {
            return response()->json([
                'error' => [
                    'code' => 'no_artist_page',
                    'message' => 'No artist page found for this user.',
                ],
            ], 404);
        }

        $startDate = now()->subDays($days)->startOfDay();

        // Build base query (exclude preview/bot clicks via realClicks scope)
        $baseQuery = ClickEvent::realClicks()
            ->where('artist_page_id', $artistPage->id)
            ->where('occurred_at', '>=', $startDate);

        // Apply spotlight filter if provided
        if ($spotlightId) {
            $baseQuery->where('spotlight_id', $spotlightId);
        }

        // Apply campaign filter if provided
        if ($campaignId) {
            $baseQuery->whereHas('trackingLink', function ($query) use ($campaignId) {
                $query->where('campaign_id', $campaignId);
            });
        }

        // Total clicks in range
        $totalClicks = (clone $baseQuery)->count();

        // Clicks by platform (V2)
        $byPlatform = (clone $baseQuery)
            ->select('platform', DB::raw('count(*) as clicks'))
            ->whereNotNull('platform')
            ->groupBy('platform')
            ->orderByDesc('clicks')
            ->get()
            ->map(function ($item) {
                return [
                    'platform' => $item->platform,
                    'clicks' => $item->clicks,
                ];
            });

        // Clicks by platform+placement (V2)
        $byPlacement = (clone $baseQuery)
            ->select('platform', 'placement', DB::raw('count(*) as clicks'))
            ->whereNotNull('platform')
            ->whereNotNull('placement')
            ->groupBy('platform', 'placement')
            ->orderByDesc('clicks')
            ->limit(15)
            ->get()
            ->map(function ($item) {
                return [
                    'platform' => $item->platform,
                    'placement' => $item->placement,
                    'clicks' => $item->clicks,
                ];
            });

        // Clicks by module (legacy support)
        $byModule = (clone $baseQuery)
            ->select('module', DB::raw('count(*) as clicks'))
            ->groupBy('module')
            ->orderByDesc('clicks')
            ->get()
            ->map(function ($item) {
                return [
                    'module' => $item->module,
                    'clicks' => $item->clicks,
                ];
            });

        // Clicks by referrer (top 10)
        $byReferrer = (clone $baseQuery)
            ->whereNotNull('referrer_host')
            ->select('referrer_host', DB::raw('count(*) as clicks'))
            ->groupBy('referrer_host')
            ->orderByDesc('clicks')
            ->limit(10)
            ->get()
            ->map(function ($item) {
                return [
                    'referrer' => $item->referrer_host,
                    'clicks' => $item->clicks,
                ];
            });

        // Trend (clicks per day)
        $trend = (clone $baseQuery)
            ->select(
                DB::raw('DATE(occurred_at) as date'),
                DB::raw('count(*) as clicks')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => $item->date,
                    'clicks' => $item->clicks,
                ];
            });

        // Pageview stats
        $pvBase = PageViewEvent::realViews()
            ->where('artist_page_id', $artistPage->id)
            ->where('occurred_at', '>=', $startDate);

        if ($spotlightId) {
            $pvBase->where('spotlight_id', $spotlightId);
        }

        $totalPageviews  = (clone $pvBase)->count();
        $uniquePageviews = (clone $pvBase)
            ->whereNotNull('user_agent_hash')
            ->distinct('user_agent_hash')
            ->count('user_agent_hash');

        // Conversion only meaningful when scoped to a spotlight.
        // Formula (MVP, Option A): total_clicks / unique_pageviews.
        // Rationale: unique_pageviews dedupes crawlers/reloads;
        // total_clicks is used instead of unique_clicks because
        // click dedup per UA is not yet tracked.
        // Revisit: switch to unique_clicks/unique_pageviews in V2.
        $conversionRate = ($spotlightId && $uniquePageviews > 0)
            ? round($totalClicks / $uniquePageviews, 4)
            : null;

        // Pageview trend (clicks per day)
        $pvTrend = (clone $pvBase)
            ->select(
                DB::raw('DATE(occurred_at) as date'),
                DB::raw('count(*) as views')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn ($item) => ['date' => $item->date, 'views' => $item->views]);

        return response()->json([
            'data' => [
                'range'            => $range,
                'spotlight_id'     => $spotlightId,
                'campaign_id'      => $campaignId,
                'total_pageviews'  => $totalPageviews,
                'unique_pageviews' => $uniquePageviews,
                'total_clicks'     => $totalClicks,
                'conversion_rate'  => $conversionRate,
                'by_platform'      => $byPlatform,   // V2
                'by_placement'     => $byPlacement,  // V2
                'by_module'        => $byModule,      // Legacy
                'by_referrer'      => $byReferrer,
                'trend'            => $trend,
                'pv_trend'         => $pvTrend,
            ],
        ]);
    }

    /**
     * Get breakdown of clicks by platform and placement for a spotlight.
     */
    public function breakdown(Request $request, \App\Services\AnalyticsService $service)
    {
        $validated = $request->validate([
            'spotlight_id' => 'required|integer',
            'period' => 'sometimes|string|in:7d,30d,90d',
        ]);

        // Ownership check
        $spotlight = \App\Models\Spotlight::where('id', $validated['spotlight_id'])
            ->whereHas('artistPage', function ($query) use ($request) {
                $query->where('user_id', $request->user()->id);
            })
            ->firstOrFail();

        $data = $service->getBreakdown(
            $request->user(),
            $spotlight->id,
            $validated['period'] ?? '7d'
        );

        return response()->json(['data' => $data]);
    }

    /**
     * Record a page view from a public artist page.
     * Public endpoint – no authentication required.
     */
    public function recordPageview(Request $request)
    {
        $request->validate([
            'handle'       => 'required|string|max:64',
            'spotlight_id' => 'nullable|integer',
            'referrer'     => 'nullable|string|max:255',
        ]);

        $artistPage = ArtistPage::where('handle', $request->input('handle'))
            ->where('is_published', true)
            ->first();

        if (!$artistPage) {
            return response()->noContent();
        }

        // Bot / preview detection
        $userAgent = $request->userAgent() ?? '';
        $isPreview = $this->isBot($userAgent);

        // Hash UA for dedup (never store raw UA)
        $uaHash = $userAgent ? hash('sha256', $userAgent) : null;

        // Parse referrer host
        $referrerRaw  = $request->input('referrer', '');
        $referrerHost = null;
        if ($referrerRaw) {
            $parsed       = parse_url($referrerRaw, PHP_URL_HOST);
            $referrerHost = $parsed ? strtolower($parsed) : null;
        }

        // Country from Cloudflare/proxy header (graceful fallback)
        $country = $request->header('CF-IPCountry')
            ?? $request->header('X-Country-Code')
            ?? null;
        if ($country && strlen($country) !== 2) {
            $country = null;
        }

        // Spotlight: use provided id or resolve active spotlight for this page
        $spotlightId = $request->input('spotlight_id');
        if (!$spotlightId) {
            $active      = $artistPage->spotlights()
                ->where('status', 'active')
                ->first();
            $spotlightId = $active?->id;
        }

        // Deduplicate reloads: count at most one pageview per visitor hash/day
        // for the same artist page + spotlight context.
        if (!$isPreview && $uaHash) {
            $alreadyTrackedToday = PageViewEvent::query()
                ->where('artist_page_id', $artistPage->id)
                ->where('user_agent_hash', $uaHash)
                ->whereDate('occurred_at', now()->toDateString())
                ->when(
                    $spotlightId,
                    fn ($query) => $query->where('spotlight_id', $spotlightId),
                    fn ($query) => $query->whereNull('spotlight_id')
                )
                ->exists();

            if ($alreadyTrackedToday) {
                return response()->noContent();
            }
        }

        PageViewEvent::create([
            'artist_page_id'  => $artistPage->id,
            'spotlight_id'    => $spotlightId,
            'referrer_host'   => $referrerHost,
            'country_code'    => $country,
            'user_agent_hash' => $uaHash,
            'is_preview'      => $isPreview,
            'occurred_at'     => now(),
        ]);

        return response()->noContent();
    }

    /**
     * Compare current phase vs previous phase for the authenticated user's artist page.
     * Current = active spotlight (or last ended if none active).
     * Previous = last ended spotlight (or second-to-last ended).
     */
    public function comparison(Request $request): \Illuminate\Http\JsonResponse
    {
        $artistPage = $request->user()->artistPage;

        if (!$artistPage) {
            return response()->json([
                'error' => ['code' => 'no_artist_page', 'message' => 'No artist page found.'],
            ], 404);
        }

        $current = Spotlight::where('artist_page_id', $artistPage->id)
            ->where('status', 'active')
            ->latest()
            ->first();

        if ($current) {
            $previous = Spotlight::where('artist_page_id', $artistPage->id)
                ->where('status', 'ended')
                ->latest('ended_at')
                ->first();
        } else {
            // No active phase: compare last two ended phases
            $ended    = Spotlight::where('artist_page_id', $artistPage->id)
                ->where('status', 'ended')
                ->latest('ended_at')
                ->limit(2)
                ->get();
            $current  = $ended->get(0);
            $previous = $ended->get(1);
        }

        if (!$current) {
            return response()->json(['data' => ['current' => null, 'previous' => null]]);
        }

        return response()->json([
            'data' => [
                'current'  => $this->aggregatePhase($current),
                'previous' => $previous ? $this->aggregatePhase($previous) : null,
            ],
        ]);
    }

    /**
     * Aggregate all-time metrics for a single spotlight.
     * No date range – captures the full phase lifecycle.
     */
    private function aggregatePhase(Spotlight $spotlight): array
    {
        $id = $spotlight->id;

        $totalClicks = ClickEvent::where('spotlight_id', $id)
            ->where('is_preview', false)
            ->count();

        $qrClicks = ClickEvent::where('spotlight_id', $id)
            ->where('platform', 'qr')
            ->where('is_preview', false)
            ->count();

        $uniqueVisitors = PageViewEvent::where('spotlight_id', $id)
            ->realViews()
            ->whereNotNull('user_agent_hash')
            ->distinct('user_agent_hash')
            ->count('user_agent_hash');

        // Conversion: total_clicks / unique_visitors × 100 (same MVP Option A logic as overview)
        $conversion = $uniqueVisitors > 0
            ? round($totalClicks / $uniqueVisitors * 100, 1)
            : null;

        $topPlatform = ClickEvent::where('spotlight_id', $id)
            ->where('is_preview', false)
            ->where('platform', '!=', 'qr')
            ->whereNotNull('platform')
            ->selectRaw('platform, COUNT(*) as clicks')
            ->groupBy('platform')
            ->orderByDesc('clicks')
            ->first();

        return [
            'id'           => $spotlight->id,
            'title'        => $spotlight->title,
            'visitors'     => $uniqueVisitors,
            'clicks'       => $totalClicks,
            'qr_scans'     => $qrClicks,
            'conversion'   => $conversion,
            'top_platform' => $topPlatform?->platform,
        ];
    }

    private function isBot(string $userAgent): bool
    {
        if (empty($userAgent)) {
            return true;
        }

        $botPatterns = [
            'bot', 'crawl', 'spider', 'slurp', 'mediapartners',
            'facebookexternalhit', 'whatsapp', 'telegrambot',
            'twitterbot', 'linkedinbot', 'discordbot', 'slackbot',
            'preview', 'iframely', 'embedly',
        ];

        $ua = strtolower($userAgent);
        foreach ($botPatterns as $pattern) {
            if (str_contains($ua, $pattern)) {
                return true;
            }
        }

        return false;
    }
}
