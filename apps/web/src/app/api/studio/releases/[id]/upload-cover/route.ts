import { type NextRequest } from "next/server";
import { withArtistPage, forwardUploadRequest } from "@/lib/bff/studio-proxy";
import { studioEndpoints } from "@/lib/bff/studio-endpoints";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return withArtistPage((artistPageId) =>
    forwardUploadRequest({
      upstreamPath: studioEndpoints.releaseUploadCover(artistPageId, id),
      request,
      errorContext: `[releases/${id}/upload-cover] POST`,
    })
  );
}
