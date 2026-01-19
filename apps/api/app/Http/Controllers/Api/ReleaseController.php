<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ArtistPage;
use App\Models\Release;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ReleaseController extends Controller
{
    /**
     * GET /artist-pages/{id}/releases
     */
    public function index(int $id)
    {
        $artistPage = ArtistPage::findOrFail($id);
        Gate::authorize('update', $artistPage);

        $releases = $artistPage->releases()->orderBy('release_date', 'desc')->get();

        $releases->each(function (Release $release) {
            $this->tryAutoCoverFromUrl($release, $release->url);
            $this->tryAutoReleaseTypeFromUrl($release, $release->url);
        });

        return response()->json([
            'data' => $releases->map(fn($release) => [
                'id' => $release->id,
                'title' => $release->title,
                'release_date' => $release->release_date?->toDateString(),
                'url' => $release->url,
                'cover_path' => $release->cover_path,
                'release_type' => $release->release_type,
                'is_featured' => $release->is_featured,
                'position' => $release->position,
            ])
        ]);
    }

    /**
     * POST /artist-pages/{id}/releases
     */
    public function store(Request $request, int $id)
    {
        $artistPage = ArtistPage::findOrFail($id);
        Gate::authorize('update', $artistPage);

        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'release_date' => 'nullable|date',
            'url' => 'nullable|url|max:2048',
            'is_featured' => 'nullable|boolean',
        ]);

        $title = trim($validated['title'] ?? '');
        $url = $validated['url'] ?? null;
        $oembed = null;

        if ($title === '' && $url) {
            $oembed = $this->fetchOembed($url);
            $title = trim((string) ($oembed['title'] ?? ''));
        }

        if ($title === '') {
            return response()->json([
                'error' => [
                    'code' => 'VALIDATION_ERROR',
                    'message' => 'Invalid input',
                    'fields' => [
                        'title' => ['Titel ist erforderlich oder muss aus einem unterstützten Link kommen.'],
                    ],
                ],
            ], 422);
        }

        $maxPosition = $artistPage->releases()->max('position') ?? -1;

        $release = $artistPage->releases()->create([
            'title' => $title,
            'release_date' => $validated['release_date'] ?? null,
            'url' => $url,
            'release_type' => $this->inferReleaseTypeFromUrl($url),
            'is_featured' => $validated['is_featured'] ?? false,
            'position' => $maxPosition + 1,
        ]);

        $this->tryAutoCoverFromUrl($release, $url, $oembed);
        $this->tryAutoReleaseDateFromUrl($release, $url, $oembed);

        return response()->json([
            'data' => [
                'id' => $release->id,
                'title' => $release->title,
                'release_date' => $release->release_date?->toDateString(),
                'url' => $release->url,
                'cover_path' => $release->cover_path,
                'release_type' => $release->release_type,
                'is_featured' => $release->is_featured,
                'position' => $release->position,
            ]
        ], 201);
    }

    /**
     * PATCH /artist-pages/{id}/releases/{releaseId}
     */
    public function update(Request $request, int $id, int $releaseId)
    {
        $artistPage = ArtistPage::findOrFail($id);
        Gate::authorize('update', $artistPage);

        $release = $artistPage->releases()->findOrFail($releaseId);

        $validated = $request->validate([
            'title' => 'sometimes|nullable|string|max:255',
            'release_date' => 'sometimes|nullable|date',
            'url' => 'nullable|url|max:2048',
            'is_featured' => 'nullable|boolean',
        ]);

        $oembed = null;
        if (array_key_exists('title', $validated)) {
            $title = trim((string) ($validated['title'] ?? ''));
            if ($title === '') {
                $url = $validated['url'] ?? $release->url;
                if ($url) {
                    $oembed = $this->fetchOembed($url);
                    $title = trim((string) ($oembed['title'] ?? ''));
                }

                if ($title === '') {
                    return response()->json([
                        'error' => [
                            'code' => 'VALIDATION_ERROR',
                            'message' => 'Invalid input',
                            'fields' => [
                                'title' => ['Titel ist erforderlich oder muss aus einem unterstützten Link kommen.'],
                            ],
                        ],
                    ], 422);
                }

                $validated['title'] = $title;
            }
        }

        $release->update($validated);

        if (array_key_exists('url', $validated)) {
            $this->tryAutoCoverFromUrl($release, $validated['url'], $oembed);
            $this->tryAutoReleaseTypeFromUrl($release, $validated['url']);
        } elseif ($oembed) {
            $this->tryAutoCoverFromUrl($release, $release->url, $oembed);
        }

        if (array_key_exists('url', $validated) || array_key_exists('release_date', $validated)) {
            $this->tryAutoReleaseDateFromUrl($release, $release->url, $oembed);
        }

        return response()->json([
            'data' => [
                'id' => $release->id,
                'title' => $release->title,
                'release_date' => $release->release_date?->toDateString(),
                'url' => $release->url,
                'cover_path' => $release->cover_path,
                'release_type' => $release->release_type,
                'is_featured' => $release->is_featured,
                'position' => $release->position,
            ]
        ]);
    }

    /**
     * DELETE /artist-pages/{id}/releases/{releaseId}
     */
    public function destroy(int $id, int $releaseId)
    {
        $artistPage = ArtistPage::findOrFail($id);
        Gate::authorize('update', $artistPage);

        $release = $artistPage->releases()->findOrFail($releaseId);

        // Delete cover if exists
        if ($release->cover_path) {
            Storage::disk('public')->delete($release->cover_path);
        }

        $release->delete();

        return response()->json([
            'data' => ['ok' => true]
        ]);
    }

    /**
     * POST /artist-pages/{id}/releases/reorder
     */
    public function reorder(Request $request, int $id)
    {
        $artistPage = ArtistPage::findOrFail($id);
        Gate::authorize('update', $artistPage);

        $validated = $request->validate([
            'release_ids' => 'required|array',
            'release_ids.*' => 'required|integer',
        ]);

        $releaseIds = $validated['release_ids'];

        foreach ($releaseIds as $index => $releaseId) {
            $artistPage->releases()->where('id', $releaseId)->update(['position' => $index]);
        }

        return response()->json([
            'data' => ['ok' => true]
        ]);
    }

    /**
     * POST /artist-pages/{id}/releases/{releaseId}/upload-cover
     */
    public function uploadCover(Request $request, int $id, int $releaseId)
    {
        $artistPage = ArtistPage::findOrFail($id);
        Gate::authorize('update', $artistPage);

        $release = $artistPage->releases()->findOrFail($releaseId);

        try {
            $validated = $request->validate([
                'cover' => ['required', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'], // 5MB max
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

        // Delete old cover if exists
        if ($release->cover_path) {
            Storage::disk('public')->delete($release->cover_path);
        }

        // Store new cover
        $path = $request->file('cover')->store('covers', 'public');
        $release->cover_path = $path;
        $release->save();

        return response()->json([
            'data' => [
                'id' => $release->id,
                'cover_path' => $release->cover_path,
                'cover_url' => $release->cover_path ? asset('storage/' . $release->cover_path) : null,
            ]
        ]);
    }

    /**
     * DELETE /artist-pages/{id}/releases/{releaseId}/cover
     */
    public function deleteCover(int $id, int $releaseId)
    {
        $artistPage = ArtistPage::findOrFail($id);
        Gate::authorize('update', $artistPage);

        $release = $artistPage->releases()->findOrFail($releaseId);

        if ($release->cover_path) {
            Storage::disk('public')->delete($release->cover_path);
            $release->cover_path = null;
            $release->save();
        }

        return response()->noContent();
    }

    private function tryAutoCoverFromUrl(Release $release, ?string $url, ?array $oembed = null): void
    {
        if (!$url || $release->cover_path) {
            return;
        }
        try {
            $oembed = $oembed ?? $this->fetchOembed($url);
            $thumbnailUrl = $oembed['thumbnail_url'] ?? null;
            if (!$thumbnailUrl) {
                return;
            }

            $imageResponse = Http::retry(2, 100, throw: false)->get($thumbnailUrl);
            if (!$imageResponse->successful()) {
                return;
            }

            $contentType = strtolower($imageResponse->header('Content-Type') ?? '');
            $extension = match (true) {
                str_contains($contentType, 'image/jpeg') => 'jpg',
                str_contains($contentType, 'image/png') => 'png',
                str_contains($contentType, 'image/webp') => 'webp',
                default => null,
            };

            if (!$extension) {
                return;
            }

            $maxBytes = 5 * 1024 * 1024;
            $contentLength = (int) ($imageResponse->header('Content-Length') ?? 0);
            if ($contentLength > 0 && $contentLength > $maxBytes) {
                return;
            }

            $body = $imageResponse->body();
            if (strlen($body) > $maxBytes) {
                return;
            }

            $path = 'covers/' . Str::uuid() . '.' . $extension;
            Storage::disk('public')->put($path, $body);
            $release->cover_path = $path;
            $release->save();
        } catch (\Throwable) {
            return;
        }
    }

    private function tryAutoReleaseTypeFromUrl(Release $release, ?string $url): void
    {
        if (!$url) {
            return;
        }

        $inferred = $this->inferReleaseTypeFromUrl($url);
        if (!$inferred) {
            return;
        }

        if ($release->release_type === $inferred) {
            return;
        }

        $release->release_type = $inferred;
        $release->save();
    }

    private function tryAutoReleaseDateFromUrl(Release $release, ?string $url, ?array $oembed = null): void
    {
        if ($release->release_date || !$url) {
            return;
        }

        $date = $this->fetchReleaseDateFromUrl($url, $oembed);
        if (!$date) {
            return;
        }

        $release->release_date = $date;
        $release->save();
    }

    private function inferReleaseTypeFromUrl(?string $url): ?string
    {
        if (!$url) {
            return null;
        }

        $path = strtolower(parse_url($url, PHP_URL_PATH) ?? '');

        if (Str::contains($path, '/album/')) {
            return 'album';
        }

        if (Str::contains($path, '/track/')) {
            return 'single';
        }

        if (Str::contains($path, '/watch')) {
            return 'single';
        }

        return null;
    }

    private function fetchOembed(string $url): ?array
    {
        $host = strtolower(parse_url($url, PHP_URL_HOST) ?? '');
        $oembedEndpoint = $this->getOembedEndpoint($host);
        if (!$oembedEndpoint) {
            return null;
        }

        try {
            $oembedResponse = Http::acceptJson()
                ->retry(2, 100, throw: false)
                ->get($oembedEndpoint, [
                    'url' => $url,
                    'format' => 'json',
                ]);

            if (!$oembedResponse->successful()) {
                return null;
            }

            return [
                'title' => $oembedResponse->json('title'),
                'thumbnail_url' => $oembedResponse->json('thumbnail_url'),
                'release_date' => $oembedResponse->json('release_date'),
                'published_at' => $oembedResponse->json('published_at'),
                'upload_date' => $oembedResponse->json('upload_date'),
            ];
        } catch (\Throwable) {
            return null;
        }
    }

    private function getOembedEndpoint(string $host): ?string
    {
        if (Str::endsWith($host, ['spotify.com', 'spotify.link'])) {
            return 'https://open.spotify.com/oembed';
        }

        if (Str::endsWith($host, ['soundcloud.com', 'on.soundcloud.com'])) {
            return 'https://soundcloud.com/oembed';
        }

        if (Str::endsWith($host, ['music.apple.com', 'itunes.apple.com'])) {
            return 'https://embed.music.apple.com/oembed';
        }

        if (Str::endsWith($host, ['music.youtube.com', 'youtube.com', 'youtu.be'])) {
            return 'https://www.youtube.com/oembed';
        }

        if (Str::endsWith($host, ['bandcamp.com'])) {
            return 'https://bandcamp.com/oembed';
        }

        return null;
    }

    private function fetchReleaseDateFromUrl(string $url, ?array $oembed = null): ?string
    {
        $date = $this->extractReleaseDateFromOembed($oembed);
        if ($date) {
            return $date;
        }

        $host = strtolower(parse_url($url, PHP_URL_HOST) ?? '');
        if (!$this->shouldAttemptReleaseDateLookup($host)) {
            return null;
        }

        try {
            $response = Http::retry(2, 100, throw: false)->get($url);
            if (!$response->successful()) {
                return null;
            }

            $html = $response->body();
            if (!$html) {
                return null;
            }

            return $this->extractReleaseDateFromHtml($html);
        } catch (\Throwable) {
            return null;
        }
    }

    private function extractReleaseDateFromOembed(?array $oembed): ?string
    {
        if (!$oembed) {
            return null;
        }

        $candidates = [
            $oembed['release_date'] ?? null,
            $oembed['published_at'] ?? null,
            $oembed['upload_date'] ?? null,
            $oembed['date'] ?? null,
        ];

        foreach ($candidates as $candidate) {
            $normalized = $this->normalizeDateString($candidate);
            if ($normalized) {
                return $normalized;
            }
        }

        return null;
    }

    private function extractReleaseDateFromHtml(string $html): ?string
    {
        $patterns = [
            '/property=["\']music:release_date["\']\s+content=["\']([^"\']+)["\']/i',
            '/itemprop=["\']datePublished["\']\s+content=["\']([^"\']+)["\']/i',
            '/"releaseDate"\s*:\s*"([^"]+)"/i',
            '/"datePublished"\s*:\s*"([^"]+)"/i',
            '/"release_date"\s*:\s*"([^"]+)"/i',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $html, $matches)) {
                $normalized = $this->normalizeDateString($matches[1] ?? null);
                if ($normalized) {
                    return $normalized;
                }
            }
        }

        return null;
    }

    private function normalizeDateString(?string $value): ?string
    {
        if (!$value) {
            return null;
        }

        $value = trim($value);
        if ($value === '') {
            return null;
        }

        try {
            return \Carbon\Carbon::parse($value)->toDateString();
        } catch (\Throwable) {
            return null;
        }
    }

    private function shouldAttemptReleaseDateLookup(string $host): bool
    {
        return Str::endsWith($host, [
            'spotify.com',
            'spotify.link',
            'soundcloud.com',
            'on.soundcloud.com',
            'music.youtube.com',
            'youtube.com',
            'youtu.be',
            'music.apple.com',
            'itunes.apple.com',
            'bandcamp.com',
        ]);
    }
}
