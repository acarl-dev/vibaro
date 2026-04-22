<?php

namespace App\Services;

class VisitorIdentityService
{
    /**
     * Build a privacy-aware daily visitor key for pageview dedupe and unique counts.
     */
    public function buildPageViewVisitorKey(
        ?string $userAgentHash,
        ?string $ipAddress,
        ?string $acceptLanguage
    ): ?string {
        $ipBucket = $this->coarseIpBucket($ipAddress);
        $languageBucket = $this->normalizeLanguage($acceptLanguage);

        if (!$userAgentHash && !$ipBucket && !$languageBucket) {
            return null;
        }

        return hash('sha256', implode('|', [
            'pve_v1',
            $userAgentHash ?? 'na',
            $ipBucket ?? 'na',
            $languageBucket ?? 'na',
        ]));
    }

    private function coarseIpBucket(?string $ipAddress): ?string
    {
        if (!$ipAddress) {
            return null;
        }

        $binary = @inet_pton($ipAddress);
        if ($binary === false) {
            return null;
        }

        if (strlen($binary) === 4) {
            return 'v4:' . bin2hex(substr($binary, 0, 3));
        }

        if (strlen($binary) === 16) {
            return 'v6:' . bin2hex(substr($binary, 0, 8));
        }

        return null;
    }

    private function normalizeLanguage(?string $acceptLanguage): ?string
    {
        if (!$acceptLanguage) {
            return null;
        }

        $first = strtolower(trim(explode(',', $acceptLanguage)[0] ?? ''));
        $first = explode(';', $first)[0] ?? '';
        $first = preg_replace('/[^a-z0-9\-]/', '', $first);

        if (!$first) {
            return null;
        }

        return substr($first, 0, 16);
    }
}
