<?php

namespace App\Services;

use App\Models\ArtistPage;
use App\Models\Spotlight;
use App\Models\TrackingLink;
use App\Models\ClickEvent;
use Carbon\Carbon;

class StudioHomeService
{
    /**
     * Get Studio Home dashboard data.
     *
     * @param ArtistPage $artistPage
     * @return array
     */
    public function getHomeData(ArtistPage $artistPage): array
    {
        return [
            'spotlight' => $this->getActiveSpotlight($artistPage),
            'top_links' => $this->getTopLinks($artistPage),
            'page' => $this->getPageStatus($artistPage),
            'stats' => $this->getStats($artistPage),
            'tip' => $this->getTip($artistPage),
        ];
    }

    /**
     * Get active spotlight (not archived, status = active).
     *
     * @param ArtistPage $artistPage
     * @return array|null
     */
    protected function getActiveSpotlight(ArtistPage $artistPage): ?array
    {
        $spotlight = Spotlight::where('artist_page_id', $artistPage->id)
            ->where('status', 'active')
            ->whereNull('archived_at')
            ->first();

        if (!$spotlight) {
            return null;
        }

        return [
            'id' => $spotlight->id,
            'title' => $spotlight->title,
            'slug' => $spotlight->slug,
            'type' => $spotlight->type,
            'show_on_page' => $spotlight->show_on_page,
            'starts_at' => $spotlight->starts_at?->toIso8601String(),
            'ends_at' => $spotlight->ends_at?->toIso8601String(),
        ];
    }

    /**
     * Get top 3 tracking links by click count.
     *
     * @param ArtistPage $artistPage
     * @return array
     */
    protected function getTopLinks(ArtistPage $artistPage): array
    {
        $links = TrackingLink::where('artist_page_id', $artistPage->id)
            ->whereNull('archived_at')
            ->where('is_active', true)
            ->orderBy('click_count', 'desc')
            ->limit(3)
            ->get(['id', 'label', 'short_code', 'click_count', 'platform', 'placement']);

        return $links->map(function ($link) {
            return [
                'id' => $link->id,
                'label' => $link->label,
                'short_code' => $link->short_code,
                'url' => config('app.url') . '/t/' . $link->short_code,
                'clicks' => $link->click_count,
                'platform' => $link->platform,
                'placement' => $link->placement,
            ];
        })->toArray();
    }

    /**
     * Get page status.
     *
     * @param ArtistPage $artistPage
     * @return array|null
     */
    protected function getPageStatus(ArtistPage $artistPage): ?array
    {
        return [
            'url' => config('app.url') . '/p/' . $artistPage->handle,
            'is_published' => $artistPage->is_published,
        ];
    }

    /**
     * Get 7-day stats.
     *
     * @param ArtistPage $artistPage
     * @return array
     */
    protected function getStats(ArtistPage $artistPage): array
    {
        $sevenDaysAgo = Carbon::now()->subDays(7);
        $fourteenDaysAgo = Carbon::now()->subDays(14);

        // Total clicks in last 7 days
        $clicks7d = ClickEvent::where('artist_page_id', $artistPage->id)
            ->where('occurred_at', '>=', $sevenDaysAgo)
            ->count();

        // Clicks in previous 7 days (for trend calculation)
        $clicksPrevious7d = ClickEvent::where('artist_page_id', $artistPage->id)
            ->where('occurred_at', '>=', $fourteenDaysAgo)
            ->where('occurred_at', '<', $sevenDaysAgo)
            ->count();

        // Calculate trend percentage
        $trend = 0;
        if ($clicksPrevious7d > 0) {
            $trend = (int) round((($clicks7d - $clicksPrevious7d) / $clicksPrevious7d) * 100);
        } elseif ($clicks7d > 0) {
            $trend = 100; // New activity
        }

        return [
            'total_clicks_7d' => $clicks7d,
            'trend' => $trend,
        ];
    }

    /**
     * Get optional tip.
     *
     * @param ArtistPage $artistPage
     * @return array|null
     */
    protected function getTip(ArtistPage $artistPage): ?array
    {
        // No active spotlight? Suggest creating one
        $activeSpotlight = Spotlight::where('artist_page_id', $artistPage->id)
            ->where('status', 'active')
            ->whereNull('archived_at')
            ->exists();

        if (!$activeSpotlight) {
            return [
                'type' => 'spotlight',
                'message' => 'Erstelle ein Spotlight, um deine Performance zu tracken.',
                'action' => '/studio/project',
            ];
        }

        // Check if page is not published
        if (!$artistPage->is_published) {
            return [
                'type' => 'publish',
                'message' => 'Deine Seite ist noch nicht veröffentlicht.',
                'action' => '/studio/page',
            ];
        }

        // Check if no tracking links exist
        $hasLinks = TrackingLink::where('artist_page_id', $artistPage->id)
            ->whereNull('archived_at')
            ->exists();

        if (!$hasLinks) {
            return [
                'type' => 'links',
                'message' => 'Erstelle Tracking-Links für deine Kanäle.',
                'action' => '/studio/share',
            ];
        }

        return null;
    }
}
