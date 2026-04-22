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
      upstreamPath: studioEndpoints.showById(artistPageId, id),
      body,
      errorContext: `[shows/${id}] PATCH`,
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
      upstreamPath: studioEndpoints.showById(artistPageId, id),
      errorContext: `[shows/${id}] DELETE`,
    })
  );
}
