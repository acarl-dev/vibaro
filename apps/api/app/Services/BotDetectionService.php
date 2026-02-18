<?php

namespace App\Services;

class BotDetectionService
{
    /**
     * List of known bot/preview user agent patterns.
     * These are link preview crawlers that should not count as real clicks.
     */
    private const PREVIEW_PATTERNS = [
        // Social media link previews
        'TelegramBot',
        'WhatsApp',
        'facebookexternalhit',
        'Facebot',
        'facebookcatalog',
        'Twitterbot',
        'discordbot',
        'Slackbot',
        'LinkedInBot',
        
        // Messaging platforms
        'SkypeUriPreview',
        'iMessageBot',
        'Viber',
        
        // Other common preview bots
        'Discordbot',
        'Slackbot-LinkExpanding',
        'TelegramBot (like TwitterBot)',
        
        // Generic indicators
        'bot',
        'crawler',
        'spider',
        'preview',
    ];

    /**
     * Check if the user agent is a known bot/preview crawler.
     */
    public function isPreviewBot(?string $userAgent): bool
    {
        if (empty($userAgent)) {
            return false;
        }

        $userAgentLower = strtolower($userAgent);

        foreach (self::PREVIEW_PATTERNS as $pattern) {
            if (str_contains($userAgentLower, strtolower($pattern))) {
                return true;
            }
        }

        return false;
    }
}
