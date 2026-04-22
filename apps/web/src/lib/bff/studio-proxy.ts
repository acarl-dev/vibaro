import { NextResponse } from "next/server";
import { backendFetch, getTokenFromCookies } from "@/lib/api/backend";

type StudioProxyOptions = {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  upstreamPath: string;
  body?: unknown;
  cache?: RequestCache;
  successStatus?: number;
  errorContext: string;
};

function unauthorizedResponse(): NextResponse {
  return NextResponse.json(
    { error: { code: "unauthorized", message: "Not authenticated" } },
    { status: 401 }
  );
}

function internalErrorResponse(): NextResponse {
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
