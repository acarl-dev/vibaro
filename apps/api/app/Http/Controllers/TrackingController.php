<?php

namespace App\Http\Controllers;

use App\Models\ClickEvent;
use App\Models\TrackingLink;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TrackingController extends Controller
{
    /**
     * Handle tracking redirect.
     */
    public function redirect(Request $request, string $slug)
    {
        // Find active tracking link
        $trackingLink = TrackingLink::where('slug', $slug)
            ->where('is_active', true)
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
     * Record click event with privacy-aware data.
     */
    private function recordClick(Request $request, TrackingLink $trackingLink): void
    {
        $referrer = $request->header('referer');
        $referrerHost = null;

        if ($referrer) {
            $parsed = parse_url($referrer);
            $referrerHost = $parsed['host'] ?? null;
        }

        // Optional: derive country code from IP (never store IP itself)
        $countryCode = $this->deriveCountryCode($request->ip());

        // Optional: hash user agent for abuse detection (privacy-aware)
        $userAgentHash = $this->hashUserAgent($request->userAgent());

        ClickEvent::create([
            'tracking_link_id' => $trackingLink->id,
            'artist_page_id' => $trackingLink->artist_page_id,
            'spotlight_id' => $trackingLink->spotlight_id,
            'campaign_id' => $trackingLink->campaign_id,
            'module' => $trackingLink->module,
            'referrer_host' => $referrerHost,
            'country_code' => $countryCode,
            'user_agent_hash' => $userAgentHash,
            'occurred_at' => now(),
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
