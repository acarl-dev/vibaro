<?php

namespace Tests\Feature;

use App\Models\ArtistPage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicArtistPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_endpoint_matches_contract(): void
    {
        $user = User::factory()->create();

        $page = ArtistPage::create([
            'user_id' => $user->id,
            'handle' => 'emily-j',
            'display_name' => 'Emily J.',
            'bio' => 'Berlin artist',
            'theme_key' => 'dark-editorial',
            'theme_variant' => 'auto',
            'accent_mode' => 'auto',
            'accent_color' => '#123456',
            'is_published' => true,
        ]);

        $response = $this->getJson("/api/v1/p/{$page->handle}");

        $response->assertStatus(200);

        $response->assertJson([
            'data' => [
                'handle' => 'emily-j',
                'display_name' => 'Emily J.',
                'bio' => 'Berlin artist',
                'images' => [
                    'avatar_url' => null,
                    'hero_image_url' => null,
                ],
                'focus' => [
                    'type' => 'links',
                    'limit' => 3,
                ],
                'links' => [],
                'shows' => [],
                'releases' => [],
                'theme' => [
                    'key' => 'dark-editorial',
                    'variant' => 'auto',
                    'accent_color' => null,
                ],
            ],
        ]);

        $theme = $response->json('data.theme');
        $this->assertIsArray($theme);
        $this->assertArrayNotHasKey('accent_mode', $theme);
        $this->assertNull($theme['accent_color']);
    }
}
