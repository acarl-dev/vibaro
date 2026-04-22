import { type NextRequest } from "next/server";
import { withArtistPage, forwardStudioRequest } from "@/lib/bff/studio-proxy";
import { studioEndpoints } from "@/lib/bff/studio-endpoints";

export async function POST(request: NextRequest) {
  const body = await request.json();
  return withArtistPage((artistPageId) =>
    forwardStudioRequest({
      method: "POST",
      upstreamPath: studioEndpoints.linksReorder(artistPageId),
      body,
      errorContext: "[links/reorder] POST",
    })
  );
}
