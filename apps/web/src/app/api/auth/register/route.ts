import { NextRequest, NextResponse } from "next/server";
import {
  consumeRateLimit,
  createIpRateLimitKey,
  getClientIp,
} from "../_lib/rate-limit";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const REGISTER_IP_LIMIT = {
  maxAttempts: 10,
  windowMs: 60_000,
};

function rateLimitedResponse(retryAfterSeconds: number): NextResponse {
  return NextResponse.json(
    {
      error: {
        code: "RATE_LIMITED",
        message: "Too many requests. Please try again later.",
      },
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSeconds),
      },
    }
  );
}

export async function POST(request: NextRequest) {
  if (!API_BASE_URL) {
    return NextResponse.json(
      {
        error: {
          code: "CONFIG_ERROR",
          message: "API base URL is not configured.",
        },
      },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_REQUEST_BODY",
          message: "Request body must be valid JSON.",
        },
      },
      { status: 400 }
    );
  }

  const clientIp = getClientIp(request);

  const ipRateLimit = consumeRateLimit(
    createIpRateLimitKey("register", clientIp),
    REGISTER_IP_LIMIT
  );

  if (!ipRateLimit.allowed) {
    return rateLimitedResponse(ipRateLimit.retryAfterSeconds);
  }

  const apiResponse = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  let json: unknown;
  try {
    json = await apiResponse.json();
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "UPSTREAM_ERROR",
          message: "Auth service did not return valid JSON.",
        },
      },
      { status: 502 }
    );
  }

  if (!apiResponse.ok) {
    // Pass through error from API (already in standard format)
    return NextResponse.json(json, { status: apiResponse.status });
  }

  const token = (json as { data?: { token?: string; user?: unknown } } | null)?.data?.token;
  const user = (json as { data?: { token?: string; user?: unknown } } | null)?.data?.user;

  // After registration, users should normally go into onboarding
  const nextPath = "/studio/onboarding";

  const response = NextResponse.json(
    {
      data: {
        user,
        next: nextPath,
      },
    },
    { status: apiResponse.status }
  );

  if (token) {
    response.cookies.set({
      name: "vibaro_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
  }

  return response;
}
