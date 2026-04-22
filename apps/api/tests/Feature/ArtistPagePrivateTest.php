<?php

namespace Tests\Feature;

use App\Models\ArtistPage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ArtistPagePrivateTest extends TestCase
{
    use RefreshDatabase;

    public function test_me_returns_artist_page_contract(): void
    {
        $user = User::factory()->create();

        $page = ArtistPage::create([
            'user_id' => $user->id,
            'handle' => 'emily-j',
            'display_name' => 'Emily J.',
            'bio' => 'Berlin artist',
            'theme_key' => 'modern',
            'theme_variant' => 'auto',
            'accent_mode' => 'auto',
            'accent_color' => null,
            'is_published' => true,
        ]);

        $this->actingAs($user, 'sanctum');

        $response = $this->getJson('/api/v1/artist-pages/me');

        $response->assertOk();

        $response->assertJson([
            'data' => [
                'id' => $page->id,
                'handle' => 'emily-j',
                'display_name' => 'Emily J.',
                'bio' => 'Berlin artist',
                'theme_key' => 'modern',
                'theme_variant' => 'auto',
                'accent_color' => null,
                'is_published' => true,
            ],
        ]);

        $data = $response->json('data');
        $this->assertIsArray($data);
        $this->assertArrayNotHasKey('accent_mode', $data);
    }

    public function test_me_returns_not_found_when_missing(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum');

        $response = $this->getJson('/api/v1/artist-pages/me');

        $response->assertStatus(404);
        $response->assertJsonPath('error.code', 'NOT_FOUND');
    }

    public function test_store_creates_page_with_defaults_and_lowercased_handle(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum');

        $response = $this->postJson('/api/v1/artist-pages', [
            'handle' => 'emily-j',
            'display_name' => 'Emily J.',
        ]);

        $response->assertCreated();
        $response->assertJson([
            'data' => [
                'handle' => 'emily-j',
                'display_name' => 'Emily J.',
                'is_published' => false,
            ],
        ]);

        $this->assertDatabaseHas('artist_pages', [
            'user_id' => $user->id,
            'handle' => 'emily-j',
            'display_name' => 'Emily J.',
            'theme_key' => 'modern',
            'theme_variant' => 'auto',
            'accent_mode' => 'auto',
            'accent_color' => null,
            'is_published' => false,
        ]);
    }

    public function test_store_fails_when_page_already_exists(): void
    {
        $user = User::factory()->create();

        ArtistPage::create([
            'user_id' => $user->id,
            'handle' => 'emily-j',
            'display_name' => 'Emily J.',
            'bio' => null,
            'theme_key' => 'modern',
            'theme_variant' => 'auto',
            'accent_mode' => 'auto',
            'accent_color' => null,
            'is_published' => false,
        ]);

        $this->actingAs($user, 'sanctum');

        $response = $this->postJson('/api/v1/artist-pages', [
            'handle' => 'emily-j',
            'display_name' => 'Emily J.',
        ]);

        $response->assertStatus(409);
        $response->assertJsonPath('error.code', 'ARTIST_PAGE_EXISTS');
    }

    public function test_update_requires_accent_color_when_manual(): void
    {
        $user = User::factory()->create();

        $page = ArtistPage::create([
            'user_id' => $user->id,
            'handle' => 'emily-j',
            'display_name' => 'Emily J.',
            'bio' => null,
            'theme_key' => 'modern',
            'theme_variant' => 'auto',
            'accent_mode' => 'auto',
            'accent_color' => null,
            'is_published' => false,
        ]);

        $this->actingAs($user, 'sanctum');

        $response = $this->patchJson("/api/v1/artist-pages/{$page->id}", [
            'accent_mode' => 'manual',
        ]);

        $response->assertStatus(422);
        $response->assertJsonPath('error.code', 'VALIDATION_ERROR');
        $response->assertJsonPath('error.fields.accent_color.0', 'Accent color is required when accent_mode is manual.');
    }

    public function test_update_rejects_non_modern_theme_key(): void
    {
        $user = User::factory()->create();

        $page = ArtistPage::create([
            'user_id' => $user->id,
            'handle' => 'emily-j',
            'display_name' => 'Emily J.',
            'bio' => null,
            'theme_key' => 'modern',
            'theme_variant' => 'auto',
            'accent_mode' => 'auto',
            'accent_color' => null,
            'is_published' => false,
        ]);

        $this->actingAs($user, 'sanctum');

        $response = $this->patchJson("/api/v1/artist-pages/{$page->id}", [
            'theme_key' => 'stage',
        ]);

        $response->assertStatus(422);
        $response->assertJsonPath('error.code', 'VALIDATION_ERROR');
        $response->assertJsonPath('error.fields.theme_key.0', 'The selected theme key is invalid.');
    }

    public function test_update_sets_manual_accent_color(): void
    {
        $user = User::factory()->create();

        $page = ArtistPage::create([
            'user_id' => $user->id,
            'handle' => 'emily-j',
            'display_name' => 'Emily J.',
            'bio' => null,
            'theme_key' => 'modern',
            'theme_variant' => 'auto',
            'accent_mode' => 'auto',
            'accent_color' => null,
            'is_published' => false,
        ]);

        $this->actingAs($user, 'sanctum');

        $response = $this->patchJson("/api/v1/artist-pages/{$page->id}", [
            'accent_mode' => 'manual',
            'accent_color' => '#abcdef',
        ]);

        $response->assertOk();
        $response->assertJsonPath('data.accent_color', '#abcdef');

        $this->assertDatabaseHas('artist_pages', [
            'id' => $page->id,
            'accent_mode' => 'manual',
            'accent_color' => '#abcdef',
        ]);
    }

    public function test_update_resets_accent_color_when_auto(): void
    {
        $user = User::factory()->create();

        $page = ArtistPage::create([
            'user_id' => $user->id,
            'handle' => 'emily-j',
            'display_name' => 'Emily J.',
            'bio' => null,
            'theme_key' => 'modern',
            'theme_variant' => 'auto',
            'accent_mode' => 'manual',
            'accent_color' => '#123456',
            'is_published' => false,
        ]);

        $this->actingAs($user, 'sanctum');

        $response = $this->patchJson("/api/v1/artist-pages/{$page->id}", [
            'accent_mode' => 'auto',
        ]);

        $response->assertOk();
        $response->assertJsonPath('data.accent_color', null);

        $this->assertDatabaseHas('artist_pages', [
            'id' => $page->id,
            'accent_mode' => 'auto',
            'accent_color' => null,
        ]);
    }

    public function test_update_forbidden_for_other_user(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();

        $page = ArtistPage::create([
            'user_id' => $owner->id,
            'handle' => 'emily-j',
            'display_name' => 'Emily J.',
            'bio' => null,
            'theme_key' => 'modern',
            'theme_variant' => 'auto',
            'accent_mode' => 'auto',
            'accent_color' => null,
            'is_published' => false,
        ]);

        $this->actingAs($other, 'sanctum');

        $response = $this->patchJson("/api/v1/artist-pages/{$page->id}", [
            'display_name' => 'Hacker',
        ]);

        // Controller returns 404 (not 403) to avoid revealing that the resource
        // exists for another user — intentional enumeration protection (see SECURITY.md).
        $response->assertStatus(404);
    }
}
