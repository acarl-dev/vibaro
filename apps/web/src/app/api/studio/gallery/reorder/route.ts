import { type NextRequest } from "next/server";
import { forwardStudioRequest } from "@/lib/bff/studio-proxy";
import { studioEndpoints } from "@/lib/bff/studio-endpoints";

export async function POST(request: NextRequest) {
  const body = await request.json();
  return forwardStudioRequest({
    method: "POST",
    upstreamPath: studioEndpoints.galleryReorder(),
    body,
    errorContext: "[gallery/reorder] POST",
  });
}
