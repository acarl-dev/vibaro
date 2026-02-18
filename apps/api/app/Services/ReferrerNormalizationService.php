<?php

namespace App\Services;

class ReferrerNormalizationService
{
    /**
     * Normalization rules for referrer hosts.
     * Maps specific subdomains to their canonical form.
     */
    private const NORMALIZATION_RULES = [
        'm.instagram.com' => 'instagram.com',
        'l.instagram.com' => 'instagram.com',
        'lm.instagram.com' => 'instagram.com',
        'm.facebook.com' => 'facebook.com',
        'l.facebook.com' => 'facebook.com',
        'mobile.twitter.com' => 'twitter.com',
        'm.twitter.com' => 'twitter.com',
    ];

    /**
     * Normalize a referrer URL to its canonical host.
     * 
     * @param string|null $referrer Full referrer URL from request header
     * @return string|null Normalized host or 'direct' if no referrer
     */
    public function normalize(?string $referrer): ?string
    {
        // Empty referrer = direct traffic
        if (empty($referrer)) {
            return 'direct';
        }

        // Parse the referrer URL
        $parsed = parse_url($referrer);
        $host = $parsed['host'] ?? null;

        if (!$host) {
            return 'direct';
        }

        // Apply normalization rules
        $normalizedHost = self::NORMALIZATION_RULES[$host] ?? $host;

        return $normalizedHost;
    }

    /**
     * Check if referrer indicates direct traffic.
     */
    public function isDirect(?string $referrer): bool
    {
        return $this->normalize($referrer) === 'direct';
    }
}
