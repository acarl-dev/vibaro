<?php

namespace App\Http\Controllers\Api;

use App\Enums\Platform;
use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\TrackingLink;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Enum;

class TrackingLinkController extends Controller
{
    use ApiResponse;

    /**
     * Get all tracking links for authenticated user's artist page.
     */
    public function index(Request $request): JsonResponse
    {
        $artistPage = $request->user()->artistPage;

        $trackingLinks = TrackingLink::where('artist_page_id', $artistPage->id)
            ->notArchived()
            ->with(['spotlight:id,title', 'campaign:id,name'])
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($link) {
                return [
                    'id' => $link->id,
                    'short_code' => $link->short_code,
                    'slug' => $link->slug,
                    'module' => $link->module,
                    'label' => $link->label,
                    'target_url' => $link->target_url,
                    'tracking_url' => $link->tracking_url,
                    'platform' => $link->platform,
                    'placement' => $link->placement,
                    'click_count' => $link->click_count,
                    'spotlight_id' => $link->spotlight_id,
                    'spotlight_title' => $link->spotlight?->title,
                    'campaign_id' => $link->campaign_id,
                    'campaign_name' => $link->campaign?->name,
                    'utm_source' => $link->utm_source,
                    'utm_medium' => $link->utm_medium,
                    'utm_campaign' => $link->utm_campaign,
                    'is_active' => $link->is_active,
                    'created_at' => $link->created_at->toISOString(),
                ];
            });

        return $this->success($trackingLinks);
    }

    /**
     * Create a new tracking link.
     */
    public function store(Request $request): JsonResponse
    {
        $artistPage = $request->user()->artistPage;

        $validated = $request->validate([
            'spotlight_id' => 'required|exists:spotlights,id',
            'platform' => ['required', 'string', new Enum(Platform::class)],
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
            ->notArchived()
            ->first();

        if ($existing) {
            return $this->error(
                'DUPLICATE_LINK',
                'Ein Link für diese Plattform und Platzierung existiert bereits.',
                409
            );
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

        return $this->success([
            'id' => $trackingLink->id,
            'short_code' => $trackingLink->short_code,
            'tracking_url' => $trackingLink->tracking_url,
            'target_url' => $trackingLink->target_url,
            'platform' => $trackingLink->platform,
            'placement' => $trackingLink->placement,
            'label' => $trackingLink->label,
            'click_count' => $trackingLink->click_count,
            'utm_source' => $trackingLink->utm_source,
            'utm_medium' => $trackingLink->utm_medium,
            'utm_campaign' => $trackingLink->utm_campaign,
            'created_at' => $trackingLink->created_at->toISOString(),
        ], 201);
    }

    /**
     * Check if a tracking link exists for given spotlight/platform/placement.
     */
    public function check(Request $request): JsonResponse
    {
        $artistPage = $request->user()->artistPage;

        $validated = $request->validate([
            'spotlight_id' => 'required|integer',
            'platform' => 'required|string',
            'placement' => 'required|string',
        ]);

        $link = TrackingLink::where('spotlight_id', $validated['spotlight_id'])
            ->where('platform', $validated['platform'])
            ->where('placement', $validated['placement'])
            ->where('artist_page_id', $artistPage->id)
            ->notArchived()
            ->first();

        return $this->success([
            'exists' => $link !== null,
            'link' => $link ? [
                'id' => $link->id,
                'tracking_url' => $link->tracking_url,
                'platform' => $link->platform,
                'placement' => $link->placement,
                'click_count' => $link->click_count,
            ] : null,
        ]);
    }

    /**
     * Archive a tracking link.
     */
    public function archive(TrackingLink $trackingLink): JsonResponse
    {
        $this->authorize('update', $trackingLink);

        $trackingLink->archive();

        return $this->success([
            'id' => $trackingLink->id,
            'archived_at' => $trackingLink->archived_at->toISOString(),
        ]);
    }

    /**
     * Delete a tracking link.
     */
    public function destroy(int $id): JsonResponse
    {
        $trackingLink = TrackingLink::findOrFail($id);

        $this->authorize('delete', $trackingLink);

        $trackingLink->delete();

        return $this->success(['ok' => true]);
    }
}
