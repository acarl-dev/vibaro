import { type NextRequest } from "next/server";
import { withArtistPage, forwardStudioRequest } from "@/lib/bff/studio-proxy";
import { studioEndpoints } from "@/lib/bff/studio-endpoints";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return withArtistPage((artistPageId) =>
    forwardStudioRequest({
      method: "DELETE",
      upstreamPath: studioEndpoints.releaseDeleteCover(artistPageId, id),
      errorContext: `[releases/${id}/cover] DELETE`,
    })
  );
}
