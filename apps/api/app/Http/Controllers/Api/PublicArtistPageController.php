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
            ->with(['links', 'shows', 'releases', 'featuredTracks', 'videos', 'galleryImages'])
            ->first();

        if (!$page) {
            return $this->error('NOT_FOUND', 'Artist page not found or unpublished.', 404);
        }

        return $this->buildPageResponse($page);
    }

    /**
     * GET /p/{handle}/preview
     *
     * Auth + ownership required. Returns full page data regardless of is_published.
     * Used by the Next.js Server Component owner-preview flow (never cached).
     * The public route GET /p/{handle} is cacheable because it only serves published pages.
     */
    public function preview(string $handle): JsonResponse
    {
        $user = auth('sanctum')->user();

        $page = ArtistPage::where('handle', $handle)
            ->with(['links', 'shows', 'releases', 'featuredTracks', 'videos', 'galleryImages'])
            ->first();

        if (!$page) {
            return $this->error('NOT_FOUND', 'Artist page not found.', 404);
        }

        if ($page->user_id !== $user->id) {
            return $this->error('FORBIDDEN', 'You do not own this artist page.', 403);
        }

        return $this->buildPageResponse($page);
    }

    /**
     * Build the shared JSON response for both show() and preview().
     * Contains all page data including spotlight, links, shows, releases, etc.
     */
    private function buildPageResponse(ArtistPage $page): JsonResponse
    {
        // Load active spotlight that should be shown on page (Hero Banner)
        $activeSpotlight = $page->spotlights()
            ->currentlyActive()
            ->where('show_on_page', true)
            ->first();

        // Prepare rich spotlight data for PhaseHero
        $spotlightData = null;
        if ($activeSpotlight) {
            $spotlightData = [
                'title'               => $activeSpotlight->title,
                'type'                => $activeSpotlight->type,
                'primary_url'         => $activeSpotlight->primary_url,
                'cover_image_url'     => $activeSpotlight->cover_image_url,
                'subtitle'            => $activeSpotlight->subtitle,
                'description'         => $activeSpotlight->description,
                'cta_label'           => $activeSpotlight->cta_label,
                'secondary_cta_url'   => $activeSpotlight->secondary_cta_url,
                'secondary_cta_label' => $activeSpotlight->secondary_cta_label,
                'background_image_url'=> $activeSpotlight->background_image_url,
                'meta'                => $activeSpotlight->meta,
            ];
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
            'visible_sections' => $page->visible_sections ?? ['profile', 'links', 'music', 'shows', 'releases', 'videos', 'gallery', 'contact'],
            'active_spotlight' => $spotlightData,
            'images' => [
                'avatar_url' => $page->avatar_path ? $appUrl . Storage::url($page->avatar_path) : null,
                'hero_image_url' => $page->header_path ? $appUrl . Storage::url($page->header_path) : null,
                'logo_url' => $page->logo_path ? $appUrl . Storage::url($page->logo_path) : null,
                'hero_focal_x' => $page->hero_focal_x ?? 50,
                'hero_focal_y' => $page->hero_focal_y ?? 35,
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
            // contacts: use the flexible array if set, otherwise fall back to the 4 legacy fields
            'contacts' => $this->resolveContacts($page),
            'contact_message' => $page->contact_message,
            'theme' => [
                'key' => 'modern',
                'variant' => 'auto',
                'accent_color' => $page->accent_mode === 'manual' ? $page->accent_color : null,
            ],
        ]);
    }

    /**
     * Return the contacts array for public display.
     * SECURITY: Only returns label + type. Actual email/phone values are PRIVATE
     * and never exposed in the public response (see SECURITY.md §3).
     * Contact URLs are resolved via the /p/{handle}/contact/{label} redirect endpoint.
     */
    private function resolveContacts(ArtistPage $page): array
    {
        $contacts = [];
        if ($page->booking_email)    $contacts[] = ['label' => 'Booking',    'type' => 'email'];
        if ($page->management_email) $contacts[] = ['label' => 'Management', 'type' => 'email'];
        if ($page->press_email)      $contacts[] = ['label' => 'Press',      'type' => 'email'];
        if ($page->whatsapp_number)  $contacts[] = ['label' => 'WhatsApp',   'type' => 'whatsapp'];

        // Merge any extra contacts from the JSONB column (future studio-managed entries)
        if (!empty($page->contacts)) {
            $legacyLabels = array_column($contacts, 'label');
            foreach ($page->contacts as $c) {
                if (!in_array($c['label'] ?? '', $legacyLabels, true)) {
                    $contacts[] = [
                        'label' => $c['label'] ?? '',
                        'type'  => $c['type'] ?? 'email',
                    ];
                }
            }
        }

        return $contacts;
    }

    /**
     * GET /p/{handle}/contact/{label}
     *
     * Returns the contact URL (mailto: / wa.me) for a given contact label.
     * The URL is computed server-side so the actual email/phone is never in the
     * public page JSON, but the visitor can still initiate contact.
     */
    public function contactRedirect(string $handle, string $label): JsonResponse
    {
        $page = ArtistPage::where('handle', $handle)
            ->where('is_published', true)
            ->first();

        if (!$page) {
            return $this->error('NOT_FOUND', 'Artist page not found.', 404);
        }

        // Resolve the contact URL from legacy fields or JSONB column
        $url = $this->resolveContactUrl($page, $label);

        if (!$url) {
            return $this->error('NOT_FOUND', 'Contact not found.', 404);
        }

        return $this->success(['url' => $url]);
    }

    /**
     * Find the contact URL for a given label.
     * Checks legacy fields first, then the JSONB contacts column.
     */
    private function resolveContactUrl(ArtistPage $page, string $label): ?string
    {
        $normalised = strtolower(trim($label));

        // Legacy fields
        $legacyMap = [
            'booking'    => ['value' => $page->booking_email,    'type' => 'email'],
            'management' => ['value' => $page->management_email, 'type' => 'email'],
            'press'      => ['value' => $page->press_email,      'type' => 'email'],
            'whatsapp'   => ['value' => $page->whatsapp_number,  'type' => 'whatsapp'],
        ];

        if (isset($legacyMap[$normalised]) && !empty($legacyMap[$normalised]['value'])) {
            return $this->buildContactUrl($legacyMap[$normalised]['type'], $legacyMap[$normalised]['value']);
        }

        // JSONB contacts column
        if (!empty($page->contacts)) {
            foreach ($page->contacts as $c) {
                if (strtolower(trim($c['label'] ?? '')) === $normalised && !empty($c['value'])) {
                    return $this->buildContactUrl($c['type'] ?? 'email', $c['value']);
                }
            }
        }

        return null;
    }

    private function buildContactUrl(string $type, string $value): string
    {
        if ($type === 'whatsapp') {
            return 'https://wa.me/' . preg_replace('/[^0-9+]/', '', $value);
        }

        return 'mailto:' . $value;
    }
}
