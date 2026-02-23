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
     * GET /artist-pages/me/links
     */
    public function myLinks(Request $request)
    {
        $artistPage = $request->user()->artistPage;

        if (!$artistPage) {
            return response()->json(['error' => 'Artist page not found'], 404);
        }

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
            'title' => 'nullable|string|max:255',
            'url' => 'nullable|string|max:2048',
            'type' => 'nullable|string|in:facebook,instagram,tiktok,x,youtube,spotify,applemusic,soundcloud,bandcamp,website,custom',
        ]);

        $maxPosition = $artistPage->links()->max('position') ?? -1;

        $link = $artistPage->links()->create([
            'title' => $validated['title'] ?? null,
            'url' => $validated['url'] ?? null,
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
            'title' => 'nullable|string|max:255',
            'url' => 'nullable|string|max:2048',
            'type' => 'nullable|string|in:facebook,instagram,tiktok,x,youtube,spotify,applemusic,soundcloud,bandcamp,website,custom',
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
