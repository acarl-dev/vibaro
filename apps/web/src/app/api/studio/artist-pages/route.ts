import { NextRequest, NextResponse } from "next/server";
import { backendFetch, getMyArtistPageId, getTokenFromCookies } from "@/lib/api/backend";

export async function POST(request: NextRequest) {
  const token = await getTokenFromCookies();
  if (!token) {
    return NextResponse.json(
      {
        error: {
          code: "UNAUTHENTICATED",
          message: "User is not authenticated.",
        },
      },
      { status: 401 }
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

  const payload = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handle: (body as any)?.handle,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    display_name: (body as any)?.display_name,
  };

  try {
    const apiResponse = await backendFetch("/api/v1/artist-pages", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const json = await apiResponse.json();
    return NextResponse.json(json, { status: apiResponse.status });
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "UPSTREAM_ERROR",
          message: "Failed to reach artist page service.",
        },
      },
      { status: 502 }
    );
  }
}


/**
 * PATCH /api/studio/artist-pages
 * Updates current user's artist page (auto-resolves ID)
 * Forwards to: PATCH /api/v1/artist-pages/{id}
 */
export async function PATCH(request: NextRequest) {
  const token = await getTokenFromCookies();
  if (!token) {
    return NextResponse.json(
      {
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication required",
        },
      },
      { status: 401 }
    );
  }

  try {
    const artistPageId = await getMyArtistPageId();
    const body = await request.text();
    const response = await backendFetch(`/api/v1/artist-pages/${artistPageId}`, {
      method: "PATCH",
      body,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: error instanceof Error ? error.message : "Unknown error",
        },
      },
      { status: 500 }
    );
  }
}
