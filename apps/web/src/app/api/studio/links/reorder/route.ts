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
 * POST /api/studio/links/reorder
 * Reorders links for current user's artist page
 * Forwards to: POST /api/v1/artist-pages/{id}/links/reorder
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
      `/api/v1/artist-pages/${artistPageId}/links/reorder`,
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
