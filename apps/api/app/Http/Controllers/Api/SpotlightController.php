<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\Spotlight;
use App\Services\MetadataService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class SpotlightController extends Controller
{
    use ApiResponse;

    /**
     * Shared formatter: convert a Spotlight model instance to API array.
     */
    private function spotlightToArray(Spotlight $spotlight): array
    {
        return [
            'id'                  => $spotlight->id,
            'title'               => $spotlight->title,
            'slug'                => $spotlight->slug,
            'type'                => $spotlight->type,
            'status'              => $spotlight->status,
            'starts_at'           => $spotlight->starts_at?->toISOString(),
            'ends_at'             => $spotlight->ends_at?->toISOString(),
            'primary_url'         => $spotlight->primary_url,
            'cover_image_url'     => $spotlight->cover_image_url,
            'artist_name'         => $spotlight->artist_name,
            'platform_name'       => $spotlight->platform_name,
            'description'         => $spotlight->description,
            'subtitle'            => $spotlight->subtitle,
            'cta_label'           => $spotlight->cta_label,
            'secondary_cta_url'   => $spotlight->secondary_cta_url,
            'secondary_cta_label' => $spotlight->secondary_cta_label,
            'background_image_url'=> $spotlight->background_image_url,
            'meta'                => $spotlight->meta,
            'show_on_page'        => $spotlight->show_on_page,
            'archived_at'         => $spotlight->archived_at?->toISOString(),
            'created_at'          => $spotlight->created_at->toISOString(),
            'updated_at'          => $spotlight->updated_at->toISOString(),
        ];
    }

    /**
     * Fetch oEmbed metadata from a public URL (Spotify, YouTube, SoundCloud, etc.).
     * Used by the frontend to auto-fill project details on URL paste.
     */
    public function fetchMetadata(Request $request, MetadataService $metadataService): JsonResponse
    {
        $validated = $request->validate([
            'url' => 'required|url|max:1000',
        ]);

        $meta = $metadataService->fetchFromUrl($validated['url']);

        return $this->success($meta);
    }

    /**
     * Get active spotlight for authenticated user's artist page.
     */
    public function active(Request $request): JsonResponse
    {
        $artistPage = $request->user()->artistPage;

        $spotlight = Spotlight::where('artist_page_id', $artistPage->id)
            ->active()
            ->where('status', 'active')
            ->first();

        return $this->success($spotlight ? $this->spotlightToArray($spotlight) : null);
    }

    /**
     * Get all spotlights for authenticated user's artist page.
     */
    public function index(Request $request): JsonResponse
    {
        $artistPage = $request->user()->artistPage;

        $showArchived = $request->boolean('archived');

        $spotlights = Spotlight::where('artist_page_id', $artistPage->id)
            ->when($showArchived,
                fn($q) => $q->whereNotNull('archived_at'),
                fn($q) => $q->whereNull('archived_at')
            )
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($s) => $this->spotlightToArray($s));

        return $this->success($spotlights);
    }

    /**
     * Create a new spotlight.
     */
    public function store(Request $request): JsonResponse
    {
        $artistPage = $request->user()->artistPage;

        $validated = $request->validate([
            'title'              => 'required|string|max:255',
            'type'               => 'required|string|in:single,album,tour,event,video,merch,livestream,collab',
            'starts_at'          => 'nullable|date',
            'ends_at'            => 'nullable|date|after:starts_at',
            'primary_url'        => 'required|url|max:1000',
            'cover_image_url'    => 'nullable|url|max:1000',
            'artist_name'        => 'nullable|string|max:255',
            'platform_name'      => 'nullable|string|max:100',
            'description'        => 'nullable|string|max:1000',
            'subtitle'           => 'nullable|string|max:500',
            'cta_label'          => 'nullable|string|max:100',
            'secondary_cta_url'  => 'nullable|url|max:1000',
            'secondary_cta_label'=> 'nullable|string|max:100',
            'background_image_url'=> 'nullable|url|max:1000',
            'meta'               => 'nullable|array',
            'show_on_page'       => 'nullable|boolean',
            'activate'           => 'nullable|boolean',
        ]);

        // If activate=true, set to active (boot hook will end any other active spotlight)
        $status = ($validated['activate'] ?? false) ? 'active' : 'scheduled';

        $spotlight = Spotlight::create([
            'artist_page_id'     => $artistPage->id,
            'title'              => $validated['title'],
            'type'               => $validated['type'],
            'status'             => $status,
            'starts_at'          => $validated['starts_at'] ?? null,
            'ends_at'            => $validated['ends_at'] ?? null,
            'primary_url'        => $validated['primary_url'],
            'cover_image_url'    => $validated['cover_image_url'] ?? null,
            'artist_name'        => $validated['artist_name'] ?? null,
            'platform_name'      => $validated['platform_name'] ?? null,
            'description'        => $validated['description'] ?? null,
            'subtitle'           => $validated['subtitle'] ?? null,
            'cta_label'          => $validated['cta_label'] ?? null,
            'secondary_cta_url'  => $validated['secondary_cta_url'] ?? null,
            'secondary_cta_label'=> $validated['secondary_cta_label'] ?? null,
            'background_image_url'=> $validated['background_image_url'] ?? null,
            'meta'               => $validated['meta'] ?? null,
            'show_on_page'       => $validated['show_on_page'] ?? true,
        ]);

        return $this->success($this->spotlightToArray($spotlight), 201);
    }

    /**
     * Update an existing spotlight.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $spotlight = Spotlight::findOrFail($id);

        Gate::authorize('update', $spotlight);

        $validated = $request->validate([
            'title'              => 'sometimes|string|max:255',
            'type'               => 'sometimes|string|in:single,album,tour,event,video,merch,livestream,collab',
            'starts_at'          => 'nullable|date',
            'ends_at'            => 'nullable|date|after:starts_at',
            'primary_url'        => 'sometimes|url|max:1000',
            'cover_image_url'    => 'nullable|url|max:1000',
            'artist_name'        => 'nullable|string|max:255',
            'platform_name'      => 'nullable|string|max:100',
            'description'        => 'nullable|string|max:1000',
            'subtitle'           => 'nullable|string|max:500',
            'cta_label'          => 'nullable|string|max:100',
            'secondary_cta_url'  => 'nullable|url|max:1000',
            'secondary_cta_label'=> 'nullable|string|max:100',
            'background_image_url'=> 'nullable|url|max:1000',
            'meta'               => 'nullable|array',
            'show_on_page'       => 'sometimes|boolean',
        ]);

        $spotlight->update($validated);

        return $this->success($this->spotlightToArray($spotlight->fresh()));
    }

    /**
     * Activate a spotlight (only one active per artist page).
     */
    public function activate(Request $request, int $id): JsonResponse
    {
        $spotlight = Spotlight::findOrFail($id);

        Gate::authorize('activate', $spotlight);

        // Model boot hook handles deactivating other spotlights
        $spotlight->update(['status' => 'active']);

        return $this->success(['active_spotlight_id' => $spotlight->id]);
    }

    /**
     * End a spotlight.
     */
    public function end(Request $request, int $id): JsonResponse
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

        return $this->success(['ended_spotlight_id' => $spotlight->id]);
    }

    /**
     * Toggle show_on_page for a spotlight.
     */
    public function toggleShowOnPage(Spotlight $spotlight): JsonResponse
    {
        Gate::authorize('update', $spotlight);

        $spotlight->update([
            'show_on_page' => !$spotlight->show_on_page,
        ]);

        return $this->success([
            'id' => $spotlight->id,
            'show_on_page' => $spotlight->show_on_page,
        ]);
    }

    /**
     * Archive a spotlight (soft delete).
     */
    public function archive(Request $request, int $id): JsonResponse
    {
        $spotlight = Spotlight::findOrFail($id);

        Gate::authorize('archive', $spotlight);

        if ($spotlight->isArchived()) {
            return $this->error('ALREADY_ARCHIVED', 'This spotlight is already archived.', 400);
        }

        $spotlight->archive();

        return $this->success(['ok' => true]);
    }

    /**
     * Permanently delete an archived spotlight.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $spotlight = Spotlight::withoutGlobalScopes()->findOrFail($id);

        Gate::authorize('delete', $spotlight);

        if (!$spotlight->isArchived()) {
            return $this->error('NOT_ARCHIVED', 'Only archived spotlights can be permanently deleted.', 400);
        }

        $spotlight->delete();

        return $this->success(['ok' => true]);
    }

    /**
     * Restore an archived spotlight.
     */
    public function restore(Request $request, int $id): JsonResponse
    {
        $spotlight = Spotlight::withoutGlobalScopes()->findOrFail($id);

        Gate::authorize('restore', $spotlight);

        if (!$spotlight->isArchived()) {
            return $this->error('NOT_ARCHIVED', 'This spotlight is not archived.', 400);
        }

        $spotlight->restore();

        return $this->success($this->spotlightToArray($spotlight->fresh()));
    }
}
