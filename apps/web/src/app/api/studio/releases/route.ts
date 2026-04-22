import { type NextRequest } from "next/server";
import { withArtistPage, forwardStudioRequest } from "@/lib/bff/studio-proxy";
import { studioEndpoints } from "@/lib/bff/studio-endpoints";

export async function GET() {
  return withArtistPage((artistPageId) =>
    forwardStudioRequest({
      method: "GET",
      upstreamPath: studioEndpoints.releases(artistPageId),
      errorContext: "[releases] GET",
    })
  );
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return withArtistPage((artistPageId) =>
    forwardStudioRequest({
      method: "POST",
      upstreamPath: studioEndpoints.releases(artistPageId),
      body,
      errorContext: "[releases] POST",
    })
  );
}

/**
 * POST /api/studio/releases
 * Creates a new release for current user's artist page
 * Forwards to: POST /api/v1/artist-pages/{id}/releases
 */
export async function POST(request: NextRequest) {
  const token = await getTokenFromCookies();
  if (!token) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
      { status: 401 }
    );
  }

  try {
    const artistPageId = await getMyArtistPageId();
    const body = await request.json();

    const response = await backendFetch(
      `/api/v1/artist-pages/${artistPageId}/releases`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
