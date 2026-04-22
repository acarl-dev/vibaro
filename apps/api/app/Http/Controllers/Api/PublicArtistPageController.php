<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArtistPageResource;
use App\Http\Traits\ApiResponse;
use App\Models\ArtistPage;
use Illuminate\Http\JsonResponse;

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

        return $this->success((new ArtistPageResource($page))->resolve());
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

        return $this->success((new ArtistPageResource($page))->resolve());
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
