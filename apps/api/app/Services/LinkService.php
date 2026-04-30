<?php

namespace App\Services;

use App\Models\ArtistPage;

class LinkService
{
    /**
     * Domain note:
     * This service belongs to the Website core and only manages ArtistPage social links.
     * It must not be used for TrackingLink / distribution logic.
     */
    /**
     * Get default social media platform configurations
     *
     * @return array<array{type: string, title: string, position: int}>
     */
    public static function getDefaultSocialMediaLinks(): array
    {
        return [
            ['type' => 'instagram', 'title' => 'Instagram', 'position' => 0],
            ['type' => 'facebook', 'title' => 'Facebook', 'position' => 1],
            ['type' => 'tiktok', 'title' => 'TikTok', 'position' => 2],
            ['type' => 'x', 'title' => 'X (Twitter)', 'position' => 3],
            ['type' => 'youtube', 'title' => 'YouTube', 'position' => 4],
            ['type' => 'spotify', 'title' => 'Spotify', 'position' => 5],
            ['type' => 'applemusic', 'title' => 'Apple Music', 'position' => 6],
            ['type' => 'soundcloud', 'title' => 'SoundCloud', 'position' => 7],
            ['type' => 'bandcamp', 'title' => 'Bandcamp', 'position' => 8],
            ['type' => 'website', 'title' => 'Website', 'position' => 9],
        ];
    }

    /**
     * Create pre-filled social media links for an artist page
     * These links have no URL initially and won't be displayed publicly until filled
     */
    public static function createDefaultLinksForArtistPage(ArtistPage $artistPage): void
    {
        $defaults = self::getDefaultSocialMediaLinks();

        foreach ($defaults as $linkData) {
            $artistPage->links()->create([
                'type' => $linkData['type'],
                'title' => $linkData['title'],
                'url' => null, // Empty initially - user fills this in
                'position' => $linkData['position'],
                'is_visible' => true,
            ]);
        }
    }

    /**
     * Get display title for a link type
     */
    public static function getTitleForType(string $type): string
    {
        $titles = [
            'instagram' => 'Instagram',
            'facebook' => 'Facebook',
            'tiktok' => 'TikTok',
            'x' => 'X (Twitter)',
            'youtube' => 'YouTube',
            'spotify' => 'Spotify',
            'applemusic' => 'Apple Music',
            'soundcloud' => 'SoundCloud',
            'bandcamp' => 'Bandcamp',
            'website' => 'Website',
            'custom' => 'Custom Link',
        ];

        return $titles[$type] ?? 'Link';
    }
}
