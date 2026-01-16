<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ArtistPage;
use App\Models\Show;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class ShowController extends Controller
{
    /**
     * GET /artist-pages/{id}/shows
     */
    public function index(int $id)
    {
        $artistPage = ArtistPage::findOrFail($id);
        Gate::authorize('update', $artistPage);

        $shows = $artistPage->shows()->orderBy('starts_at')->get();

        return response()->json([
            'data' => $shows->map(fn($show) => [
                'id' => $show->id,
                'starts_at' => $show->starts_at->format('Y-m-d\TH:i:s'),
                'venue' => $show->venue,
                'city' => $show->city,
                'address' => $show->address,
                'ticket_url' => $show->ticket_url,
                'price' => $show->price,
                'is_free' => $show->is_free,
                'support_acts' => $show->support_acts,
                'flyer_path' => $show->flyer_path,
                'flyer_url' => $show->flyer_path ? Storage::disk('public')->url($show->flyer_path) : null,
                'status' => $show->status,
                'position' => $show->position,
            ])
        ]);
    }

    /**
     * POST /artist-pages/{id}/shows
     */
    public function store(Request $request, int $id)
    {
        $artistPage = ArtistPage::findOrFail($id);
        Gate::authorize('update', $artistPage);

        $validated = $request->validate([
            'starts_at' => 'required|date',
            'venue' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'address' => 'nullable|string|max:500',
            'ticket_url' => 'nullable|url|max:2048',
            'price' => 'nullable|numeric|min:0|max:99999.99',
            'is_free' => 'nullable|boolean',
            'support_acts' => 'nullable|array',
            'support_acts.*' => 'string|max:255',
            'status' => 'nullable|string|in:upcoming,sold_out,cancelled',
        ]);

        $maxPosition = $artistPage->shows()->max('position') ?? -1;

        // Treat input as local time, don't let Laravel convert it
        $show = $artistPage->shows()->create([
            'starts_at' => $validated['starts_at'],
            'venue' => $validated['venue'],
            'city' => $validated['city'],
            'address' => $validated['address'] ?? null,
            'ticket_url' => $validated['ticket_url'] ?? null,
            'price' => $validated['price'] ?? null,
            'is_free' => $validated['is_free'] ?? false,
            'support_acts' => $validated['support_acts'] ?? null,
            'status' => $validated['status'] ?? 'upcoming',
            'position' => $maxPosition + 1,
        ]);

        return response()->json([
            'data' => [
                'id' => $show->id,
                'starts_at' => $show->starts_at->format('Y-m-d\TH:i:s'),
                'venue' => $show->venue,
                'city' => $show->city,
                'address' => $show->address,
                'ticket_url' => $show->ticket_url,
                'price' => $show->price,
                'is_free' => $show->is_free,
                'support_acts' => $show->support_acts,
                'flyer_path' => $show->flyer_path,
                'flyer_url' => $show->flyer_path ? Storage::disk('public')->url($show->flyer_path) : null,
                'status' => $show->status,
                'position' => $show->position,
            ]
        ], 201);
    }

    /**
     * PATCH /artist-pages/{id}/shows/{showId}
     */
    public function update(Request $request, int $id, int $showId)
    {
        $artistPage = ArtistPage::findOrFail($id);
        Gate::authorize('update', $artistPage);

        $show = $artistPage->shows()->findOrFail($showId);

        $validated = $request->validate([
            'starts_at' => 'sometimes|required|date',
            'venue' => 'sometimes|required|string|max:255',
            'city' => 'sometimes|required|string|max:255',
            'address' => 'nullable|string|max:500',
            'ticket_url' => 'nullable|url|max:2048',
            'price' => 'nullable|numeric|min:0|max:99999.99',
            'is_free' => 'nullable|boolean',
            'support_acts' => 'nullable|array',
            'support_acts.*' => 'string|max:255',
            'status' => 'nullable|string|in:upcoming,sold_out,cancelled',
        ]);

        $show->update($validated);

        return response()->json([
            'data' => [
                'id' => $show->id,
                'starts_at' => $show->starts_at->format('Y-m-d\TH:i:s'),
                'venue' => $show->venue,
                'city' => $show->city,
                'address' => $show->address,
                'ticket_url' => $show->ticket_url,
                'price' => $show->price,
                'is_free' => $show->is_free,
                'support_acts' => $show->support_acts,
                'flyer_path' => $show->flyer_path,
                'flyer_url' => $show->flyer_path ? Storage::disk('public')->url($show->flyer_path) : null,
                'status' => $show->status,
                'position' => $show->position,
            ]
        ]);
    }

    /**
     * DELETE /artist-pages/{id}/shows/{showId}
     */
    public function destroy(int $id, int $showId)
    {
        $artistPage = ArtistPage::findOrFail($id);
        Gate::authorize('update', $artistPage);

        $show = $artistPage->shows()->findOrFail($showId);
        $show->delete();

        return response()->json([
            'data' => ['ok' => true]
        ]);
    }

    /**
     * POST /artist-pages/{id}/shows/reorder
     */
    public function reorder(Request $request, int $id)
    {
        $artistPage = ArtistPage::findOrFail($id);
        Gate::authorize('update', $artistPage);

        $validated = $request->validate([
            'show_ids' => 'required|array',
            'show_ids.*' => 'required|integer',
        ]);

        $showIds = $validated['show_ids'];

        foreach ($showIds as $index => $showId) {
            $artistPage->shows()->where('id', $showId)->update(['position' => $index]);
        }

        return response()->json([
            'data' => ['ok' => true]
        ]);
    }

    /**
     * POST /artist-pages/{id}/shows/{showId}/upload-flyer
     */
    public function uploadFlyer(Request $request, int $id, int $showId)
    {
        $artistPage = ArtistPage::findOrFail($id);
        Gate::authorize('update', $artistPage);

        $show = $artistPage->shows()->findOrFail($showId);

        try {
            $validated = $request->validate([
                'flyer' => ['required', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'], // 5MB max
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

        // Delete old flyer if exists
        if ($show->flyer_path) {
            Storage::disk('public')->delete($show->flyer_path);
        }

        // Store new flyer
        $path = $request->file('flyer')->store('flyers', 'public');
        $show->flyer_path = $path;
        $show->save();

        return response()->json([
            'data' => [
                'id' => $show->id,
                'flyer_path' => $show->flyer_path,
                'flyer_url' => $show->flyer_path ? Storage::disk('public')->url($show->flyer_path) : null,
            ]
        ]);
    }

    /**
     * DELETE /artist-pages/{id}/shows/{showId}/flyer
     */
    public function deleteFlyer(int $id, int $showId)
    {
        $artistPage = ArtistPage::findOrFail($id);
        Gate::authorize('update', $artistPage);

        $show = $artistPage->shows()->findOrFail($showId);

        if ($show->flyer_path) {
            Storage::disk('public')->delete($show->flyer_path);
            $show->flyer_path = null;
            $show->save();
        }

        return response()->json([
            'data' => ['ok' => true]
        ]);
    }
}
