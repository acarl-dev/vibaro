<?php

namespace Tests\Feature;

use App\Models\ArtistPage;
use App\Services\ImageProcessingService;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Mockery;
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

    public function test_generic_update_ignores_avatar_path_changes(): void
    {
        $user = User::factory()->create();

        $page = ArtistPage::create([
            'user_id' => $user->id,
            'handle' => 'asset-owner',
            'display_name' => 'Asset Owner',
            'bio' => null,
            'theme_key' => 'modern',
            'theme_variant' => 'auto',
            'accent_mode' => 'auto',
            'accent_color' => null,
            'is_published' => false,
        ]);
        $page->avatar_path = 'avatars/' . $user->id . '/old.webp';
        $page->save();

        $this->actingAs($user, 'sanctum');

        $this->patchJson("/api/v1/artist-pages/{$page->id}", [
            'display_name' => 'Renamed',
            'avatar_path' => 'avatars/999/foreign.webp',
        ])->assertOk();

        $page->refresh();

        $this->assertSame('Renamed', $page->display_name);
        $this->assertSame('avatars/' . $user->id . '/old.webp', $page->avatar_path);
    }

    public function test_upload_avatar_does_not_delete_foreign_prefixed_path(): void
    {
        Storage::fake('public');

        $owner = User::factory()->create();
        $victim = User::factory()->create();

        ArtistPage::create([
            'user_id' => $victim->id,
            'handle' => 'victim-page',
            'display_name' => 'Victim',
            'theme_key' => 'modern',
            'theme_variant' => 'auto',
            'accent_mode' => 'auto',
            'is_published' => true,
        ]);

        $page = ArtistPage::create([
            'user_id' => $owner->id,
            'handle' => 'owner-page',
            'display_name' => 'Owner',
            'theme_key' => 'modern',
            'theme_variant' => 'auto',
            'accent_mode' => 'auto',
            'is_published' => true,
        ]);
        $page->avatar_path = 'avatars/999/foreign.webp';
        $page->save();

        Storage::disk('public')->put('avatars/999/foreign.webp', 'victim-content');

        $mock = Mockery::mock(ImageProcessingService::class);
        $mock->shouldReceive('process')
            ->once()
            ->andReturn([
                'path' => 'avatars/' . $page->id . '/new-avatar.webp',
                'contents' => 'new-avatar-content',
            ]);
        $this->app->instance(ImageProcessingService::class, $mock);

        $this->actingAs($owner, 'sanctum');

        $this->postJson('/api/v1/artist-pages/upload-avatar', [
            'avatar' => UploadedFile::fake()->image('avatar.jpg'),
        ])->assertOk();

        $this->assertTrue(Storage::disk('public')->exists('avatars/999/foreign.webp'));
        $this->assertTrue(Storage::disk('public')->exists('avatars/' . $page->id . '/new-avatar.webp'));

        $page->refresh();
        $this->assertSame('avatars/' . $page->id . '/new-avatar.webp', $page->avatar_path);
    }

    public function test_delete_avatar_does_not_delete_foreign_prefixed_path(): void
    {
        Storage::fake('public');

        $owner = User::factory()->create();

        $page = ArtistPage::create([
            'user_id' => $owner->id,
            'handle' => 'delete-owner',
            'display_name' => 'Delete Owner',
            'theme_key' => 'modern',
            'theme_variant' => 'auto',
            'accent_mode' => 'auto',
            'is_published' => true,
        ]);
        $page->avatar_path = 'avatars/999/foreign.webp';
        $page->save();

        Storage::disk('public')->put('avatars/999/foreign.webp', 'victim-content');

        $this->actingAs($owner, 'sanctum');

        $this->deleteJson('/api/v1/artist-pages/delete-avatar')
            ->assertOk();

        $this->assertTrue(Storage::disk('public')->exists('avatars/999/foreign.webp'));
        $page->refresh();
        $this->assertNull($page->avatar_path);
    }
}
