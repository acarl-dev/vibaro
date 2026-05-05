import "server-only";
import { type NextRequest, NextResponse } from "next/server";
import {
  backendFetch,
  getMyArtistPageId,
  getTokenFromCookies,
} from "@/lib/api/backend";

// ─── Option Types ─────────────────────────────────────────────────────────────

type StudioProxyOptions = {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  upstreamPath: string;
  body?: unknown;
  cache?: RequestCache;
  successStatus?: number;
  errorContext: string;
};

type StudioUploadOptions = {
  upstreamPath: string;
  request: NextRequest;
  errorContext: string;
  successStatus?: number;
};

// ─── Shared Response Helpers ──────────────────────────────────────────────────

export function unauthorizedResponse(): NextResponse {
  return NextResponse.json(
    { error: { code: "unauthorized", message: "Not authenticated" } },
    { status: 401 }
  );
}

export function internalErrorResponse(): NextResponse {
  return NextResponse.json(
    { error: { code: "internal_error", message: "Internal server error" } },
    { status: 500 }
  );
}

async function parseJsonSafely(response: Response): Promise<unknown | null> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

// ─── JSON Proxy ───────────────────────────────────────────────────────────────

/**
 * Forward a JSON request to the upstream Laravel API.
 * Handles auth guard, 204 passthrough, status forwarding, and consistent error format.
 */
export async function forwardStudioRequest(
  options: StudioProxyOptions
): Promise<NextResponse> {
  try {
    const token = await getTokenFromCookies();
    if (!token) {
      return unauthorizedResponse();
    }

    const headers: Record<string, string> = {};
    if (options.body !== undefined) {
      headers["Content-Type"] = "application/json";
    }

    const response = await backendFetch(options.upstreamPath, {
      method: options.method,
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      cache: options.cache,
    });

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const json = await parseJsonSafely(response);

    if (!response.ok) {
      return NextResponse.json(
        json ?? {
          error: {
            code: "upstream_error",
            message: "Upstream service did not return valid JSON.",
          },
        },
        { status: response.status }
      );
    }

    return NextResponse.json(json ?? { data: null }, {
      status: options.successStatus ?? response.status,
    });
  } catch (error) {
    console.error(options.errorContext, error);
    return internalErrorResponse();
  }
}

// ─── Multipart Upload Proxy ───────────────────────────────────────────────────

/**
 * Forward a multipart/form-data upload to the upstream Laravel API.
 * Preserves the raw Content-Type boundary required by Laravel's parser.
 */
export async function forwardUploadRequest(
  options: StudioUploadOptions
): Promise<NextResponse> {
  try {
    const token = await getTokenFromCookies();
    if (!token) {
      return unauthorizedResponse();
    }

    const bodyBuffer = await options.request.arrayBuffer();
    const contentType =
      options.request.headers.get("content-type") || "application/octet-stream";

    const response = await backendFetch(options.upstreamPath, {
      method: "POST",
      headers: { "Content-Type": contentType },
      body: bodyBuffer,
      // @ts-expect-error -- duplex required for streaming bodies in Node
      duplex: "half",
    });

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const json = await parseJsonSafely(response);

    if (!response.ok) {
      return NextResponse.json(
        json ?? {
          error: { code: "upstream_error", message: "Upload failed." },
        },
        { status: response.status }
      );
    }

    return NextResponse.json(json ?? { data: null }, {
      status: options.successStatus ?? response.status,
    });
  } catch (error) {
    console.error(options.errorContext, error);
    return internalErrorResponse();
  }
}

// ─── Artist Page Context Helper ───────────────────────────────────────────────

/**
 * Resolves the current user's artist page ID and passes it to the callback.
 * Returns 401 if unauthenticated, 500 if the artist page cannot be resolved.
 */
export async function withArtistPage(
  callback: (artistPageId: number) => Promise<NextResponse>
): Promise<NextResponse> {
  const token = await getTokenFromCookies();
  if (!token) {
    return unauthorizedResponse();
  }
  try {
    const artistPageId = await getMyArtistPageId();
    return callback(artistPageId);
  } catch (error) {
    console.error("[BFF] Artist page resolution failed", error);
    return internalErrorResponse();
  }
}
