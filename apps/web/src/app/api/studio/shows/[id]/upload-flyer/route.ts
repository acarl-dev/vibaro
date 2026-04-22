import { NextRequest, NextResponse } from "next/server";
import { backendFetch, getMyArtistPageId, getTokenFromCookies } from "@/lib/api/backend";


/**
 * POST /api/studio/shows/[id]/upload-flyer
 * Uploads a flyer image for a show
 * Forwards to: POST /api/v1/artist-pages/{artistPageId}/shows/{showId}/upload-flyer
 *
 * Uses arrayBuffer() to forward the raw multipart body without re-encoding,
 * preserving the exact Content-Type boundary that Laravel's parser expects.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getTokenFromCookies();
  if (!token) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const artistPageId = await getMyArtistPageId();
    const bodyBuffer = await request.arrayBuffer();

    const response = await backendFetch(
      `/api/v1/artist-pages/${artistPageId}/shows/${id}/upload-flyer`,
      {
        method: "POST",
        headers: {
          "Content-Type": request.headers.get("content-type") || "application/octet-stream",
        },
        body: bodyBuffer,
        // @ts-expect-error -- duplex required for streaming bodies
        duplex: "half",
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
