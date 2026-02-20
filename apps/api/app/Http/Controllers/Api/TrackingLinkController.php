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
            'spotlight_id' => 'required|exists:spotlights,id',
            'platform' => 'required|string|in:instagram,tiktok,youtube,facebook,twitter,whatsapp,telegram,email,other',
            'placement' => 'required|string|max:50',
            'target_url' => 'required|url|max:1000',
        ]);

        // Ownership check: Spotlight belongs to this artist page
        $spotlight = \App\Models\Spotlight::where('id', $validated['spotlight_id'])
            ->where('artist_page_id', $artistPage->id)
            ->firstOrFail();

        // Duplicate check
        $existing = TrackingLink::where('spotlight_id', $spotlight->id)
            ->where('platform', $validated['platform'])
            ->where('placement', $validated['placement'])
            ->active()
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'Ein Link für diese Plattform und Platzierung existiert bereits.',
                'data' => [
                    'id' => $existing->id,
                    'tracking_url' => $existing->tracking_url,
                    'platform' => $existing->platform,
                    'placement' => $existing->placement,
                ],
            ], 409);
        }

        // Campaign auto-create or find
        $campaign = \App\Models\Campaign::firstOrCreate([
            'artist_page_id' => $artistPage->id,
            'spotlight_id' => $spotlight->id,
            'platform' => $validated['platform'],
        ], [
            'name' => ucfirst($validated['platform']) . ' — ' . $spotlight->title,
        ]);

        // Create link (label + UTMs auto-generated in model boot)
        $trackingLink = TrackingLink::create([
            'artist_page_id' => $artistPage->id,
            'spotlight_id' => $spotlight->id,
            'campaign_id' => $campaign->id,
            'platform' => $validated['platform'],
            'placement' => $validated['placement'],
            'target_url' => $validated['target_url'],
            'module' => 'share',
            'is_active' => true,
        ]);

        return response()->json([
            'data' => [
                'id' => $trackingLink->id,
                'short_code' => $trackingLink->short_code,
                'tracking_url' => $trackingLink->tracking_url,
                'target_url' => $trackingLink->target_url,
                'platform' => $trackingLink->platform,
                'placement' => $trackingLink->placement,
                'label' => $trackingLink->label,
            ],
        ], 201);
    }

    /**
     * Check if a tracking link exists for given spotlight/platform/placement.
     */
    public function check(Request $request)
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
            'spotlight_id' => 'required|integer',
            'platform' => 'required|string',
            'placement' => 'required|string',
        ]);

        $link = TrackingLink::where('spotlight_id', $validated['spotlight_id'])
            ->where('platform', $validated['platform'])
            ->where('placement', $validated['placement'])
            ->where('artist_page_id', $artistPage->id)
            ->active()
            ->first();

        return response()->json([
            'data' => [
                'exists' => $link !== null,
                'link' => $link ? [
                    'id' => $link->id,
                    'tracking_url' => $link->tracking_url,
                    'platform' => $link->platform,
                    'placement' => $link->placement,
                    'click_count' => $link->click_count,
                ] : null,
            ],
        ]);
    }

    /**
     * Archive a tracking link.
     */
    public function archive(TrackingLink $trackingLink)
    {
        $this->authorize('update', $trackingLink);

        $trackingLink->archive();

        return response()->json([
            'data' => [
                'id' => $trackingLink->id,
                'archived_at' => $trackingLink->archived_at->toISOString(),
            ],
        ]);
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
