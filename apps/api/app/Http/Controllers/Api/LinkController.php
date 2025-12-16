<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ArtistPage;
use App\Models\Link;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class LinkController extends Controller
{
    /**
     * GET /artist-pages/{id}/links
     */
    public function index(int $id)
    {
        $artistPage = ArtistPage::findOrFail($id);
        Gate::authorize('update', $artistPage);

        $links = $artistPage->links()->orderBy('position')->get();

        return response()->json([
            'data' => $links->map(fn($link) => [
                'id' => $link->id,
                'type' => $link->type,
                'title' => $link->title,
                'url' => $link->url,
                'position' => $link->position,
                'is_visible' => $link->is_visible,
            ])
        ]);
    }

    /**
     * POST /artist-pages/{id}/links
     */
    public function store(Request $request, int $id)
    {
        $artistPage = ArtistPage::findOrFail($id);
        Gate::authorize('update', $artistPage);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'url' => 'required|url|max:2048',
            'type' => 'nullable|string|in:custom,spotify,youtube,instagram',
        ]);

        $maxPosition = $artistPage->links()->max('position') ?? -1;

        $link = $artistPage->links()->create([
            'title' => $validated['title'],
            'url' => $validated['url'],
            'type' => $validated['type'] ?? 'custom',
            'position' => $maxPosition + 1,
            'is_visible' => true,
        ]);

        return response()->json([
            'data' => [
                'id' => $link->id,
                'type' => $link->type,
                'title' => $link->title,
                'url' => $link->url,
                'position' => $link->position,
                'is_visible' => $link->is_visible,
            ]
        ], 201);
    }

    /**
     * PATCH /artist-pages/{id}/links/{linkId}
     */
    public function update(Request $request, int $id, int $linkId)
    {
        $artistPage = ArtistPage::findOrFail($id);
        Gate::authorize('update', $artistPage);

        $link = $artistPage->links()->findOrFail($linkId);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'url' => 'sometimes|required|url|max:2048',
            'type' => 'nullable|string|in:custom,spotify,youtube,instagram',
            'is_visible' => 'nullable|boolean',
        ]);

        $link->update($validated);

        return response()->json([
            'data' => [
                'id' => $link->id,
                'type' => $link->type,
                'title' => $link->title,
                'url' => $link->url,
                'position' => $link->position,
                'is_visible' => $link->is_visible,
            ]
        ]);
    }

    /**
     * DELETE /artist-pages/{id}/links/{linkId}
     */
    public function destroy(int $id, int $linkId)
    {
        $artistPage = ArtistPage::findOrFail($id);
        Gate::authorize('update', $artistPage);

        $link = $artistPage->links()->findOrFail($linkId);
        $link->delete();

        return response()->json([
            'data' => ['ok' => true]
        ]);
    }

    /**
     * POST /artist-pages/{id}/links/reorder
     */
    public function reorder(Request $request, int $id)
    {
        $artistPage = ArtistPage::findOrFail($id);
        Gate::authorize('update', $artistPage);

        $validated = $request->validate([
            'link_ids' => 'required|array',
            'link_ids.*' => 'required|integer',
        ]);

        $linkIds = $validated['link_ids'];

        // Update positions
        foreach ($linkIds as $index => $linkId) {
            $artistPage->links()->where('id', $linkId)->update(['position' => $index]);
        }

        return response()->json([
            'data' => ['ok' => true]
        ]);
    }
}
