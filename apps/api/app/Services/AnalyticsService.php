<?php

namespace App\Services;

use App\Models\User;
use App\Models\TrackingLink;
use App\Models\ClickEvent;

class AnalyticsService
{
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
        $totalCurrent = ClickEvent::whereIn('tracking_link_id', $linkIds)
            ->where('occurred_at', '>=', now()->subDays($days))
            ->count();

        // Total clicks (previous period for trend)
        $totalPrevious = ClickEvent::whereIn('tracking_link_id', $linkIds)
            ->where('occurred_at', '>=', now()->subDays($days * 2))
            ->where('occurred_at', '<', now()->subDays($days))
            ->count();

        // Get clicks by link
        $clicksByLink = ClickEvent::whereIn('tracking_link_id', $linkIds)
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
