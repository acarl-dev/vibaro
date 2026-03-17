<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\Campaign;
use App\Models\Spotlight;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class CampaignController extends Controller
{
    use ApiResponse;

    /**
     * Get all campaigns for authenticated user's artist page.
     */
    public function index(Request $request): JsonResponse
    {
        $artistPage = $request->user()->artistPage;

        $campaigns = Campaign::where('artist_page_id', $artistPage->id)
            ->with(['spotlight:id,title'])
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($campaign) {
                return [
                    'id' => $campaign->id,
                    'name' => $campaign->name,
                    'platform' => $campaign->platform,
                    'notes' => $campaign->notes,
                    'spotlight_id' => $campaign->spotlight_id,
                    'spotlight_title' => $campaign->spotlight?->title,
                    'starts_at' => $campaign->starts_at?->toISOString(),
                    'ends_at' => $campaign->ends_at?->toISOString(),
                    'created_at' => $campaign->created_at->toISOString(),
                    'updated_at' => $campaign->updated_at->toISOString(),
                ];
            });

        return $this->success($campaigns);
    }

    /**
     * Create a new campaign.
     */
    public function store(Request $request): JsonResponse
    {
        $artistPage = $request->user()->artistPage;

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'platform' => 'nullable|string|max:100',
            'notes' => 'nullable|string|max:1000',
            'spotlight_id' => 'nullable|exists:spotlights,id',
            'starts_at' => 'nullable|date',
            'ends_at' => 'nullable|date|after:starts_at',
        ]);

        // If spotlight_id is provided, ensure it belongs to this artist page
        if (!empty($validated['spotlight_id'])) {
            $spotlight = Spotlight::find($validated['spotlight_id']);
            if (!$spotlight || $spotlight->artist_page_id !== $artistPage->id) {
                return $this->error('INVALID_SPOTLIGHT', 'Spotlight does not belong to your artist page.', 403);
            }
        }

        $campaign = Campaign::create([
            'artist_page_id' => $artistPage->id,
            'spotlight_id' => $validated['spotlight_id'] ?? null,
            'name' => $validated['name'],
            'platform' => $validated['platform'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'starts_at' => $validated['starts_at'] ?? null,
            'ends_at' => $validated['ends_at'] ?? null,
        ]);

        return $this->success([
            'id' => $campaign->id,
            'name' => $campaign->name,
        ], 201);
    }

    /**
     * Update an existing campaign.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $campaign = Campaign::findOrFail($id);

        Gate::authorize('update', $campaign);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'platform' => 'nullable|string|max:100',
            'notes' => 'nullable|string|max:1000',
            'spotlight_id' => 'nullable|exists:spotlights,id',
            'starts_at' => 'nullable|date',
            'ends_at' => 'nullable|date|after:starts_at',
        ]);

        // If spotlight_id is provided, ensure it belongs to this artist page
        if (isset($validated['spotlight_id']) && $validated['spotlight_id'] !== null) {
            $spotlight = Spotlight::find($validated['spotlight_id']);
            if (!$spotlight || $spotlight->artist_page_id !== $campaign->artist_page_id) {
                return $this->error('INVALID_SPOTLIGHT', 'Spotlight does not belong to your artist page.', 403);
            }
        }

        $campaign->update($validated);

        return $this->success(['ok' => true]);
    }

    /**
     * Delete a campaign.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $campaign = Campaign::findOrFail($id);

        Gate::authorize('delete', $campaign);

        $campaign->delete();

        return $this->success(['ok' => true]);
    }
}
