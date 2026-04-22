import { NextRequest, NextResponse } from "next/server";
import { backendFetch, getMyArtistPageId, getTokenFromCookies } from "@/lib/api/backend";


/**
 * POST /api/studio/releases/[id]/upload-cover
 * Uploads a cover image for a release
 * Forwards to: POST /api/v1/artist-pages/{artistPageId}/releases/{releaseId}/upload-cover
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;
    const artistPageId = await getMyArtistPageId();
    const formData = await request.formData();

    // Forward the request to Laravel backend
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(
      `${backendUrl}/api/v1/artist-pages/${artistPageId}/releases/${id}/upload-cover`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
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
