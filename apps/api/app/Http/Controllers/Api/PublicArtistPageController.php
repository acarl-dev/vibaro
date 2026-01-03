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
            ->with(['links', 'shows', 'releases', 'featuredTracks'])
            ->first();

        if (!$page) {
            return $this->error('NOT_FOUND', 'Artist page not found or unpublished.', 404);
        }

        $appUrl = rtrim(config('app.url'), '/');

        // Transform links - only include links with URLs
        $links = $page->links
            ->filter(function ($link) {
                return !empty($link->url);
            })
            ->map(function ($link) {
                return [
                    'type' => $link->type,
                    'title' => $link->title,
                    'url' => $link->url,
                ];
            })
            ->values()
            ->toArray();

        return $this->success([
            'handle' => $page->handle,
            'display_name' => $page->display_name,
            'bio' => $page->bio,
            'images' => [
                'avatar_url' => $page->avatar_path ? $appUrl . Storage::url($page->avatar_path) : null,
                'hero_image_url' => $page->header_path ? $appUrl . Storage::url($page->header_path) : null,
            ],
            'focus' => [
                'type' => 'links', // MVP: Free plan always shows links
                'limit' => 3,
            ],
            'links' => $links,
            'shows' => $page->shows->map(function ($show) {
                return [
                    'title' => $show->venue . ' - ' . $show->city,
                    'venue' => $show->venue,
                    'date' => $show->starts_at->toIso8601String(),
                    'url' => $show->ticket_url,
                ];
            })->toArray(),
            'releases' => $page->releases->map(function ($release) use ($appUrl) {
                return [
                    'title' => $release->title,
                    'cover_url' => $release->cover_path ? $appUrl . Storage::url($release->cover_path) : null,
                    'url' => $release->url,
                    'release_date' => $release->release_date->toDateString(),
                ];
            })->toArray(),
            'featured_tracks' => $page->featuredTracks->map(function ($track) {
                return [
                    'title' => $track->title,
                    'artist_name' => $track->artist_name,
                    'platform' => $track->platform,
                    'platform_url' => $track->platform_url,
                    'embed_id' => $track->embed_id,
                ];
            })->toArray(),
            'videos' => $page->videos->map(function ($video) {
                return [
                    'title' => $video->title,
                    'platform' => $video->platform,
                    'video_id' => $video->video_id,
                    'url' => $video->url,
                    'description' => $video->description,
                    'thumbnail_url' => $video->thumbnail_url,
                ];
            })->toArray(),
            'theme' => [
                'key' => $page->theme_key,
                'variant' => $page->theme_variant,
                'accent_color' => $page->accent_mode === 'manual' ? $page->accent_color : null,
            ],
        ]);
    }
}
