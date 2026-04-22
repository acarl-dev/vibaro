<?php

namespace Tests\Feature;

use App\Models\ArtistPage;
use App\Models\Spotlight;
use App\Models\TrackingLink;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SpotlightLifecycleTest extends TestCase
{
    use RefreshDatabase;

    public function test_activate_switches_active_spotlight_and_ends_previous_one(): void
    {
        [$user, $page] = $this->createUserWithArtistPage();

        $currentlyActive = Spotlight::create([
            'artist_page_id' => $page->id,
            'title' => 'Current Live',
            'type' => 'single',
            'status' => 'active',
            'primary_url' => 'https://example.com/current',
            'show_on_page' => true,
        ]);

        $scheduled = Spotlight::create([
            'artist_page_id' => $page->id,
            'title' => 'Next Release',
            'type' => 'single',
            'status' => 'scheduled',
            'primary_url' => 'https://example.com/next',
            'show_on_page' => true,
        ]);

        Sanctum::actingAs($user);

        $response = $this->postJson("/api/v1/spotlights/{$scheduled->id}/activate");

        $response->assertOk();
        $response->assertJsonPath('data.active_spotlight_id', $scheduled->id);

        $currentlyActive->refresh();
        $scheduled->refresh();

        $this->assertSame('ended', $currentlyActive->status);
        $this->assertSame('active', $scheduled->status);
    }

    public function test_end_sets_status_and_archives_active_tracking_links(): void
    {
        [$user, $page] = $this->createUserWithArtistPage();

        $spotlight = Spotlight::create([
            'artist_page_id' => $page->id,
            'title' => 'Tour Run',
            'type' => 'tour',
            'status' => 'active',
            'primary_url' => 'https://example.com/tour',
            'show_on_page' => true,
        ]);

        $activeLink = TrackingLink::create([
            'artist_page_id' => $page->id,
            'spotlight_id' => $spotlight->id,
            'platform' => 'instagram',
            'placement' => 'bio',
            'module' => 'share',
            'target_url' => 'https://example.com/listen',
            'slug' => 'ig-bio-tour',
            'short_code' => 'ig-bio-tour',
            'is_active' => true,
        ]);

        Sanctum::actingAs($user);

        $response = $this->postJson("/api/v1/spotlights/{$spotlight->id}/end");

        $response->assertOk();
        $response->assertJsonPath('data.ended_spotlight_id', $spotlight->id);

        $spotlight->refresh();
        $activeLink->refresh();

        $this->assertSame('ended', $spotlight->status);
        $this->assertFalse((bool) $spotlight->show_on_page);
        $this->assertNotNull($spotlight->ends_at);
        $this->assertNotNull($activeLink->archived_at);
    }

    public function test_archive_and_restore_change_spotlight_visibility_in_index(): void
    {
        [$user, $page] = $this->createUserWithArtistPage();

        $spotlight = Spotlight::create([
            'artist_page_id' => $page->id,
            'title' => 'Archive Me',
            'type' => 'single',
            'status' => 'scheduled',
            'primary_url' => 'https://example.com/archive-me',
            'show_on_page' => true,
        ]);

        Sanctum::actingAs($user);

        $this->postJson("/api/v1/spotlights/{$spotlight->id}/archive")
            ->assertOk()
            ->assertJsonPath('data.ok', true);

        $this->getJson('/api/v1/spotlights')
            ->assertOk()
            ->assertJsonMissing(['id' => $spotlight->id]);

        $this->getJson('/api/v1/spotlights?archived=1')
            ->assertOk()
            ->assertJsonFragment(['id' => $spotlight->id]);

        $this->postJson("/api/v1/spotlights/{$spotlight->id}/restore")
            ->assertOk()
            ->assertJsonPath('data.id', $spotlight->id);

        $this->getJson('/api/v1/spotlights')
            ->assertOk()
            ->assertJsonFragment(['id' => $spotlight->id]);
    }

    public function test_other_user_cannot_activate_foreign_spotlight(): void
    {
        [, $ownerPage] = $this->createUserWithArtistPage('owner-page');
        [$otherUser] = $this->createUserWithArtistPage('other-page');

        $foreignSpotlight = Spotlight::create([
            'artist_page_id' => $ownerPage->id,
            'title' => 'Foreign Spotlight',
            'type' => 'single',
            'status' => 'scheduled',
            'primary_url' => 'https://example.com/foreign',
            'show_on_page' => true,
        ]);

        Sanctum::actingAs($otherUser);

        $this->postJson("/api/v1/spotlights/{$foreignSpotlight->id}/activate")
            ->assertStatus(403);
    }

    private function createUserWithArtistPage(string $handle = 'artist'): array
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
}
