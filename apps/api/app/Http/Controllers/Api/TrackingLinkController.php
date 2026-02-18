<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TrackingLink;
use Illuminate\Http\Request;

class TrackingLinkController extends Controller
{
    /**
     * Get all tracking links for authenticated user's artist page.
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

        $trackingLinks = TrackingLink::where('artist_page_id', $artistPage->id)
            ->with(['spotlight:id,title', 'campaign:id,name'])
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($link) {
                return [
                    'id' => $link->id,
                    'slug' => $link->slug,
                    'module' => $link->module,
                    'label' => $link->label,
                    'target_url' => $link->target_url,
                    'tracking_url' => $link->tracking_url,
                    'spotlight_id' => $link->spotlight_id,
                    'spotlight_title' => $link->spotlight?->title,
                    'campaign_id' => $link->campaign_id,
                    'campaign_name' => $link->campaign?->name,
                    'is_active' => $link->is_active,
                    'created_at' => $link->created_at->toISOString(),
                ];
            });

        return response()->json(['data' => $trackingLinks]);
    }

    /**
     * Create a new tracking link.
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
            'module' => 'required|string|in:spotlight,link,show,release,campaign',
            'label' => 'required|string|max:255',
            'target_url' => 'required|url|max:1000',
            'spotlight_id' => 'nullable|exists:spotlights,id',
            'campaign_id' => 'nullable|exists:campaigns,id',
            'utm_source' => 'nullable|string|max:255',
            'utm_medium' => 'nullable|string|max:255',
            'utm_campaign' => 'nullable|string|max:255',
            'utm_content' => 'nullable|string|max:255',
            'utm_term' => 'nullable|string|max:255',
        ]);

        // Generate unique slug
        $slug = TrackingLink::generateSlug();

        $trackingLink = TrackingLink::create([
            'artist_page_id' => $artistPage->id,
            'spotlight_id' => $validated['spotlight_id'] ?? null,
            'campaign_id' => $validated['campaign_id'] ?? null,
            'module' => $validated['module'],
            'label' => $validated['label'],
            'target_url' => $validated['target_url'],
            'slug' => $slug,
            'utm_source' => $validated['utm_source'] ?? null,
            'utm_medium' => $validated['utm_medium'] ?? null,
            'utm_campaign' => $validated['utm_campaign'] ?? null,
            'utm_content' => $validated['utm_content'] ?? null,
            'utm_term' => $validated['utm_term'] ?? null,
            'is_active' => true,
        ]);

        return response()->json([
            'data' => [
                'id' => $trackingLink->id,
                'slug' => $trackingLink->slug,
                'tracking_url' => $trackingLink->tracking_url,
                'target_url' => $trackingLink->target_url,
            ],
        ], 201);
    }

    /**
     * Delete a tracking link.
     */
    public function destroy(int $id)
    {
        $trackingLink = TrackingLink::findOrFail($id);

        $this->authorize('delete', $trackingLink);

        $trackingLink->delete();

        return response()->json(['data' => ['ok' => true]]);
    }
}
