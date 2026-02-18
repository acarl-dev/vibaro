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
            ->where('status', 'active')
            ->first();

        return response()->json([
            'data' => $spotlight ? [
                'id' => $spotlight->id,
                'title' => $spotlight->title,
                'type' => $spotlight->type,
                'status' => $spotlight->status,
                'starts_at' => $spotlight->starts_at?->toISOString(),
                'ends_at' => $spotlight->ends_at?->toISOString(),
                'primary_url' => $spotlight->primary_url,
                'description' => $spotlight->description,
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

        $spotlights = Spotlight::where('artist_page_id', $artistPage->id)
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($spotlight) {
                return [
                    'id' => $spotlight->id,
                    'title' => $spotlight->title,
                    'type' => $spotlight->type,
                    'status' => $spotlight->status,
                    'starts_at' => $spotlight->starts_at?->toISOString(),
                    'ends_at' => $spotlight->ends_at?->toISOString(),
                    'primary_url' => $spotlight->primary_url,
                    'description' => $spotlight->description,
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
            'type' => 'required|string|in:release,tour,announcement,other',
            'starts_at' => 'nullable|date',
            'ends_at' => 'nullable|date|after:starts_at',
            'primary_url' => 'required|url|max:1000',
            'description' => 'nullable|string|max:1000',
        ]);

        $spotlight = Spotlight::create([
            'artist_page_id' => $artistPage->id,
            'title' => $validated['title'],
            'type' => $validated['type'],
            'status' => 'scheduled',
            'starts_at' => $validated['starts_at'] ?? null,
            'ends_at' => $validated['ends_at'] ?? null,
            'primary_url' => $validated['primary_url'],
            'description' => $validated['description'] ?? null,
        ]);

        return response()->json([
            'data' => [
                'id' => $spotlight->id,
                'status' => $spotlight->status,
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
            'type' => 'sometimes|string|in:release,tour,announcement,other',
            'starts_at' => 'nullable|date',
            'ends_at' => 'nullable|date|after:starts_at',
            'primary_url' => 'sometimes|url|max:1000',
            'description' => 'nullable|string|max:1000',
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
        ]);

        return response()->json([
            'data' => ['ended_spotlight_id' => $spotlight->id],
        ]);
    }
}
