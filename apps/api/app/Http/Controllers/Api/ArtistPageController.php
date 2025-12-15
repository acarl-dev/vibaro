<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\ArtistPage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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
            'theme_key' => 'dark-editorial',
            'theme_variant' => 'auto',
            'accent_mode' => 'auto',
            'accent_color' => null,
            'is_published' => false,
        ]);

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
                'theme_key' => ['sometimes', 'string', 'max:255'],
                'theme_variant' => ['sometimes', 'string', 'max:255'],
                'accent_mode' => ['sometimes', 'string', 'in:auto,manual'],
                'accent_color' => ['sometimes', 'nullable', 'regex:/^#?[0-9A-Fa-f]{6}$/', 'required_with:accent_mode'],
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

        $page->fill($validated);
        $page->save();

        return $this->success($this->transform($page));
    }

    private function transform(ArtistPage $page): array
    {
        return [
            'id' => $page->id,
            'handle' => $page->handle,
            'display_name' => $page->display_name,
            'bio' => $page->bio,
            'theme_key' => $page->theme_key,
            'theme_variant' => $page->theme_variant,
            'accent_color' => $page->accent_color,
            'is_published' => $page->is_published,
        ];
    }
}
