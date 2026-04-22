import { type NextRequest, NextResponse } from "next/server";
import { withArtistPage, forwardStudioRequest } from "@/lib/bff/studio-proxy";
import { studioEndpoints } from "@/lib/bff/studio-endpoints";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: "invalid_request", message: "Request body must be valid JSON." } },
      { status: 400 }
    );
  }
  return forwardStudioRequest({
    method: "POST",
    upstreamPath: studioEndpoints.artistPages(),
    body: {
      handle: (body as Record<string, unknown>)?.handle,
      display_name: (body as Record<string, unknown>)?.display_name,
    },
    errorContext: "[artist-pages] POST",
  });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  return withArtistPage((artistPageId) =>
    forwardStudioRequest({
      method: "PATCH",
      upstreamPath: studioEndpoints.artistPageById(artistPageId),
      body,
      errorContext: "[artist-pages] PATCH",
    })
  );
}
