<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SpotlightResource;
use App\Http\Traits\ApiResponse;
use App\Models\Spotlight;
use App\Services\MetadataService;
use App\Services\SpotlightLifecycleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class SpotlightController extends Controller
{
    use ApiResponse;

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
            ->currentlyActive()
            ->first();

        return $this->success($spotlight ? (new SpotlightResource($spotlight))->resolve() : null);
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
            ->get();

        return $this->success(SpotlightResource::collection($spotlights)->resolve());
    }

    /**
     * Create a new spotlight.
     */
    public function store(Request $request, SpotlightLifecycleService $lifecycle): JsonResponse
    {
        $artistPage = $request->user()->artistPage;

        $validated = $request->validate([
            'title'              => 'required|string|max:255',
            'type'               => 'required|string|in:single,album,tour,event,video,merch,livestream,collab,studio,focus',
            'starts_at'          => 'nullable|date',
            'ends_at'            => 'nullable|date|after:starts_at',
            'primary_url'        => 'nullable|url|max:1000',
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

        // Activation side effects are centralized in SpotlightLifecycleService.
        $activate = (bool) ($validated['activate'] ?? false);
        $status = 'scheduled';

        $spotlight = Spotlight::create([
            'artist_page_id'     => $artistPage->id,
            'title'              => $validated['title'],
            'type'               => $validated['type'],
            'status'             => $status,
            'starts_at'          => $validated['starts_at'] ?? null,
            'ends_at'            => $validated['ends_at'] ?? null,
            'primary_url'        => $validated['primary_url'] ?? null,
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

        if ($activate) {
            $lifecycle->activate($spotlight);
            $spotlight->refresh();
        }

        return $this->success((new SpotlightResource($spotlight))->resolve(), 201);
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
            'type'               => 'sometimes|string|in:single,album,tour,event,video,merch,livestream,collab,studio,focus',
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

        return $this->success((new SpotlightResource($spotlight->fresh()))->resolve());
    }

    /**
     * Activate a spotlight (only one active per artist page).
     */
    public function activate(Request $request, int $id, SpotlightLifecycleService $lifecycle): JsonResponse
    {
        $spotlight = Spotlight::findOrFail($id);

        Gate::authorize('activate', $spotlight);

        if ($spotlight->isArchived()) {
            return $this->error('SPOTLIGHT_ARCHIVED', 'Archived spotlight cannot be activated.', 400);
        }

        $lifecycle->activate($spotlight);

        return $this->success(['active_spotlight_id' => $spotlight->id]);
    }

    /**
     * End a spotlight.
     */
    public function end(Request $request, int $id, SpotlightLifecycleService $lifecycle): JsonResponse
    {
        $spotlight = Spotlight::findOrFail($id);

        Gate::authorize('end', $spotlight);

        $lifecycle->end($spotlight);

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
    public function archive(Request $request, int $id, SpotlightLifecycleService $lifecycle): JsonResponse
    {
        $spotlight = Spotlight::findOrFail($id);

        Gate::authorize('archive', $spotlight);

        if ($spotlight->isArchived()) {
            return $this->error('ALREADY_ARCHIVED', 'This spotlight is already archived.', 400);
        }

        $lifecycle->archive($spotlight);

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
    public function restore(Request $request, int $id, SpotlightLifecycleService $lifecycle): JsonResponse
    {
        $spotlight = Spotlight::withoutGlobalScopes()->findOrFail($id);

        Gate::authorize('restore', $spotlight);

        if (!$spotlight->isArchived()) {
            return $this->error('NOT_ARCHIVED', 'This spotlight is not archived.', 400);
        }

        $lifecycle->restore($spotlight);

        return $this->success((new SpotlightResource($spotlight->fresh()))->resolve());
    }
}
