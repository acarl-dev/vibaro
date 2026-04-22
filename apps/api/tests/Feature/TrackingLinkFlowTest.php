<?php

namespace Tests\Feature;

use App\Models\ArtistPage;
use App\Models\Spotlight;
use App\Models\TrackingLink;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TrackingLinkFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_creates_tracking_link_with_generated_fields(): void
    {
        [$user, $page] = $this->createUserWithArtistPage('tracking-owner');
        $spotlight = $this->createSpotlight($page, 'Downfall Launch');

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/v1/tracking-links', [
            'spotlight_id' => $spotlight->id,
            'platform' => 'instagram',
            'placement' => 'bio',
            'target_url' => 'https://open.spotify.com/track/test',
        ]);

        $response->assertCreated();
        $response->assertJsonPath('data.platform', 'instagram');
        $response->assertJsonPath('data.placement', 'bio');
        $response->assertJsonPath('data.utm_source', 'instagram');
        $response->assertJsonPath('data.utm_medium', 'bio');

        $linkId = $response->json('data.id');
        $trackingUrl = $response->json('data.tracking_url');

        $this->assertNotNull($linkId);
        $this->assertIsString($trackingUrl);
        $this->assertStringContainsString('/t/', $trackingUrl);

        $this->assertDatabaseHas('tracking_links', [
            'id' => $linkId,
            'artist_page_id' => $page->id,
            'spotlight_id' => $spotlight->id,
            'platform' => 'instagram',
            'placement' => 'bio',
            'module' => 'share',
        ]);

        $this->assertDatabaseHas('campaigns', [
            'artist_page_id' => $page->id,
            'spotlight_id' => $spotlight->id,
            'platform' => 'instagram',
        ]);
    }

    public function test_store_rejects_duplicate_active_platform_placement_per_spotlight(): void
    {
        [$user, $page] = $this->createUserWithArtistPage('dup-owner');
        $spotlight = $this->createSpotlight($page, 'Duplicate Test');

        Sanctum::actingAs($user);

        $payload = [
            'spotlight_id' => $spotlight->id,
            'platform' => 'instagram',
            'placement' => 'story',
            'target_url' => 'https://example.com/one',
        ];

        $this->postJson('/api/v1/tracking-links', $payload)->assertCreated();

        $this->postJson('/api/v1/tracking-links', [
            ...$payload,
            'target_url' => 'https://example.com/two',
        ])
            ->assertStatus(409)
            ->assertJsonPath('error.code', 'DUPLICATE_LINK');
    }

    public function test_check_reflects_archive_state(): void
    {
        [$user, $page] = $this->createUserWithArtistPage('check-owner');
        $spotlight = $this->createSpotlight($page, 'Check State');

        Sanctum::actingAs($user);

        $create = $this->postJson('/api/v1/tracking-links', [
            'spotlight_id' => $spotlight->id,
            'platform' => 'tiktok',
            'placement' => 'bio',
            'target_url' => 'https://example.com/video',
        ])->assertCreated();

        $linkId = $create->json('data.id');

        $this->getJson("/api/v1/tracking-links/check?spotlight_id={$spotlight->id}&platform=tiktok&placement=bio")
            ->assertOk()
            ->assertJsonPath('data.exists', true)
            ->assertJsonPath('data.link.id', $linkId);

        $this->patchJson("/api/v1/tracking-links/{$linkId}/archive")
            ->assertOk()
            ->assertJsonPath('data.id', $linkId);

        $this->getJson("/api/v1/tracking-links/check?spotlight_id={$spotlight->id}&platform=tiktok&placement=bio")
            ->assertOk()
            ->assertJsonPath('data.exists', false)
            ->assertJsonPath('data.link', null);
    }

    public function test_other_user_cannot_delete_foreign_tracking_link(): void
    {
        [$owner, $ownerPage] = $this->createUserWithArtistPage('link-owner');
        [$other] = $this->createUserWithArtistPage('link-other');

        $spotlight = $this->createSpotlight($ownerPage, 'Owner Spotlight');

        Sanctum::actingAs($owner);
        $create = $this->postJson('/api/v1/tracking-links', [
            'spotlight_id' => $spotlight->id,
            'platform' => 'facebook',
            'placement' => 'feed',
            'target_url' => 'https://example.com/fb',
        ])->assertCreated();

        $linkId = $create->json('data.id');

        Sanctum::actingAs($other);

        $this->deleteJson("/api/v1/tracking-links/{$linkId}")
            ->assertStatus(403);
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
}
