import { type NextRequest } from "next/server";
import { forwardStudioRequest } from "@/lib/bff/studio-proxy";
import { studioEndpoints } from "@/lib/bff/studio-endpoints";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return forwardStudioRequest({
    method: "POST",
    upstreamPath: studioEndpoints.videoFeatured(id),
    errorContext: `[videos/${id}/featured] POST`,
  });
}
