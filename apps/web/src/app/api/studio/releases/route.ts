import { NextRequest, NextResponse } from "next/server";
import { getMyArtistPageId } from "@/lib/api/backend";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Get the current user's artist page ID by calling /api/v1/artist-pages/me
 */
async function safeJson(response: Response): Promise<unknown | null> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}


/**
 * GET /api/studio/releases
 * Gets all releases for current user's artist page
 * Forwards to: GET /api/v1/artist-pages/{id}/releases
 */
export async function GET(request: NextRequest) {
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

  const token = request.cookies.get("vibaro_token")?.value;
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

    const response = await fetch(
      `${API_BASE_URL}/api/v1/artist-pages/${artistPageId}/releases`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await safeJson(response);
    if (data) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(
      {
        error: {
          code: "UPSTREAM_ERROR",
          message: "Release service did not return valid JSON.",
        },
      },
      { status: 502 }
    );
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

/**
 * POST /api/studio/releases
 * Creates a new release for current user's artist page
 * Forwards to: POST /api/v1/artist-pages/{id}/releases
 */
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

  const token = request.cookies.get("vibaro_token")?.value;
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
    const body = await request.json();

    const response = await fetch(
      `${API_BASE_URL}/api/v1/artist-pages/${artistPageId}/releases`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await safeJson(response);
    if (data) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(
      {
        error: {
          code: "UPSTREAM_ERROR",
          message: "Release service did not return valid JSON.",
        },
      },
      { status: 502 }
    );
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
