<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\ArtistPage;
use App\Models\ClickEvent;
use App\Models\PageViewEvent;
use App\Models\Spotlight;
use App\Services\BotDetectionService;
use App\Services\VisitorIdentityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    use ApiResponse;

    /**
     * Get analytics overview for authenticated user's artist page.
     */
    public function overview(Request $request): JsonResponse
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
        $uniquePageviews = PageViewEvent::countDistinctVisitors($pvBase);

        // Conversion only meaningful when scoped to a spotlight.
        // Formula (MVP approximation, capped for display safety):
        //   total_clicks / unique_pageviews, capped at 1.0.
        // Rationale: unique_pageviews dedupes crawlers/reloads via a privacy-aware
        // visitor key (with fallback for legacy UA-only rows);
        // total_clicks is NOT deduplicated, so the ratio can exceed 1.0 on
        // repeat-clickers. The cap prevents misleading UI output.
        // This is intentionally NOT a true unique-click conversion metric.
        // V2: switch numerator to unique_clicks (deduplicated per UA+day).
        $conversionRate = ($spotlightId && $uniquePageviews > 0)
            ? min(1.0, round($totalClicks / $uniquePageviews, 4))
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

        return $this->success([
            'range'            => $range,
            'spotlight_id'     => $spotlightId,
            'campaign_id'      => $campaignId,
            'total_pageviews'  => $totalPageviews,
            'unique_pageviews' => $uniquePageviews,
            'total_clicks'     => $totalClicks,
            'conversion_rate'  => $conversionRate,
            'by_platform'      => $byPlatform,
            'by_placement'     => $byPlacement,
            // by_module intentionally omitted: the legacy 'module' column is no longer
            // populated meaningfully (defaults to 'legacy'). Platform + placement
            // are the canonical breakdown dimensions in V2.
            'by_referrer'      => $byReferrer,
            'trend'            => $trend,
            'pv_trend'         => $pvTrend,
        ]);
    }

    /**
     * Get breakdown of clicks by platform and placement for a spotlight.
     */
    public function breakdown(Request $request, \App\Services\AnalyticsService $service): JsonResponse
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

        return $this->success($data);
    }

    /**
     * Record a page view from a public artist page.
     * Public endpoint – no authentication required.
     */
    public function recordPageview(
        Request $request,
        BotDetectionService $botDetection,
        VisitorIdentityService $visitorIdentity
    ): Response
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
        $isPreview = $botDetection->isPreviewBot($userAgent);

        // Hash UA for dedup (never store raw UA)
        $uaHash = $userAgent ? hash('sha256', $userAgent) : null;

        // Privacy-aware visitor key for approximation-grade dedupe.
        $visitorKeyHash = $visitorIdentity->buildPageViewVisitorKey(
            $uaHash,
            $request->ip(),
            $request->header('Accept-Language')
        );

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
                ->active()
                ->first();
            $spotlightId = $active?->id;
        }

        // Deduplicate reloads: count at most one pageview per visitor key/day
        // for the same artist page + spotlight context.
        if (!$isPreview && $visitorKeyHash) {
            $alreadyTrackedToday = PageViewEvent::query()
                ->where('artist_page_id', $artistPage->id)
                ->where('visitor_key_hash', $visitorKeyHash)
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
            'visitor_key_hash' => $visitorKeyHash,
            'is_preview'      => $isPreview,
            'occurred_at'     => now(),
        ]);

        return response()->noContent();
    }

    /**
     * Compare current phase vs previous phase for the authenticated user's artist page.
     *
     * Semantics:
     *   current  = active spotlight (if one exists), otherwise the most recently ended spotlight.
     *   previous = most recently ended spotlight (if current is active), or the
     *              second-most-recently ended spotlight (if no active spotlight).
     *
     * This is a CHRONOLOGICAL comparison, not a semantic/content-based one.
     * It serves as a trend/progress view ("how am I doing now vs. before?"),
     * not as a benchmark between comparable campaigns.
     * No similarity or content relationship between current and previous is implied.
     */
    public function comparison(Request $request, \App\Services\AnalyticsService $service): JsonResponse
    {
        $artistPage = $request->user()->artistPage;

        $current = Spotlight::where('artist_page_id', $artistPage->id)
            ->active()
            ->latest()
            ->first();

        if ($current) {
            $previous = Spotlight::where('artist_page_id', $artistPage->id)
                ->where('status', 'ended')
                ->latest('ends_at')
                ->first();
        } else {
            // No active phase: compare last two ended phases
            $ended    = Spotlight::where('artist_page_id', $artistPage->id)
                ->where('status', 'ended')
                ->latest('ends_at')
                ->limit(2)
                ->get();
            $current  = $ended->get(0);
            $previous = $ended->get(1);
        }

        if (!$current) {
            return $this->success(['current' => null, 'previous' => null]);
        }

        $formatPhase = fn (Spotlight $s) => array_merge(
            ['id' => $s->id, 'title' => $s->title],
            $service->getPhaseStats($s->id),
        );

        return $this->success([
            'current'  => $formatPhase($current),
            'previous' => $previous ? $formatPhase($previous) : null,
        ]);
    }
}
