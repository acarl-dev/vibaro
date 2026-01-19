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
        $query = ArtistPage::where('handle', $handle);

        // If user is authenticated, check if they own this page
        $user = auth('sanctum')->user();
        $isOwner = false;

        if ($user) {
            $artistPage = ArtistPage::where('handle', $handle)->first();
            $isOwner = $artistPage && $artistPage->user_id === $user->id;
        }

        // If not owner, only show published pages
        if (!$isOwner) {
            $query->where('is_published', true);
        }

        $page = $query->with(['links', 'shows', 'releases', 'featuredTracks', 'videos', 'galleryImages'])
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
            'is_published' => $page->is_published,
            'images' => [
                'avatar_url' => $page->avatar_path ? $appUrl . Storage::url($page->avatar_path) : null,
                'hero_image_url' => $page->header_path ? $appUrl . Storage::url($page->header_path) : null,
            ],
            'focus' => [
                'type' => 'links', // MVP: Free plan always shows links
                'limit' => 3,
            ],
            'links' => $links,
            'shows' => $page->shows->map(function ($show) use ($appUrl) {
                return [
                    'title' => $show->venue . ' - ' . $show->city,
                    'venue' => $show->venue,
                    'city' => $show->city,
                    'address' => $show->address,
                    'date' => $show->starts_at->toIso8601String(),
                    'time' => $show->starts_at->format('H:i'),
                    'price' => $show->price,
                    'is_free' => $show->is_free,
                    'support_acts' => $show->support_acts ?? [],
                    'url' => $show->ticket_url,
                    'flyer_url' => $show->flyer_path ? $appUrl . Storage::url($show->flyer_path) : null,
                ];
            })->toArray(),
            'releases' => $page->releases->map(function ($release) use ($appUrl) {
                return [
                    'title' => $release->title,
                    'cover_url' => $release->cover_path ? $appUrl . Storage::url($release->cover_path) : null,
                    'url' => $release->url,
                    'release_date' => $release->release_date?->toDateString(),
                    'is_featured' => $release->is_featured,
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
            'gallery_images' => $page->galleryImages->map(function ($image) use ($appUrl) {
                return [
                    'title' => $image->title,
                    'image_url' => $appUrl . Storage::url($image->image_path),
                ];
            })->toArray(),
            'booking_email' => $page->booking_email,
            'management_email' => $page->management_email,
            'press_email' => $page->press_email,
            'whatsapp_number' => $page->whatsapp_number,
            'theme' => [
                'key' => $page->theme_key,
                'variant' => $page->theme_variant,
                'accent_color' => $page->accent_mode === 'manual' ? $page->accent_color : null,
            ],
        ]);
    }
}
