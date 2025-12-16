<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\ArtistPage;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class PublicArtistPageController extends Controller
{
    use ApiResponse;

    public function show(string $handle): JsonResponse
    {
        $page = ArtistPage::where('handle', $handle)
            ->where('is_published', true)
            ->first();

        if (!$page) {
            return $this->error('NOT_FOUND', 'Artist page not found or unpublished.', 404);
        }

        return $this->success([
            'handle' => $page->handle,
            'display_name' => $page->display_name,
            'bio' => $page->bio,
            'images' => [
                'avatar_url' => $page->avatar_path ? Storage::url($page->avatar_path) : null,
                'hero_image_url' => $page->header_path ? Storage::url($page->header_path) : null,
            ],
            'focus' => [
                'type' => 'links', // MVP: Free plan always shows links
                'limit' => 3,
            ],
            'links' => [],
            'shows' => [],
            'releases' => [],
            'theme' => [
                'key' => $page->theme_key,
                'variant' => $page->theme_variant,
                'accent_color' => $page->accent_mode === 'manual' ? $page->accent_color : null,
            ],
        ]);
    }
}
