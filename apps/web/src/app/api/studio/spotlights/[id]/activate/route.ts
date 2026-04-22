import { studioEndpoints } from "@/lib/bff/studio-endpoints";
import { forwardStudioRequest } from "@/lib/bff/studio-proxy";

/**
 * POST /api/studio/spotlights/[id]/activate
 * Activate a spotlight
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  return forwardStudioRequest({
    method: "POST",
    upstreamPath: studioEndpoints.spotlightActivate(id),
    errorContext: "Error activating spotlight:",
  });
}
