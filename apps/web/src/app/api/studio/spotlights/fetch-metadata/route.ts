import { NextRequest, NextResponse } from "next/server";
import { studioEndpoints } from "@/lib/bff/studio-endpoints";
import { forwardStudioRequest } from "@/lib/bff/studio-proxy";

/**
 * GET /api/studio/spotlights/fetch-metadata?url=...
 * Fetch oEmbed metadata from a public URL (Spotify, YouTube, SoundCloud, etc.)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: { code: "missing_url", message: "url parameter is required" } },
      { status: 400 }
    );
  }

  return forwardStudioRequest({
    method: "GET",
    upstreamPath: studioEndpoints.spotlightFetchMetadata(url),
    cache: "no-store",
    errorContext: "Error fetching spotlight metadata:",
  });
}
