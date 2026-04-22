import { type NextRequest } from "next/server";
import { forwardStudioRequest } from "@/lib/bff/studio-proxy";
import { studioEndpoints } from "@/lib/bff/studio-endpoints";

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  return forwardStudioRequest({
    method: "PATCH",
    upstreamPath: studioEndpoints.artistPageUpdateHeroFocal(),
    body,
    errorContext: "[update-hero-focal] PATCH",
  });
}
