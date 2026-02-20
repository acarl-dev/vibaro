<?php

namespace App\Http\Controllers;

use App\Models\ClickEvent;
use App\Models\TrackingLink;
use App\Services\BotDetectionService;
use App\Services\ReferrerNormalizationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TrackingController extends Controller
{
    public function __construct(
        private BotDetectionService $botDetection,
        private ReferrerNormalizationService $referrerNormalizer
    ) {}

    /**
     * Handle tracking redirect.
     */
    public function redirect(Request $request, string $slug)
    {
        // Support both legacy slug and new short_code (8 chars)
        $trackingLink = TrackingLink::active()
            ->where(function ($query) use ($slug) {
                $query->where('short_code', $slug)
                      ->orWhere('slug', $slug);
            })
            ->first();

        if (!$trackingLink) {
            abort(404);
        }

        // Record click event
        try {
            $this->recordClick($request, $trackingLink);
        } catch (\Exception $e) {
            // Log error but don't block the redirect
            Log::error('Failed to record click event', [
                'slug' => $slug,
                'error' => $e->getMessage(),
            ]);
        }

        // Redirect to target
        return redirect($trackingLink->target_url, 302);
    }

    /**
     * Record click event with privacy-aware data and abuse protection.
     */
    private function recordClick(Request $request, TrackingLink $trackingLink): void
    {
        $userAgent = $request->userAgent();
        $referrer = $request->header('referer');

        // Detect if this is a bot/preview crawler
        $isPreview = $this->botDetection->isPreviewBot($userAgent);

        // Normalize referrer (handles Instagram mobile/link-wrapper, etc.)
        $referrerHost = $this->referrerNormalizer->normalize($referrer);

        // Optional: derive country code from IP (never store IP itself)
        $countryCode = $this->deriveCountryCode($request->ip());

        // Optional: hash user agent for abuse detection (privacy-aware)
        $userAgentHash = $this->hashUserAgent($userAgent);

        ClickEvent::create([
            'tracking_link_id' => $trackingLink->id,
            'artist_page_id' => $trackingLink->artist_page_id,
            'spotlight_id' => $trackingLink->spotlight_id,
            'campaign_id' => $trackingLink->campaign_id,
            'module' => $trackingLink->module ?? 'legacy', // Legacy field
            'platform' => $trackingLink->platform, // V2 field
            'placement' => $trackingLink->placement, // V2 field
            'referrer_host' => $referrerHost,
            'country_code' => $countryCode,
            'user_agent_hash' => $userAgentHash,
            'is_preview' => $isPreview,
            'occurred_at' => now()->utc(), // Always store in UTC
        ]);
    }

    /**
     * Derive country code from IP without storing the IP.
     * Returns null in this minimal implementation.
     * Future: integrate with MaxMind GeoLite2 or similar.
     */
    private function deriveCountryCode(?string $ip): ?string
    {
        // TODO: Implement GeoIP lookup if needed
        // IP must NEVER be stored
        return null;
    }

    /**
     * Hash user agent for abuse detection without storing raw UA.
     */
    private function hashUserAgent(?string $userAgent): ?string
    {
        if (!$userAgent) {
            return null;
        }

        return hash('sha256', $userAgent);
    }
}
