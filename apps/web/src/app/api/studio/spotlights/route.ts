import { NextRequest } from "next/server";
import { studioEndpoints } from "@/lib/bff/studio-endpoints";
import { forwardStudioRequest } from "@/lib/bff/studio-proxy";

/**
 * GET /api/studio/spotlights
 * Fetch all spotlights for authenticated user
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const archived = searchParams.get("archived");
  const upstreamPath =
    archived === "1"
      ? `${studioEndpoints.spotlights()}?archived=1`
      : studioEndpoints.spotlights();

  return forwardStudioRequest({
    method: "GET",
    upstreamPath,
    cache: "no-store",
    errorContext: "Error fetching spotlights:",
  });
}

/**
 * POST /api/studio/spotlights
 * Create a new spotlight
 */
export async function POST(request: NextRequest) {
  const body = await request.json();

  return forwardStudioRequest({
    method: "POST",
    upstreamPath: studioEndpoints.spotlights(),
    body,
    successStatus: 201,
    errorContext: "Error creating spotlight:",
  });
}
