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
      upstreamPath: studioEndpoints.showUploadFlyer(artistPageId, id),
      request,
      errorContext: `[shows/${id}/upload-flyer] POST`,
    })
  );
}
