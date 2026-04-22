<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ArtistPageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $appUrl = rtrim(config('app.url'), '/');

        // Load active spotlight (targeted query – not eager-loaded by default)
        $activeSpotlight = $this->resource->spotlights()
            ->currentlyActive()
            ->visibleOnPage()
            ->first();

        $spotlightData = null;
        if ($activeSpotlight) {
            $spotlightData = [
                'title'                => $activeSpotlight->title,
                'type'                 => $activeSpotlight->type,
                'primary_url'          => $activeSpotlight->primary_url,
                'cover_image_url'      => $activeSpotlight->cover_image_url,
                'subtitle'             => $activeSpotlight->subtitle,
                'description'          => $activeSpotlight->description,
                'cta_label'            => $activeSpotlight->cta_label,
                'secondary_cta_url'    => $activeSpotlight->secondary_cta_url,
                'secondary_cta_label'  => $activeSpotlight->secondary_cta_label,
                'background_image_url' => $activeSpotlight->background_image_url,
                'meta'                 => $activeSpotlight->meta,
            ];
        }

        return [
            'handle'           => $this->handle,
            'display_name'     => $this->display_name,
            'bio'              => $this->bio,
            'is_published'     => $this->is_published,
            'visible_sections' => $this->visible_sections ?? ['profile', 'links', 'music', 'shows', 'releases', 'videos', 'gallery', 'contact'],
            'active_spotlight' => $spotlightData,
            'images'           => [
                'avatar_url'     => $this->avatar_path ? $appUrl . Storage::url($this->avatar_path) : null,
                'hero_image_url' => $this->header_path ? $appUrl . Storage::url($this->header_path) : null,
                'logo_url'       => $this->logo_path ? $appUrl . Storage::url($this->logo_path) : null,
                'hero_focal_x'   => $this->hero_focal_x ?? 50,
                'hero_focal_y'   => $this->hero_focal_y ?? 35,
            ],
            'focus' => [
                'type'  => 'links',
                'limit' => 3,
            ],
            'links'           => LinkResource::collection(
                $this->links->filter(fn($l) => !empty($l->url))->values()
            )->resolve(),
            'shows'           => ShowResource::collection($this->shows)->resolve(),
            'releases'        => ReleaseResource::collection($this->releases)->resolve(),
            'featured_tracks' => FeaturedTrackResource::collection($this->featuredTracks)->resolve(),
            'videos'          => VideoResource::collection($this->videos)->resolve(),
            'gallery_images'  => GalleryImageResource::collection($this->galleryImages)->resolve(),
            'contacts'        => $this->resolveContacts(),
            'contact_message' => $this->contact_message,
            'theme'           => [
                'key'          => 'modern',
                'variant'      => 'auto',
                'accent_color' => $this->accent_mode === 'manual' ? $this->accent_color : null,
            ],
        ];
    }

    /**
     * Return the contacts array for public display.
     * SECURITY: Only returns label + type. Actual email/phone values are PRIVATE
     * and never exposed in the public response (see SECURITY.md §3).
     * Contact URLs are resolved via the /p/{handle}/contact/{label} redirect endpoint.
     */
    private function resolveContacts(): array
    {
        $contacts = [];
        if ($this->booking_email)    $contacts[] = ['label' => 'Booking',    'type' => 'email'];
        if ($this->management_email) $contacts[] = ['label' => 'Management', 'type' => 'email'];
        if ($this->press_email)      $contacts[] = ['label' => 'Press',      'type' => 'email'];
        if ($this->whatsapp_number)  $contacts[] = ['label' => 'WhatsApp',   'type' => 'whatsapp'];

        // Merge any extra contacts from the JSONB column (future studio-managed entries)
        if (!empty($this->contacts)) {
            $legacyLabels = array_column($contacts, 'label');
            foreach ($this->contacts as $c) {
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
}
