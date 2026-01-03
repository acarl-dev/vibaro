<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ArtistPage;
use App\Models\Release;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class ReleaseController extends Controller
{
    /**
     * GET /artist-pages/{id}/releases
     */
    public function index(int $id)
    {
        $artistPage = ArtistPage::findOrFail($id);
        Gate::authorize('update', $artistPage);

        $releases = $artistPage->releases()->orderBy('release_date', 'desc')->get();

        return response()->json([
            'data' => $releases->map(fn($release) => [
                'id' => $release->id,
                'title' => $release->title,
                'release_date' => $release->release_date->toDateString(),
                'url' => $release->url,
                'cover_path' => $release->cover_path,
                'is_featured' => $release->is_featured,
                'position' => $release->position,
            ])
        ]);
    }

    /**
     * POST /artist-pages/{id}/releases
     */
    public function store(Request $request, int $id)
    {
        $artistPage = ArtistPage::findOrFail($id);
        Gate::authorize('update', $artistPage);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'release_date' => 'required|date',
            'url' => 'nullable|url|max:2048',
            'is_featured' => 'nullable|boolean',
        ]);

        $maxPosition = $artistPage->releases()->max('position') ?? -1;

        $release = $artistPage->releases()->create([
            'title' => $validated['title'],
            'release_date' => $validated['release_date'],
            'url' => $validated['url'] ?? null,
            'is_featured' => $validated['is_featured'] ?? false,
            'position' => $maxPosition + 1,
        ]);

        return response()->json([
            'data' => [
                'id' => $release->id,
                'title' => $release->title,
                'release_date' => $release->release_date->toDateString(),
                'url' => $release->url,
                'cover_path' => $release->cover_path,
                'is_featured' => $release->is_featured,
                'position' => $release->position,
            ]
        ], 201);
    }

    /**
     * PATCH /artist-pages/{id}/releases/{releaseId}
     */
    public function update(Request $request, int $id, int $releaseId)
    {
        $artistPage = ArtistPage::findOrFail($id);
        Gate::authorize('update', $artistPage);

        $release = $artistPage->releases()->findOrFail($releaseId);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'release_date' => 'sometimes|required|date',
            'url' => 'nullable|url|max:2048',
            'is_featured' => 'nullable|boolean',
        ]);

        $release->update($validated);

        return response()->json([
            'data' => [
                'id' => $release->id,
                'title' => $release->title,
                'release_date' => $release->release_date->toDateString(),
                'url' => $release->url,
                'cover_path' => $release->cover_path,
                'is_featured' => $release->is_featured,
                'position' => $release->position,
            ]
        ]);
    }

    /**
     * DELETE /artist-pages/{id}/releases/{releaseId}
     */
    public function destroy(int $id, int $releaseId)
    {
        $artistPage = ArtistPage::findOrFail($id);
        Gate::authorize('update', $artistPage);

        $release = $artistPage->releases()->findOrFail($releaseId);

        // Delete cover if exists
        if ($release->cover_path) {
            Storage::disk('public')->delete($release->cover_path);
        }

        $release->delete();

        return response()->json([
            'data' => ['ok' => true]
        ]);
    }

    /**
     * POST /artist-pages/{id}/releases/reorder
     */
    public function reorder(Request $request, int $id)
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

        return response()->json([
            'data' => ['ok' => true]
        ]);
    }

    /**
     * POST /artist-pages/{id}/releases/{releaseId}/upload-cover
     */
    public function uploadCover(Request $request, int $id, int $releaseId)
    {
        $artistPage = ArtistPage::findOrFail($id);
        Gate::authorize('update', $artistPage);

        $release = $artistPage->releases()->findOrFail($releaseId);

        try {
            $validated = $request->validate([
                'cover' => ['required', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'], // 5MB max
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'error' => [
                    'code' => 'VALIDATION_ERROR',
                    'message' => 'Validation failed',
                    'details' => $e->errors(),
                ]
            ], 422);
        }

        // Delete old cover if exists
        if ($release->cover_path) {
            Storage::disk('public')->delete($release->cover_path);
        }

        // Store new cover
        $path = $request->file('cover')->store('covers', 'public');
        $release->cover_path = $path;
        $release->save();

        return response()->json([
            'data' => [
                'id' => $release->id,
                'cover_path' => $release->cover_path,
                'cover_url' => $release->cover_path ? asset('storage/' . $release->cover_path) : null,
            ]
        ]);
    }

    /**
     * DELETE /artist-pages/{id}/releases/{releaseId}/cover
     */
    public function deleteCover(int $id, int $releaseId)
    {
        $artistPage = ArtistPage::findOrFail($id);
        Gate::authorize('update', $artistPage);

        $release = $artistPage->releases()->findOrFail($releaseId);

        if ($release->cover_path) {
            Storage::disk('public')->delete($release->cover_path);
            $release->cover_path = null;
            $release->save();
        }

        return response()->noContent();
    }
}
