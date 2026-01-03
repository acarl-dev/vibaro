<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class VideoController extends Controller
{
    /**
     * List all videos for authenticated user's artist page
     */
    public function index(Request $request): JsonResponse
    {
        $page = $request->user()->artistPage;

        if (!$page) {
            return $this->error('NOT_FOUND', 'Artist page not found.', 404);
        }

        $videos = $page->videos()->orderBy('position')->get();

        return $this->success($videos->map(fn($video) => [
            'id' => $video->id,
            'title' => $video->title,
            'platform' => $video->platform,
            'video_id' => $video->video_id,
            'url' => $video->url,
            'description' => $video->description,
            'thumbnail_url' => $video->thumbnail_url,
            'position' => $video->position,
        ])->toArray());
    }

    /**
     * Create a new video
     */
    public function store(Request $request): JsonResponse
    {
        $page = $request->user()->artistPage;

        if (!$page) {
            return $this->error('NOT_FOUND', 'Artist page not found.', 404);
        }

        $this->authorize('update', $page);

        // Check limit (max 8 videos for Artist plan)
        if ($page->videos()->count() >= 8) {
            return $this->error('LIMIT_EXCEEDED', 'Maximum 8 videos allowed.', 400);
        }

        try {
            $validated = $request->validate([
                'title' => ['required', 'string', 'max:255'],
                'url' => ['required', 'url', 'max:500'],
                'platform' => ['required', 'in:youtube,vimeo'],
                'description' => ['nullable', 'string', 'max:1000'],
            ]);
        } catch (ValidationException $e) {
            return $this->error('VALIDATION_ERROR', 'Validation failed.', 400, $e->errors());
        }

        // Extract video ID from URL
        $videoId = Video::extractVideoId($validated['url'], $validated['platform']);

        if (!$videoId) {
            return $this->error('INVALID_URL', 'Could not extract video ID from URL.', 400);
        }

        // Get next position
        $nextPosition = $page->videos()->max('position') + 1;

        $video = Video::create([
            'artist_page_id' => $page->id,
            'title' => $validated['title'],
            'platform' => $validated['platform'],
            'video_id' => $videoId,
            'url' => $validated['url'],
            'description' => $validated['description'] ?? null,
            'position' => $nextPosition,
        ]);

        return $this->success([
            'id' => $video->id,
            'title' => $video->title,
            'platform' => $video->platform,
            'video_id' => $video->video_id,
            'url' => $video->url,
            'description' => $video->description,
            'thumbnail_url' => $video->thumbnail_url,
            'position' => $video->position,
        ]);
    }

    /**
     * Update a video
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $video = Video::find($id);

        if (!$video) {
            return $this->error('NOT_FOUND', 'Video not found.', 404);
        }

        $page = $request->user()->artistPage;

        if (!$page || $video->artist_page_id !== $page->id) {
            return $this->error('FORBIDDEN', 'Access denied.', 403);
        }

        $this->authorize('update', $page);

        try {
            $validated = $request->validate([
                'title' => ['sometimes', 'string', 'max:255'],
                'url' => ['sometimes', 'url', 'max:500'],
                'platform' => ['sometimes', 'in:youtube,vimeo'],
                'description' => ['nullable', 'string', 'max:1000'],
                'position' => ['sometimes', 'integer', 'min:0'],
            ]);
        } catch (ValidationException $e) {
            return $this->error('VALIDATION_ERROR', 'Validation failed.', 400, $e->errors());
        }

        // If URL or platform changed, re-extract video ID
        if (isset($validated['url']) || isset($validated['platform'])) {
            $url = $validated['url'] ?? $video->url;
            $platform = $validated['platform'] ?? $video->platform;
            $videoId = Video::extractVideoId($url, $platform);

            if (!$videoId) {
                return $this->error('INVALID_URL', 'Could not extract video ID from URL.', 400);
            }

            $validated['video_id'] = $videoId;
        }

        $video->update($validated);

        return $this->success([
            'id' => $video->id,
            'title' => $video->title,
            'platform' => $video->platform,
            'video_id' => $video->video_id,
            'url' => $video->url,
            'description' => $video->description,
            'thumbnail_url' => $video->thumbnail_url,
            'position' => $video->position,
        ]);
    }

    /**
     * Delete a video
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $video = Video::find($id);

        if (!$video) {
            return $this->error('NOT_FOUND', 'Video not found.', 404);
        }

        $page = $request->user()->artistPage;

        if (!$page || $video->artist_page_id !== $page->id) {
            return $this->error('FORBIDDEN', 'Access denied.', 403);
        }

        $this->authorize('update', $page);

        $video->delete();

        return $this->success(null);
    }

    /**
     * Reorder videos
     */
    public function reorder(Request $request): JsonResponse
    {
        $page = $request->user()->artistPage;

        if (!$page) {
            return $this->error('NOT_FOUND', 'Artist page not found.', 404);
        }

        $this->authorize('update', $page);

        try {
            $validated = $request->validate([
                'video_ids' => ['required', 'array'],
                'video_ids.*' => ['integer', 'exists:videos,id'],
            ]);
        } catch (ValidationException $e) {
            return $this->error('VALIDATION_ERROR', 'Validation failed.', 400, $e->errors());
        }

        // Update positions
        foreach ($validated['video_ids'] as $position => $videoId) {
            Video::where('id', $videoId)
                ->where('artist_page_id', $page->id)
                ->update(['position' => $position]);
        }

        return $this->success(null);
    }

    /**
     * Standard response helpers
     */
    private function success($data, int $status = 200): JsonResponse
    {
        return response()->json(['data' => $data], $status);
    }

    private function error(string $code, string $message, int $status = 400, ?array $errors = null): JsonResponse
    {
        $response = [
            'error' => [
                'code' => $code,
                'message' => $message,
            ],
        ];

        if ($errors) {
            $response['error']['errors'] = $errors;
        }

        return response()->json($response, $status);
    }
}
