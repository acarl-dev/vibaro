<?php

namespace App\Services;

use App\Models\User;
use App\Models\ArtistPage;
use App\Models\Spotlight;
use App\Models\TrackingLink;
use App\Models\ClickEvent;
use App\Models\PageViewEvent;

class StudioHomeService
{
    public function __construct(
        protected AnalyticsService $analyticsService,
    ) {}

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

        // 2. Get top tracking links (max 3, sorted by click_count)
        // Note: click_count is a denormalized display/listing cache, NOT the analytics
        // source of truth. It may diverge from ClickEvent::realClicks() counts due to
        // race conditions or pre-migration data. It is intentionally used here for
        // fast sorting only — not for precise metric display.
        $topLinks = $this->getTopLinks($artistPage, $spotlight);

        // 3. Get 7-day stats with trend
        $stats = $this->getStats($artistPage, $spotlight);

        // 4. Get page status
        $page = $this->getPageStatus($artistPage);

        // 5. Generate contextual tip
        $tip = $this->generateTip($artistPage, $spotlight, $topLinks, $stats);

        // 6. Phase stats (all-time for active spotlight)
        if ($spotlight) {
            $spotlight['phase_stats'] = $this->getPhaseStats($spotlight['id']);
        }

        // 7. Previous (last ended) spotlight + its metrics
        $previousSpotlight = $this->getPreviousSpotlight($artistPage);

        // 8. Traffic snapshot (7-day pageview summary)
        $trafficSnapshot = $this->getTrafficSnapshot($artistPage, $spotlight);

        return [
            'spotlight' => $spotlight,
            'previous_spotlight' => $previousSpotlight,
            'traffic_snapshot' => $trafficSnapshot,
            'stats' => $stats,
            'top_links' => $topLinks,
            'page' => $page,
            'tip' => $tip,
        ];
    }

    /**
     * Get all-time metrics for a spotlight (delegates to shared AnalyticsService).
     */
    protected function getPhaseStats(int $spotlightId): array
    {
        return $this->analyticsService->getPhaseStats($spotlightId);
    }

    /**
     * Get last ended spotlight + its all-time metrics.
     */
    protected function getPreviousSpotlight(ArtistPage $artistPage): ?array
    {
        $spotlight = Spotlight::where('artist_page_id', $artistPage->id)
            ->where('status', 'ended')
            ->latest('ends_at')
            ->first();

        if (!$spotlight) {
            return null;
        }

        return [
            'id'         => $spotlight->id,
            'title'      => $spotlight->title,
            'phase_stats' => $this->getPhaseStats($spotlight->id),
        ];
    }

    /**
     * 7-day traffic snapshot for the mini-analytics block.
     */
    protected function getTrafficSnapshot(ArtistPage $artistPage, ?array $spotlight): array
    {
        $since7d = now()->subDays(7)->startOfDay();
        $since14d = now()->subDays(14)->startOfDay();

        // Unique pageviews this week
        $visitors7d = PageViewEvent::countDistinctVisitors(
            PageViewEvent::where('artist_page_id', $artistPage->id)
                ->realViews()
                ->where('occurred_at', '>=', $since7d)
        );

        // Unique pageviews previous week (for trend)
        $visitorsPrev7d = PageViewEvent::countDistinctVisitors(
            PageViewEvent::where('artist_page_id', $artistPage->id)
                ->realViews()
                ->where('occurred_at', '>=', $since14d)
                ->where('occurred_at', '<', $since7d)
        );

        $trendPct = $visitorsPrev7d > 0
            ? (int) round((($visitors7d - $visitorsPrev7d) / $visitorsPrev7d) * 100)
            : null;

        // Top platform (scoped to spotlight if active, else all artist page clicks)
        $clickQuery = ClickEvent::where('artist_page_id', $artistPage->id)
            ->where('is_preview', false)
            ->where('occurred_at', '>=', $since7d)
            ->where('platform', '!=', 'qr')
            ->whereNotNull('platform');

        if ($spotlight) {
            $clickQuery->where('spotlight_id', $spotlight['id']);
        }

        $topPlatform = $clickQuery
            ->selectRaw('platform, COUNT(*) as cnt')
            ->groupBy('platform')
            ->orderByDesc('cnt')
            ->value('platform');

        return [
            'visitors_7d' => $visitors7d,
            'trend_pct'   => $trendPct,
            'top_platform' => $topPlatform,
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
            ->notArchived()
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
     * Get page status including field-level completeness data.
     *
     * @param ArtistPage $artistPage
     * @return array
     */
    protected function getPageStatus(ArtistPage $artistPage): array
    {
        // Kontakt: prefer the new `contacts` JSON array (source of truth since 2026-02-23).
        // A contact entry counts only when it has a non-empty value.
        $contacts = $artistPage->contacts ?? [];
        $hasContact = collect($contacts)->contains(
            fn($c) => !empty($c['value'] ?? null)
        );
        // Fall back to the legacy individual fields in case of old rows not yet migrated.
        if (!$hasContact) {
            $hasContact = !empty($artistPage->booking_email)
                || !empty($artistPage->management_email)
                || !empty($artistPage->press_email)
                || !empty($artistPage->whatsapp_number);
        }

        // Links: a row is only "filled" when it actually has a URL.
        // Pre-created platform placeholder rows with url=null must not count.
        $hasLinks = $artistPage->links()
            ->whereNotNull('url')
            ->where('url', '!=', '')
            ->exists();

        // Media: either FeaturedTracks (Spotify/SoundCloud embeds) or Videos count.
        $hasMedia = $artistPage->featuredTracks()->exists()
            || $artistPage->videos()->exists();

        $hasShows = $artistPage->shows()->exists();

        return [
            'handle'       => $artistPage->handle,
            'is_published' => $artistPage->is_published,
            'display_name' => $artistPage->display_name,
            'updated_at'   => $artistPage->updated_at->toIso8601String(),
            'completeness' => [
                'basis' => [
                    ['key' => 'name',    'label' => 'Künstlername',  'done' => !empty($artistPage->display_name)],
                    ['key' => 'bio',     'label' => 'Bio',            'done' => !empty($artistPage->bio)],
                    ['key' => 'header',  'label' => 'Headerbild',     'done' => !empty($artistPage->header_path)],
                    ['key' => 'contact', 'label' => 'Kontakt',        'done' => $hasContact],
                ],
                'praesenz' => [
                    ['key' => 'links', 'label' => 'Social Links',    'done' => $hasLinks],
                    ['key' => 'media', 'label' => 'Media / Player',  'done' => $hasMedia],
                    ['key' => 'shows', 'label' => 'Shows',           'done' => $hasShows],
                ],
            ],
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
