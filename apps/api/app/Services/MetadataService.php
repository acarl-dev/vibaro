<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MetadataService
{
    /**
     * Fetch metadata from a URL using oEmbed or platform-specific methods.
     *
     * Returns an array with keys: title, artist_name, cover_image_url, platform_name, suggested_type
     * All values may be null if not available.
     */
    public function fetchFromUrl(string $url): array
    {
        // Reject non-http(s) schemes before touching any external service.
        $scheme = strtolower(parse_url($url, PHP_URL_SCHEME) ?? '');
        if (!in_array($scheme, ['http', 'https'], true)) {
            return [];
        }

        $platform = $this->detectPlatform($url);

        $meta = match ($platform['name']) {
            'Spotify'    => $this->fetchSpotify($url),
            'YouTube'    => $this->fetchYouTube($url),
            'SoundCloud' => $this->fetchSoundCloud($url),
            'Apple Music'=> $this->fetchAppleMusic($url),
            default      => $this->tryGenericOembed($url),
        };

        return array_merge([
            'title'           => null,
            'artist_name'     => null,
            'cover_image_url' => null,
            'platform_name'   => $platform['name'] !== 'Unknown' ? $platform['name'] : null,
            'suggested_type'  => $platform['suggested_type'],
        ], array_filter($meta, fn($v) => $v !== null));
    }

    /**
     * Detect which platform a URL belongs to.
     */
    private function detectPlatform(string $url): array
    {
        $host = strtolower(parse_url($url, PHP_URL_HOST) ?? '');
        $path = parse_url($url, PHP_URL_PATH) ?? '';

        if (str_contains($host, 'spotify.com')) {
            $type = 'single';
            if (str_contains($path, '/album/'))    $type = 'album';
            if (str_contains($path, '/playlist/')) $type = 'single'; // treat as single/event
            if (str_contains($path, '/artist/'))   $type = 'single';
            return ['name' => 'Spotify', 'suggested_type' => $type];
        }

        if (str_contains($host, 'youtube.com') || str_contains($host, 'youtu.be')) {
            return ['name' => 'YouTube', 'suggested_type' => 'video'];
        }

        if (str_contains($host, 'soundcloud.com')) {
            return ['name' => 'SoundCloud', 'suggested_type' => 'single'];
        }

        if (str_contains($host, 'music.apple.com')) {
            return ['name' => 'Apple Music', 'suggested_type' => 'single'];
        }

        if (str_contains($host, 'tiktok.com')) {
            return ['name' => 'TikTok', 'suggested_type' => 'video'];
        }

        if (str_contains($host, 'instagram.com')) {
            return ['name' => 'Instagram', 'suggested_type' => 'single'];
        }

        return ['name' => 'Unknown', 'suggested_type' => 'single'];
    }

    /**
     * Fetch metadata via Spotify oEmbed (no API key required).
     * Returns: title (track name), thumbnail_url (cover, 300x300), no artist_name in oEmbed.
     */
    private function fetchSpotify(string $url): array
    {
        try {
            $response = Http::timeout(8)->get('https://open.spotify.com/oembed', [
                'url' => $url,
            ]);

            if ($response->failed()) {
                return [];
            }

            $data = $response->json();

            return array_filter([
                'title'           => $data['title'] ?? null,
                'artist_name'     => null, // Spotify oEmbed does not expose artist separately
                'cover_image_url' => $data['thumbnail_url'] ?? null,
                'platform_name'   => 'Spotify',
            ]);
        } catch (\Throwable $e) {
            Log::warning('MetadataService: Spotify oEmbed failed', ['url' => $url, 'error' => $e->getMessage()]);
            return [];
        }
    }

    /**
     * Fetch metadata via YouTube oEmbed (no API key required).
     * Returns: title (video name), author_name (channel name), thumbnail_url.
     */
    private function fetchYouTube(string $url): array
    {
        try {
            $response = Http::timeout(8)->get('https://www.youtube.com/oembed', [
                'url'    => $url,
                'format' => 'json',
            ]);

            if ($response->failed()) {
                return [];
            }

            $data = $response->json();

            return array_filter([
                'title'           => $data['title'] ?? null,
                'artist_name'     => $data['author_name'] ?? null,
                'cover_image_url' => $data['thumbnail_url'] ?? null,
                'platform_name'   => 'YouTube',
            ]);
        } catch (\Throwable $e) {
            Log::warning('MetadataService: YouTube oEmbed failed', ['url' => $url, 'error' => $e->getMessage()]);
            return [];
        }
    }

    /**
     * Fetch metadata via SoundCloud oEmbed (no API key required).
     */
    private function fetchSoundCloud(string $url): array
    {
        try {
            $response = Http::timeout(8)->get('https://soundcloud.com/oembed', [
                'format' => 'json',
                'url'    => $url,
            ]);

            if ($response->failed()) {
                return [];
            }

            $data = $response->json();

            return array_filter([
                'title'           => $data['title'] ?? null,
                'artist_name'     => $data['author_name'] ?? null,
                'cover_image_url' => $data['thumbnail_url'] ?? null,
                'platform_name'   => 'SoundCloud',
            ]);
        } catch (\Throwable $e) {
            Log::warning('MetadataService: SoundCloud oEmbed failed', ['url' => $url, 'error' => $e->getMessage()]);
            return [];
        }
    }

    /**
     * Fetch metadata via Apple Music oEmbed.
     */
    private function fetchAppleMusic(string $url): array
    {
        try {
            $response = Http::timeout(8)->get('https://music.apple.com/oembed', [
                'url' => $url,
            ]);

            if ($response->failed()) {
                return [];
            }

            $data = $response->json();

            return array_filter([
                'title'           => $data['title'] ?? null,
                'artist_name'     => $data['author_name'] ?? null,
                'cover_image_url' => $data['thumbnail_url'] ?? null,
                'platform_name'   => 'Apple Music',
            ]);
        } catch (\Throwable $e) {
            Log::warning('MetadataService: Apple Music oEmbed failed', ['url' => $url, 'error' => $e->getMessage()]);
            return [];
        }
    }

    /**
     * Try generic oEmbed discovery via oEmbed.com as a fallback.
     */
    private function tryGenericOembed(string $url): array
    {
        try {
            $response = Http::timeout(8)->get('https://noembed.com/embed', [
                'url' => $url,
            ]);

            if ($response->failed()) {
                return [];
            }

            $data = $response->json();

            if (!empty($data['error'])) {
                return [];
            }

            return array_filter([
                'title'           => $data['title'] ?? null,
                'artist_name'     => $data['author_name'] ?? null,
                'cover_image_url' => $data['thumbnail_url'] ?? null,
                'platform_name'   => $data['provider_name'] ?? null,
            ]);
        } catch (\Throwable $e) {
            return [];
        }
    }
}
