import { studioEndpoints } from "@/lib/bff/studio-endpoints";
import { forwardStudioRequest } from "@/lib/bff/studio-proxy";

/**
 * GET /api/studio/spotlights/active
 * Fetch active spotlight for authenticated user
 */
export async function GET() {
  return forwardStudioRequest({
    method: "GET",
    upstreamPath: studioEndpoints.spotlightActive(),
    cache: "no-store",
    errorContext: "Error fetching active spotlight:",
  });
}
