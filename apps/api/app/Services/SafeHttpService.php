<?php

namespace App\Services;

use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * SSRF-hardened HTTP GET wrapper.
 *
 * Validates that a URL is safe to fetch server-side before making the request:
 *   - Only http / https allowed
 *   - Private, loopback, link-local and reserved IP ranges are blocked
 *   - Each redirect hop is validated (prevents redirect-based SSRF)
 *   - Enforced timeout and redirect limit
 *   - Response body capped at MAX_RESPONSE_BYTES
 *   - Blocked / failed requests are logged for audit
 */
class SafeHttpService
{
    /** Accepted URL schemes. */
    private const ALLOWED_SCHEMES = ['http', 'https'];

    /** Absolute cap on the response body (10 MB). */
    private const MAX_RESPONSE_BYTES = 10 * 1024 * 1024;

    /** Default connect+read timeout in seconds. */
    public const DEFAULT_TIMEOUT = 10;

    /** Maximum number of redirects to follow. */
    private const MAX_REDIRECTS = 3;

    /**
     * Hostnames that are always blocked regardless of DNS resolution.
     * Guards against hosts that gethostbyname may resolve to a public IP
     * in certain environments.
     */
    private const BLOCKED_HOST_LITERALS = [
        'localhost',
        'ip6-localhost',
        'ip6-loopback',
    ];

    // ------------------------------------------------------------------
    // Public API
    // ------------------------------------------------------------------

    /**
     * Perform a safe GET request.
     *
     * Returns the Response on success, or null if:
     *   - the URL is blocked (private/reserved target, bad scheme, …)
     *   - a redirect leads to a blocked URL
     *   - the request fails or times out
     *   - the response body exceeds MAX_RESPONSE_BYTES
     *
     * Additional Guzzle/HTTP-client options can be passed via $options.
     */
    public function safeGet(
        string $url,
        array  $params  = [],
        int    $timeout = self::DEFAULT_TIMEOUT,
        array  $headers = [],
    ): ?Response {
        if (!$this->isAllowed($url)) {
            return null;
        }

        try {
            $client = Http::timeout($timeout)
                ->withHeaders($headers)
                ->withOptions([
                    'allow_redirects' => [
                        'max'         => self::MAX_REDIRECTS,
                        'on_redirect' => function ($req, $res, $uri): void {
                            if (!$this->isAllowed((string) $uri)) {
                                throw new \RuntimeException(
                                    'SafeHttpService: redirect to blocked URL ' . $uri
                                );
                            }
                        },
                    ],
                ]);

            $response = $client->get($url, $params);

            if (strlen($response->body()) > self::MAX_RESPONSE_BYTES) {
                Log::warning('SafeHttpService: response body exceeds limit', ['url' => $url]);
                return null;
            }

            return $response;
        } catch (\RuntimeException $e) {
            Log::warning('SafeHttpService: redirect blocked', [
                'url'    => $url,
                'reason' => $e->getMessage(),
            ]);
            return null;
        } catch (\Throwable $e) {
            Log::warning('SafeHttpService: request failed', [
                'url'   => $url,
                'error' => $e->getMessage(),
            ]);
            return null;
        }
    }

    /**
     * Check whether a URL is safe to fetch from this server.
     * Can be called independently for pre-flight validation.
     */
    public function isAllowed(string $url): bool
    {
        $parsed = parse_url($url);

        if (!$parsed || empty($parsed['host'])) {
            $this->logBlocked($url, 'unparseable or missing host');
            return false;
        }

        $scheme = strtolower($parsed['scheme'] ?? '');
        if (!in_array($scheme, self::ALLOWED_SCHEMES, true)) {
            $this->logBlocked($url, "disallowed scheme: {$scheme}");
            return false;
        }

        // Strip IPv6 brackets ( [::1] → ::1 )
        $host = strtolower(trim($parsed['host'], '[]'));

        if (in_array($host, self::BLOCKED_HOST_LITERALS, true)) {
            $this->logBlocked($url, "blocked host literal: {$host}");
            return false;
        }

        $ips = $this->resolveHost($host);

        if (empty($ips)) {
            $this->logBlocked($url, "DNS resolution returned no addresses for: {$host}");
            return false;
        }

        foreach ($ips as $ip) {
            if (!$this->isPublicIp($ip)) {
                $this->logBlocked($url, "private/reserved IP: {$ip}");
                return false;
            }
        }

        return true;
    }

    // ------------------------------------------------------------------
    // Internals
    // ------------------------------------------------------------------

    /**
     * Resolve a hostname to all its A / AAAA records.
     * Returns the IP literal itself when $host is already an IP address.
     */
    private function resolveHost(string $host): array
    {
        if (filter_var($host, FILTER_VALIDATE_IP)) {
            return [$host];
        }

        $records = @dns_get_record($host, DNS_A | DNS_AAAA);
        $ips     = [];

        if (!empty($records)) {
            foreach ($records as $record) {
                if (!empty($record['ip']))   { $ips[] = $record['ip']; }
                if (!empty($record['ipv6'])) { $ips[] = $record['ipv6']; }
            }
        }

        // Fallback for environments where dns_get_record is unavailable
        if (empty($ips)) {
            $resolved = @gethostbyname($host);
            if ($resolved !== $host) {
                $ips[] = $resolved;
            }
        }

        return array_unique($ips);
    }

    /**
     * Returns true only for globally routable IPs.
     *
     * FILTER_FLAG_NO_PRIV_RANGE blocks:
     *   IPv4 — 10/8, 172.16/12, 192.168/16
     *   IPv6 — ffc0::/10 (site-local), fc00::/7 (unique local)
     *
     * FILTER_FLAG_NO_RES_RANGE blocks:
     *   IPv4 — 0/8, 127/8, 169.254/16 (AWS metadata!), 240/4
     *   IPv6 — ::1/128, ::/128, ::ffff:0:0/96, fe80::/10 (link-local)
     */
    private function isPublicIp(string $ip): bool
    {
        return filter_var(
            $ip,
            FILTER_VALIDATE_IP,
            FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE
        ) !== false;
    }

    private function logBlocked(string $url, string $reason): void
    {
        Log::warning('SafeHttpService: request blocked', [
            'url'    => $url,
            'reason' => $reason,
        ]);
    }
}
