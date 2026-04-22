<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\GalleryImage;
use App\Services\ImageProcessingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use RuntimeException;

class GalleryImageController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly ImageProcessingService $imageProcessor) {}
    /**
     * List all gallery images for authenticated user's artist page
     */
    public function index(Request $request): JsonResponse
    {
        $page = $request->user()->artistPage;

        $images = $page->galleryImages()->orderBy('position')->get();

        $appUrl = config('app.url');

        return $this->success($images->map(fn($image) => [
            'id' => $image->id,
            'title' => $image->title,
            'image_url' => $appUrl . Storage::url($image->image_path),
            'image_path' => $image->image_path,
            'position' => $image->position,
        ])->toArray());
    }

    /**
     * Upload a new gallery image
     */
    public function store(Request $request): JsonResponse
    {
        $page = $request->user()->artistPage;
        $this->authorize('update', $page);

        // Check limit
        $maxImages = config('vibaro.limits.max_gallery_images', 16);
        if ($page->galleryImages()->count() >= $maxImages) {
            return $this->error('LIMIT_EXCEEDED', "Maximum {$maxImages} gallery images allowed.", 400);
        }

        try {
            $validated = $request->validate([
                'image' => ['required', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'], // 5MB
                'title' => ['nullable', 'string', 'max:255'],
            ]);
        } catch (ValidationException $e) {
            return $this->validationError($e->errors());
        }

        try {
            $result = $this->imageProcessor->process($request->file('image'), 'gallery', 'gallery');
        } catch (RuntimeException $e) {
            return $this->error('IMAGE_PROCESSING_FAILED', 'Image could not be processed.', 422);
        }

        Storage::disk('public')->put($result['path'], $result['contents']);
        $path = $result['path'];

        // Get next position
        $nextPosition = $page->galleryImages()->max('position') + 1;

        $image = GalleryImage::create([
            'artist_page_id' => $page->id,
            'title' => $validated['title'] ?? null,
            'image_path' => $path,
            'position' => $nextPosition,
        ]);

        $appUrl = config('app.url');

        return $this->success([
            'id' => $image->id,
            'title' => $image->title,
            'image_url' => $appUrl . Storage::url($image->image_path),
            'image_path' => $image->image_path,
            'position' => $image->position,
        ]);
    }

    /**
     * Update a gallery image (only title)
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $image = GalleryImage::find((int) $id);

        if (!$image) {
            return $this->error('NOT_FOUND', 'Gallery image not found.', 404);
        }

        $page = $request->user()->artistPage;

        if ($image->artist_page_id !== $page->id) {
            return $this->error('FORBIDDEN', 'Access denied.', 403);
        }

        $this->authorize('update', $page);

        try {
            $validated = $request->validate([
                'title' => ['nullable', 'string', 'max:255'],
                'position' => ['sometimes', 'integer', 'min:0'],
            ]);
        } catch (ValidationException $e) {
            return $this->validationError($e->errors());
        }

        $image->update($validated);

        $appUrl = config('app.url');

        return $this->success([
            'id' => $image->id,
            'title' => $image->title,
            'image_url' => $appUrl . Storage::url($image->image_path),
            'image_path' => $image->image_path,
            'position' => $image->position,
        ]);
    }

    /**
     * Delete a gallery image
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $image = GalleryImage::find((int) $id);

        if (!$image) {
            return $this->error('NOT_FOUND', 'Gallery image not found.', 404);
        }

        $page = $request->user()->artistPage;

        if ($image->artist_page_id !== $page->id) {
            return $this->error('FORBIDDEN', 'Access denied.', 403);
        }

        $this->authorize('update', $page);

        // Delete file from storage
        if ($image->image_path && Storage::disk('public')->exists($image->image_path)) {
            Storage::disk('public')->delete($image->image_path);
        }

        $image->delete();

        return $this->success(null);
    }

    /**
     * Reorder gallery images
     */
    public function reorder(Request $request): JsonResponse
    {
        $page = $request->user()->artistPage;
        $this->authorize('update', $page);

        try {
            $validated = $request->validate([
                'image_ids' => ['required', 'array'],
                'image_ids.*' => ['integer', 'exists:gallery_images,id'],
            ]);
        } catch (ValidationException $e) {
            return $this->validationError($e->errors());
        }

        // Update positions
        foreach ($validated['image_ids'] as $position => $imageId) {
            GalleryImage::where('id', $imageId)
                ->where('artist_page_id', $page->id)
                ->update(['position' => $position]);
        }

        return $this->success(null);
    }
}
