<?php

namespace App\Services;

use App\Models\User;
use App\Models\TrackingLink;
use App\Models\ClickEvent;
use App\Models\PageViewEvent;

class AnalyticsService
{
    /**
     * Aggregate all-time metrics for a single spotlight (no date range).
     *
     * Source of truth: ClickEvent / PageViewEvent tables (event-based).
     * NOT click_count on tracking_links — that column is a display/listing cache
     * and can diverge from real event counts (race conditions, retroactive
     * preview corrections, pre-migration data gaps). Always use events for analytics.
     *
     * Used by AnalyticsController::comparison and StudioHomeService::getPhaseStats.
     */
    public function getPhaseStats(int $spotlightId): array
    {
        $totalClicks = ClickEvent::where('spotlight_id', $spotlightId)
            ->where('is_preview', false)
            ->count();

        $qrClicks = ClickEvent::where('spotlight_id', $spotlightId)
            ->where('platform', 'qr')
            ->where('is_preview', false)
            ->count();

        $uniqueVisitors = PageViewEvent::where('spotlight_id', $spotlightId)
            ->realViews()
            ->whereNotNull('user_agent_hash')
            ->distinct('user_agent_hash')
            ->count('user_agent_hash');

        $conversion = $uniqueVisitors > 0
            // MVP approximation, capped at 1.0 for display safety.
            // total_clicks is not deduplicated; result can exceed 1.0 on
            // repeat-clickers without the cap. V2: use unique_clicks.
            ? min(100.0, round($totalClicks / $uniqueVisitors * 100, 1))
            : null;

        $topPlatform = ClickEvent::where('spotlight_id', $spotlightId)
            ->where('is_preview', false)
            ->where('platform', '!=', 'qr')
            ->whereNotNull('platform')
            ->selectRaw('platform, COUNT(*) as clicks')
            ->groupBy('platform')
            ->orderByDesc('clicks')
            ->value('platform');

        return [
            'visitors'     => $uniqueVisitors,
            'clicks'       => $totalClicks,
            'qr_scans'     => $qrClicks,
            'conversion'   => $conversion,
            'top_platform' => $topPlatform,
        ];
    }

    /**
     * Get platform/placement breakdown for a spotlight.
     *
     * @param User $user
     * @param int $spotlightId
     * @param string $period
     * @return array
     */
    public function getBreakdown(User $user, int $spotlightId, string $period = '7d'): array
    {
        $artistPage = $user->artistPage;

        if (!$artistPage) {
            return [
                'total_clicks' => 0,
                'trend' => 0,
                'period' => $period,
                'by_platform' => [],
            ];
        }

        $days = match ($period) {
            '7d' => 7,
            '30d' => 30,
            '90d' => 90,
            default => 7,
        };

        // Get all links for this spotlight
        $links = TrackingLink::where('spotlight_id', $spotlightId)
            ->where('artist_page_id', $artistPage->id)
            ->get();

        if ($links->isEmpty()) {
            return [
                'total_clicks' => 0,
                'trend' => 0,
                'period' => $period,
                'by_platform' => [],
            ];
        }

        $linkIds = $links->pluck('id');

        // Total clicks (current period)
        $totalCurrent = ClickEvent::realClicks()
            ->whereIn('tracking_link_id', $linkIds)
            ->where('occurred_at', '>=', now()->subDays($days))
            ->count();

        // Total clicks (previous period for trend)
        $totalPrevious = ClickEvent::realClicks()
            ->whereIn('tracking_link_id', $linkIds)
            ->where('occurred_at', '>=', now()->subDays($days * 2))
            ->where('occurred_at', '<', now()->subDays($days))
            ->count();

        // Get clicks by link
        $clicksByLink = ClickEvent::realClicks()
            ->whereIn('tracking_link_id', $linkIds)
            ->where('occurred_at', '>=', now()->subDays($days))
            ->selectRaw('tracking_link_id, COUNT(*) as clicks')
            ->groupBy('tracking_link_id')
            ->pluck('clicks', 'tracking_link_id');

        // Group by platform and placement
        $byPlatform = $links
            ->groupBy('platform')
            ->map(function ($platformLinks, $platform) use ($clicksByLink) {
                $placements = $platformLinks->map(function ($link) use ($clicksByLink) {
                    return [
                        'placement' => $link->placement,
                        'clicks' => $clicksByLink->get($link->id, 0),
                    ];
                })
                ->sortByDesc('clicks')
                ->values();

                return [
                    'platform' => $platform,
                    'clicks' => $placements->sum('clicks'),
                    'placements' => $placements->toArray(),
                ];
            })
            ->sortByDesc('clicks')
            ->values();

        return [
            'total_clicks' => $totalCurrent,
            'trend' => $totalCurrent - $totalPrevious,
            'period' => $period,
            'by_platform' => $byPlatform->toArray(),
        ];
    }
}
