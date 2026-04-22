import { type NextRequest } from "next/server";
import { withArtistPage, forwardStudioRequest } from "@/lib/bff/studio-proxy";
import { studioEndpoints } from "@/lib/bff/studio-endpoints";

export async function GET() {
  return withArtistPage((artistPageId) =>
    forwardStudioRequest({
      method: "GET",
      upstreamPath: studioEndpoints.links(artistPageId),
      errorContext: "[links] GET",
    })
  );
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return withArtistPage((artistPageId) =>
    forwardStudioRequest({
      method: "POST",
      upstreamPath: studioEndpoints.links(artistPageId),
      body,
      errorContext: "[links] POST",
    })
  );
}
