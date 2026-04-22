import { NextRequest, NextResponse } from "next/server";
import { backendFetch, getTokenFromCookies } from "@/lib/api/backend";

/**
 * GET /api/studio/spotlights/fetch-metadata?url=...
 * Fetch oEmbed metadata from a public URL (Spotify, YouTube, SoundCloud, etc.)
 */
export async function GET(request: NextRequest) {
  try {
    const token = await getTokenFromCookies();
    if (!token) {
      return NextResponse.json(
        { error: { code: "unauthorized", message: "Not authenticated" } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { error: { code: "missing_url", message: "url parameter is required" } },
        { status: 400 }
      );
    }

    const res = await backendFetch(
      `/api/v1/spotlights/fetch-metadata?url=${encodeURIComponent(url)}`,
      { cache: "no-store" }
    );

    const json = await res.json();

    if (!res.ok) {
      return NextResponse.json(json, { status: res.status });
    }

    return NextResponse.json(json);
  } catch (error) {
    console.error("Error fetching spotlight metadata:", error);
    return NextResponse.json(
      { error: { code: "internal_error", message: "Internal server error" } },
      { status: 500 }
    );
  }
}
