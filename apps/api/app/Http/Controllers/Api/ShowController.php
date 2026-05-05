<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\NormalizesUrlInput;
use App\Http\Traits\ApiResponse;
use App\Models\ArtistPage;
use App\Rules\SafeExternalUrl;
use App\Services\ImageProcessingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use RuntimeException;

class ShowController extends Controller
{
    use ApiResponse;
    use NormalizesUrlInput;

    public function __construct(private readonly ImageProcessingService $imageProcessor) {}

    /**
     * GET /artist-pages/{id}/shows
     */
    public function index(int $id): JsonResponse
    {
        $artistPage = ArtistPage::findOrFail($id);
        Gate::authorize('update', $artistPage);

        $shows = $artistPage->shows()->orderBy('starts_at')->get();

        return $this->success($shows->map(fn($show) => [
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
        ]));
    }

    /**
     * POST /artist-pages/{id}/shows
     */
    public function store(Request $request, int $id): JsonResponse
    {
        $artistPage = ArtistPage::findOrFail($id);
        Gate::authorize('update', $artistPage);

        $this->normalizeUrlInput($request, ['ticket_url']);

        $validated = $request->validate([
            'starts_at' => 'required|date',
            'venue' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'address' => 'nullable|string|max:500',
            'ticket_url' => ['nullable', 'string', 'max:2048', new SafeExternalUrl()],
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

        return $this->success([
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
        ], 201);
    }

    /**
     * PATCH /artist-pages/{id}/shows/{showId}
     */
    public function update(Request $request, int $id, int $showId): JsonResponse
    {
        $artistPage = ArtistPage::findOrFail($id);
        Gate::authorize('update', $artistPage);

        $this->normalizeUrlInput($request, ['ticket_url']);

        $show = $artistPage->shows()->findOrFail($showId);

        $validated = $request->validate([
            'starts_at' => 'sometimes|required|date',
            'venue' => 'sometimes|required|string|max:255',
            'city' => 'sometimes|required|string|max:255',
            'address' => 'nullable|string|max:500',
            'ticket_url' => ['nullable', 'string', 'max:2048', new SafeExternalUrl()],
            'price' => 'nullable|numeric|min:0|max:99999.99',
            'is_free' => 'nullable|boolean',
            'support_acts' => 'nullable|array',
            'support_acts.*' => 'string|max:255',
            'status' => 'nullable|string|in:upcoming,sold_out,cancelled',
        ]);

        $show->update($validated);

        return $this->success([
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
        ]);
    }

    /**
     * DELETE /artist-pages/{id}/shows/{showId}
     */
    public function destroy(int $id, int $showId): JsonResponse
    {
        $artistPage = ArtistPage::findOrFail($id);
        Gate::authorize('update', $artistPage);

        $show = $artistPage->shows()->findOrFail($showId);
        $show->delete();

        return $this->success(['ok' => true]);
    }

    /**
     * POST /artist-pages/{id}/shows/reorder
     */
    public function reorder(Request $request, int $id): JsonResponse
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

        return $this->success(['ok' => true]);
    }

    /**
     * POST /artist-pages/{id}/shows/{showId}/upload-flyer
     */
    public function uploadFlyer(Request $request, int $id, int $showId): JsonResponse
    {
        $artistPage = ArtistPage::findOrFail($id);
        Gate::authorize('update', $artistPage);

        $show = $artistPage->shows()->findOrFail($showId);

        try {
            $request->validate([
                'flyer' => ['required', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'], // 5MB max
            ]);
        } catch (ValidationException $e) {
            return $this->validationError($e->errors());
        }

        try {
            $result = $this->imageProcessor->process($request->file('flyer'), 'flyer', 'flyers');
        } catch (RuntimeException $e) {
            return $this->error('IMAGE_PROCESSING_FAILED', 'Image could not be processed.', 422);
        }

        if ($show->flyer_path) {
            Storage::disk('public')->delete($show->flyer_path);
        }

        Storage::disk('public')->put($result['path'], $result['contents']);
        $show->flyer_path = $result['path'];
        $show->save();

        return $this->success([
            'id' => $show->id,
            'flyer_path' => $show->flyer_path,
            'flyer_url' => $show->flyer_path ? Storage::disk('public')->url($show->flyer_path) : null,
        ]);
    }

    /**
     * DELETE /artist-pages/{id}/shows/{showId}/flyer
     */
    public function deleteFlyer(int $id, int $showId): JsonResponse
    {
        $artistPage = ArtistPage::findOrFail($id);
        Gate::authorize('update', $artistPage);

        $show = $artistPage->shows()->findOrFail($showId);

        if ($show->flyer_path) {
            Storage::disk('public')->delete($show->flyer_path);
            $show->flyer_path = null;
            $show->save();
        }

        return $this->success(['ok' => true]);
    }
}
