import { type NextRequest } from "next/server";
import { forwardStudioRequest } from "@/lib/bff/studio-proxy";
import { studioEndpoints } from "@/lib/bff/studio-endpoints";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return forwardStudioRequest({
    method: "DELETE",
    upstreamPath: studioEndpoints.trackingLinkById(id),
    errorContext: `[tracking-links/${id}] DELETE`,
  });
}
