<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClickEvent;
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

        return response()->json([
            'data' => [
                'range' => $range,
                'spotlight_id' => $spotlightId,
                'campaign_id' => $campaignId,
                'total_clicks' => $totalClicks,
                'by_platform' => $byPlatform, // V2
                'by_placement' => $byPlacement, // V2
                'by_module' => $byModule, // Legacy
                'by_referrer' => $byReferrer,
                'trend' => $trend,
            ],
        ]);
    }
}
