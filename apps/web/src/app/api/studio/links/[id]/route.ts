import { NextRequest, NextResponse } from "next/server";
import { backendFetch, getMyArtistPageId, getTokenFromCookies } from "@/lib/api/backend";


/**
 * PATCH /api/studio/links/[id]
 * Updates a specific link
 * Forwards to: PATCH /api/v1/artist-pages/{id}/links/{linkId}
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id: linkId } = await params;

    // Forward request to backend
    const body = await request.text();
    const response = await backendFetch(
      `/api/v1/artist-pages/${artistPageId}/links/${linkId}`,
      {
        method: "PATCH",
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

/**
 * DELETE /api/studio/links/[id]
 * Deletes a specific link
 * Forwards to: DELETE /api/v1/artist-pages/{id}/links/{linkId}
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id: linkId } = await params;

    // Forward request to backend
    const response = await backendFetch(
      `/api/v1/artist-pages/${artistPageId}/links/${linkId}`,
      {
        method: "DELETE",
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
