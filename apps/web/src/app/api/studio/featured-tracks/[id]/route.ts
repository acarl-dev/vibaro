import { type NextRequest } from "next/server";
import { withArtistPage, forwardStudioRequest } from "@/lib/bff/studio-proxy";
import { studioEndpoints } from "@/lib/bff/studio-endpoints";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  return withArtistPage((artistPageId) =>
    forwardStudioRequest({
      method: "PATCH",
      upstreamPath: studioEndpoints.featuredTrackById(artistPageId, id),
      body,
      errorContext: `[featured-tracks/${id}] PATCH`,
    })
  );
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return withArtistPage((artistPageId) =>
    forwardStudioRequest({
      method: "DELETE",
      upstreamPath: studioEndpoints.featuredTrackById(artistPageId, id),
      errorContext: `[featured-tracks/${id}] DELETE`,
    })
  );
}
