<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\ArtistPage;
use App\Services\LinkService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class ArtistPageController extends Controller
{
    use ApiResponse;

    public function me(Request $request): JsonResponse
    {
        $page = $request->user()->artistPage;

        if (!$page) {
            return $this->error('NOT_FOUND', 'Artist page not found.', 404);
        }

        $this->authorize('view', $page);

        return $this->success($this->transform($page));
    }

    public function store(Request $request): JsonResponse
    {
        if ($request->user()->artistPage) {
            return $this->error('ARTIST_PAGE_EXISTS', 'Artist page already exists.', 409);
        }

        try {
            $validated = $request->validate([
                'handle' => ['required', 'string', 'min:3', 'max:40', 'regex:/^[a-z0-9-]+$/', 'unique:artist_pages,handle'],
                'display_name' => ['required', 'string', 'max:255'],
            ]);
        } catch (ValidationException $e) {
            return $this->validationError($e->errors());
        }

        $handle = strtolower($validated['handle']);

        $page = ArtistPage::create([
            'user_id' => $request->user()->id,
            'handle' => $handle,
            'display_name' => $validated['display_name'],
            'bio' => null,
            'theme_key' => 'modern',
            'theme_variant' => 'auto',
            'accent_mode' => 'auto',
            'accent_color' => null,
            'is_published' => false,
        ]);

        // Create default social media links (pre-filled, empty URLs)
        LinkService::createDefaultLinksForArtistPage($page);

        return $this->success([
            'id' => $page->id,
            'handle' => $page->handle,
            'display_name' => $page->display_name,
            'is_published' => $page->is_published,
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $page = ArtistPage::find($id);

        if (!$page) {
            return $this->error('NOT_FOUND', 'Artist page not found.', 404);
        }

        $this->authorize('update', $page);

        try {
            $validated = $request->validate([
                'display_name' => ['sometimes', 'string', 'max:255'],
                'bio' => ['sometimes', 'nullable', 'string'],
                'avatar_path' => ['sometimes', 'nullable', 'string'],
                'theme_key' => ['sometimes', 'string', 'max:255'],
                'theme_variant' => ['sometimes', 'string', 'max:255'],
                'accent_mode' => ['sometimes', 'string', 'in:auto,manual'],
                'accent_color' => ['sometimes', 'nullable', 'regex:/^#?[0-9A-Fa-f]{6}$/', 'required_with:accent_mode'],
                'booking_email' => ['sometimes', 'nullable', 'email', 'max:255'],
                'management_email' => ['sometimes', 'nullable', 'email', 'max:255'],
                'press_email' => ['sometimes', 'nullable', 'email', 'max:255'],
                'whatsapp_number' => ['sometimes', 'nullable', 'string', 'max:50'],
                'is_published' => ['sometimes', 'boolean'],
            ]);
        } catch (ValidationException $e) {
            return $this->validationError($e->errors());
        }

        // enforce accent color rules
        if (($validated['accent_mode'] ?? $page->accent_mode) === 'manual' && !array_key_exists('accent_color', $validated)) {
            return $this->validationError(['accent_color' => ['Accent color is required when accent_mode is manual.']]);
        }

        if (($validated['accent_mode'] ?? null) === 'auto') {
            $validated['accent_color'] = null;
        }

        // Set published_at timestamp when publishing
        if (isset($validated['is_published']) && $validated['is_published'] && !$page->is_published) {
            $validated['published_at'] = now();
        }

        $page->fill($validated);
        $page->save();

        return $this->success($this->transform($page));
    }

    public function publish(Request $request, int $id): JsonResponse
    {
        $page = ArtistPage::find($id);

        if (!$page) {
            return $this->error('NOT_FOUND', 'Artist page not found.', 404);
        }

        $this->authorize('update', $page);

        // Check if required fields are filled (with trim validation)
        if (!$page->handle ||
            !$page->display_name ||
            trim($page->display_name) === '' ||
            !$page->bio ||
            trim($page->bio) === '') {
            return $this->error('INCOMPLETE_PROFILE', 'Handle, display name, and bio are required to publish.', 400);
        }

        if (!$page->is_published) {
            $page->is_published = true;
            $page->published_at = now();
            $page->save();
        }

        return $this->success($this->transform($page));
    }

    public function unpublish(Request $request, int $id): JsonResponse
    {
        $page = ArtistPage::find($id);

        if (!$page) {
            return $this->error('NOT_FOUND', 'Artist page not found.', 404);
        }

        $this->authorize('update', $page);

        if ($page->is_published) {
            $page->is_published = false;
            $page->save();
        }

        return $this->success($this->transform($page));
    }

    public function checkHandle(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'handle' => ['required', 'string', 'min:3', 'max:40', 'regex:/^[a-z0-9-]+$/'],
            ]);
        } catch (ValidationException $e) {
            return $this->validationError($e->errors());
        }

        $handle = strtolower($validated['handle']);
        $exists = ArtistPage::where('handle', $handle)->exists();

        // If checking own handle, allow it
        if ($request->user() && $request->user()->artistPage) {
            $ownHandle = $request->user()->artistPage->handle;
            if ($ownHandle === $handle) {
                $exists = false;
            }
        }

        return $this->success([
            'handle' => $handle,
            'available' => !$exists,
        ]);
    }

    private function transform(ArtistPage $page): array
    {
        $appUrl = rtrim(config('app.url'), '/');

        return [
            'id' => $page->id,
            'handle' => $page->handle,
            'display_name' => $page->display_name,
            'bio' => $page->bio,
            'avatar_url' => $page->avatar_path ? $appUrl . Storage::url($page->avatar_path) : null,
            'hero_image_url' => $page->header_path ? $appUrl . Storage::url($page->header_path) : null,
            'logo_url' => $page->logo_path ? $appUrl . Storage::url($page->logo_path) : null,
            'hero_focal_x' => $page->hero_focal_x ?? 50,
            'hero_focal_y' => $page->hero_focal_y ?? 35,
            'visible_sections' => $page->visible_sections ?? ['profile', 'links', 'music', 'shows', 'releases', 'videos', 'gallery', 'contact'],
            'theme_key' => $page->theme_key,
            'theme_variant' => $page->theme_variant,
            'accent_color' => $page->accent_color,
            'booking_email' => $page->booking_email,
            'management_email' => $page->management_email,
            'press_email' => $page->press_email,
            'whatsapp_number' => $page->whatsapp_number,
            'is_published' => $page->is_published,
            'published_at' => $page->published_at?->toIso8601String(),
        ];
    }

    public function uploadAvatar(Request $request): JsonResponse
    {
        $page = $request->user()->artistPage;
        $this->authorize('update', $page);

        try {
            $validated = $request->validate([
                'avatar' => ['required', 'image', 'mimes:jpeg,jpg,png,webp', 'max:2048'],
            ]);
        } catch (ValidationException $e) {
            return $this->validationError($e->errors());
        }

        // Delete old avatar if exists
        if ($page->avatar_path) {
            Storage::disk('public')->delete($page->avatar_path);
        }

        // Store new avatar
        $path = $request->file('avatar')->store('avatars', 'public');
        $page->avatar_path = $path;
        $page->save();

        return $this->success($this->transform($page));
    }

    public function uploadHero(Request $request): JsonResponse
    {
        $page = $request->user()->artistPage;
        $this->authorize('update', $page);

        try {
            $validated = $request->validate([
                'hero_image' => ['required', 'image', 'mimes:jpeg,jpg,png,webp', 'max:2048'],
            ]);
        } catch (ValidationException $e) {
            return $this->validationError($e->errors());
        }

        // Delete old hero image if exists
        if ($page->header_path) {
            Storage::disk('public')->delete($page->header_path);
        }

        // Store new hero image
        $path = $request->file('hero_image')->store('hero-images', 'public');
        $page->header_path = $path;
        $page->save();

        return $this->success($this->transform($page));
    }

    public function uploadLogo(Request $request): JsonResponse
    {
        $page = $request->user()->artistPage;
        $this->authorize('update', $page);

        try {
            $validated = $request->validate([
                'logo' => ['required', 'image', 'mimes:jpeg,jpg,png,webp', 'max:2048'],
            ]);
        } catch (ValidationException $e) {
            return $this->validationError($e->errors());
        }

        if ($page->logo_path) {
            Storage::disk('public')->delete($page->logo_path);
        }

        $path = $request->file('logo')->store('logos', 'public');
        $page->logo_path = $path;
        $page->save();

        return $this->success($this->transform($page));
    }

    public function deleteLogo(Request $request): JsonResponse
    {
        $page = $request->user()->artistPage;
        $this->authorize('update', $page);

        if ($page->logo_path) {
            Storage::disk('public')->delete($page->logo_path);
            $page->logo_path = null;
            $page->save();
        }

        return $this->success($this->transform($page));
    }

    public function updateHeroFocal(Request $request): JsonResponse
    {
        $page = $request->user()->artistPage;
        $this->authorize('update', $page);

        try {
            $validated = $request->validate([
                'hero_focal_x' => ['required', 'integer', 'min:0', 'max:100'],
                'hero_focal_y' => ['required', 'integer', 'min:0', 'max:100'],
            ]);
        } catch (ValidationException $e) {
            return $this->validationError($e->errors());
        }

        $page->hero_focal_x = $validated['hero_focal_x'];
        $page->hero_focal_y = $validated['hero_focal_y'];
        $page->save();

        return $this->success($this->transform($page));
    }

    public function deleteAvatar(Request $request): JsonResponse
    {
        $page = $request->user()->artistPage;
        $this->authorize('update', $page);

        // Delete avatar file if exists
        if ($page->avatar_path) {
            Storage::disk('public')->delete($page->avatar_path);
            $page->avatar_path = null;
            $page->save();
        }

        return $this->success($this->transform($page));
    }

    public function deleteHero(Request $request): JsonResponse
    {
        $page = $request->user()->artistPage;
        $this->authorize('update', $page);

        // Delete hero image file if exists
        if ($page->header_path) {
            Storage::disk('public')->delete($page->header_path);
            $page->header_path = null;
            $page->save();
        }

        return $this->success($this->transform($page));
    }

    /**
     * GET /artist-pages/search
     * Search for published artist pages by handle or display name
     */
    public function search(Request $request): JsonResponse
    {
        $query = $request->input('q', '');

        if (strlen($query) < 2) {
            return $this->success([]);
        }

        $pages = ArtistPage::where('is_published', true)
            ->where(function ($q) use ($query) {
                $q->where('handle', 'like', "%{$query}%")
                  ->orWhere('display_name', 'like', "%{$query}%");
            })
            ->limit(10)
            ->get(['id', 'handle', 'display_name', 'avatar_path']);

        $results = $pages->map(function ($page) {
            return [
                'id' => $page->id,
                'handle' => $page->handle,
                'display_name' => $page->display_name,
                'avatar_url' => $page->avatar_path ? Storage::disk('public')->url($page->avatar_path) : null,
            ];
        });

        return $this->success($results);
    }

    /**
     * PATCH /artist-pages/{id}/sections
     * Update visible sections on the public page
     */
    public function updateSections(Request $request, ArtistPage $artistPage): JsonResponse
    {
        $this->authorize('update', $artistPage);

        try {
            $validated = $request->validate([
                'visible_sections' => ['required', 'array'],
                'visible_sections.*' => ['string', 'in:profile,links,music,shows,releases,videos,gallery,contact'],
            ]);
        } catch (ValidationException $e) {
            return $this->validationError($e->errors());
        }

        $artistPage->update($validated);

        return $this->success([
            'id' => $artistPage->id,
            'visible_sections' => $artistPage->visible_sections,
        ]);
    }
}
