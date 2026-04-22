import { NextRequest, NextResponse } from "next/server";
import { backendFetch, getMyArtistPageId, getTokenFromCookies } from "@/lib/api/backend";


/**
 * POST /api/studio/featured-tracks/reorder
 * Reorders featured tracks
 * Forwards to: POST /api/v1/artist-pages/{id}/featured-tracks/reorder
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
      `/api/v1/artist-pages/${artistPageId}/featured-tracks/reorder`,
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
