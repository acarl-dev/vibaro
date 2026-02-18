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
        ]);

        $range = $request->input('range', '7d');
        $days = $range === '7d' ? 7 : 30;

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

        // Total clicks in range
        $totalClicks = ClickEvent::where('artist_page_id', $artistPage->id)
            ->where('occurred_at', '>=', $startDate)
            ->count();

        // Clicks by module
        $byModule = ClickEvent::where('artist_page_id', $artistPage->id)
            ->where('occurred_at', '>=', $startDate)
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
        $byReferrer = ClickEvent::where('artist_page_id', $artistPage->id)
            ->where('occurred_at', '>=', $startDate)
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
        $trend = ClickEvent::where('artist_page_id', $artistPage->id)
            ->where('occurred_at', '>=', $startDate)
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
                'total_clicks' => $totalClicks,
                'by_module' => $byModule,
                'by_referrer' => $byReferrer,
                'trend' => $trend,
            ],
        ]);
    }
}
