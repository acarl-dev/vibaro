<?php

namespace Tests\Feature;

use App\Models\ArtistPage;
use App\Models\ClickEvent;
use App\Models\PageViewEvent;
use App\Models\Spotlight;
use App\Models\TrackingLink;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AnalyticsOverviewBreakdownTest extends TestCase
{
    use RefreshDatabase;

    public function test_overview_caps_conversion_and_omits_legacy_by_module_field(): void
    {
        [$user, $page] = $this->createUserWithArtistPage('overview-owner');
        $spotlight = $this->createSpotlight($page, 'Overview Spotlight');
        $link = $this->createTrackingLink($page, $spotlight, 'instagram', 'bio');

        // Two real clicks + one preview click (preview should be excluded).
        $this->createClick($page, $spotlight, $link, false, 'instagram', 'bio');
        $this->createClick($page, $spotlight, $link, false, 'instagram', 'bio');
        $this->createClick($page, $spotlight, $link, true, 'instagram', 'bio');

        // One unique real pageview -> raw ratio would be 2.0, must be capped to 1.0.
        PageViewEvent::create([
            'artist_page_id' => $page->id,
            'spotlight_id' => $spotlight->id,
            'referrer_host' => 'instagram.com',
            'country_code' => 'DE',
            'user_agent_hash' => hash('sha256', 'Mozilla/5.0 overview test'),
            'is_preview' => false,
            'occurred_at' => now()->subHour(),
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson("/api/v1/analytics/overview?range=7d&spotlight_id={$spotlight->id}");

        $response->assertOk();
        $response->assertJsonPath('data.total_clicks', 2);
        $response->assertJsonPath('data.unique_pageviews', 1);
        $this->assertEquals(1.0, $response->json('data.conversion_rate'));
        $response->assertJsonMissingPath('data.by_module');

        $data = $response->json('data');
        $this->assertIsArray($data['by_platform']);
        $this->assertIsArray($data['by_placement']);
        $this->assertIsArray($data['by_referrer']);
    }

    public function test_record_pageview_deduplicates_same_visitor_hash_per_day(): void
    {
        [, $page] = $this->createUserWithArtistPage('pv-dedupe-owner');

        $headers = [
            'User-Agent' => 'Mozilla/5.0 (Vibaro Test Browser)',
            'CF-IPCountry' => 'DE',
        ];

        $payload = [
            'handle' => $page->handle,
            'referrer' => 'https://instagram.com/some-profile',
        ];

        $this->postJson('/api/v1/analytics/pageview', $payload, $headers)
            ->assertNoContent();

        $this->assertDatabaseCount('page_view_events', 1);

        $this->postJson('/api/v1/analytics/pageview', $payload, $headers)
            ->assertNoContent();

        // Second hit on same day + same UA hash should be deduplicated.
        $this->assertDatabaseCount('page_view_events', 1);
    }

    public function test_record_pageview_does_not_merge_different_ip_buckets_with_same_ua(): void
    {
        [, $page] = $this->createUserWithArtistPage('pv-ip-bucket-owner');

        $headers = [
            'User-Agent' => 'Mozilla/5.0 (Vibaro Test Browser)',
            'Accept-Language' => 'de-DE,de;q=0.9',
        ];

        $payload = [
            'handle' => $page->handle,
            'referrer' => 'https://instagram.com/some-profile',
        ];

        $this->withServerVariables(['REMOTE_ADDR' => '198.51.100.10'])
            ->postJson('/api/v1/analytics/pageview', $payload, $headers)
            ->assertNoContent();

        $this->withServerVariables(['REMOTE_ADDR' => '203.0.113.25'])
            ->postJson('/api/v1/analytics/pageview', $payload, $headers)
            ->assertNoContent();

        $this->assertDatabaseCount('page_view_events', 2);
    }

    public function test_breakdown_groups_clicks_by_platform_and_placement_for_owner(): void
    {
        [$user, $page] = $this->createUserWithArtistPage('breakdown-owner');
        $spotlight = $this->createSpotlight($page, 'Breakdown Spotlight');

        $bio = $this->createTrackingLink($page, $spotlight, 'instagram', 'bio');
        $story = $this->createTrackingLink($page, $spotlight, 'instagram', 'story');

        // Current period (7d): bio=3, story=1
        $this->createClick($page, $spotlight, $bio, false, 'instagram', 'bio');
        $this->createClick($page, $spotlight, $bio, false, 'instagram', 'bio');
        $this->createClick($page, $spotlight, $bio, false, 'instagram', 'bio');
        $this->createClick($page, $spotlight, $story, false, 'instagram', 'story');
        // Preview click must be excluded from breakdown counts.
        $this->createClick($page, $spotlight, $story, true, 'instagram', 'story');

        Sanctum::actingAs($user);

        $response = $this->getJson("/api/v1/analytics/breakdown?spotlight_id={$spotlight->id}&period=7d");

        $response->assertOk();
        $response->assertJsonPath('data.total_clicks', 4);
        $response->assertJsonPath('data.period', '7d');
        $response->assertJsonPath('data.by_platform.0.platform', 'instagram');
        $response->assertJsonPath('data.by_platform.0.clicks', 4);

        $placements = collect($response->json('data.by_platform.0.placements'));
        $this->assertSame(3, $placements->firstWhere('placement', 'bio')['clicks']);
        $this->assertSame(1, $placements->firstWhere('placement', 'story')['clicks']);
    }

    public function test_breakdown_returns_not_found_for_foreign_spotlight(): void
    {
        [$owner, $ownerPage] = $this->createUserWithArtistPage('foreign-owner');
        [$other] = $this->createUserWithArtistPage('foreign-other');

        $spotlight = $this->createSpotlight($ownerPage, 'Owner Spotlight');

        Sanctum::actingAs($other);

        $this->getJson("/api/v1/analytics/breakdown?spotlight_id={$spotlight->id}&period=7d")
            ->assertStatus(404);
    }

    private function createUserWithArtistPage(string $handle): array
    {
        $user = User::factory()->create();

        $page = ArtistPage::create([
            'user_id' => $user->id,
            'handle' => $handle,
            'display_name' => ucfirst(str_replace('-', ' ', $handle)),
            'theme_key' => 'modern',
            'theme_variant' => 'auto',
            'accent_mode' => 'auto',
            'is_published' => true,
        ]);

        return [$user, $page];
    }

    private function createSpotlight(ArtistPage $page, string $title): Spotlight
    {
        return Spotlight::create([
            'artist_page_id' => $page->id,
            'title' => $title,
            'type' => 'single',
            'status' => 'active',
            'primary_url' => 'https://example.com/spotlight',
            'show_on_page' => true,
        ]);
    }

    private function createTrackingLink(ArtistPage $page, Spotlight $spotlight, string $platform, string $placement): TrackingLink
    {
        $suffix = substr(md5($platform . $placement . microtime(true)), 0, 8);

        return TrackingLink::create([
            'artist_page_id' => $page->id,
            'spotlight_id' => $spotlight->id,
            'platform' => $platform,
            'placement' => $placement,
            'module' => 'share',
            'target_url' => "https://example.com/{$platform}-{$placement}",
            'slug' => "{$platform}-{$placement}-{$suffix}",
            'short_code' => "{$platform}-{$placement}-{$suffix}",
            'is_active' => true,
        ]);
    }

    private function createClick(
        ArtistPage $page,
        Spotlight $spotlight,
        TrackingLink $link,
        bool $isPreview,
        string $platform,
        string $placement
    ): void {
        ClickEvent::create([
            'tracking_link_id' => $link->id,
            'artist_page_id' => $page->id,
            'spotlight_id' => $spotlight->id,
            'campaign_id' => $link->campaign_id,
            'module' => 'share',
            'platform' => $platform,
            'placement' => $placement,
            'referrer_host' => 'instagram.com',
            'country_code' => 'DE',
            'user_agent_hash' => hash('sha256', uniqid('ua-', true)),
            'is_preview' => $isPreview,
            'occurred_at' => now()->subHour(),
        ]);
    }
}
