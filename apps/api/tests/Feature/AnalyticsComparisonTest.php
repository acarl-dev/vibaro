<?php

namespace Tests\Feature;

use App\Models\ArtistPage;
use App\Models\Spotlight;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AnalyticsComparisonTest extends TestCase
{
    use RefreshDatabase;

    /**
     * comparison() must select the most-recently-ended spotlight as "previous"
     * when there is an active spotlight. The sort key is ends_at (not ended_at).
     */
    public function test_comparison_selects_most_recent_ended_as_previous(): void
    {
        $user = User::factory()->create();
        $page = ArtistPage::create([
            'user_id'       => $user->id,
            'handle'        => 'test-artist',
            'display_name'  => 'Test Artist',
            'theme_key'     => 'modern',
            'theme_variant' => 'auto',
            'accent_mode'   => 'auto',
            'is_published'  => true,
        ]);

        // Older ended spotlight
        $older = Spotlight::create([
            'artist_page_id' => $page->id,
            'title'          => 'Older Phase',
            'type'           => 'single',
            'status'         => 'ended',
            'starts_at'      => now()->subDays(60),
            'ends_at'        => now()->subDays(31),
        ]);

        // More recently ended spotlight
        $recent = Spotlight::create([
            'artist_page_id' => $page->id,
            'title'          => 'Recent Phase',
            'type'           => 'single',
            'status'         => 'ended',
            'starts_at'      => now()->subDays(30),
            'ends_at'        => now()->subDays(1),
        ]);

        // Active spotlight (current)
        $active = Spotlight::create([
            'artist_page_id' => $page->id,
            'title'          => 'Active Phase',
            'type'           => 'single',
            'status'         => 'active',
            'starts_at'      => now(),
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/v1/analytics/comparison');

        $response->assertOk();

        $data = $response->json('data');

        // Current must be the active spotlight
        $this->assertEquals($active->id, $data['current']['id']);

        // Previous must be the most recently ended — not the older one
        $this->assertNotNull($data['previous']);
        $this->assertEquals($recent->id, $data['previous']['id'],
            'comparison() should return the most recently ended spotlight as previous, sorted by ends_at desc'
        );
    }

    /**
     * When no active spotlight exists, comparison() must order the two
     * ended spotlights by ends_at desc and assign current = latest, previous = second.
     */
    public function test_comparison_with_no_active_spotlight_orders_by_ends_at(): void
    {
        $user = User::factory()->create();
        $page = ArtistPage::create([
            'user_id'       => $user->id,
            'handle'        => 'test-artist-2',
            'display_name'  => 'Test Artist 2',
            'theme_key'     => 'modern',
            'theme_variant' => 'auto',
            'accent_mode'   => 'auto',
            'is_published'  => true,
        ]);

        $older = Spotlight::create([
            'artist_page_id' => $page->id,
            'title'          => 'Older Phase',
            'type'           => 'single',
            'status'         => 'ended',
            'starts_at'      => now()->subDays(60),
            'ends_at'        => now()->subDays(31),
        ]);

        $newer = Spotlight::create([
            'artist_page_id' => $page->id,
            'title'          => 'Newer Phase',
            'type'           => 'single',
            'status'         => 'ended',
            'starts_at'      => now()->subDays(30),
            'ends_at'        => now()->subDays(1),
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/v1/analytics/comparison');

        $response->assertOk();

        $data = $response->json('data');

        $this->assertEquals($newer->id, $data['current']['id'],
            'current should be the most recently ended spotlight'
        );
        $this->assertEquals($older->id, $data['previous']['id'],
            'previous should be the second-most recently ended spotlight'
        );
    }
}
