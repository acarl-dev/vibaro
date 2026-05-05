<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\NormalizesUrlInput;
use App\Http\Traits\ApiResponse;
use App\Models\ArtistPage;
use App\Rules\SafeExternalUrl;
use App\Services\ImageProcessingService;
use App\Services\ReleaseMetadataService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use RuntimeException;

class ReleaseController extends Controller
{
    use ApiResponse;
    use NormalizesUrlInput;

    public function __construct(
        protected ReleaseMetadataService $metadata,
        private readonly ImageProcessingService $imageProcessor,
    ) {}

    /**
     * GET /artist-pages/{id}/releases
     */
    public function index(int $id): JsonResponse
    {
        $artistPage = ArtistPage::findOrFail($id);
        Gate::authorize('update', $artistPage);

        $releases = $artistPage->releases()->orderBy('release_date', 'desc')->get();

        return $this->success($releases->map(fn($release) => [
            'id' => $release->id,
            'title' => $release->title,
            'release_date' => $release->release_date?->toDateString(),
            'url' => $release->url,
            'cover_path' => $release->cover_path,
            'release_type' => $release->release_type,
            'is_featured' => $release->is_featured,
            'position' => $release->position,
        ]));
    }

    /**
     * POST /artist-pages/{id}/releases
     */
    public function store(Request $request, int $id): JsonResponse
    {
        $artistPage = ArtistPage::findOrFail($id);
        Gate::authorize('update', $artistPage);

        $this->normalizeUrlInput($request, ['url']);

        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'release_date' => 'nullable|date',
            'url' => ['nullable', 'string', 'max:2048', new SafeExternalUrl()],
            'is_featured' => 'nullable|boolean',
        ]);

        $title = trim($validated['title'] ?? '');
        $url = $validated['url'] ?? null;
        $oembed = null;

        if ($title === '' && $url) {
            $oembed = $this->metadata->fetchOembed($url);
            $title = trim((string) ($oembed['title'] ?? ''));
        }

        if ($title === '') {
            return $this->validationError([
                'title' => ['Titel ist erforderlich oder muss aus einem unterstützten Link kommen.'],
            ]);
        }

        $maxPosition = $artistPage->releases()->max('position') ?? -1;

        $release = $artistPage->releases()->create([
            'title' => $title,
            'release_date' => $validated['release_date'] ?? null,
            'url' => $url,
            'release_type' => $this->metadata->inferReleaseTypeFromUrl($url),
            'is_featured' => $validated['is_featured'] ?? false,
            'position' => $maxPosition + 1,
        ]);

        $this->metadata->tryAutoCoverFromUrl($release, $url, $oembed);
        $this->metadata->tryAutoReleaseDateFromUrl($release, $url, $oembed);

        return $this->success([
            'id' => $release->id,
            'title' => $release->title,
            'release_date' => $release->release_date?->toDateString(),
            'url' => $release->url,
            'cover_path' => $release->cover_path,
            'release_type' => $release->release_type,
            'is_featured' => $release->is_featured,
            'position' => $release->position,
        ], 201);
    }

    /**
     * PATCH /artist-pages/{id}/releases/{releaseId}
     */
    public function update(Request $request, int $id, int $releaseId): JsonResponse
    {
        $artistPage = ArtistPage::findOrFail($id);
        Gate::authorize('update', $artistPage);

        $this->normalizeUrlInput($request, ['url']);

        $release = $artistPage->releases()->findOrFail($releaseId);

        $validated = $request->validate([
            'title' => 'sometimes|nullable|string|max:255',
            'release_date' => 'sometimes|nullable|date',
            'url' => ['nullable', 'string', 'max:2048', new SafeExternalUrl()],
            'is_featured' => 'nullable|boolean',
        ]);

        $oembed = null;
        if (array_key_exists('title', $validated)) {
            $title = trim((string) ($validated['title'] ?? ''));
            if ($title === '') {
                $url = $validated['url'] ?? $release->url;
                if ($url) {
                    $oembed = $this->metadata->fetchOembed($url);
                    $title = trim((string) ($oembed['title'] ?? ''));
                }

                if ($title === '') {
                    return $this->validationError([
                        'title' => ['Titel ist erforderlich oder muss aus einem unterstützten Link kommen.'],
                    ]);
                }

                $validated['title'] = $title;
            }
        }

        $release->update($validated);

        if (array_key_exists('url', $validated)) {
            $this->metadata->tryAutoCoverFromUrl($release, $validated['url'], $oembed);
            $this->metadata->tryAutoReleaseTypeFromUrl($release, $validated['url']);
        } elseif ($oembed) {
            $this->metadata->tryAutoCoverFromUrl($release, $release->url, $oembed);
        }

        if (array_key_exists('url', $validated) || array_key_exists('release_date', $validated)) {
            $this->metadata->tryAutoReleaseDateFromUrl($release, $release->url, $oembed);
        }

        return $this->success([
            'id' => $release->id,
            'title' => $release->title,
            'release_date' => $release->release_date?->toDateString(),
            'url' => $release->url,
            'cover_path' => $release->cover_path,
            'release_type' => $release->release_type,
            'is_featured' => $release->is_featured,
            'position' => $release->position,
        ]);
    }

    /**
     * DELETE /artist-pages/{id}/releases/{releaseId}
     */
    public function destroy(int $id, int $releaseId): JsonResponse
    {
        $artistPage = ArtistPage::findOrFail($id);
        Gate::authorize('update', $artistPage);

        $release = $artistPage->releases()->findOrFail($releaseId);

        // Delete cover if exists
        if ($release->cover_path) {
            Storage::disk('public')->delete($release->cover_path);
        }

        $release->delete();

        return $this->success(['ok' => true]);
    }

    /**
     * POST /artist-pages/{id}/releases/reorder
     */
    public function reorder(Request $request, int $id): JsonResponse
    {
        $artistPage = ArtistPage::findOrFail($id);
        Gate::authorize('update', $artistPage);

        $validated = $request->validate([
            'release_ids' => 'required|array',
            'release_ids.*' => 'required|integer',
        ]);

        $releaseIds = $validated['release_ids'];

        foreach ($releaseIds as $index => $releaseId) {
            $artistPage->releases()->where('id', $releaseId)->update(['position' => $index]);
        }

        return $this->success(['ok' => true]);
    }

    /**
     * POST /artist-pages/{id}/releases/{releaseId}/upload-cover
     */
    public function uploadCover(Request $request, int $id, int $releaseId): JsonResponse
    {
        $artistPage = ArtistPage::findOrFail($id);
        Gate::authorize('update', $artistPage);

        $release = $artistPage->releases()->findOrFail($releaseId);

        try {
            $request->validate([
                'cover' => ['required', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'], // 5MB max
            ]);
        } catch (ValidationException $e) {
            return $this->validationError($e->errors());
        }

        try {
            $result = $this->imageProcessor->process($request->file('cover'), 'cover', 'covers');
        } catch (RuntimeException $e) {
            return $this->error('IMAGE_PROCESSING_FAILED', 'Image could not be processed.', 422);
        }

        if ($release->cover_path) {
            Storage::disk('public')->delete($release->cover_path);
        }

        Storage::disk('public')->put($result['path'], $result['contents']);
        $release->cover_path = $result['path'];
        $release->save();

        return $this->success([
            'id' => $release->id,
            'cover_path' => $release->cover_path,
            'cover_url' => $release->cover_path ? asset('storage/' . $release->cover_path) : null,
        ]);
    }

    /**
     * DELETE /artist-pages/{id}/releases/{releaseId}/cover
     */
    public function deleteCover(int $id, int $releaseId): JsonResponse
    {
        $artistPage = ArtistPage::findOrFail($id);
        Gate::authorize('update', $artistPage);

        $release = $artistPage->releases()->findOrFail($releaseId);

        if ($release->cover_path) {
            Storage::disk('public')->delete($release->cover_path);
            $release->cover_path = null;
            $release->save();
        }

        return $this->success(['ok' => true]);
    }
}
