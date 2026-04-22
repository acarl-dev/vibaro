import { NextRequest, NextResponse } from "next/server";
import { backendFetch, getMyArtistPageId, getTokenFromCookies } from "@/lib/api/backend";


/**
 * GET /api/studio/links
 * Gets all links for current user's artist page
 * Forwards to: GET /api/v1/artist-pages/{id}/links
 */
export async function GET(request: NextRequest) {
  // Check for token
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
    // Get artist page ID
    const artistPageId = await getMyArtistPageId();

    // Forward request to backend
    const response = await backendFetch(
      `/api/v1/artist-pages/${artistPageId}/links`,
      {
        method: "GET",
      }
    );

    // Return backend response as-is
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
 * POST /api/studio/links
 * Creates a new link for current user's artist page
 * Forwards to: POST /api/v1/artist-pages/{id}/links
 */
export async function POST(request: NextRequest) {
  // Check for token
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
    // Get artist page ID
    const artistPageId = await getMyArtistPageId();

    // Forward request to backend
    const body = await request.text();
    const response = await backendFetch(
      `/api/v1/artist-pages/${artistPageId}/links`,
      {
        method: "POST",
        body,
      }
    );

    // Return backend response as-is
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
