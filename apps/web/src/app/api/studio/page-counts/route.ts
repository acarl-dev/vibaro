import { NextResponse } from "next/server";
import { backendFetch, getTokenFromCookies } from "@/lib/api/backend";

/**
 * GET /api/studio/page-counts
 * Returns content counts for all page sections in a single request.
 * Fetches all 6 resources in parallel to keep latency low.
 */
export async function GET() {
  const token = await getTokenFromCookies();
  if (!token) {
    return NextResponse.json({ error: { code: "UNAUTHORIZED" } }, { status: 401 });
  }

  // First get the artist page ID (needed for some endpoints)
  let pageId: number;
  try {
    const pageRes = await backendFetch("/api/v1/artist-pages/me", { cache: "no-store" });
    if (!pageRes.ok) return NextResponse.json({ error: { code: "NOT_FOUND" } }, { status: 404 });
    const pageJson = await pageRes.json();
    pageId = pageJson?.data?.id;
    if (!pageId) return NextResponse.json({ error: { code: "NOT_FOUND" } }, { status: 404 });
  } catch {
    return NextResponse.json({ error: { code: "SERVER_ERROR" } }, { status: 500 });
  }

  // Fetch all 6 counts in parallel
  const [linksRes, showsRes, releasesRes, tracksRes, videosRes, galleryRes] = await Promise.all([
    backendFetch("/api/v1/artist-pages/me/links", { cache: "no-store" }),
    backendFetch(`/api/v1/artist-pages/${pageId}/shows`, { cache: "no-store" }),
    backendFetch(`/api/v1/artist-pages/${pageId}/releases`, { cache: "no-store" }),
    backendFetch(`/api/v1/artist-pages/${pageId}/featured-tracks`, { cache: "no-store" }),
    backendFetch("/api/v1/studio/videos", { cache: "no-store" }),
    backendFetch("/api/v1/studio/gallery", { cache: "no-store" }),
  ]);

  const toCount = async (res: Response) => {
    if (!res.ok) return 0;
    const json = await res.json();
    const data = json?.data;
    return Array.isArray(data) ? data.length : 0;
  };

  const [links, shows, releases, featured_tracks, videos, gallery] = await Promise.all([
    toCount(linksRes),
    toCount(showsRes),
    toCount(releasesRes),
    toCount(tracksRes),
    toCount(videosRes),
    toCount(galleryRes),
  ]);

  return NextResponse.json({ data: { links, shows, releases, featured_tracks, videos, gallery } });
}
