import { NextRequest, NextResponse } from "next/server";
import { backendFetch, getTokenFromCookies } from "@/lib/api/backend";

/**
 * Get the current user's artist page ID by calling /api/v1/artist-pages/me
 */
async function getMyArtistPageId(): Promise<number> {
  const response = await backendFetch("/api/v1/artist-pages/me");

  if (!response.ok) {
    throw new Error("Failed to fetch artist page");
  }

  const json = await response.json();
  const id = json?.data?.id;

  if (!id) {
    throw new Error("Artist page ID not found");
  }

  return id;
}

/**
 * GET /api/studio/featured-tracks
 * Gets all featured tracks for current user's artist page
 * Forwards to: GET /api/v1/artist-pages/{id}/featured-tracks
 */
export async function GET() {
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

    const response = await backendFetch(
      `/api/v1/artist-pages/${artistPageId}/featured-tracks`,
      {
        method: "GET",
      }
    );

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

/**
 * POST /api/studio/featured-tracks
 * Creates a new featured track for current user's artist page
 * Forwards to: POST /api/v1/artist-pages/{id}/featured-tracks
 */
export async function POST(request: NextRequest) {
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
    const body = await request.json();

    const response = await backendFetch(
      `/api/v1/artist-pages/${artistPageId}/featured-tracks`,
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );

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
