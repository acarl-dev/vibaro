<?php

namespace Tests\Feature;

use App\Models\ArtistPage;
use App\Models\Spotlight;
use App\Models\TrackingLink;
use App\Models\User;
use Illuminate\Database\QueryException;
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

        $currentLink = TrackingLink::create([
            'artist_page_id' => $page->id,
            'spotlight_id' => $currentlyActive->id,
            'platform' => 'instagram',
            'placement' => 'story',
            'module' => 'share',
            'target_url' => 'https://example.com/current-link',
            'slug' => 'current-story-link',
            'short_code' => 'current-story-link',
            'is_active' => true,
        ]);

        Sanctum::actingAs($user);

        $response = $this->postJson("/api/v1/spotlights/{$scheduled->id}/activate");

        $response->assertOk();
        $response->assertJsonPath('data.active_spotlight_id', $scheduled->id);

        $currentlyActive->refresh();
        $scheduled->refresh();
        $currentLink->refresh();

        $this->assertSame('ended', $currentlyActive->status);
        $this->assertFalse((bool) $currentlyActive->show_on_page);
        $this->assertNotNull($currentlyActive->ends_at);
        $this->assertNotNull($currentLink->archived_at);
        $this->assertSame('active', $scheduled->status);
    }

    public function test_store_with_activate_true_uses_full_lifecycle_rules(): void
    {
        [$user, $page] = $this->createUserWithArtistPage('store-activate-owner');

        $currentlyActive = Spotlight::create([
            'artist_page_id' => $page->id,
            'title' => 'Current Active',
            'type' => 'single',
            'status' => 'active',
            'primary_url' => 'https://example.com/current-active',
            'show_on_page' => true,
        ]);

        $currentLink = TrackingLink::create([
            'artist_page_id' => $page->id,
            'spotlight_id' => $currentlyActive->id,
            'platform' => 'instagram',
            'placement' => 'bio',
            'module' => 'share',
            'target_url' => 'https://example.com/current-bio',
            'slug' => 'current-bio-link',
            'short_code' => 'current-bio-link',
            'is_active' => true,
        ]);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/v1/spotlights', [
            'title' => 'Created Active Spotlight',
            'type' => 'single',
            'primary_url' => 'https://example.com/created-active',
            'show_on_page' => true,
            'activate' => true,
        ]);

        $response->assertCreated();
        $newSpotlightId = $response->json('data.id');

        $currentlyActive->refresh();
        $currentLink->refresh();
        $newSpotlight = Spotlight::findOrFail($newSpotlightId);

        $this->assertSame('ended', $currentlyActive->status);
        $this->assertFalse((bool) $currentlyActive->show_on_page);
        $this->assertNotNull($currentlyActive->ends_at);
        $this->assertNotNull($currentLink->archived_at);
        $this->assertSame('active', $newSpotlight->status);
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

    public function test_cannot_activate_archived_spotlight(): void
    {
        [$user, $page] = $this->createUserWithArtistPage('archived-activate-owner');

        $spotlight = Spotlight::create([
            'artist_page_id' => $page->id,
            'title' => 'Archived Spotlight',
            'type' => 'single',
            'status' => 'scheduled',
            'primary_url' => 'https://example.com/archived',
            'show_on_page' => true,
            'archived_at' => now(),
        ]);

        Sanctum::actingAs($user);

        $this->postJson("/api/v1/spotlights/{$spotlight->id}/activate")
            ->assertStatus(400)
            ->assertJsonPath('error.code', 'SPOTLIGHT_ARCHIVED');
    }

    public function test_database_constraint_prevents_two_active_spotlights_per_artist_page(): void
    {
        [, $page] = $this->createUserWithArtistPage('db-constraint-owner');

        Spotlight::create([
            'artist_page_id' => $page->id,
            'title' => 'Active One',
            'type' => 'single',
            'status' => 'active',
            'primary_url' => 'https://example.com/active-one',
            'show_on_page' => true,
        ]);

        $this->expectException(QueryException::class);

        Spotlight::create([
            'artist_page_id' => $page->id,
            'title' => 'Active Two',
            'type' => 'single',
            'status' => 'active',
            'primary_url' => 'https://example.com/active-two',
            'show_on_page' => true,
        ]);
    }

    public function test_archive_normalizes_active_spotlight_state(): void
    {
        [$user, $page] = $this->createUserWithArtistPage('archive-active-owner');

        $spotlight = Spotlight::create([
            'artist_page_id' => $page->id,
            'title' => 'Archive Active',
            'type' => 'single',
            'status' => 'active',
            'primary_url' => 'https://example.com/archive-active',
            'show_on_page' => true,
        ]);

        Sanctum::actingAs($user);

        $this->postJson("/api/v1/spotlights/{$spotlight->id}/archive")
            ->assertOk()
            ->assertJsonPath('data.ok', true);

        $spotlight->refresh();

        $this->assertSame('ended', $spotlight->status);
        $this->assertFalse((bool) $spotlight->show_on_page);
        $this->assertNotNull($spotlight->archived_at);
        $this->assertNotNull($spotlight->ends_at);
    }

    public function test_archived_active_spotlight_does_not_block_new_active_spotlight(): void
    {
        [, $page] = $this->createUserWithArtistPage('archived-active-cleanup-owner');

        Spotlight::create([
            'artist_page_id' => $page->id,
            'title' => 'Archived Former Active',
            'type' => 'single',
            'status' => 'ended',
            'primary_url' => 'https://example.com/archived-former-active',
            'show_on_page' => false,
            'archived_at' => now(),
            'ends_at' => now(),
        ]);

        $newActive = Spotlight::create([
            'artist_page_id' => $page->id,
            'title' => 'Fresh Active',
            'type' => 'single',
            'status' => 'active',
            'primary_url' => 'https://example.com/fresh-active',
            'show_on_page' => true,
        ]);

        $this->assertSame('active', $newActive->status);
        $this->assertNull($newActive->archived_at);
    }

    public function test_model_archive_helper_normalizes_active_spotlight_state(): void
    {
        [, $page] = $this->createUserWithArtistPage('model-archive-owner');

        $spotlight = Spotlight::create([
            'artist_page_id' => $page->id,
            'title' => 'Model Archive Active',
            'type' => 'single',
            'status' => 'active',
            'primary_url' => 'https://example.com/model-archive-active',
            'show_on_page' => true,
        ]);

        $spotlight->archive();
        $spotlight->refresh();

        $this->assertSame('ended', $spotlight->status);
        $this->assertFalse((bool) $spotlight->show_on_page);
        $this->assertNotNull($spotlight->archived_at);
        $this->assertNotNull($spotlight->ends_at);
    }

    public function test_store_accepts_nullable_primary_url_for_focus_spotlight(): void
    {
        [$user] = $this->createUserWithArtistPage('nullable-primary-owner');

        Sanctum::actingAs($user);

        $this->postJson('/api/v1/spotlights', [
            'title' => 'Studio Focus Week',
            'type' => 'focus',
            'primary_url' => null,
            'show_on_page' => true,
        ])
            ->assertCreated()
            ->assertJsonPath('data.primary_url', null);
    }

    public function test_store_rejects_javascript_primary_url(): void
    {
        [$user] = $this->createUserWithArtistPage('unsafe-primary-owner');

        Sanctum::actingAs($user);

        $this->postJson('/api/v1/spotlights', [
            'title' => 'Unsafe Spotlight',
            'type' => 'single',
            'primary_url' => 'javascript:alert(1)',
            'show_on_page' => true,
        ])->assertStatus(422);
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
