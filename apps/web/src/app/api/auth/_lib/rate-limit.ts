import type { NextRequest } from "next/server";

type RateLimitCheckResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

type RateLimitConfig = {
  maxAttempts: number;
  windowMs: number;
};

const RATE_LIMIT_BUCKETS = new Map<string, RateLimitBucket>();

// In-memory limiter is acceptable for single-instance dev/staging.
// Production multi-instance deployments should move this to Redis/edge/proxy limits.
export function consumeRateLimit(
  key: string,
  config: RateLimitConfig,
  nowMs: number = Date.now()
): RateLimitCheckResult {
  const current = RATE_LIMIT_BUCKETS.get(key);

  if (!current || current.resetAt <= nowMs) {
    RATE_LIMIT_BUCKETS.set(key, {
      count: 1,
      resetAt: nowMs + config.windowMs,
    });

    return {
      allowed: true,
      retryAfterSeconds: 0,
    };
  }

  if (current.count >= config.maxAttempts) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((current.resetAt - nowMs) / 1000)
      ),
    };
  }

  current.count += 1;
  RATE_LIMIT_BUCKETS.set(key, current);

  return {
    allowed: true,
    retryAfterSeconds: 0,
  };
}

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const firstIp = forwarded.split(",")[0]?.trim();
    if (firstIp) {
      return firstIp;
    }
  }

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) {
    return realIp;
  }

  return "unknown";
}

export function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  return normalized.length > 0 ? normalized : null;
}

export function createIpRateLimitKey(scope: "login" | "register", ip: string): string {
  return `auth:${scope}:ip:${ip}`;
}

export function createLoginEmailRateLimitKey(ip: string, email: string): string {
  return `auth:login:ip-email:${ip}:${email}`;
}

export function resetRateLimitStore(): void {
  RATE_LIMIT_BUCKETS.clear();
}
