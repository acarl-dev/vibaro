<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Spotlight;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class SpotlightController extends Controller
{
    /**
     * Get active spotlight for authenticated user's artist page.
     */
    public function active(Request $request)
    {
        $artistPage = $request->user()->artistPage;

        if (!$artistPage) {
            return response()->json([
                'error' => [
                    'code' => 'no_artist_page',
                    'message' => 'No artist page found for this user.',
                ],
            ], 404);
        }

        $spotlight = Spotlight::where('artist_page_id', $artistPage->id)
            ->active()
            ->where('status', 'active')
            ->first();

        return response()->json([
            'data' => $spotlight ? [
                'id' => $spotlight->id,
                'title' => $spotlight->title,
                'slug' => $spotlight->slug,
                'type' => $spotlight->type,
                'status' => $spotlight->status,
                'starts_at' => $spotlight->starts_at?->toISOString(),
                'ends_at' => $spotlight->ends_at?->toISOString(),
                'primary_url' => $spotlight->primary_url,
                'description' => $spotlight->description,
                'show_on_page' => $spotlight->show_on_page,
                'created_at' => $spotlight->created_at->toISOString(),
                'updated_at' => $spotlight->updated_at->toISOString(),
            ] : null,
        ]);
    }

    /**
     * Get all spotlights for authenticated user's artist page.
     */
    public function index(Request $request)
    {
        $artistPage = $request->user()->artistPage;

        if (!$artistPage) {
            return response()->json([
                'error' => [
                    'code' => 'no_artist_page',
                    'message' => 'No artist page found for this user.',
                ],
            ], 404);
        }

        $showArchived = $request->boolean('archived');

        $spotlights = Spotlight::where('artist_page_id', $artistPage->id)
            ->when($showArchived,
                fn($q) => $q->whereNotNull('archived_at'),
                fn($q) => $q->whereNull('archived_at')
            )
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($spotlight) {
                return [
                    'id' => $spotlight->id,
                    'title' => $spotlight->title,
                    'slug' => $spotlight->slug,
                    'type' => $spotlight->type,
                    'status' => $spotlight->status,
                    'starts_at' => $spotlight->starts_at?->toISOString(),
                    'ends_at' => $spotlight->ends_at?->toISOString(),
                    'primary_url' => $spotlight->primary_url,
                    'description' => $spotlight->description,
                    'show_on_page' => $spotlight->show_on_page,
                    'archived_at' => $spotlight->archived_at?->toISOString(),
                    'created_at' => $spotlight->created_at->toISOString(),
                    'updated_at' => $spotlight->updated_at->toISOString(),
                ];
            });

        return response()->json(['data' => $spotlights]);
    }

    /**
     * Create a new spotlight.
     */
    public function store(Request $request)
    {
        $artistPage = $request->user()->artistPage;

        if (!$artistPage) {
            return response()->json([
                'error' => [
                    'code' => 'no_artist_page',
                    'message' => 'No artist page found for this user.',
                ],
            ], 404);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|string|in:single,album,tour,event,video,merch,livestream,collab',
            'starts_at' => 'nullable|date',
            'ends_at' => 'nullable|date|after:starts_at',
            'primary_url' => 'required|url|max:1000',
            'description' => 'nullable|string|max:1000',
            'show_on_page' => 'nullable|boolean',
            'activate' => 'nullable|boolean',
        ]);

        // If activate=true, set to active (boot hook will end any other active spotlight)
        $status = ($validated['activate'] ?? false) ? 'active' : 'scheduled';

        $spotlight = Spotlight::create([
            'artist_page_id' => $artistPage->id,
            'title' => $validated['title'],
            'type' => $validated['type'],
            'status' => $status,
            'starts_at' => $validated['starts_at'] ?? null,
            'ends_at' => $validated['ends_at'] ?? null,
            'primary_url' => $validated['primary_url'],
            'description' => $validated['description'] ?? null,
            'show_on_page' => $validated['show_on_page'] ?? true,
        ]);

        return response()->json([
            'data' => [
                'id' => $spotlight->id,
                'title' => $spotlight->title,
                'slug' => $spotlight->slug,
                'type' => $spotlight->type,
                'status' => $spotlight->status,
                'starts_at' => $spotlight->starts_at?->toISOString(),
                'ends_at' => $spotlight->ends_at?->toISOString(),
                'primary_url' => $spotlight->primary_url,
                'description' => $spotlight->description,
                'show_on_page' => $spotlight->show_on_page,
                'created_at' => $spotlight->created_at->toISOString(),
                'updated_at' => $spotlight->updated_at->toISOString(),
            ],
        ], 201);
    }

    /**
     * Update an existing spotlight.
     */
    public function update(Request $request, int $id)
    {
        $spotlight = Spotlight::findOrFail($id);

        Gate::authorize('update', $spotlight);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'type' => 'sometimes|string|in:single,album,tour,event,video,merch,livestream,collab',
            'starts_at' => 'nullable|date',
            'ends_at' => 'nullable|date|after:starts_at',
            'primary_url' => 'sometimes|url|max:1000',
            'description' => 'nullable|string|max:1000',
            'show_on_page' => 'sometimes|boolean',
        ]);

        $spotlight->update($validated);

        return response()->json(['data' => ['ok' => true]]);
    }

    /**
     * Activate a spotlight (only one active per artist page).
     */
    public function activate(Request $request, int $id)
    {
        $spotlight = Spotlight::findOrFail($id);

        Gate::authorize('activate', $spotlight);

        // Model boot hook handles deactivating other spotlights
        $spotlight->update(['status' => 'active']);

        return response()->json([
            'data' => ['active_spotlight_id' => $spotlight->id],
        ]);
    }

    /**
     * End a spotlight.
     */
    public function end(Request $request, int $id)
    {
        $spotlight = Spotlight::findOrFail($id);

        Gate::authorize('end', $spotlight);

        $spotlight->update([
            'status' => 'ended',
            'ends_at' => now(),
            'show_on_page' => false,
        ]);

        // Archive all active tracking links for this spotlight
        \App\Models\TrackingLink::where('spotlight_id', $spotlight->id)
            ->active()
            ->update(['archived_at' => now()]);

        return response()->json([
            'data' => ['ended_spotlight_id' => $spotlight->id],
        ]);
    }

    /**
     * Toggle show_on_page for a spotlight.
     */
    public function toggleShowOnPage(Spotlight $spotlight)
    {
        Gate::authorize('update', $spotlight);

        $spotlight->update([
            'show_on_page' => !$spotlight->show_on_page,
        ]);

        return response()->json([
            'data' => [
                'id' => $spotlight->id,
                'show_on_page' => $spotlight->show_on_page,
            ],
        ]);
    }

    /**
     * Archive a spotlight (soft delete).
     */
    public function archive(Request $request, int $id)
    {
        $spotlight = Spotlight::findOrFail($id);

        Gate::authorize('archive', $spotlight);

        if ($spotlight->isArchived()) {
            return response()->json([
                'error' => [
                    'code' => 'already_archived',
                    'message' => 'This spotlight is already archived.',
                ],
            ], 400);
        }

        $spotlight->archive();

        return response()->json(['data' => ['ok' => true]]);
    }

    /**
     * Permanently delete an archived spotlight.
     */
    public function destroy(Request $request, int $id)
    {
        $spotlight = Spotlight::withoutGlobalScopes()->findOrFail($id);

        Gate::authorize('delete', $spotlight);

        if (!$spotlight->isArchived()) {
            return response()->json([
                'error' => [
                    'code' => 'not_archived',
                    'message' => 'Only archived spotlights can be permanently deleted.',
                ],
            ], 400);
        }

        $spotlight->delete();

        return response()->json(['data' => ['ok' => true]]);
    }

    /**
     * Restore an archived spotlight.
     */
    public function restore(Request $request, int $id)
    {
        $spotlight = Spotlight::withoutGlobalScopes()->findOrFail($id);

        Gate::authorize('restore', $spotlight);

        if (!$spotlight->isArchived()) {
            return response()->json([
                'error' => [
                    'code' => 'not_archived',
                    'message' => 'This spotlight is not archived.',
                ],
            ], 400);
        }

        $spotlight->restore();

        return response()->json(['data' => [
            'id'          => $spotlight->id,
            'title'       => $spotlight->title,
            'slug'        => $spotlight->slug,
            'type'        => $spotlight->type,
            'status'      => $spotlight->status,
            'starts_at'   => $spotlight->starts_at?->toISOString(),
            'ends_at'     => $spotlight->ends_at?->toISOString(),
            'primary_url' => $spotlight->primary_url,
            'description' => $spotlight->description,
            'show_on_page' => $spotlight->show_on_page,
            'archived_at' => null,
            'created_at'  => $spotlight->created_at->toISOString(),
            'updated_at'  => $spotlight->updated_at->toISOString(),
        ]]);
    }
}
