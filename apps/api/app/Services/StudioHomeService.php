<?php

namespace App\Services;

use App\Models\User;
use App\Models\ArtistPage;
use App\Models\Spotlight;
use App\Models\TrackingLink;
use App\Models\ClickEvent;
use Carbon\Carbon;

class StudioHomeService
{
    /**
     * Get Studio Home dashboard data for a user.
     *
     * @param User $user
     * @return array
     */
    public function getHomeData(User $user): array
    {
        $artistPage = $user->artistPage;

        if (!$artistPage) {
            return [];
        }

        // 1. Get active spotlight
        $spotlight = $this->getActiveSpotlight($artistPage);

        // 2. Get top tracking links (max 3, by click_count)
        $topLinks = $this->getTopLinks($artistPage, $spotlight);

        // 3. Get 7-day stats with trend
        $stats = $this->getStats($artistPage, $spotlight);

        // 4. Get page status
        $page = $this->getPageStatus($artistPage);

        // 5. Generate contextual tip
        $tip = $this->generateTip($artistPage, $spotlight, $topLinks, $stats);

        return [
            'spotlight' => $spotlight,
            'stats' => $stats,
            'top_links' => $topLinks,
            'page' => $page,
            'tip' => $tip,
        ];
    }

    /**
     * Get active spotlight (status=active, not archived).
     *
     * @param ArtistPage $artistPage
     * @return array|null
     */
    protected function getActiveSpotlight(ArtistPage $artistPage): ?array
    {
        // Prefer active spotlight; fall back to the most recent scheduled one
        $spotlight = Spotlight::where('artist_page_id', $artistPage->id)
            ->whereNull('archived_at')
            ->whereIn('status', ['active', 'scheduled'])
            ->orderByRaw("CASE status WHEN 'active' THEN 0 ELSE 1 END")
            ->orderByDesc('created_at')
            ->first();

        if (!$spotlight) {
            return null;
        }

        $daysActive = 0;
        if ($spotlight->starts_at) {
            $daysActive = $spotlight->starts_at->diffInDays(now());
        }

        return [
            'id' => $spotlight->id,
            'title' => $spotlight->title,
            'slug' => $spotlight->slug,
            'type' => $spotlight->type,
            'status' => $spotlight->status,
            'starts_at' => $spotlight->starts_at?->toIso8601String(),
            'ends_at' => $spotlight->ends_at?->toIso8601String(),
            'days_active' => $daysActive,
            'show_on_page' => $spotlight->show_on_page,
            'cover_image_url' => $spotlight->cover_image_url,
            'artist_name' => $spotlight->artist_name,
            'platform_name' => $spotlight->platform_name,
        ];
    }

    /**
     * Get top 3 tracking links by click count.
     *
     * @param ArtistPage $artistPage
     * @param array|null $spotlight
     * @return array
     */
    protected function getTopLinks(ArtistPage $artistPage, ?array $spotlight): array
    {
        if (!$spotlight) {
            return [];
        }

        $links = TrackingLink::where('spotlight_id', $spotlight['id'])
            ->where('artist_page_id', $artistPage->id)
            ->active()
            ->orderByDesc('click_count')
            ->limit(3)
            ->get();

        return $links->map(function ($link) {
            return [
                'id' => $link->id,
                'platform' => $link->platform,
                'placement' => $link->placement,
                'tracking_url' => $link->tracking_url,
                'click_count' => $link->click_count,
            ];
        })->toArray();
    }

    /**
     * Get page status.
     *
     * @param ArtistPage $artistPage
     * @return array
     */
    protected function getPageStatus(ArtistPage $artistPage): array
    {
        return [
            'handle' => $artistPage->handle,
            'is_published' => $artistPage->is_published,
            'display_name' => $artistPage->display_name,
            'updated_at' => $artistPage->updated_at->toIso8601String(),
        ];
    }

    /**
     * Get 7-day stats with trend calculation.
     *
     * @param ArtistPage $artistPage
     * @param array|null $spotlight
     * @return array
     */
    protected function getStats(ArtistPage $artistPage, ?array $spotlight): array
    {
        if (!$spotlight) {
            return [
                'total_clicks_7d' => 0,
                'trend' => 0,
            ];
        }

        $linkIds = TrackingLink::where('spotlight_id', $spotlight['id'])
            ->where('artist_page_id', $artistPage->id)
            ->pluck('id');

        // Last 7 days
        $last7 = ClickEvent::whereIn('tracking_link_id', $linkIds)
            ->where('occurred_at', '>=', now()->subDays(7))
            ->count();

        // Previous 7 days
        $prev7 = ClickEvent::whereIn('tracking_link_id', $linkIds)
            ->where('occurred_at', '>=', now()->subDays(14))
            ->where('occurred_at', '<', now()->subDays(7))
            ->count();

        return [
            'total_clicks_7d' => $last7,
            'trend' => $last7 - $prev7,
        ];
    }

    /**
     * Generate contextual tip based on user state.
     *
     * @param ArtistPage $artistPage
     * @param array|null $spotlight
     * @param array $topLinks
     * @param array $stats
     * @return array|null
     */
    protected function generateTip(ArtistPage $artistPage, ?array $spotlight, array $topLinks, array $stats): ?array
    {
        // Priority 1: Page not published
        if (!$artistPage->is_published) {
            return [
                'type' => 'publish',
                'message' => 'Deine Seite ist noch nicht öffentlich. Veröffentliche sie, damit Fans dich finden.',
                'action' => '/studio/page',
            ];
        }

        // Priority 2: No project
        if (!$spotlight) {
            return [
                'type' => 'spotlight',
                'message' => 'Starte ein Projekt, um Links zu erstellen und zu sehen wie es läuft.',
                'action' => '/studio/project',
            ];
        }

        // Priority 3: Project, but no links
        if (empty($topLinks)) {
            return [
                'type' => 'links',
                'message' => 'Du hast noch keine Links erstellt. Starte mit Instagram – dort sind die meisten Fans.',
                'action' => '/studio/share',
            ];
        }

        // Priority 4: No clicks since 2 days
        $recentClicks = ClickEvent::whereIn('tracking_link_id', array_column($topLinks, 'id'))
            ->where('occurred_at', '>=', now()->subDays(2))
            ->count();

        if ($recentClicks === 0) {
            return [
                'type' => 'links',
                'message' => 'Deine Links wurden seit 2 Tagen nicht geklickt. Teile sie nochmal in einer Story!',
                'action' => '/studio/share',
            ];
        }

        // Priority 5: Best platform recommendation
        if (!empty($topLinks)) {
            $best = $topLinks[0];
            $platformLabel = ucfirst($best['platform']);
            $placementLabel = ucfirst($best['placement']);

            return [
                'type' => 'links',
                'message' => "Deine {$platformLabel}-{$placementLabel}-Links bringen die meisten Klicks. Poste dort nochmal!",
                'action' => '/studio/share',
            ];
        }

        return null;
    }
}
