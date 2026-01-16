<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ArtistPage;
use App\Models\FeaturedTrack;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class FeaturedTrackController extends Controller
{
    /**
     * GET /artist-pages/{id}/featured-tracks
     */
    public function index(int $id)
    {
        $artistPage = ArtistPage::findOrFail($id);
        Gate::authorize('update', $artistPage);

        $tracks = $artistPage->featuredTracks()->orderBy('position')->get();

        return response()->json([
            'data' => $tracks->map(fn($track) => [
                'id' => $track->id,
                'title' => $track->title,
                'artist_name' => $track->artist_name,
                'platform' => $track->platform,
                'platform_url' => $track->platform_url,
                'embed_id' => $track->embed_id,
                'position' => $track->position,
            ]),
        ]);
    }

    /**
     * POST /artist-pages/{id}/featured-tracks
     */
    public function store(Request $request, int $id)
    {
        $artistPage = ArtistPage::findOrFail($id);
        Gate::authorize('update', $artistPage);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'artist_name' => 'nullable|string|max:255',
            'platform' => 'required|string|in:spotify,youtubemusic,soundcloud',
            'platform_url' => 'required|url|max:500',
            'embed_id' => 'nullable|string|max:255',
        ]);

        // Auto-extract embed_id if not provided
        if (empty($validated['embed_id'])) {
            $validated['embed_id'] = $this->extractEmbedId(
                $validated['platform'],
                $validated['platform_url']
            );
        }

        // Set position to the end
        $maxPosition = $artistPage->featuredTracks()->max('position') ?? -1;
        $validated['position'] = $maxPosition + 1;

        $track = $artistPage->featuredTracks()->create($validated);

        return response()->json([
            'data' => [
                'id' => $track->id,
                'title' => $track->title,
                'artist_name' => $track->artist_name,
                'platform' => $track->platform,
                'platform_url' => $track->platform_url,
                'embed_id' => $track->embed_id,
                'position' => $track->position,
            ],
        ], 201);
    }

    /**
     * PATCH /artist-pages/{id}/featured-tracks/{trackId}
     */
    public function update(Request $request, int $id, int $trackId)
    {
        $artistPage = ArtistPage::findOrFail($id);
        Gate::authorize('update', $artistPage);

        $track = $artistPage->featuredTracks()->findOrFail($trackId);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'artist_name' => 'nullable|string|max:255',
            'platform' => 'sometimes|string|in:spotify,youtubemusic,soundcloud',
            'platform_url' => 'sometimes|url|max:500',
            'embed_id' => 'nullable|string|max:255',
            'position' => 'sometimes|integer|min:0',
        ]);

        // Re-extract embed_id if platform_url changed
        if (isset($validated['platform_url']) && empty($validated['embed_id'])) {
            $platform = $validated['platform'] ?? $track->platform;
            $validated['embed_id'] = $this->extractEmbedId($platform, $validated['platform_url']);
        }

        $track->update($validated);

        return response()->json([
            'data' => [
                'id' => $track->id,
                'title' => $track->title,
                'artist_name' => $track->artist_name,
                'platform' => $track->platform,
                'platform_url' => $track->platform_url,
                'embed_id' => $track->embed_id,
                'position' => $track->position,
            ],
        ]);
    }

    /**
     * DELETE /artist-pages/{id}/featured-tracks/{trackId}
     */
    public function destroy(int $id, int $trackId)
    {
        $artistPage = ArtistPage::findOrFail($id);
        Gate::authorize('update', $artistPage);

        $track = $artistPage->featuredTracks()->findOrFail($trackId);
        $track->delete();

        return response()->json(null, 204);
    }

    /**
     * POST /artist-pages/{id}/featured-tracks/reorder
     */
    public function reorder(Request $request, int $id)
    {
        $artistPage = ArtistPage::findOrFail($id);
        Gate::authorize('update', $artistPage);

        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:featured_tracks,id',
        ]);

        foreach ($validated['ids'] as $position => $trackId) {
            FeaturedTrack::where('id', $trackId)
                ->where('artist_page_id', $artistPage->id)
                ->update(['position' => $position]);
        }

        return response()->json(['message' => 'Reordered successfully']);
    }

    /**
     * Extract embed ID from platform URL
     */
    private function extractEmbedId(string $platform, string $url): ?string
    {
        switch ($platform) {
            case 'spotify':
                // https://open.spotify.com/track/ABC123...
                // https://open.spotify.com/intl-de/track/ABC123...
                // https://open.spotify.com/embed/track/ABC123
                if (preg_match('/spotify\.com\/(?:intl-[a-z]{2}(?:-[A-Z]{2})?|[a-z]{2}(?:-[A-Z]{2})?)?\/(?:embed\/)?track\/([a-zA-Z0-9]+)/', $url, $matches)) {
                    return $matches[1];
                }
                break;

            case 'soundcloud':
                // SoundCloud requires full URL for embed
                return $url;

            case 'youtubemusic':
                // https://music.youtube.com/watch?v=ABC123
                if (preg_match('/music\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/', $url, $matches)) {
                    return $matches[1];
                }
                break;
        }

        return null;
    }
}
