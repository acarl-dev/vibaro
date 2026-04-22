import { type NextRequest } from "next/server";
import { forwardStudioRequest } from "@/lib/bff/studio-proxy";
import { studioEndpoints } from "@/lib/bff/studio-endpoints";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  return forwardStudioRequest({
    method: "PATCH",
    upstreamPath: studioEndpoints.videoById(id),
    body,
    errorContext: `[videos/${id}] PATCH`,
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return forwardStudioRequest({
    method: "DELETE",
    upstreamPath: studioEndpoints.videoById(id),
    errorContext: `[videos/${id}] DELETE`,
  });
}
