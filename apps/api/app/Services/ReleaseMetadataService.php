<?php

namespace App\Services;

use App\Models\Release;
use App\Services\SafeHttpService;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Handles oEmbed lookups, auto-cover downloads, release-type inference,
 * and release-date extraction for Release resources.
 *
 * Extracted from ReleaseController to keep the controller thin.
 */
class ReleaseMetadataService
{
    public function __construct(private readonly SafeHttpService $safeHttp) {}

    /**
     * Try to auto-fill the cover image from oEmbed thumbnail.
     */
    public function tryAutoCoverFromUrl(Release $release, ?string $url, ?array $oembed = null): void
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

            $imageResponse = $this->safeHttp->safeGet($thumbnailUrl);
            if (!$imageResponse || !$imageResponse->successful()) {
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

    /**
     * Try to auto-detect release type from URL via HTML scraping (Spotify).
     */
    public function tryAutoReleaseTypeFromUrl(Release $release, ?string $url): void
    {
        if (!$url) {
            return;
        }

        $host = strtolower(parse_url($url, PHP_URL_HOST) ?? '');
        $inferred = $this->fetchReleaseTypeFromUrl($url, $host) ?? $this->inferReleaseTypeFromUrl($url);
        if (!$inferred || $release->release_type === $inferred) {
            return;
        }

        $release->release_type = $inferred;
        $release->save();
    }

    /**
     * Try to auto-fill release date from oEmbed or HTML metadata.
     */
    public function tryAutoReleaseDateFromUrl(Release $release, ?string $url, ?array $oembed = null): void
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

    /**
     * Infer release type from URL path (simple string matching).
     */
    public function inferReleaseTypeFromUrl(?string $url): ?string
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

    /**
     * Fetch oEmbed data from a supported provider.
     */
    public function fetchOembed(string $url): ?array
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

    // ------------------------------------------------------------------
    // Internal helpers
    // ------------------------------------------------------------------

    private function fetchReleaseTypeFromUrl(string $url, string $host): ?string
    {
        if (!Str::endsWith($host, ['spotify.com', 'spotify.link'])) {
            return null;
        }

        $response = $this->safeHttp->safeGet(
            $url,
            [],
            SafeHttpService::DEFAULT_TIMEOUT,
            [
                'User-Agent'      => 'Mozilla/5.0 (compatible; VibaroBot/1.0; +https://vibaro.app)',
                'Accept-Language' => 'en-US,en;q=0.9',
            ]
        );

        if (!$response || !$response->successful()) {
            return null;
        }

        $html = $response->body();
        return $html ? $this->extractReleaseTypeFromHtml($html) : null;
    }

    private function extractReleaseTypeFromHtml(string $html): ?string
    {
        if (!preg_match('/"album_type"\s*:\s*"([^"]+)"/i', $html, $matches)) {
            return null;
        }

        $type = strtolower(trim($matches[1] ?? ''));
        return match ($type) {
            'single' => 'single',
            'album', 'compilation' => 'album',
            default => null,
        };
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

        $response = $this->safeHttp->safeGet($url);

        if (!$response || !$response->successful()) {
            return null;
        }

        $html = $response->body();
        return $html ? $this->extractReleaseDateFromHtml($html) : null;
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
        if (!$value || trim($value) === '') {
            return null;
        }

        try {
            return \Carbon\Carbon::parse(trim($value))->toDateString();
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
